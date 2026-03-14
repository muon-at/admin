# SEBASTIAN'S SECOND BRAIN 🧠

Your AI-powered memory system. Never forget anything. Always have context.

## WHAT IS THIS?

A Supabase database + TypeScript client that stores:
- ✅ Everything you learn about marketing
- ✅ All your ad campaigns + performance data
- ✅ Business decisions & insights
- ✅ Projects, preferences, people
- ✅ Sub-agent memory (for future)

**Result:** I always have complete context when you chat with me. No more "remind me of..."

---

## QUICK START

```bash
# 1. Set up (read SETUP.md first!)
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# 2. Install
npm install

# 3. Test
npm run dev

# 4. Use in your code
import { getAllAds, getWinningAds, searchMemory } from './src/queries';

const winners = await getWinningAds();
```

See **SETUP.md** for detailed instructions.

---

## STRUCTURE

```
openclaw-memory/
├── src/
│   ├── queries/        # All database queries
│   │   ├── memory.ts   # Get/store your memory
│   │   ├── ads.ts      # Ad campaigns & performance
│   │   └── learnings.ts # Marketing insights
│   ├── types/          # TypeScript types
│   ├── lib/            # Supabase client
│   └── hooks/          # React hooks (future)
├── scripts/            # Sync, backup scripts
├── data/               # Seed data
├── supabase-schema.sql # Database schema
└── SETUP.md            # How to set up
```

---

## TABLES (What I Remember)

| Table | Purpose | Example |
|-------|---------|---------|
| `sebastian_memory` | Your long-term memory | "Fast execution > perfect planning" |
| `ads_campaigns` | All your ads + performance | AD_SET_3 FOMO with 4.5% CTR |
| `marketing_learnings` | Insights you've taught me | "Norwegian copy gets 3x better engagement" |
| `projects` | Your active projects | TicketBuddy status: 65% |
| `files` | Ad images, documents | AD_SET_1_TIME.jpg |
| `marketing_agent_memory` | Sub-agent memory (future) | "Last campaign: FOMO won" |

---

## WHAT I DO WITH THIS

When you chat with me:

1. **I read your memory first**
   - Know your projects, learnings, preferences
   - Understand your context instantly

2. **I store new insights**
   - "FOMO angle outperforms money angle" → saved
   - Your learnings compound over time

3. **I track your ads**
   - You send ad → I log it
   - Performance metrics → I update them
   - Patterns → I find them

4. **I give instant answers**
   - "What worked best?" → I query the database
   - "What did I teach you about X?" → I search memory
   - "Which ads are winning?" → Ranked by CTR/CPS

---

## QUICK QUERIES

```typescript
// Get your marketing learnings
const learnings = await getAllLearnings();

// Find winning ads
const winners = await getWinningAds();

// Search your memory
const automation = await searchMemory('automation');

// Get your preferences
const prefs = await getPreferences();

// Find ads by angle
const fomoAds = await getAdsByAngle('FOMO');

// Get recent updates
const recent = await getRecentUpdates(7); // Last 7 days
```

---

## FOR FUTURE

This infrastructure is ready for:
- 🤖 Sub-agent (Marketing Manager with own memory)
- 📊 Analytics dashboard (real-time insights)
- 🔍 Semantic search (find related ideas)
- 📈 Predictions (what ad will win?)
- ⚡ Automations (autonomous tasks)

---

## OWNERSHIP

You own everything:
- ✅ Your Supabase project (your data)
- ✅ Your database (export anytime)
- ✅ All code (open source, modify freely)
- ✅ No vendor lock-in (portable)

---

## SUPPORT

Read **SETUP.md** for:
- Detailed step-by-step setup
- Troubleshooting
- How each table works
- How to populate data
- How I'll use it

---

**Built for:** Sebastian Moen  
**Purpose:** Never forget. Always have context. Think clearly.  
**Status:** 🟢 Ready to deploy

Let's build something incredible. 🚀
