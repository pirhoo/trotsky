import type { Step } from "../../trotsky"

/**
 * Represents a value that can be resolved dynamically. It may be:
 * - A direct value of type `T`
 * - A promise resolving to type `T`
 * - A function returning a value of type `T` or a promise resolving to `T`, with a {@link Step} as its argument.
 *
 * @typeParam T - The type of the resolvable value.
 */
export type Resolvable<T> = T | Promise<T> | ((step: Step) => T | Promise<T>)

/**
 * Resolves a given {@link Resolvable} input into its final value.
 * If the input is a function, it is called with the provided {@link Step} and its result is awaited.
 * Otherwise, the input is returned as is or awaited if it is a promise.
 *
 * @typeParam T - The type of the resolved value.
 * @param step - The {@link Step} instance to pass to the resolver function if the input is callable.
 * @param input - The {@link Resolvable} input to resolve.
 * @returns A promise resolving to the final value of type `T`.
 */
export async function resolveValue<T> (step: Step<unknown>, input: Resolvable<T>): Promise<T> {
  if (typeof input === "function") {
    return await (input as (step: Step) => T | Promise<T>)(step as Step)
  }
  return input
}
