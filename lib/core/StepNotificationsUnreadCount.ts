import type { AppBskyNotificationGetUnreadCount } from "@atproto/api"

import { Step, type Trotsky } from "../trotsky"

/**
 * Type representing the output of the unread count retrieved by {@link StepNotificationsUnreadCount}.
 * @public
 */
export type StepNotificationsUnreadCountOutput = AppBskyNotificationGetUnreadCount.OutputSchema

/**
 * Represents a step for retrieving the unread notification count using the Bluesky API.
 *
 * @typeParam P - Type of the parent step, extending {@link Trotsky}.
 * @typeParam C - Type of the context object.
 * @typeParam O - Type of the output object, extending {@link StepNotificationsUnreadCountOutput}.
 *
 * @example
 * Get unread notification count:
 * ```ts
 * await Trotsky.init(agent)
 *   .notificationsUnreadCount()
 *   .tap((step) => {
 *     console.log(`Unread notifications: ${step.output.count}`)
 *   })
 *   .run()
 * ```
 *
 * @public
 */
export class StepNotificationsUnreadCount<P = Trotsky, C = null, O extends StepNotificationsUnreadCountOutput = StepNotificationsUnreadCountOutput> extends Step<P, C, O> {

  /**
   * Applies the step logic to retrieve the unread notification count.
   */
  async apply () {
    const { data } = await this.agent.app.bsky.notification.getUnreadCount()
    this.output = data as O
  }
}
