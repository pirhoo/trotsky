import type { AppBskyNotificationListNotifications } from "@atproto/api"

import { StepBuilderList, type Trotsky } from "../trotsky"

/**
 * Type representing the output of the notifications retrieved by {@link StepNotifications}.
 * @public
 */
export type StepNotificationsOutput = AppBskyNotificationListNotifications.Notification[]

/**
 * Type representing the query parameters for retrieving notifications.
 * @public
 */
export type StepNotificationsQueryParams = AppBskyNotificationListNotifications.QueryParams

/**
 * Type representing the cursor for paginated queries.
 * @public
 */
export type StepNotificationsQueryParamsCursor = StepNotificationsQueryParams["cursor"] | undefined

/**
 * Represents a step for retrieving user notifications using the Bluesky API.
 * Supports paginated retrieval of notifications.
 *
 * @typeParam P - Type of the parent step, extending {@link Trotsky}.
 * @typeParam C - Type of the context object.
 * @typeParam O - Type of the output object, extending {@link StepNotificationsOutput}.
 *
 * @example
 * Get recent notifications:
 * ```ts
 * await Trotsky.init(agent)
 *   .notifications()
 *   .take(20)
 *   .tap((step) => {
 *     step.output.forEach((notif) => {
 *       console.log(`${notif.reason}: from ${notif.author.handle}`)
 *     })
 *   })
 *   .run()
 * ```
 *
 * @public
 */
export class StepNotifications<P = Trotsky, C = null, O extends StepNotificationsOutput = StepNotificationsOutput> extends StepBuilderList<P, C, O> {

  /**
   * Applies pagination to retrieve notifications and sets the output.
   * Fetches paginated results using the agent and appends them to the output.
   */
  async applyPagination () {
    this.output = await this.paginate<O, AppBskyNotificationListNotifications.Response>("notifications", (cursor) => {
      return this.agent.app.bsky.notification.listNotifications(this.queryParams(cursor))
    })
  }

  /**
   * Generates query parameters for retrieving notifications, including the optional cursor.
   * @param cursor - The cursor for paginated queries.
   * @returns The query parameters for retrieving notifications.
   */
  private queryParams (cursor: StepNotificationsQueryParamsCursor): StepNotificationsQueryParams {
    return { cursor }
  }
}
