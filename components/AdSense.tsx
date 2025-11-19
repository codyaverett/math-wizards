// Google AdSense component for monetization
// To enable ads, set the ADSENSE_CLIENT_ID environment variable

interface AdSenseProps {
  slot: string;
  format?: "auto" | "rectangle" | "vertical" | "horizontal";
  responsive?: boolean;
  style?: Record<string, string>;
}

export default function AdSense({
  slot,
  format = "auto",
  responsive = true,
  style = {},
}: AdSenseProps) {
  // Get AdSense client ID from environment
  const clientId = Deno.env.get("ADSENSE_CLIENT_ID");

  // Don't render ads if client ID is not configured
  if (!clientId) {
    // In development, show placeholder
    if (Deno.env.get("DENO_ENV") !== "production") {
      return (
        <div
          style={{
            border: "2px dashed #ccc",
            padding: "2rem",
            textAlign: "center",
            background: "#f5f5f5",
            marginBottom: "1rem",
            ...style,
          }}
        >
          <p style={{ color: "#666", margin: 0 }}>
            Ad Placeholder (Configure ADSENSE_CLIENT_ID)
          </p>
        </div>
      );
    }
    return null;
  }

  return (
    <div style={{ marginBottom: "1rem", ...style }}>
      <ins
        class="adsbygoogle"
        style={{ display: "block", ...style }}
        data-ad-client={clientId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive.toString()}
      >
      </ins>
      <script>
        {`(adsbygoogle = window.adsbygoogle || []).push({});`}
      </script>
    </div>
  );
}
