<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Packages](./index.md) &nbsp;&#8250;&nbsp; [trotsky](./trotsky.md) &nbsp;&#8250;&nbsp; [Trotsky](./trotsky.trotsky.md) &nbsp;&#8250;&nbsp; [append](./trotsky.trotsky.append.md)

# Trotsky.append() method

Appends a new step to the sequence.

**Signature:**

```typescript
append<Type extends Step<this>>(type: new (agent: AtpAgent, parent: this, ...args: any[]) => Type, ...args: unknown[]): Type;
```

## Parameters

<table><thead><tr><th>

Parameter


</th><th>

Type


</th><th>

Description


</th></tr></thead>
<tbody><tr><td>

type


</td><td>

new (agent: AtpAgent, parent: this, ...args: any\[\]) =&gt; Type


</td><td>

The step class.


</td></tr>
<tr><td>

args


</td><td>

unknown\[\]


</td><td>

Arguments for the step.


</td></tr>
</tbody></table>
**Returns:**

Type

The new step instance.