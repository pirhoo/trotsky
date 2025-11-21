import fs from "fs/promises"
import type { AtpAgent } from "@atproto/api"

import { Step, type StepBuilder } from "../trotsky"

/**
 * Type representing the path of the JSON file to save the output.
 * @public
 */
export type StepSavePath = string | null

/**
 * A step that saves the current output to a JSON file at the specified path.
 *
 * @typeParam P - The parent type of this step, defaulting to {@link StepBuilder}.
 * @typeParam C - The context type, defaulting to `null`.
 * @typeParam O - The output type, defaulting to `string`.
 *
 * @example
 * Save search results to a file:
 * ```ts
 * await Trotsky.init(agent)
 *   .searchPosts({ q: "typescript tips" })
 *   .take(20)
 *   .each()
 *   .when((step) => step?.context?.likeCount > 10)
 *   .save("typescript-tips.json")
 *   .run()
 * ```
 *
 * @example
 * Save actor profiles:
 * ```ts
 * await Trotsky.init(agent)
 *   .actors(["alice.bsky.social", "bob.bsky.social", "carol.bsky.social"])
 *   .each()
 *   .save("profiles.json")
 *   .run()
 * ```
 *
 * @public
 */
export class StepSave<P = StepBuilder, C = null, O = string> extends Step<P, C, O> {

  /**
   * Path of the JSON file to save the current output.
   */
  protected _path: StepSavePath = null

  /**
   * Initializes the StepSave instance with the given path.
   * 
   * @param agent - The AT protocol agent used for API calls.
   * @param parent - The parent step in the chain.
   * @param path - The path of the JSON file to save the output. If not provided, the file path will be created using the current timestamp.
   */
  constructor (agent: AtpAgent, parent: P, path: StepSavePath = null) {
    super(agent, parent)
    this._path = path
  }

  /**
   * Clones the current step and returns a new instance with the same parameters.
   * @param rest - Additional parameters to pass to the cloned step. This is useful for child class overriding the clone.
   * @returns A new {@link StepActor} instance.
   */
  override clone (...rest: unknown[]) {
    return super.clone(this._path, ...rest)
  }


  /**
   * Applies the step logic to save the output to a JSON file.
   * 
   * @override
   */
  async apply () {
    const path = (this._path ?? `Output (${Date.now()})`).replace(/(\.json)?$/, ".json")
    await fs.writeFile(path, JSON.stringify(this.context))
    this.output = path as O
  }
}
