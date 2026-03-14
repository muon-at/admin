// SEBASTIAN'S SECOND BRAIN - TEST FILE
import { testConnection } from './lib/supabase';

async function main() {
  console.log('🧠 SEBASTIAN\'S SECOND BRAIN - TESTING CONNECTION\n');
  
  const connected = await testConnection();
  
  if (connected) {
    console.log('\n✅ SUCCESS! Second Brain is live and connected to Supabase!\n');
    console.log('Next steps:');
    console.log('1. Store new ads: await storeAdCampaign(...)');
    console.log('2. Get winning ads: await getWinningAds()');
    console.log('3. Search memory: await searchMemory("query")');
    console.log('4. Store learnings: await storeMemory(...)');
    console.log('\n📚 Import from: ./queries');
  } else {
    console.log('\n❌ Connection failed. Check your .env.local credentials.');
    process.exit(1);
  }
}

main();
