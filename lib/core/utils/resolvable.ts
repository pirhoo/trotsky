import type { Step } from "../../trotsky"

export type Resolvable<T> = T | Promise<T> | ((step: Step) => T) | ((step: Step) => Promise<T>)

export async function resolveValue<T>(step: Step, input: Resolvable<T>): Promise<T> {
    if (typeof input === "function") {
        return await (input as (step: Step) => T | Promise<T>)(step)
    }
    return input
}