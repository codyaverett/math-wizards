// Code playground page

import { Head } from "$fresh/runtime.ts";
import CodeEditor from "../islands/CodeEditor.tsx";

export default function PlaygroundPage() {
  const tiBasicStarter = `:ClrHome
:Disp "HELLO WORLD"
:Pause`;

  const assemblyStarter = `; Simple Z80 Assembly Example
LD A, 5
ADD A, 3
LD B, A
HALT`;

  return (
    <>
      <Head>
        <title>Code Playground - Maths Wizards</title>
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
              <li><a href="/playground">Playground</a></li>
              <li><a href="/faq">FAQ</a></li>
            </ul>
          </nav>
        </header>

        <section>
          <hgroup>
            <h1>Code Playground</h1>
            <p>Practice TI-Basic and Z80 Assembly programming</p>
          </hgroup>
        </section>

        <section>
          <h2>TI-Basic Playground</h2>
          <p>
            Write and validate TI-Basic code for TI-83/84 calculators.
          </p>
          <CodeEditor language="ti-basic" starterCode={tiBasicStarter} />
        </section>

        <section>
          <h2>Z80 Assembly Playground</h2>
          <p>
            Write and validate Z80 Assembly code for TI calculators.
          </p>
          <CodeEditor language="assembly" starterCode={assemblyStarter} />
        </section>

        <footer>
          <p>&copy; 2024 Maths Wizards. All rights reserved.</p>
        </footer>
      </main>
    </>
  );
}
