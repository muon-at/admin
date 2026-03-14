# 🚀 DEPLOYMENT GUIDE - Sebastian's Second Brain

## STATUS: ALL 8 PAGES LIVE ✅

Dashboard URL: https://admin-second-brain.vercel.app

---

## PART 1: DEPLOY NIGHTLY AUTOMATION (5 min)

### Step 1: Deploy Edge Function

```bash
cd supabase/functions/dropoff-automation
supabase functions deploy dropoff-automation --project-id aqerqnqeqmzwugfwsywz
```

**Expected Output:**
```
✓ Function deployed successfully
Endpoint: https://aqerqnqeqmzwugfwsywz.supabase.co/functions/v1/dropoff-automation
```

### Step 2: Set Up Scheduled Execution

#### Option A: Using Vercel Cron (Recommended)

Add to `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/cron/dropoff",
      "schedule": "0 22 * * *"
    }
  ]
}
```

Create `src/pages/api/cron/dropoff.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server'

export const config = {
  runtime: 'edge',
}

export default async function handler(req: NextRequest) {
  const edgeFunctionUrl = `https://aqerqnqeqmzwugfwsywz.supabase.co/functions/v1/dropoff-automation`
  
  const response = await fetch(edgeFunctionUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  return NextResponse.json(await response.json())
}
```

#### Option B: External Cron Service (Free Alternative)

Use **EasyCron** (free tier):
1. Go to: https://www.easycron.com
2. Create account
3. Add new cron:
   - URL: `https://aqerqnqeqmzwugfwsywz.supabase.co/functions/v1/dropoff-automation`
   - Schedule: `0 22 * * *` (every day at 22:00 UTC)
   - Method: POST

### Step 3: Test Edge Function Manually

```bash
curl -X POST https://aqerqnqeqmzwugfwsywz.supabase.co/functions/v1/dropoff-automation \
  -H "Authorization: Bearer $(gcloud auth print-access-token)" \
  -H "Content-Type: application/json"
```

Expected response:
```json
{
  "success": true,
  "message": "✅ Dropoff complete - X tasks, Y learnings, Z ads"
}
```

---

## PART 2: SET UP CUSTOM DOMAIN (10 min)

### Step 1: Get Your Domain

Get a domain from:
- **Cheap:** Namecheap, Porkbun, Route53
- **Easy:** Vercel Domains (auto-configured)

### Step 2: Configure in Vercel

1. Go to: `https://vercel.com/muon-at/admin`
2. Settings > Domains
3. Add domain: `yourdomain.com`
4. Choose DNS method:

#### DNS Method (Recommended):
- Copy CNAME: `cname.vercel-dns.com`
- Go to your registrar (Namecheap, GoDaddy, etc.)
- Add CNAME record:
  ```
  Type: CNAME
  Name: yourdomain.com (or @)
  Value: cname.vercel-dns.com
  TTL: 3600
  ```
- Wait 24 hours for propagation

#### Nameservers Method (Alternative):
- Change nameservers at registrar to Vercel's:
  - ns1.vercel-dns.com
  - ns2.vercel-dns.com

### Step 3: Verify & Enable SSL

1. Return to Vercel > Domains
2. Wait for "Valid Configuration" status ✅
3. SSL/TLS auto-enabled (free from Vercel)
4. All traffic automatically HTTPS

### Step 4: Update Environment Variables (if needed)

If using custom domain, update `.env`:
```
REACT_APP_DASHBOARD_URL=https://yourdomain.com
```

---

## PART 3: CONFIGURE DATABASE BACKUPS (5 min)

### Automatic Backups

Supabase auto-backs up **every 24 hours**. View at:
1. Supabase Dashboard > Settings > Backups
2. Restore any point-in-time if needed

### Manual Backup (Optional)

```bash
supabase db dump -f backup-$(date +%Y-%m-%d).sql
```

---

## PART 4: MONITOR & MAINTAIN

### Daily Monitoring

**Check dashboard:**
- All pages loading? ✅
- Supabase data syncing? ✅
- No 404 errors? ✅

**View Vercel logs:**
1. https://vercel.com/muon-at/admin > Deployments
2. Click latest deployment > Logs
3. Look for errors (red text)

### Weekly Maintenance

- Review nightly digest reports
- Check Supabase usage (at 50% limit?)
- Verify SSL certificate (auto-renews)

### Monthly Health Check

```bash
# Check database size
supabase status

# View API usage
supabase quotas
```

---

## TROUBLESHOOTING

### Pages Not Loading?
1. Check browser console: F12 > Console tab
2. Look for red error messages
3. Common fixes:
   - Hard refresh: Cmd+Shift+R
   - Clear cache: Settings > Clear browsing data
   - Check Vercel deployment status

### Nightly Digest Not Running?
1. Verify Edge Function deployed:
   ```bash
   supabase functions list
   ```
2. Check Vercel cron logs
3. Manual trigger test (see Part 1, Step 3)

### Domain Not Working?
1. DNS propagation takes 24-48h
2. Check propagation: `nslookup yourdomain.com`
3. Verify CNAME in registrar (exact copy)
4. Test SSL: `https://yourdomain.com`

### Database Connection Issues?
1. Verify .env variables:
   ```bash
   echo $REACT_APP_SUPABASE_URL
   echo $REACT_APP_SUPABASE_KEY
   ```
2. Test connection:
   ```bash
   curl https://aqerqnqeqmzwugfwsywz.supabase.co/rest/v1/tasks -H "Authorization: Bearer YOUR_KEY"
   ```

---

## PRODUCTION CHECKLIST

- [ ] All 8 pages deployed & tested
- [ ] Supabase database accessible
- [ ] Edge Function deployed & scheduled
- [ ] Custom domain pointing to Vercel
- [ ] SSL/TLS certificate active
- [ ] Automatic backups enabled
- [ ] Monitoring set up (optional: Sentry, LogRocket)
- [ ] Documentation updated

---

## NEXT STEPS

1. **Deploy Edge Function** (5 min)
2. **Configure Custom Domain** (10 min)
3. **Test nightly digest** (run manually first)
4. **Monitor for 24h** (ensure stability)
5. **Enable advanced features** (optional):
   - Email notifications on digest
   - Slack integration for reminders
   - API rate limiting
   - Custom error pages

---

## SUPPORT

**Need help?**
- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.io/docs
- Edge Functions Guide: https://supabase.io/docs/guides/functions

---

**Last Updated:** 2026-03-14
**Status:** 🟢 ALL SYSTEMS GO
