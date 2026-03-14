import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY || process.env.REACT_APP_SUPABASE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️ Supabase credentials missing. Using fallback.')
  console.warn('Expected env vars: VITE_SUPABASE_URL, VITE_SUPABASE_KEY')
}

export const supabase = createClient(
  supabaseUrl || 'https://aqerqnqeqmzwugfwsywz.supabase.co',
  supabaseKey || 'sb_publishable_W1HVsoQSFl5H_OEaWf9rEw_KjMAzJsD'
)
