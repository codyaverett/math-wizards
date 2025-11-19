# Google AdSense Integration

Maths Wizards includes built-in support for Google AdSense monetization. This guide explains how to set up and configure ads on your site.

## Prerequisites

1. **Google AdSense Account**: Sign up at [adsense.google.com](https://adsense.google.com)
2. **Approved Website**: Your site must be approved by AdSense
3. **Ad Units Created**: Create ad units in your AdSense dashboard

## Configuration

### Step 1: Get Your AdSense Client ID

1. Log in to Google AdSense
2. Go to **Account** > **Settings**
3. Find your Publisher ID (format: `ca-pub-XXXXXXXXXXXXXXXX`)

### Step 2: Set Environment Variable

Add your AdSense client ID to your environment variables:

```bash
# .env file
ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXXXXXXXX
```

Or export it in your shell:

```bash
export ADSENSE_CLIENT_ID="ca-pub-XXXXXXXXXXXXXXXX"
```

### Step 3: Create Ad Units

1. In AdSense, go to **Ads** > **By ad unit**
2. Click **+ New ad unit**
3. Choose ad type (Display ads recommended)
4. Configure size and style
5. Save and note the **Ad slot ID**

## Usage

### Basic Ad Placement

Import and use the AdSense component in any route:

```tsx
import AdSense from "../components/AdSense.tsx";

export default function MyPage() {
  return (
    <div>
      <h1>My Content</h1>

      {/* Ad placement */}
      <AdSense slot="1234567890" />

      <p>More content...</p>
    </div>
  );
}
```

### Ad Placement Options

```tsx
// Auto-sized responsive ad
<AdSense slot="1234567890" format="auto" />

// Rectangle ad
<AdSense slot="1234567890" format="rectangle" responsive={false} />

// Horizontal banner
<AdSense
  slot="1234567890"
  format="horizontal"
  style={{ maxHeight: "90px" }}
/>

// Vertical skyscraper
<AdSense
  slot="1234567890"
  format="vertical"
  responsive={false}
/>
```

## Best Practices

### Strategic Ad Placement

1. **Above the Fold**: Place one ad near the top for visibility
2. **Between Content**: Insert ads between sections naturally
3. **Sidebar**: Use vertical ads in sidebars
4. **End of Content**: Place ads after articles/lessons

### Recommended Placements

**Home Page:**
- Between hero and features: Horizontal banner
- Between features and CTA: Auto-sized responsive

**Lesson Pages:**
- After lesson introduction: Rectangle ad
- Between lesson sections: Auto-sized responsive
- After practice problems: Rectangle ad

**Blog Posts:**
- After first paragraph: Auto-sized responsive
- Middle of content: Rectangle ad
- End of article: Auto-sized responsive

### Don't Overdo It

- **Maximum 3 ads** per page recommended
- Don't place ads too close together
- Maintain content-to-ad ratio of at least 60:40
- Never place ads in a way that tricks users into clicking

## Development Mode

When `ADSENSE_CLIENT_ID` is not set:

- **Development**: Shows gray placeholder boxes
- **Production**: Ads are not rendered (fail gracefully)

This allows you to:
- Develop without AdSense account
- See where ads will appear
- Test layouts before going live

## Testing

### Before Going Live

1. **Test in Production Mode**:
   ```bash
   DENO_ENV=production deno task start
   ```

2. **Verify Ad Display**:
   - Check that ads load properly
   - Confirm responsive behavior
   - Test on mobile devices

3. **Check AdSense Dashboard**:
   - Verify ad units are active
   - Monitor impressions
   - Check for policy violations

### Common Issues

**Ads Not Showing:**
- Verify `ADSENSE_CLIENT_ID` is set correctly
- Check ad slot ID matches AdSense dashboard
- Ensure AdSense script loads (check browser console)
- Wait 24-48 hours after creating ad units

**Blank Spaces:**
- AdSense may not fill all requests immediately
- Check ad balance settings in AdSense
- Verify site is approved and in good standing

**Policy Violations:**
- Review AdSense program policies
- Don't click your own ads
- Don't encourage clicks
- Maintain appropriate content

## Performance Optimization

### Lazy Loading

The AdSense script loads asynchronously by default. For better performance:

```tsx
<Head>
  <script
    async
    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
  />
</Head>
```

### Ad Refresh

Avoid refreshing ads too frequently:
- Don't reload ads on every state change
- Use stable ad placements
- Consider user experience

## Compliance

### GDPR/CCPA

For EU/California visitors, implement consent management:

1. Use a consent management platform (CMP)
2. Integrate with AdSense consent mode
3. Update privacy policy

Example privacy policy addition:

> We use Google AdSense to display advertisements. Google may use cookies and web beacons to collect information about your browsing activity.

### Content Guidelines

Ensure your content complies with AdSense policies:
- No prohibited content (violence, adult content, etc.)
- Original, valuable content
- Clear navigation
- No deceptive practices

## Revenue Optimization

### A/B Testing

Test different ad placements:
1. Track performance metrics
2. Try different formats
3. Adjust based on data

### Monitor Performance

Key metrics to watch:
- **CTR** (Click-through rate)
- **RPM** (Revenue per thousand impressions)
- **Fill rate** (% of ad requests filled)

### Optimize Placement

- Higher viewability = higher earnings
- Above-the-fold ads perform better
- Balance user experience with revenue

## Troubleshooting

### Debug Mode

Check browser console for errors:

```javascript
// In browser console
googletag.debug = true;
```

### Common Error Messages

**"AdSense ad not showing":**
- Check account status
- Verify ad slot ID
- Clear browser cache

**"Ads.txt file missing":**
Add `ads.txt` file to your domain root.

### Support Resources

- [AdSense Help Center](https://support.google.com/adsense)
- [AdSense Community](https://support.google.com/adsense/community)
- [Policy Center](https://support.google.com/adsense/answer/48182)

## Example Integration

See these files for complete examples:

- `routes/index.tsx` - Home page with ad placement
- `components/AdSense.tsx` - AdSense component source
- `routes/blog/[slug].tsx` - Blog post with ads (recommended)
- `routes/lessons/[category]/[slug].tsx` - Lesson page with ads (recommended)

## Security

### Content Security Policy

If using CSP headers, allow AdSense domains:

```
script-src 'self' 'unsafe-inline' https://pagead2.googlesyndication.com;
img-src 'self' https://pagead2.googlesyndication.com;
frame-src https://googleads.g.doubleclick.net;
```

### Environment Variables

Never commit `.env` file to version control:

```bash
# Add to .gitignore
.env
.env.local
.env.production
```

## Production Checklist

Before enabling ads in production:

- [ ] AdSense account approved
- [ ] `ADSENSE_CLIENT_ID` configured
- [ ] Ad units created and active
- [ ] Test ads display correctly
- [ ] Privacy policy updated
- [ ] GDPR/CCPA compliance implemented
- [ ] `ads.txt` file added
- [ ] Performance tested
- [ ] User experience validated
- [ ] Policy compliance verified

## Next Steps

1. Apply for AdSense if you haven't
2. Configure your client ID
3. Create ad units
4. Add strategic placements
5. Monitor performance
6. Optimize based on data

For questions or issues, consult the [AdSense Help Center](https://support.google.com/adsense) or review our documentation.
