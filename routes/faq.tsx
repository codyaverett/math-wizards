// FAQ page

import { Handlers, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import { faqService } from "../services/faq.service.ts";
import type { FAQItem } from "../models/user.ts";

interface FAQPageData {
  faqsByCategory: Record<string, FAQItem[]>;
}

export const handler: Handlers<FAQPageData> = {
  async GET(_req, ctx) {
    const faqsByCategory = await faqService.getFAQsGroupedByCategory();
    return ctx.render({ faqsByCategory });
  },
};

export default function FAQPage({ data }: PageProps<FAQPageData>) {
  return (
    <>
      <Head>
        <title>FAQ - Maths Wizards</title>
      </Head>
      <main class="container">
        <header>
          <nav>
            <ul>
              <li><strong><a href="/">Maths Wizards</a></strong></li>
            </ul>
            <ul>
              <li><a href="/lessons">Lessons</a></li>
              <li><a href="/blog">Blog</a></li>
              <li><a href="/faq">FAQ</a></li>
            </ul>
          </nav>
        </header>

        <section>
          <hgroup>
            <h1>Frequently Asked Questions</h1>
            <p>Find answers to common questions</p>
          </hgroup>
        </section>

        {Object.entries(data.faqsByCategory).map(([category, faqs]) => (
          <section key={category}>
            <h2>{category}</h2>
            {faqs.map((faq) => (
              <details key={faq.id}>
                <summary>{faq.question}</summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </section>
        ))}

        <footer>
          <p>&copy; 2024 Maths Wizards. All rights reserved.</p>
        </footer>
      </main>
    </>
  );
}
