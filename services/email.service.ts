// Email service - Business logic for email subscriptions

import { query, queryOne, execute } from "../db/database.ts";
import type { EmailSubscriber } from "../models/user.ts";

export class EmailService {
  /**
   * Subscribe a new email
   */
  async subscribe(email: string, name?: string): Promise<{ success: boolean; message: string }> {
    // Check if email already exists
    const existing = queryOne<EmailSubscriber>(
      `SELECT * FROM email_subscribers WHERE email = ?`,
      [email]
    );

    if (existing) {
      if (existing.is_active) {
        return {
          success: false,
          message: "This email is already subscribed.",
        };
      } else {
        // Reactivate subscription
        execute(
          `UPDATE email_subscribers
           SET is_active = 1, unsubscribed_at = NULL
           WHERE email = ?`,
          [email]
        );
        return {
          success: true,
          message: "Your subscription has been reactivated!",
        };
      }
    }

    // Insert new subscriber
    execute(
      `INSERT INTO email_subscribers (email, name, is_active)
       VALUES (?, ?, 1)`,
      [email, name ?? null]
    );

    return {
      success: true,
      message: "Successfully subscribed! Thank you for joining our community.",
    };
  }

  /**
   * Unsubscribe an email
   */
  async unsubscribe(email: string): Promise<{ success: boolean; message: string }> {
    const existing = queryOne<EmailSubscriber>(
      `SELECT * FROM email_subscribers WHERE email = ?`,
      [email]
    );

    if (!existing) {
      return {
        success: false,
        message: "Email not found in our subscriber list.",
      };
    }

    if (!existing.is_active) {
      return {
        success: false,
        message: "This email is already unsubscribed.",
      };
    }

    execute(
      `UPDATE email_subscribers
       SET is_active = 0, unsubscribed_at = datetime('now')
       WHERE email = ?`,
      [email]
    );

    return {
      success: true,
      message: "You have been unsubscribed. Sorry to see you go!",
    };
  }

  /**
   * Get all active subscribers
   */
  async getActiveSubscribers(): Promise<EmailSubscriber[]> {
    return query<EmailSubscriber>(
      `SELECT * FROM email_subscribers WHERE is_active = 1 ORDER BY subscribed_at DESC`
    );
  }

  /**
   * Get subscriber count
   */
  async getSubscriberCount(): Promise<number> {
    const result = queryOne<{ count: number }>(
      `SELECT COUNT(*) as count FROM email_subscribers WHERE is_active = 1`
    );
    return result?.count ?? 0;
  }

  /**
   * Check if email is subscribed
   */
  async isSubscribed(email: string): Promise<boolean> {
    const subscriber = queryOne<EmailSubscriber>(
      `SELECT * FROM email_subscribers WHERE email = ? AND is_active = 1`,
      [email]
    );
    return subscriber !== null;
  }
}

// Export singleton instance
export const emailService = new EmailService();
