// Interactive code editor island for TI-Basic and Assembly

import { useSignal } from "@preact/signals";
import { useEffect, useRef } from "preact/hooks";

interface CodeEditorProps {
  language: "ti-basic" | "assembly";
  starterCode?: string;
  problemId?: number;
}

export default function CodeEditor({ language, starterCode = "", problemId }: CodeEditorProps) {
  const code = useSignal(starterCode);
  const output = useSignal("");
  const isRunning = useSignal(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [code.value]);

  const runCode = async () => {
    isRunning.value = true;
    output.value = "Running...";

    try {
      const response = await fetch("/api/code/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: code.value,
          language: language,
        }),
      });

      const result = await response.json();

      if (result.success) {
        output.value = result.output || "Code executed successfully!";
      } else {
        output.value = `Error: ${result.error}`;
      }
    } catch (error) {
      output.value = `Error: ${error.message}`;
    } finally {
      isRunning.value = false;
    }
  };

  const clearCode = () => {
    code.value = starterCode;
    output.value = "";
  };

  return (
    <div class="code-playground">
      <div class="editor-header">
        <h3>
          {language === "ti-basic" ? "TI-Basic" : "Z80 Assembly"} Editor
        </h3>
        <div class="editor-actions">
          <button
            onClick={runCode}
            disabled={isRunning.value || !code.value.trim()}
          >
            {isRunning.value ? "Running..." : "▶ Run Code"}
          </button>
          <button onClick={clearCode} disabled={isRunning.value}>
            Clear
          </button>
        </div>
      </div>

      <textarea
        ref={textareaRef}
        class="code-input"
        value={code.value}
        onInput={(e) => {
          code.value = (e.target as HTMLTextAreaElement).value;
        }}
        placeholder={
          language === "ti-basic"
            ? "Enter your TI-Basic code here...\n\nExample:\n:Disp \"HELLO WORLD\"\n:Pause"
            : "Enter your Z80 Assembly code here...\n\nExample:\nLD A, 5\nADD A, 3"
        }
        spellcheck={false}
      />

      {output.value && (
        <div class="code-output">
          <h4>Output:</h4>
          <pre>{output.value}</pre>
        </div>
      )}

      <div class="editor-info">
        <details>
          <summary>Tips & Syntax Help</summary>
          {language === "ti-basic" ? (
            <div>
              <h5>TI-Basic Commands:</h5>
              <ul>
                <li><code>:Disp</code> - Display text or values</li>
                <li><code>:Input</code> - Get user input</li>
                <li><code>:If/Then/Else/End</code> - Conditionals</li>
                <li><code>:For/End</code> - Loops</li>
                <li><code>:Pause</code> - Wait for user</li>
              </ul>
            </div>
          ) : (
            <div>
              <h5>Z80 Assembly Instructions:</h5>
              <ul>
                <li><code>LD</code> - Load data</li>
                <li><code>ADD, SUB</code> - Arithmetic</li>
                <li><code>JP, JR</code> - Jump instructions</li>
                <li><code>CALL, RET</code> - Subroutines</li>
              </ul>
            </div>
          )}
        </details>
      </div>
    </div>
  );
}
