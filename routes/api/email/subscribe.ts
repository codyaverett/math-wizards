// API route for email subscription

import { Handlers } from "$fresh/server.ts";
import { emailService } from "../../../services/email.service.ts";

export const handler: Handlers = {
  async POST(req) {
    try {
      const formData = await req.formData();
      const email = formData.get("email")?.toString();
      const name = formData.get("name")?.toString();

      if (!email) {
        return new Response(
          `<div class="feedback error" role="alert">
            <p>✗ Please provide an email address.</p>
          </div>`,
          {
            status: 400,
            headers: { "Content-Type": "text/html" },
          }
        );
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return new Response(
          `<div class="feedback error" role="alert">
            <p>✗ Please provide a valid email address.</p>
          </div>`,
          {
            status: 400,
            headers: { "Content-Type": "text/html" },
          }
        );
      }

      const result = await emailService.subscribe(email, name);

      if (result.success) {
        return new Response(
          `<div class="feedback success" role="alert">
            <p>✓ ${result.message}</p>
          </div>`,
          {
            status: 200,
            headers: { "Content-Type": "text/html" },
          }
        );
      } else {
        return new Response(
          `<div class="feedback error" role="alert">
            <p>✗ ${result.message}</p>
          </div>`,
          {
            status: 400,
            headers: { "Content-Type": "text/html" },
          }
        );
      }
    } catch (error) {
      console.error("Email subscription error:", error);
      return new Response(
        `<div class="feedback error" role="alert">
          <p>✗ An error occurred. Please try again later.</p>
        </div>`,
        {
          status: 500,
          headers: { "Content-Type": "text/html" },
        }
      );
    }
  },
};
