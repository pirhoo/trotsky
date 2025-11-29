/**
 * Hook types for Trotsky lifecycle events.
 *
 * This module provides type definitions for hooks that execute before and after
 * each step in a Trotsky scenario, allowing users to extend and customize behavior.
 *
 * @module types/hooks
 * @packageDocumentation
 */

import type { Step } from "../core/Step"

/**
 * Result information from a step execution.
 * @public
 */
export interface StepExecutionResult {

  /**
   * Whether the step executed successfully.
   */
  "success": boolean;

  /**
   * Error that occurred during execution, if any.
   */
  "error"?: Error;

  /**
   * Time taken to execute the step in milliseconds.
   */
  "executionTime"?: number;

  /**
   * The output produced by the step.
   */
  "output"?: unknown;
}

/**
 * Hook function that executes before a step runs.
 * @param step - The step about to be executed.
 * @param context - The current execution context.
 * @public
 */
export type BeforeStepHook = (step: Step, context: unknown) => void | Promise<void>

/**
 * Hook function that executes after a step completes.
 * @param step - The step that was executed.
 * @param context - The current execution context.
 * @param result - Information about the step execution.
 * @public
 */
export type AfterStepHook = (step: Step, context: unknown, result: StepExecutionResult) => void | Promise<void>

/**
 * Collection of lifecycle hooks.
 * @public
 */
export interface StepHooks {

  /**
   * Hooks that execute before each step.
   */
  "beforeStep": BeforeStepHook[];

  /**
   * Hooks that execute after each step.
   */
  "afterStep": AfterStepHook[];
}
