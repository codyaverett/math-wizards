import { Head } from "$fresh/runtime.ts";
import AdSense from "../components/AdSense.tsx";

export default function Home() {
  return (
    <>
      <Head>
        <title>Maths Wizards - Level Up Your Math Skills</title>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
        >
        </script>
      </Head>
      <main class="container">
        <header>
          <nav>
            <ul>
              <li><strong>Maths Wizards</strong></li>
            </ul>
            <ul>
              <li><a href="/lessons">Lessons</a></li>
              <li><a href="/blog">Blog</a></li>
              <li><a href="/faq">FAQ</a></li>
            </ul>
          </nav>
        </header>

        <section class="hero">
          <hgroup>
            <h1>Level Up Your Math Skills</h1>
            <p>
              Master mathematics fundamentals, TI calculator programming, and
              practical applications with interactive lessons.
            </p>
          </hgroup>
        </section>

        <section class="features">
          <div class="grid">
            <article>
              <h3>📐 Basic Mathematics</h3>
              <p>
                Arithmetic, algebra, geometry, trigonometry, and calculus
                fundamentals.
              </p>
            </article>
            <article>
              <h3>🧮 TI Calculators</h3>
              <p>
                Learn to use TI calculator functions effectively for
                problem-solving.
              </p>
            </article>
            <article>
              <h3>💻 Programming</h3>
              <p>
                TI-Basic programming and Assembly for creating calculator
                applications.
              </p>
            </article>
          </div>
        </section>

        {/* Ad placement between features and CTA */}
        <AdSense slot="1234567890" format="auto" />

        <section class="cta">
          <h2>Start Learning Today</h2>
          <p>Join our community and get updates on new lessons.</p>
          <form hx-post="/api/email/subscribe" hx-swap="outerHTML">
            <div class="grid">
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                required
              />
              <button type="submit">Subscribe</button>
            </div>
          </form>
        </section>

        <footer>
          <p>&copy; 2024 Maths Wizards. All rights reserved.</p>
        </footer>
      </main>
    </>
  );
}
