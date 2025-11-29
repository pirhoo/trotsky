# Lifecycle Hooks

Lifecycle hooks are callback functions that execute before and after each step in your Trotsky scenarios. They provide powerful extension points for logging, monitoring, validation, error handling, and more—all without modifying your step implementations.

## Quick Start

```typescript
import { Trotsky } from 'trotsky'
import { AtpAgent } from '@atproto/api'

const agent = new AtpAgent({ service: 'https://bsky.social' })
await agent.login({ identifier: 'your-handle', password: 'your-password' })

const trotsky = new Trotsky(agent)

// Log when steps start
trotsky.beforeStep((step, context) => {
  console.log(`Starting: ${step.constructor.name}`)
})

// Log when steps complete
trotsky.afterStep((step, context, result) => {
  console.log(`Completed: ${step.constructor.name} (${result.executionTime}ms)`)
})

// Run your scenario
await trotsky
  .actor('alice.bsky.social')
  .createPost('Hello world!')
  .run()
```

Output:
```
Starting: StepActor
Completed: StepActor (245ms)
Starting: StepCreatePost
Completed: StepCreatePost (189ms)
```

## Hook Execution Flow

For each step in your scenario, hooks execute in this order:

```
1. beforeStep hooks (in registration order)
   ↓
2. Step execution (step.apply())
   ↓
3. afterStep hooks (in registration order)
```

### Multiple Hooks

You can register multiple hooks of the same type. They execute in the order they were registered:

```typescript
trotsky
  .beforeStep(() => console.log('Hook 1'))
  .beforeStep(() => console.log('Hook 2'))
  .beforeStep(() => console.log('Hook 3'))
  .actor('alice.test')

// Output:
// Hook 1
// Hook 2
// Hook 3
// (StepActor executes)
```

### Async Hooks

Both hook types support async functions:

```typescript
trotsky.beforeStep(async (step, context) => {
  await new Promise(resolve => setTimeout(resolve, 100))
  console.log('Async work complete')
})

trotsky.afterStep(async (step, context, result) => {
  // Send metrics to external service
  await sendMetrics({
    step: step.constructor.name,
    duration: result.executionTime
  })
})
```

## Common Use Cases

### Logging and Debugging

Track execution flow and inspect state at each step:

```typescript
trotsky.beforeStep((step, context) => {
  console.log(`[${new Date().toISOString()}] → ${step.constructor.name}`)
})

trotsky.afterStep((step, context, result) => {
  const status = result.success ? '✓' : '✗'
  console.log(`[${new Date().toISOString()}] ${status} ${step.constructor.name}`)
})
```

### Performance Monitoring

Identify slow steps and bottlenecks:

```typescript
const metrics: Array<{ step: string; duration: number }> = []

trotsky.afterStep((step, context, result) => {
  metrics.push({
    step: step.constructor.name,
    duration: result.executionTime || 0
  })

  // Alert on slow steps
  if (result.executionTime && result.executionTime > 1000) {
    console.warn(`⚠️  Slow: ${step.constructor.name} took ${result.executionTime}ms`)
  }
})

// After scenario completes
console.log('Performance Report:')
metrics.forEach(m => console.log(`  ${m.step}: ${m.duration}ms`))
```

### Validation and Testing

Ensure steps produce expected results:

```typescript
trotsky.afterStep((step, context, result) => {
  if (step.constructor.name === 'StepActor') {
    if (!context || typeof context !== 'object' || !('session' in context)) {
      throw new Error('StepActor must establish a session')
    }
  }

  if (step.constructor.name === 'StepCreatePost') {
    const output = step.output as { uri?: string; cid?: string }
    if (!output?.uri || !output?.cid) {
      throw new Error('StepCreatePost must return uri and cid')
    }
  }
})
```

### Error Recovery and Retry

Automatically retry steps that fail due to transient errors:

```typescript
const MAX_RETRIES = 3

trotsky.afterStep(async (step, context, result) => {
  if (!result.success && result.error?.message.includes('rate limit')) {
    const retryCount = (context as any)._retryCount || 0

    if (retryCount < MAX_RETRIES) {
      console.log(`Retrying ${step.constructor.name} (attempt ${retryCount + 1})`)
      ;(context as any)._retryCount = retryCount + 1

      await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)))
      await step.apply()

      ;(context as any)._retryCount = 0
    }
  }
})
```

### State Snapshots

Capture execution state for debugging or auditing:

```typescript
import * as fs from 'fs'

let stepCounter = 0

trotsky.afterStep((step, context, result) => {
  stepCounter++

  const snapshot = {
    stepNumber: stepCounter,
    stepType: step.constructor.name,
    timestamp: new Date().toISOString(),
    success: result.success,
    executionTime: result.executionTime,
    context: extractRelevantContext(context)
  }

  fs.writeFileSync(
    `./snapshots/step-${stepCounter}.json`,
    JSON.stringify(snapshot, null, 2)
  )
})
```

### Timeout Protection

Prevent steps from hanging indefinitely:

```typescript
const STEP_TIMEOUT_MS = 5000

trotsky.beforeStep((step, context) => {
  const ctx = context as any
  ctx._stepTimeout = setTimeout(() => {
    throw new Error(`Step ${step.constructor.name} exceeded ${STEP_TIMEOUT_MS}ms timeout`)
  }, STEP_TIMEOUT_MS)
})

trotsky.afterStep((step, context) => {
  const ctx = context as any
  if (ctx._stepTimeout) {
    clearTimeout(ctx._stepTimeout)
    delete ctx._stepTimeout
  }
})
```

### Custom Metrics Collection

Aggregate statistics across your scenario:

```typescript
interface ScenarioMetrics {
  totalSteps: number
  successfulSteps: number
  failedSteps: number
  totalDuration: number
  stepMetrics: Map<string, {
    count: number
    avgTime: number
    failures: number
  }>
}

const metrics: ScenarioMetrics = {
  totalSteps: 0,
  successfulSteps: 0,
  failedSteps: 0,
  totalDuration: 0,
  stepMetrics: new Map()
}

trotsky.afterStep((step, context, result) => {
  const stepName = step.constructor.name
  const duration = result.executionTime || 0

  metrics.totalSteps++
  metrics.totalDuration += duration

  if (result.success) {
    metrics.successfulSteps++
  } else {
    metrics.failedSteps++
  }

  // Update per-step metrics
  if (!metrics.stepMetrics.has(stepName)) {
    metrics.stepMetrics.set(stepName, {
      count: 0,
      avgTime: 0,
      failures: 0
    })
  }

  const stepMetric = metrics.stepMetrics.get(stepName)!
  stepMetric.count++
  stepMetric.avgTime = ((stepMetric.avgTime * (stepMetric.count - 1)) + duration) / stepMetric.count

  if (!result.success) {
    stepMetric.failures++
  }
})
```

## Best Practices

### Keep Hooks Fast

Hooks execute synchronously in the step execution flow. Avoid heavy computation:

```typescript
// ❌ Bad: Expensive operation blocks execution
trotsky.afterStep((step, context, result) => {
  const analysis = performExpensiveAnalysis(context)
  saveToDatabase(analysis)
})

// ✅ Good: Defer expensive work
trotsky.afterStep(async (step, context, result) => {
  await metricsQueue.add({
    step: step.constructor.name,
    duration: result.executionTime
  })
})
```

### Handle Errors Gracefully

Errors in hooks will stop scenario execution. Add try-catch for non-critical operations:

```typescript
trotsky.afterStep(async (step, context, result) => {
  try {
    await sendMetricsToExternalService(result)
  } catch (error) {
    console.warn('Failed to send metrics:', error)
  }
})
```

### Use Type Guards for Context

The context is typed as `unknown`. Use type guards for safe access:

```typescript
interface ActorContext {
  handle: string
  did: string
  session: any
}

function isActorContext(ctx: unknown): ctx is ActorContext {
  return (
    ctx !== null &&
    typeof ctx === 'object' &&
    'handle' in ctx &&
    'did' in ctx &&
    'session' in ctx
  )
}

trotsky.afterStep((step, context, result) => {
  if (isActorContext(context)) {
    console.log(`Actor: ${context.handle} (${context.did})`)
  }
})
```

### Clean Up Resources

Use afterStep to clean up resources created in beforeStep:

```typescript
trotsky.beforeStep((step, context) => {
  const ctx = context as any
  ctx._startTime = Date.now()
  ctx._tempFiles = []
})

trotsky.afterStep((step, context) => {
  const ctx = context as any

  // Clean up temp files
  if (ctx._tempFiles) {
    ctx._tempFiles.forEach((file: string) => fs.unlinkSync(file))
    delete ctx._tempFiles
  }

  delete ctx._startTime
})
```

## Advanced Topics

### Conditional Hook Execution

Execute hooks only for specific steps:

```typescript
trotsky.afterStep((step, context, result) => {
  // Only track performance for post creation
  if (step.constructor.name === 'StepCreatePost') {
    trackPerformance(step.constructor.name, result.executionTime)
  }
})
```

### Hook Composition

Create reusable hook functions:

```typescript
function createLoggingHook(prefix: string) {
  return (step: Step, context: unknown) => {
    console.log(`[${prefix}] ${step.constructor.name}`)
  }
}

function createTimingHook(metrics: Map<string, number[]>) {
  return (step: Step, context: unknown, result: StepExecutionResult) => {
    const stepName = step.constructor.name
    if (!metrics.has(stepName)) {
      metrics.set(stepName, [])
    }
    metrics.get(stepName)!.push(result.executionTime || 0)
  }
}

const metrics = new Map()

trotsky
  .beforeStep(createLoggingHook('DEBUG'))
  .afterStep(createTimingHook(metrics))
```

### Testing with Hooks

Use hooks to assert expected behavior in tests:

```typescript
import { describe, it, expect } from '@jest/globals'

describe('User signup scenario', () => {
  it('should create actor and post', async () => {
    const executedSteps: string[] = []

    const trotsky = new Trotsky(agent)
      .afterStep((step, context, result) => {
        executedSteps.push(step.constructor.name)
        expect(result.success).toBe(true)
      })
      .actor('alice.test')
      .createPost('Hello!')

    await trotsky.run()

    expect(executedSteps).toEqual(['StepActor', 'StepCreatePost'])
  })
})
```
