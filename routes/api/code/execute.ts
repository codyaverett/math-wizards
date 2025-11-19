// API route for code execution/validation

import { Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  async POST(req) {
    try {
      const { code, language } = await req.json();

      if (!code || !language) {
        return Response.json({
          success: false,
          error: "Missing code or language",
        }, { status: 400 });
      }

      // For now, we'll validate syntax rather than execute
      // Full execution would require sandboxing and emulation
      const result = await validateCode(code, language);

      return Response.json(result);
    } catch (error) {
      console.error("Code execution error:", error);
      return Response.json({
        success: false,
        error: "An error occurred processing your code",
      }, { status: 500 });
    }
  },
};

/**
 * Validate code syntax and provide feedback
 * In a production environment, this would use actual interpreters/emulators
 */
async function validateCode(
  code: string,
  language: string
): Promise<{ success: boolean; output?: string; error?: string }> {
  if (language === "ti-basic") {
    return validateTIBasic(code);
  } else if (language === "assembly") {
    return validateAssembly(code);
  }

  return {
    success: false,
    error: "Unsupported language",
  };
}

/**
 * Validate TI-Basic code
 */
function validateTIBasic(code: string): { success: boolean; output?: string; error?: string } {
  const lines = code.split("\n").filter((line) => line.trim());

  // Basic syntax validation
  const validCommands = [
    "Disp",
    "Input",
    "Prompt",
    "If",
    "Then",
    "Else",
    "End",
    "For",
    "While",
    "Repeat",
    "Pause",
    "ClrHome",
    "Output",
    "Text",
    "Lbl",
    "Goto",
    "Menu",
    "Stop",
  ];

  const errors: string[] = [];
  let hasDisp = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Skip empty lines and comments
    if (!line || line.startsWith("//")) continue;

    // Lines should start with :
    if (!line.startsWith(":")) {
      errors.push(`Line ${i + 1}: TI-Basic commands should start with :`);
      continue;
    }

    const command = line.substring(1).split(" ")[0].split("(")[0];

    if (command === "Disp") {
      hasDisp = true;
    }

    // Check if command is valid (case insensitive)
    const isValid = validCommands.some(
      (cmd) => cmd.toLowerCase() === command.toLowerCase()
    );

    if (!isValid && command && !isNumber(command)) {
      errors.push(
        `Line ${i + 1}: Unknown command '${command}'. Did you mean one of: ${validCommands.join(", ")}?`
      );
    }
  }

  if (errors.length > 0) {
    return {
      success: false,
      error: errors.join("\n"),
    };
  }

  // Simulate output for simple Disp commands
  let output = "✓ Syntax looks good!\n\n";

  if (hasDisp) {
    output += "Simulated output:\n";
    for (const line of lines) {
      if (line.includes("Disp ")) {
        const content = line.substring(line.indexOf("Disp ") + 5).trim();
        // Remove quotes if present
        const cleaned = content.replace(/^["']|["']$/g, "");
        output += cleaned + "\n";
      }
    }
  } else {
    output += "No output commands found. Program appears to run without errors.";
  }

  return {
    success: true,
    output,
  };
}

/**
 * Validate Assembly code
 */
function validateAssembly(code: string): { success: boolean; output?: string; error?: string } {
  const lines = code.split("\n").filter((line) => line.trim());

  const validInstructions = [
    "LD",
    "ADD",
    "SUB",
    "AND",
    "OR",
    "XOR",
    "CP",
    "INC",
    "DEC",
    "JP",
    "JR",
    "CALL",
    "RET",
    "PUSH",
    "POP",
    "NOP",
    "HALT",
  ];

  const errors: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Skip empty lines and comments
    if (!line || line.startsWith(";")) continue;

    // Skip labels
    if (line.endsWith(":")) continue;

    const instruction = line.split(" ")[0].toUpperCase();

    const isValid = validInstructions.includes(instruction);

    if (!isValid) {
      errors.push(
        `Line ${i + 1}: Unknown instruction '${instruction}'. Common instructions: ${validInstructions.slice(0, 8).join(", ")}`
      );
    }
  }

  if (errors.length > 0) {
    return {
      success: false,
      error: errors.join("\n"),
    };
  }

  return {
    success: true,
    output: `✓ Assembly syntax looks valid!\n\nYour code has ${lines.length} lines.\nNote: This is syntax validation only. Actual execution would require a Z80 emulator.`,
  };
}

/**
 * Check if a string is a number
 */
function isNumber(str: string): boolean {
  return !isNaN(parseFloat(str)) && isFinite(Number(str));
}
