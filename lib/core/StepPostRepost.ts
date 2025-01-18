import { Step, type StepPost, type StepPostOutput } from "../trotsky"

/**
 * Represents the output of a repost step, including the URI and CID of the reposted content.
 * @public
 */
export type StepPostRepostOutput = { "uri": string; "cid": string }

/**
 * Represents a step for reposting a specific post.
 * 
 * @typeParam P - The parent type of this step, defaulting to {@link StepPost}.
 * @typeParam C - The context type, defaulting to {@link StepPostOutput}.
 * @typeParam O - The output type, defaulting to {@link StepPostRepostOutput}.
 * @public
 */
export class StepPostRepost<P = StepPost, C extends StepPostOutput = StepPostOutput, O extends StepPostRepostOutput = StepPostRepostOutput> extends Step<P, C, O> {

  /**
   * Applies the step logic to repost the post provided in the context.
   * The resulting URI and CID of the repost are stored in the output.
   * 
   * @override
   * @throws Error
   * If the context does not provide the required `uri` and `cid`.
   */
  async apply () {
    const { uri, cid } = this.context as C
    this.output = await this.agent.repost(uri, cid) as O
  }
}
