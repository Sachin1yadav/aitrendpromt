# Google Analytics 4 (GA4) Setup Guide

## Overview

This project now includes **dual tracking**:
1. **Custom Analytics** - Stored in your MongoDB database
2. **Google Analytics 4 (GA4)** - Google's analytics platform

Both systems track the same events simultaneously, giving you comprehensive analytics.

---

## Step 1: Create GA4 Property

1. Go to [Google Analytics](https://analytics.google.com/)
2. Click **Admin** (gear icon) in the bottom left
3. In the **Property** column, click **Create Property**
4. Fill in:
   - Property name: `AItrendpromt`
   - Reporting time zone: Your timezone
   - Currency: Your currency
5. Click **Next** → **Next** → **Create**

---

## Step 2: Get Your Measurement ID

1. In your GA4 property, go to **Admin** → **Data Streams**
2. Click **Add stream** → **Web**
3. Enter:
   - Website URL: Your website URL (e.g., `https://yourdomain.com`)
   - Stream name: `AItrendpromt Web`
4. Click **Create stream**
5. Copy your **Measurement ID** (format: `G-XXXXXXXXXX`)

---

## Step 3: Add Measurement ID to Environment Variables

### For Local Development

Create or update `.env.local` file in the project root:

```env
NEXT_PUBLIC_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
```

Replace `G-XXXXXXXXXX` with your actual Measurement ID.

### For Production (Vercel)

1. Go to your Vercel project settings
2. Navigate to **Environment Variables**
3. Add:
   - **Name**: `NEXT_PUBLIC_GA4_MEASUREMENT_ID`
   - **Value**: `G-XXXXXXXXXX` (your Measurement ID)
   - **Environment**: Production, Preview, Development
4. Click **Save**

---

## Step 4: Verify Installation

1. **Restart your development server**:
   ```bash
   npm run dev:all
   ```

2. **Open your website** in a browser

3. **Check browser console** - You should see:
   ```
   GA4 initialized with ID: G-XXXXXXXXXX
   ```

4. **Check GA4 Real-Time Reports**:
   - Go to Google Analytics
   - Navigate to **Reports** → **Realtime**
   - You should see your visit appear within seconds

---

## What Gets Tracked

### Automatic Tracking

- ✅ **Page Views** - Every page navigation
- ✅ **Route Changes** - All Next.js route changes

### Event Tracking

All events are tracked in both **Custom Analytics** and **GA4**:

1. **Prompt Clicks**
   - Event: `prompt_click`
   - Parameters: `prompt_slug`, `prompt_title`, `prompt_category`

2. **Instagram Clicks**
   - Event: `instagram_click`
   - Parameters: `instagram_location` (header, cta, footer, etc.)

3. **Search**
   - Event: `search`
   - Parameters: `search_term`

4. **Filter Applications**
   - Event: `filter_apply`
   - Parameters: `filter_type`, `filter_value`

5. **Copy Prompt**
   - Event: `copy_prompt`
   - Parameters: `prompt_slug`

6. **Image Downloads**
   - Event: `download_image`
   - Parameters: `image_type`, `prompt_slug`

7. **Button Clicks**
   - Event: `button_click`
   - Parameters: `button_name`, `button_location`

---

## Viewing Analytics

### Google Analytics 4 Dashboard

1. Go to [Google Analytics](https://analytics.google.com/)
2. Select your property
3. View reports:
   - **Realtime**: See live activity
   - **Engagement** → **Events**: See all custom events
   - **Acquisition**: See traffic sources
   - **Engagement** → **Pages and screens**: See page views

### Custom Analytics Dashboard

1. Go to `/admin/analytics` on your website
2. View comprehensive statistics
3. Filter by date range
4. Option to exclude localhost traffic

---

## Testing

### Test GA4 Events

1. Open browser DevTools (F12)
2. Go to **Console** tab
3. Navigate your site and perform actions
4. Check for GA4 initialization message
5. In GA4, go to **Realtime** → **Events** to see events

### Test Custom Analytics

1. Go to `/admin/analytics`
2. Perform actions on your site
3. Refresh the analytics dashboard
4. See events appear in real-time

---

## Troubleshooting

### GA4 Not Loading

1. **Check Measurement ID**:
   - Verify `NEXT_PUBLIC_GA4_MEASUREMENT_ID` is set correctly
   - Format should be `G-XXXXXXXXXX`

2. **Check Browser Console**:
   - Look for errors
   - Should see "GA4 initialized with ID: ..."

3. **Check Network Tab**:
   - Look for requests to `googletagmanager.com`
   - Should see `gtag/js` script loading

### Events Not Showing in GA4

1. **Wait 24-48 hours** for some reports (not Realtime)
2. **Check Realtime reports** for immediate verification
3. **Verify event names** match what's in the code
4. **Check ad blockers** - they may block GA4

### Development vs Production

- **Development**: GA4 will track on localhost (you can filter this in GA4)
- **Production**: GA4 tracks all production traffic
- **Custom Analytics**: Has option to exclude localhost in dashboard

---

## Advanced Configuration

### Custom Dimensions (Optional)

You can add custom dimensions in GA4:

1. Go to **Admin** → **Custom Definitions** → **Custom Dimensions**
2. Create dimensions for:
   - `prompt_category`
   - `prompt_slug`
   - `instagram_location`
   - etc.

### Enhanced Ecommerce (Future)

The tracking is set up to easily add ecommerce tracking if needed later.

---

## Privacy & Compliance

- GA4 respects user privacy settings
- Consider adding a cookie consent banner
- GA4 automatically handles GDPR compliance features
- IP anonymization is enabled by default

---

## Support

If you encounter issues:
1. Check browser console for errors
2. Verify Measurement ID is correct
3. Check GA4 Realtime reports
4. Verify environment variables are set

---

## Summary

✅ **Dual Tracking System**:
- Custom Analytics → Your MongoDB database
- GA4 → Google Analytics platform

✅ **All Events Tracked**:
- Page views, clicks, searches, filters, downloads, etc.

✅ **Easy Setup**:
- Just add your Measurement ID to environment variables

✅ **Comprehensive Analytics**:
- View data in both your custom dashboard and GA4

