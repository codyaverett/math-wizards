import { type PageProps } from "$fresh/server.ts";

export default function App({ Component }: PageProps) {
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Maths Wizards - Level Up Your Math Skills</title>
        <meta
          name="description"
          content="Learn mathematics, TI calculator programming, and practical math applications with interactive lessons."
        />
        <link rel="stylesheet" href="/pico.min.css" />
        <link rel="stylesheet" href="/styles.css" />
        <script src="/htmx.min.js" defer></script>
      </head>
      <body>
        <Component />
      </body>
    </html>
  );
}
