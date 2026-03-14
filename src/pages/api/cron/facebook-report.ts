import { NextRequest, NextResponse } from 'next/server'

export const config = {
  runtime: 'edge',
}

export default async function handler(req: NextRequest) {
  // Verify cron secret
  const cronSecret = req.headers.get('x-vercel-cron-secret')
  if (cronSecret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Call Supabase Edge Function
    const edgeFunctionUrl = `https://aqerqnqeqmzwugfwsywz.supabase.co/functions/v1/facebook-campaign-report`
    
    const response = await fetch(edgeFunctionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const result = await response.json()

    console.log(`📊 Facebook Campaign Report Generated:
- Spend: ${result.report.spend}
- Impressions: ${result.report.impressions}
- Clicks: ${result.report.clicks}
- Leads: ${result.report.leads}
- CPL: ${result.report.cpl}
- CPC: ${result.report.cpc}
- Auto-paused: ${result.report.autoPaused || 'No'}`)

    return NextResponse.json({
      success: true,
      message: '✅ Facebook campaign report generated',
      report: result.report,
    })
  } catch (error) {
    console.error('Cron error:', error)
    return NextResponse.json(
      { error: 'Failed to generate report', details: String(error) },
      { status: 500 }
    )
  }
}
