import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

export const handler = async (req: any) => {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

  if (!supabaseUrl || !supabaseKey) {
    return new Response(
      JSON.stringify({ error: 'Missing Supabase credentials' }),
      { status: 500 }
    )
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  try {
    const today = new Date().toISOString().split('T')[0]

    // Get today's completed tasks
    const { data: tasks } = await supabase
      .from('tasks')
      .select('*')
      .gte('completed_at', `${today}T00:00:00`)
      .lte('completed_at', `${today}T23:59:59`)

    // Get today's ads
    const { data: ads } = await supabase
      .from('ads_campaigns')
      .select('*')
      .gte('created_at', `${today}T00:00:00`)
      .lte('created_at', `${today}T23:59:59`)

    // Get today's learnings
    const { data: learnings } = await supabase
      .from('marketing_learnings')
      .select('*')
      .gte('created_at', `${today}T00:00:00`)
      .lte('created_at', `${today}T23:59:59`)

    // Get today's files
    const { data: files } = await supabase
      .from('file_index')
      .select('*')
      .gte('uploaded_date', `${today}T00:00:00`)
      .lte('uploaded_date', `${today}T23:59:59`)

    // Generate digest
    const digest = {
      date: today,
      summary: `✅ Completed ${tasks?.length || 0} tasks, 💡 ${learnings?.length || 0} learnings captured, 📊 ${ads?.length || 0} ads created, 📁 ${files?.length || 0} files uploaded`,
      achievements: tasks?.map((t: any) => t.title) || [],
      new_ads_count: ads?.length || 0,
      new_learnings_count: learnings?.length || 0,
      tasks_completed: tasks?.length || 0,
      files_uploaded: files?.length || 0,
      key_learnings: learnings?.map((l: any) => l.summary) || [],
      tomorrow_focus: [
        '🔍 Review today\'s digest',
        '📊 Check top ad performance',
        '🎯 Plan top 3 priorities',
        '💡 Review new learnings',
      ],
      generated_at: new Date().toISOString(),
      sent_to_user: false,
    }

    // Insert digest
    await supabase.from('daily_digest').insert(digest)

    // Update memory with summary
    await supabase
      .from('sebastian_memory')
      .insert({
        title: `Daily Summary - ${new Date(today).toLocaleDateString('nb-NO')}`,
        content: digest.summary,
        category: 'learning',
        tags: ['daily', 'summary'],
      })

    return new Response(
      JSON.stringify({
        success: true,
        message: `✅ Dropoff complete - ${tasks?.length || 0} tasks, ${learnings?.length || 0} learnings, ${ads?.length || 0} ads`,
        digest,
      }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error: any) {
    console.error('Dropoff error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
