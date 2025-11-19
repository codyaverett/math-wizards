// FAQ service - Business logic for FAQ items

import { query, queryOne, incrementViewCount } from "../db/database.ts";
import type { FAQItem } from "../models/user.ts";

export class FAQService {
  /**
   * Get all published FAQ items
   */
  async getAllFAQs(): Promise<FAQItem[]> {
    return query<FAQItem>(
      `SELECT * FROM faq_items
       WHERE is_published = 1
       ORDER BY sort_order ASC, created_at ASC`
    );
  }

  /**
   * Get FAQs by category
   */
  async getFAQsByCategory(category: string): Promise<FAQItem[]> {
    return query<FAQItem>(
      `SELECT * FROM faq_items
       WHERE category = ? AND is_published = 1
       ORDER BY sort_order ASC`,
      [category]
    );
  }

  /**
   * Get all FAQ categories
   */
  async getAllCategories(): Promise<string[]> {
    const results = query<{ category: string }>(
      `SELECT DISTINCT category FROM faq_items
       WHERE is_published = 1 AND category IS NOT NULL
       ORDER BY category ASC`
    );

    return results.map((r) => r.category);
  }

  /**
   * Get FAQs grouped by category
   */
  async getFAQsGroupedByCategory(): Promise<Record<string, FAQItem[]>> {
    const faqs = await this.getAllFAQs();
    const grouped: Record<string, FAQItem[]> = {};

    faqs.forEach((faq) => {
      const category = faq.category || "General";
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(faq);
    });

    return grouped;
  }

  /**
   * Get a single FAQ by ID
   */
  async getFAQById(id: number): Promise<FAQItem | null> {
    const faq = queryOne<FAQItem>(
      `SELECT * FROM faq_items WHERE id = ? AND is_published = 1`,
      [id]
    );

    if (faq) {
      incrementViewCount("faq_items", id);
    }

    return faq;
  }

  /**
   * Search FAQs
   */
  async searchFAQs(searchQuery: string): Promise<FAQItem[]> {
    return query<FAQItem>(
      `SELECT * FROM faq_items
       WHERE is_published = 1
         AND (question LIKE ? OR answer LIKE ?)
       ORDER BY view_count DESC`,
      [`%${searchQuery}%`, `%${searchQuery}%`]
    );
  }

  /**
   * Get popular FAQs
   */
  async getPopularFAQs(limit = 5): Promise<FAQItem[]> {
    return query<FAQItem>(
      `SELECT * FROM faq_items
       WHERE is_published = 1
       ORDER BY view_count DESC
       LIMIT ?`,
      [limit]
    );
  }
}

// Export singleton instance
export const faqService = new FAQService();
