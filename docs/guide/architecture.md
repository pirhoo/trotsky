# Architecture

This document explains the internal architecture of Trotsky, its design principles, and how the different components work together.

## Overview

Trotsky is built around a **builder pattern** that allows users to chain operations (called "steps") to interact with the AT Protocol / Bluesky API. The library provides a type-safe, fluent interface for building complex automation workflows.

## Core Concepts

### 1. Steps

A **Step** is the fundamental building block in Trotsky. Each step represents a single operation, such as:
- Fetching an actor profile
- Liking a post
- Following an account
- Iterating through a list

Steps are chainable and composable, allowing complex workflows to be built declaratively.

```typescript
await Trotsky.init(agent)
  .actor('alice.bsky.social')  // Step 1: Get actor
  .followers()                  // Step 2: Get followers
  .each()                       // Step 3: Iterate
  .follow()                     // Step 4: Follow each
  .run()                        // Execute
```

### 2. Step Hierarchy

Steps are organized in a class hierarchy:

```
Step (base class)
├── StepBuilder (chainable steps)
│   ├── Trotsky (entry point)
│   ├── StepActor
│   ├── StepPost
│   └── ...
├── StepBuilderList (steps that return lists)
│   ├── StepActors
│   ├── StepPosts
│   ├── StepActorFollowers
│   └── ...
└── StepBuilderStream (steps that stream data)
    ├── StepStreamPosts
    └── StepActorStreamPosts
```

**Key Properties:**
- **Parent**: Each step has a reference to its parent step
- **Context**: Data passed from parent to child (e.g., actor DID)
- **Output**: Result of executing the step
- **Agent**: AT Protocol agent for API calls

### 3. Step Types

#### Single-Item Steps
Steps that work with a single entity:
- `StepActor` - Single actor profile
- `StepPost` - Single post
- `StepList` - Single list

#### List Steps
Steps that work with collections and support pagination:
- `StepActors` - Multiple actors
- `StepPosts` - Multiple posts
- `StepActorFollowers` - Actor's followers (paginated)

#### Action Steps
Steps that perform an action without returning data:
- `StepActorFollow` - Follow an actor
- `StepPostLike` - Like a post
- `StepActorBlock` - Block an actor

#### Utility Steps
Steps that modify execution flow:
- `StepWhen` - Conditional execution
- `StepTap` - Side effects without modifying flow
- `StepWait` - Delay execution
- `StepSave` - Save output to file

## Component Organization

### Directory Structure

```
lib/
├── core/              # Core step implementations
│   ├── base/          # Base classes (Step, StepBuilder, etc.)
│   ├── mixins/        # Reusable mixins (ActorMixins, PostMixins)
│   └── utils/         # Utilities (logger, resolvable, etc.)
├── types/             # Shared type definitions
├── errors/            # Custom error classes
├── config/            # Configuration types
└── trotsky.ts         # Main barrel export
```

### Key Files

- **`Step.ts`**: Base class for all steps
- **`StepBuilder.ts`**: Base for chainable steps
- **`StepBuilderList.ts`**: Base for list/collection steps
- **`Trotsky.ts`**: Main entry point class
- **`trotsky.ts`**: Barrel export file

## Design Patterns

### 1. Builder Pattern

The fluent interface allows chaining operations:

```typescript
Trotsky.init(agent)
  .actor('handle')
  .posts()
  .each()
  .like()
```

Each method returns a new step instance that can be chained further.

### 2. Mixins

Common functionality is shared via mixins:

```typescript
// ActorMixins.ts
export class ActorMixins {
  followers() { return this.append(StepActorFollowers) }
  posts() { return this.append(StepActorPosts) }
  starterPacks() { return this.append(StepActorStarterPacks) }
}

// StepActor extends both StepBuilder and ActorMixins
export class StepActor extends mix(StepBuilder, ActorMixins) {}
```

**Benefits:**
- Code reuse across similar steps
- Consistent API across step types
- Easy to add new functionality

### 3. Context Propagation

Data flows from parent to child through the context property:

```typescript
Trotsky.init(agent)
  .actor('alice')          // Context: { did: 'did:plc:...', handle: 'alice', ... }
    .followers()           // Context inherited from parent
      .each()              // Context: individual follower
        .follow()          // Uses follower's DID from context
```

### 4. Lazy Execution

Steps are not executed when chained - only when `.run()` is called:

```typescript
const workflow = Trotsky.init(agent)
  .actor('alice')
  .posts()
  .each()
  .like()
// Nothing has executed yet

await workflow.run()  // NOW it executes
```

## Data Flow

### 1. Execution Pipeline

```
User Code → Trotsky.init() → Chain Steps → .run() → Execute Pipeline
                                                    ↓
                                            Results/Side Effects
```

### 2. Step Execution

Each step follows this lifecycle:

1. **Construction**: Step is created via `.append()`
2. **Configuration**: Parameters are set (e.g., query params)
3. **Context Inheritance**: Receives context from parent
4. **Execution**: `.apply()` method is called
5. **Output Generation**: Result is stored in `.output`
6. **Child Execution**: Child steps receive this step's output as context

### 3. Pagination

List steps handle pagination automatically:

```typescript
async applyPagination() {
  let cursor: string | undefined
  const items = []

  while (true) {
    const response = await this.agent.api({ cursor, limit: 50 })
    items.push(...response.items)

    cursor = response.cursor
    if (!cursor || items.length >= limit) break
  }

  this.output = items
}
```

## Error Handling

Trotsky provides structured error classes:

```typescript
try {
  await Trotsky.init(agent).actor('invalid').run()
} catch (error) {
  if (error instanceof ValidationError) {
    console.log(error.code, error.details)
  } else if (error instanceof AuthenticationError) {
    console.log('Auth failed:', error.message)
  }
}
```

**Error Classes:**
- `TrotskyError` - Base error class
- `ValidationError` - Input validation failures
- `AuthenticationError` - Auth/permission failures
- `RateLimitError` - Rate limit exceeded
- `PaginationError` - Pagination failures

## Type Safety

Trotsky leverages TypeScript's type system extensively:

### 1. Generic Type Parameters

```typescript
class Step<P, C, O> {
  parent: P      // Parent step type
  context: C     // Context data type
  output: O      // Output data type
}
```

### 2. Type Inference

Types are inferred through the chain:

```typescript
const result = await Trotsky.init(agent)
  .actor('alice')  // StepActor<Trotsky>
  .posts()         // StepActorPosts<StepActor<Trotsky>>
  .runHere()

// result.output is typed as AppBskyFeedDefs.PostView[]
```

### 3. Shared Types

Common types are centralized in `lib/types/`:

```typescript
import { ActorParam, PostUri, PaginationParams } from 'trotsky/types'
```

## Performance Considerations

### 1. Pagination Limits

Control pagination with `.take()`:

```typescript
// Only fetch first 10 items
await Trotsky.init(agent)
  .actor('alice')
  .followers()
  .take(10)
  .run()
```

### 2. Rate Limiting

Built-in rate limiting (configurable):

```typescript
Trotsky.init(agent, {
  rateLimit: {
    enabled: true,
    requestsPerMinute: 60
  }
})
```

### 3. Batching

Some operations support batching:

```typescript
// Fetch multiple posts in one request
await Trotsky.init(agent).posts([uri1, uri2, uri3]).run()
```

## Extensibility

### Adding New Steps

1. **Create Step Class**:
```typescript
export class StepMyFeature extends StepBuilder {
  async apply() {
    const result = await this.agent.api.myFeature()
    this.output = result
  }
}
```

2. **Add to Trotsky Class**:
```typescript
myFeature(): StepMyFeature<this> {
  return this.append(StepMyFeature<this>)
}
```

3. **Export**:
```typescript
// lib/trotsky.ts
export * from "./core/StepMyFeature"
```

### Using Mixins

Add reusable functionality via mixins:

```typescript
export class MyMixins {
  customAction() {
    return this.append(StepCustomAction)
  }
}

export class StepMyFeature extends mix(StepBuilder, MyMixins) {}
```

## Testing Strategy

- **Unit Tests**: Test individual steps in isolation
- **Integration Tests**: Test step chains and workflows
- **Test Environment**: Uses `@atproto/dev-env` for realistic testing

```typescript
describe('StepActor', () => {
  test('should fetch actor profile', async () => {
    const actor = await Trotsky.init(agent)
      .actor('alice')
      .runHere()

    expect(actor.output).toHaveProperty('handle')
  })
})
```

## Future Architecture Plans

### 1. Plugin System

Support for custom plugins:

```typescript
Trotsky.init(agent)
  .use(new AnalyticsPlugin())
  .use(new CachePlugin())
```

### 2. Middleware

Request/response interceptors:

```typescript
Trotsky.init(agent)
  .beforeStep((step) => console.log(`Executing: ${step.name}`))
  .afterStep((step) => console.log(`Completed: ${step.name}`))
```

### 3. Advanced Caching

Built-in caching layer for frequently accessed data:

```typescript
Trotsky.init(agent, {
  cache: {
    enabled: true,
    ttl: 60000
  }
})
```

## Best Practices

1. **Use Type Inference**: Let TypeScript infer types instead of explicit annotations
2. **Chain Efficiently**: Minimize API calls by batching when possible
3. **Handle Errors**: Always wrap `.run()` in try/catch
4. **Rate Limit**: Use `.wait()` between actions to avoid rate limits
5. **Test Workflows**: Write integration tests for complex chains

## Contributing

When contributing to Trotsky's architecture:

1. Follow existing patterns (Step hierarchy, mixins, etc.)
2. Add comprehensive JSDoc comments
3. Include unit and integration tests
4. Update this architecture document
5. Consider backward compatibility

## References

- [AT Protocol Documentation](https://atproto.com)
- [Bluesky API Reference](https://docs.bsky.app)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
