import { supabase } from '../lib/supabase';
import { AdsCampaign, QueryResult } from '../types';

// Get all ads
export async function getAllAds(status?: string): Promise<QueryResult<AdsCampaign>> {
  try {
    let query = supabase
      .from('ads_campaigns')
      .select('*', { count: 'exact' })
      .order('created_date', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error, count } = await query;

    return {
      data: data as AdsCampaign[],
      error: error ? new Error(error.message) : null,
      count: count || 0
    };
  } catch (error) {
    return {
      data: null,
      error: error as Error,
      count: 0
    };
  }
}

// Get winning ads
export async function getWinningAds(): Promise<QueryResult<AdsCampaign>> {
  try {
    const { data, error, count } = await supabase
      .from('ads_campaigns')
      .select('*', { count: 'exact' })
      .eq('winning', true)
      .order('cps', { ascending: true });

    return {
      data: data as AdsCampaign[],
      error: error ? new Error(error.message) : null,
      count: count || 0
    };
  } catch (error) {
    return {
      data: null,
      error: error as Error,
      count: 0
    };
  }
}

// Get ads by angle
export async function getAdsByAngle(angle: string): Promise<QueryResult<AdsCampaign>> {
  try {
    const { data, error, count } = await supabase
      .from('ads_campaigns')
      .select('*', { count: 'exact' })
      .eq('angle', angle)
      .order('cps', { ascending: true });

    return {
      data: data as AdsCampaign[],
      error: error ? new Error(error.message) : null,
      count: count || 0
    };
  } catch (error) {
    return {
      data: null,
      error: error as Error,
      count: 0
    };
  }
}

// Get best performers
export async function getBestPerformers(limit: number = 5): Promise<QueryResult<AdsCampaign>> {
  try {
    const { data, error, count } = await supabase
      .from('ads_campaigns')
      .select('*', { count: 'exact' })
      .gt('ctr', 2)
      .order('cps', { ascending: true })
      .limit(limit);

    return {
      data: data as AdsCampaign[],
      error: error ? new Error(error.message) : null,
      count: count || 0
    };
  } catch (error) {
    return {
      data: null,
      error: error as Error,
      count: 0
    };
  }
}

// Store new ad campaign
export async function storeAdCampaign(ad: Omit<AdsCampaign, 'id' | 'created_date' | 'updated_at'>): Promise<AdsCampaign | null> {
  try {
    const { data, error } = await supabase
      .from('ads_campaigns')
      .insert([ad])
      .select()
      .single();

    if (error) throw error;
    return data as AdsCampaign;
  } catch (error) {
    console.error('Error storing ad campaign:', error);
    return null;
  }
}

// Update ad performance
export async function updateAdPerformance(
  id: string,
  metrics: {
    impressions?: number;
    clicks?: number;
    ctr?: number;
    cpc?: number;
    signups?: number;
    cps?: number;
    conversion_rate?: number;
    quality_score?: number;
  }
): Promise<AdsCampaign | null> {
  try {
    const { data, error } = await supabase
      .from('ads_campaigns')
      .update({
        ...metrics,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as AdsCampaign;
  } catch (error) {
    console.error('Error updating ad performance:', error);
    return null;
  }
}

// Mark ad as winning
export async function markAdAsWinning(id: string): Promise<AdsCampaign | null> {
  try {
    const { data, error } = await supabase
      .from('ads_campaigns')
      .update({
        winning: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as AdsCampaign;
  } catch (error) {
    console.error('Error marking ad as winning:', error);
    return null;
  }
}

// Get ads by campaign name
export async function getAdsByCampaign(campaignName: string): Promise<QueryResult<AdsCampaign>> {
  try {
    const { data, error, count } = await supabase
      .from('ads_campaigns')
      .select('*', { count: 'exact' })
      .eq('campaign_name', campaignName)
      .order('ad_set_number', { ascending: true });

    return {
      data: data as AdsCampaign[],
      error: error ? new Error(error.message) : null,
      count: count || 0
    };
  } catch (error) {
    return {
      data: null,
      error: error as Error,
      count: 0
    };
  }
}

// Get ad performance summary
export async function getPerformanceSummary(): Promise<{
  totalAds: number;
  totalImpressions: number;
  totalClicks: number;
  averageCTR: number;
  averageCPS: number;
  bestCPS: number;
  worstCPS: number;
}> {
  try {
    const { data } = await supabase
      .from('ads_campaigns')
      .select('ctr, cps, impressions, clicks')
      .not('cps', 'is', null);

    if (!data || data.length === 0) {
      return {
        totalAds: 0,
        totalImpressions: 0,
        totalClicks: 0,
        averageCTR: 0,
        averageCPS: 0,
        bestCPS: 0,
        worstCPS: 0
      };
    }

    const totalImpressions = data.reduce((sum: number, ad: any) => sum + (ad.impressions || 0), 0);
    const totalClicks = data.reduce((sum: number, ad: any) => sum + (ad.clicks || 0), 0);
    const cpsList = data.map((ad: any) => ad.cps).filter((cps: any) => cps !== null);

    return {
      totalAds: data.length,
      totalImpressions,
      totalClicks,
      averageCTR: data.reduce((sum: number, ad: any) => sum + (ad.ctr || 0), 0) / data.length,
      averageCPS: cpsList.reduce((sum: number, cps: number) => sum + cps, 0) / cpsList.length,
      bestCPS: Math.min(...cpsList),
      worstCPS: Math.max(...cpsList)
    };
  } catch (error) {
    console.error('Error getting performance summary:', error);
    return {
      totalAds: 0,
      totalImpressions: 0,
      totalClicks: 0,
      averageCTR: 0,
      averageCPS: 0,
      bestCPS: 0,
      worstCPS: 0
    };
  }
}
