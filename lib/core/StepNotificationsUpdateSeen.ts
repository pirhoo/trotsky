import { Step, type Trotsky } from "../trotsky"

/**
 * Represents a step for marking notifications as seen using the Bluesky API.
 *
 * @typeParam P - Type of the parent step, extending {@link Trotsky}.
 * @typeParam C - Type of the context object.
 * @typeParam O - Type of the output object.
 *
 * @example
 * Mark all notifications as seen:
 * ```ts
 * await Trotsky.init(agent)
 *   .notificationsUpdateSeen()
 *   .run()
 * ```
 *
 * @public
 */
export class StepNotificationsUpdateSeen<P = Trotsky, C = null, O = null> extends Step<P, C, O> {

  /**
   * Applies the step logic to mark notifications as seen.
   */
  async apply () {
    const seenAt = new Date().toISOString()
    await this.agent.app.bsky.notification.updateSeen({ seenAt })
  }
}
