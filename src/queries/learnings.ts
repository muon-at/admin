import { supabase } from '../lib/supabase';
import { MarketingLearning, QueryResult } from '../types';

// Get all learnings
export async function getAllLearnings(): Promise<QueryResult<MarketingLearning>> {
  try {
    const { data, error, count } = await supabase
      .from('marketing_learnings')
      .select('*', { count: 'exact' })
      .order('relevance', { ascending: false })
      .order('date_learned', { ascending: false });

    return {
      data: data as MarketingLearning[],
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

// Get learnings by topic
export async function getLearningsByTopic(topic: string): Promise<QueryResult<MarketingLearning>> {
  try {
    const { data, error, count } = await supabase
      .from('marketing_learnings')
      .select('*', { count: 'exact' })
      .eq('topic', topic)
      .order('relevance', { ascending: false });

    return {
      data: data as MarketingLearning[],
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

// Get high-relevance learnings
export async function getHighRelevanceLearnings(threshold: number = 8): Promise<QueryResult<MarketingLearning>> {
  try {
    const { data, error, count } = await supabase
      .from('marketing_learnings')
      .select('*', { count: 'exact' })
      .gte('relevance', threshold)
      .order('relevance', { ascending: false });

    return {
      data: data as MarketingLearning[],
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

// Store new learning
export async function storeLearning(learning: Omit<MarketingLearning, 'id' | 'date_learned' | 'updated_at'>): Promise<MarketingLearning | null> {
  try {
    const { data, error } = await supabase
      .from('marketing_learnings')
      .insert([{
        ...learning,
        date_learned: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    return data as MarketingLearning;
  } catch (error) {
    console.error('Error storing learning:', error);
    return null;
  }
}

// Get recent learnings
export async function getRecentLearnings(limitDays: number = 30): Promise<QueryResult<MarketingLearning>> {
  try {
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - limitDays);

    const { data, error, count } = await supabase
      .from('marketing_learnings')
      .select('*', { count: 'exact' })
      .gte('date_learned', daysAgo.toISOString())
      .order('date_learned', { ascending: false });

    return {
      data: data as MarketingLearning[],
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

// Get learning topics (unique)
export async function getLearningTopics(): Promise<string[]> {
  try {
    const { data } = await supabase
      .from('marketing_learnings')
      .select('topic')
      .order('topic', { ascending: true });

    const topics = [...new Set(data?.map(d => d.topic) || [])];
    return topics as string[];
  } catch (error) {
    console.error('Error getting learning topics:', error);
    return [];
  }
}

// Search learnings
export async function searchLearnings(query: string): Promise<QueryResult<MarketingLearning>> {
  try {
    // Simple text search in insight and examples
    const { data, error, count } = await supabase
      .from('marketing_learnings')
      .select('*', { count: 'exact' })
      .or(`insight.ilike.%${query}%,examples.ilike.%${query}%`)
      .order('relevance', { ascending: false });

    return {
      data: data as MarketingLearning[],
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
