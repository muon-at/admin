import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SYSTEM_TOKEN = 'EAARRSRM9xBABQwjnL4e7snRBvrV1xDAdrgipOxeu8CsNVxAgis1I7lDfGiVO7HkXZCE7eNmDGx85mvG98Hbpf7LnIqwJZCwrN93wunlohOWZBqje9CYn0ZCgxONxj5ohnDgoE3CYBvPbjH0ZByvdYt6kHrlsWiF0tQLaSLARIEDazh7N0jc7wZClORWPOpHwZDZD'
const CAMPAIGN_ID = '120237989519600292'
const AD_SET_ID = '120237989519790292'

export const handler = async (req: any) => {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

  if (!supabaseUrl || !supabaseKey) {
    return new Response(JSON.stringify({ error: 'Missing credentials' }), { status: 500 })
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  try {
    // Fetch campaign insights from Facebook
    const today = new Date().toISOString().split('T')[0]
    const apiUrl = `https://graph.facebook.com/v18.0/${CAMPAIGN_ID}/insights?fields=spend,impressions,clicks,cpm,cpc,cpp,actions&access_token=${SYSTEM_TOKEN}&date_preset=today`

    const response = await fetch(apiUrl)
    const data = await response.json()

    if (data.error) {
      console.error('Facebook API error:', data.error)
      return new Response(JSON.stringify({ error: data.error.message }), { status: 400 })
    }

    // Parse metrics
    const insights = data.data[0] || {}
    const spend = parseFloat(insights.spend || 0) / 100 // Convert cents to kr
    const impressions = parseInt(insights.impressions || 0)
    const clicks = parseInt(insights.clicks || 0)
    const actions = insights.actions || [] // Conversions/leads

    // Count leads from actions
    let leads = 0
    actions.forEach((action: any) => {
      if (action.action_type === 'lead') {
        leads += parseInt(action.value || 0)
      }
    })

    // Calculate metrics
    const cpc = clicks > 0 ? spend / clicks : 0
    const cpl = leads > 0 ? spend / leads : 0

    // Store in Supabase
    const { error: insertError } = await supabase.from('facebook_daily_metrics').insert({
      date: today,
      campaign_id: CAMPAIGN_ID,
      spend_kr: spend,
      impressions,
      clicks,
      leads,
      cpc,
      cpl,
      auto_paused: cpl > 90 ? true : false,
    })

    if (insertError) {
      console.error('Insert error:', insertError)
      throw insertError
    }

    // Check if should auto-pause
    let autoPauseReason = null
    if (cpl > 90) {
      autoPauseReason = `CPL exceeded threshold: ${cpl.toFixed(2)} kr > 90 kr`
      // Auto-pause campaign via Facebook API
      await fetch(
        `https://graph.facebook.com/v18.0/${CAMPAIGN_ID}?status=PAUSED&access_token=${SYSTEM_TOKEN}`,
        { method: 'POST' }
      )
    }

    // Generate report
    const report = {
      date: today,
      spend: `${spend.toFixed(2)} kr`,
      impressions,
      clicks,
      leads,
      cpc: `${cpc.toFixed(2)} kr`,
      cpl: `${cpl.toFixed(2)} kr`,
      autoPaused: autoPauseReason,
      metrics: {
        ctrPercent: impressions > 0 ? ((clicks / impressions) * 100).toFixed(2) : '0',
        avgCpm: impressions > 0 ? (spend / (impressions / 1000)).toFixed(2) : '0',
      },
    }

    return new Response(JSON.stringify({ success: true, report }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error: any) {
    console.error('Report error:', error)
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
}
