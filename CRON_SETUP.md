# 🔥 FACEBOOK CAMPAIGN - AUTOMATED 6-HOUR REPORTING

## Status
- **Campaign:** Heat Pump Service Competition - Agder ✅
- **Campaign ID:** 120237989519600292
- **Budget:** 300 kr/day
- **Dashboard:** `/admin/facebook` in Vercel app

---

## AUTO-REPORTING SETUP

### OPTION 1: EasyCron (Recommended - Free)

**Setup (5 min):**

1. Go to: https://www.easycron.com/
2. Sign up (free)
3. Click "Create a Cron Job"
4. Enter:
   ```
   URL: https://aqerqnqeqmzwugfwsywz.supabase.co/functions/v1/facebook-campaign-report
   Method: POST
   Cron Expression: 0 */6 * * * (every 6 hours)
   ```
5. Schedule time:
   ```
   00:10 UTC+1
   06:10 UTC+1
   12:10 UTC+1
   18:10 UTC+1
   ```
6. Save & activate

**Result:**
- ✅ Edge Function runs every 6 hours
- ✅ Stats saved to Supabase
- ✅ Dashboard updates automatically

---

### OPTION 2: Vercel Cron (If Using Vercel Functions)

Currently NOT available for Vite projects on Vercel without serverless functions.

**Alternative:**
Use EasyCron (Option 1) or set up a dedicated cron service.

---

### OPTION 3: Manual Testing

Test the Edge Function manually:

```bash
curl -X POST https://aqerqnqeqmzwugfwsywz.supabase.co/functions/v1/facebook-campaign-report \
  -H "Content-Type: application/json"
```

Should return:
```json
{
  "success": true,
  "report": {
    "date": "2026-03-14",
    "spend": "45.23 kr",
    "impressions": 1200,
    "clicks": 45,
    "leads": 3,
    "cpc": "1.01 kr",
    "cpl": "15.08 kr",
    "metrics": { ... }
  }
}
```

---

## DASHBOARD FEATURES

**Location:** https://admin-ten-bice-98.vercel.app/facebook

**Features:**
- ✅ Total spend, leads, CPL, CTR (KPI cards)
- ✅ Daily timeline with metrics
- ✅ Click date to see detailed stats
- ✅ Auto-pause alert if CPL > 90 kr
- ✅ CTR monitoring
- ✅ Budget utilization tracking

**Data Source:** Supabase `facebook_daily_metrics` table

---

## AUTO-PAUSE LOGIC

**Trigger:** Cost per lead (CPL) exceeds 90 kr

**Action:**
1. Edge Function detects CPL > 90 kr
2. Sends PAUSED status to Facebook campaign
3. Records in `auto_paused` field in Supabase
4. Alert shown in dashboard

**Recovery:**
- Manual restart in Meta Ads Manager
- Or contact for optimization review

---

## FACEBOOK API CREDENTIALS (SECURE)

**System User Token:**
```
EAARRSRM9xBABQwjnL4e7snRBvrV1xDAdrgipOxeu8CsNVxAgis1I7lDfGiVO7HkXZCE7eNmDGx85mvG98Hbpf7LnIqwJZCwrN93wunlohOWZBqje9CYn0ZCgxONxj5ohnDgoE3CYBvPbjH0ZByvdYt6kHrlsWiF0tQLaSLARIEDazh7N0jc7wZClORWPOpHwZDZD
```

**Stored in:**
- `supabase/functions/facebook-campaign-report/index.ts` (hardcoded)
- `/Users/atventilasjon/.openclaw/workspace/memory/2026-03-14.md` (backup)

---

## MONITORING

**Daily Reports Include:**
- Spend (kr)
- Impressions
- Clicks
- Leads generated
- Cost per click (CPC)
- Cost per lead (CPL)
- Click-through rate (CTR)
- Auto-pause status

**Frequency:** Every 6 hours (00:10, 06:10, 12:10, 18:10 UTC+1)

**Location:** Supabase → `facebook_daily_metrics` table

---

## NEXT STEPS

1. **Set up EasyCron** (Option 1 above) - 5 min
2. **Visit dashboard:** admin-ten-bice-98.vercel.app/facebook
3. **Monitor campaign performance**
4. **Review daily reports** (automatic every 6h)

---

## TROUBLESHOOTING

**Campaign not reporting?**
- Check EasyCron is running: https://www.easycron.com/
- Test manually: `curl` command above
- Check Supabase logs: https://supabase.com/dashboard/project/aqerqnqeqmzwugfwsywz/logs

**Dashboard not updating?**
- Hard refresh: Cmd+Shift+R
- Check browser console: F12
- Verify Supabase connection: Check .env variables

**CPL too high?**
- Check dashboard for alerts
- Review ad copy quality
- Target location targeting
- Consider budget increase or creative change

---

## MANUAL OPTIMIZATION OPTIONS

If automated CPL seems high, consider:

1. **Creative testing:**
   - New ad images/video
   - Different headlines
   - Stronger CTA

2. **Targeting adjustments:**
   - Age range (currently 25-65+)
   - Interests (currently broad)
   - Location refinement

3. **Budget strategy:**
   - Increase slowly to find sweet spot
   - A/B test different budgets
   - Geographic split if one area underperforms

4. **Timing:**
   - Check day/time performance in Meta Ads Manager
   - Weekend vs. weekday performance
   - Adjust bid strategy if needed

---

**Questions?** Check supabase/functions/facebook-campaign-report/index.ts for implementation details.
