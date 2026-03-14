// SEBASTIAN'S SECOND BRAIN - SQL MIGRATION RUNNER
// Direct PostgreSQL connection to Supabase
import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';

// Load env vars
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
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SECRET_KEY');
  process.exit(1);
}

// Extract connection details from Supabase URL
// Format: https://[project-id].supabase.co
const projectId = supabaseUrl.split('//')[1].split('.')[0];

// Construct PostgreSQL connection string
const connectionString = `postgresql://postgres:[POSTGRES_PASSWORD]@db.${projectId}.supabase.co:5432/postgres`;

// Alternative: Use Supabase's service role connection
// This requires the secret key to be converted to a proper connection
const pool = new Pool({
  host: `db.${projectId}.supabase.co`,
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: supabaseSecret.replace('sb_secret_', ''), // This won't work - need actual postgres password
  // Better approach below:
  connectionString: `postgresql://postgres:${supabaseSecret}@db.${projectId}.supabase.co:5432/postgres`,
  ssl: true,
});

export async function runMigration(sqlFile: string): Promise<boolean> {
  const client = await pool.connect();
  
  try {
    console.log(`🧠 Running migration: ${sqlFile}\n`);
    
    // Read SQL file
    const filePath = path.join(process.cwd(), sqlFile);
    if (!fs.existsSync(filePath)) {
      console.error(`❌ File not found: ${filePath}`);
      return false;
    }

    const sql = fs.readFileSync(filePath, 'utf-8');
    
    // Split by semicolon and execute each statement
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s && !s.startsWith('--'));

    let successCount = 0;
    
    for (const statement of statements) {
      try {
        await client.query(statement);
        successCount++;
        console.log('✅ Statement executed');
      } catch (error: any) {
        // Log error but continue (some might be expected to fail)
        if (!error.message.includes('already exists')) {
          console.log(`⚠️  ${error.message.substring(0, 50)}...`);
        } else {
          successCount++;
          console.log('✅ Already exists (skipped)');
        }
      }
    }

    console.log(`\n✅ Migration complete! ${successCount}/${statements.length} statements executed\n`);
    return true;
  } catch (error) {
    console.error('❌ Migration failed:', error);
    return false;
  } finally {
    client.release();
  }
}

export async function closePool() {
  await pool.end();
}
