# SEBASTIAN'S SECOND BRAIN - SETUP GUIDE

## OVERVIEW

This is your AI-powered memory system powered by Supabase + OpenClaw. Everything is stored in Supabase, so you own it all.

---

## STEP 1: CREATE SUPABASE PROJECT

1. Go to https://supabase.com
2. Click "New project"
3. Name: "sebastian-second-brain"
4. Region: "eu-west-1" (Ireland - closest to Norway)
5. Password: Set a strong one
6. Click "Create new project" (takes ~2-3 minutes)

---

## STEP 2: CREATE DATABASE TABLES

1. Go to your Supabase project dashboard
2. Click "SQL Editor" (left sidebar)
3. Copy the entire contents of `../supabase-schema.sql`
4. Paste it into the SQL editor
5. Click "Run" (at bottom right)
6. Watch it execute (should see green checkmarks)

**You now have:**
- ✅ sebastian_memory table
- ✅ ads_campaigns table
- ✅ marketing_learnings table
- ✅ projects table
- ✅ files table
- ✅ marketing_agent_memory table
- ✅ query_log table
- ✅ All indexes
- ✅ Initial data (your projects + learnings)

---

## STEP 3: GET YOUR API CREDENTIALS

1. In Supabase dashboard, go to "Settings" → "API"
2. Copy your **Project URL** (starts with https://)
3. Copy your **anon public key** (under "Project API keys")

Save these safely!

---

## STEP 4: SET UP THIS PROJECT

```bash
# 1. Navigate to the project
cd openclaw-memory

# 2. Copy environment template
cp .env.example .env.local

# 3. Edit .env.local
# Add your SUPABASE_URL and SUPABASE_KEY
nano .env.local

# 4. Install dependencies
npm install

# 5. Test connection
npm run dev
```

You should see: **✅ Supabase connected successfully**

---

## STEP 5: HOW TO USE

### In Your Code (Cursor/Node.js)

```typescript
import {
  getMemoryByCategory,
  searchMemory,
  getAllAds,
  getWinningAds,
  getAllLearnings,
  storeMemory,
  storeAdCampaign
} from './src/queries';

// Get all your marketing learnings
const learnings = await getAllLearnings();

// Get winning ads
const winners = await getWinningAds();

// Search your memory
const results = await searchMemory('automation');

// Store new memory
await storeMemory({
  category: 'learning',
  content: 'FOMO angle hits 4.5% CTR',
  importance: 9,
  source: 'ad_testing',
  tags: ['marketing', 'fomo']
});
```

### From Command Line

```bash
# Search memory
npm run search "automation"

# Get all ads
npm run query -- --type=ads

# Test connection
npm run dev
```

---

## STEP 6: POPULATE WITH DATA

You can add data three ways:

### Option A: Via Cursor (Code)

```typescript
// Add new ad to database
await storeAdCampaign({
  campaign_name: 'OpenClaw Course',
  ad_set_number: 1,
  angle: 'Time Saving',
  headline: 'Save 10 hours per week',
  status: 'draft',
  tags: ['openclaw', 'course']
});
```

### Option B: Via Supabase Dashboard (Manual)

1. Go to Supabase → "Table Editor"
2. Click table (e.g., "ads_campaigns")
3. Click "Insert row" (+ button)
4. Fill in fields
5. Click "Save"

### Option C: Upload Files

1. Go to Supabase → "Storage"
2. Create bucket: "sebastian-storage"
3. Upload your ad images/files
4. Link file metadata in `files` table

---

## WHAT EACH TABLE STORES

### `sebastian_memory`
Your long-term memory about:
- Projects (goals, status, blockers)
- Decisions (what worked, what didn't)
- Learnings (insights you've gained)
- Preferences (how you like things)
- Observations (patterns noticed)

**Query example:**
```sql
SELECT * FROM sebastian_memory 
WHERE category = 'learning' 
ORDER BY importance DESC;
```

### `ads_campaigns`
All your ads with:
- Copy (headline, body)
- Visuals (path to image)
- Performance (CTR, CPS, conversion rate)
- Status (draft/testing/live/paused)
- Learnings (what worked)

**Query example:**
```sql
SELECT angle, ctr, cps FROM ads_campaigns 
WHERE status = 'live' 
ORDER BY cps ASC;
```

### `marketing_learnings`
Marketing insights you've learned:
- Topic (targeting, copywriting, psychology, etc)
- Insight (what you learned)
- Relevance (1-10 score)
- Source (conversation, testing, research)

**Query example:**
```sql
SELECT insight FROM marketing_learnings 
WHERE relevance >= 8 
ORDER BY date_learned DESC;
```

### `projects`
Your active projects:
- Name, status, goals
- Timeline, team, blockers
- Progress percentage

**Query example:**
```sql
SELECT * FROM projects 
WHERE status = 'active';
```

### `marketing_agent_memory`
(For future) Sub-agent's memory:
- Task outcomes
- Learnings from past work
- Recommendations

---

## HOW I WILL USE THIS

When you chat with me:

1. **I read your memory before responding**
   ```typescript
   const context = await searchMemory(topic);
   // Now I have context about previous discussions
   ```

2. **I store new learnings**
   ```typescript
   await storeMemory({
     category: 'learning',
     content: 'FOMO angle performs best',
     importance: 9
   });
   ```

3. **I update your ad performance**
   ```typescript
   await updateAdPerformance(adId, {
     ctr: 4.5,
     cps: 18,
     conversion_rate: 25
   });
   ```

4. **I give you instant insights**
   ```typescript
   const winners = await getWinningAds();
   // "Your best ad is FOMO angle with 4.5% CTR"
   ```

---

## COMMANDS

```bash
# Install dependencies
npm install

# Test connection
npm run dev

# Search memory for something
npm run search "your query here"

# Query all ads
npm run query

# Run any TypeScript file
npm run query -- src/queries/index.ts
```

---

## NEXT STEPS

1. ✅ Create Supabase project
2. ✅ Run SQL schema
3. ✅ Get API credentials
4. ✅ Set up .env.local
5. ✅ Run `npm install`
6. ✅ Test with `npm run dev`
7. ⏳ Start uploading ads
8. ⏳ Start storing learnings
9. ⏳ Have me query it when needed

---

## TROUBLESHOOTING

### "Connection failed"
- Check SUPABASE_URL and SUPABASE_KEY in .env.local
- Make sure they have no extra spaces
- Verify they're from the right project

### "Table not found"
- Go to Supabase → SQL Editor
- Re-run the schema.sql file
- Check for errors in output

### "Permission denied"
- Make sure you're using the **anon public key**, not the service role key
- In Supabase, go Settings → API → copy the first key

### "Nothing happens when I run npm run dev"
- TypeScript might not be installed
- Run: `npm install -D typescript tsx`
- Then: `npm run dev`

---

## SUPPORT

Any issues? Check:
1. Supabase docs: https://supabase.com/docs
2. Your project settings (API keys section)
3. Database → Tables in Supabase dashboard

Good luck! 🚀
