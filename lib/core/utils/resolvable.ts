import type { Step } from "../../trotsky"

// eslint-disable-next-line no-unused-vars
export type Resolvable<T> = T | Promise<T> | ((step: Step) => T) | ((step: Step) => Promise<T>)

export async function resolveValue<T> (step: Step, input: Resolvable<T>): Promise<T> {
  if (typeof input === "function") {
    // eslint-disable-next-line no-unused-vars
    return await (input as (step: Step) => T | Promise<T>)(step)
  }
  return input
}