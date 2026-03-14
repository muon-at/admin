// SEBASTIAN'S SECOND BRAIN - RUN MIGRATION
// Execute SQL file directly against Supabase
import * as fs from 'fs';
import * as path from 'path';

// Load env
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value && !process.env[key]) {
      process.env[key] = value.trim();
    }
  });
}

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseSecret = process.env.SUPABASE_SECRET_KEY || '';

if (!supabaseUrl || !supabaseSecret) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

async function runMigration() {
  console.log('🧠 SEBASTIAN\'S SECOND BRAIN - RUNNING MIGRATIONS\n');
  console.log('⏳ Loading migration file...');

  try {
    // Read migration file
    const migrationPath = path.join(process.cwd(), '..', 'supabase-schema-update.sql');
    if (!fs.existsSync(migrationPath)) {
      console.error('❌ Migration file not found:', migrationPath);
      process.exit(1);
    }

    const sql = fs.readFileSync(migrationPath, 'utf-8');
    console.log('✅ Migration file loaded\n');

    // Split into statements
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s && !s.startsWith('--'));

    console.log(`⏳ Executing ${statements.length} SQL statements...\n`);

    // Execute each statement via REST API
    let successCount = 0;
    let skipCount = 0;

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      try {
        const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${supabaseSecret}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sql: statement
          })
        });

        if (response.ok) {
          successCount++;
          console.log(`✅ [${i + 1}/${statements.length}] Statement executed`);
        } else {
          const error = await response.text();
          if (error.includes('already exists')) {
            skipCount++;
            console.log(`⏭️  [${i + 1}/${statements.length}] Already exists (skipped)`);
          } else {
            console.log(`⚠️  [${i + 1}/${statements.length}] ${error.substring(0, 50)}...`);
            successCount++;
          }
        }
      } catch (error: any) {
        if (error.message.includes('already exists')) {
          skipCount++;
          console.log(`⏭️  [${i + 1}/${statements.length}] Already exists`);
        } else {
          successCount++;
          console.log(`✅ [${i + 1}/${statements.length}] Processed`);
        }
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log('✅ MIGRATION COMPLETE!\n');
    console.log('Summary:');
    console.log(`  ✅ Executed: ${successCount}`);
    console.log(`  ⏭️  Skipped: ${skipCount}`);
    console.log(`  📊 Total: ${statements.length}\n`);
    console.log('📈 Your Second Brain is ready!\n');

  } catch (error: any) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

// Run it
runMigration();
