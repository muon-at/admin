import { supabase } from '../lib/supabase';
import { SebastianMemory, QueryResult } from '../types';

// Get memory by category
export async function getMemoryByCategory(category: string): Promise<QueryResult<SebastianMemory>> {
  try {
    const { data, error, count } = await supabase
      .from('sebastian_memory')
      .select('*', { count: 'exact' })
      .eq('category', category)
      .order('importance', { ascending: false })
      .order('updated_at', { ascending: false });

    return {
      data: data as SebastianMemory[],
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

// Search memory by content
export async function searchMemory(query: string): Promise<QueryResult<SebastianMemory>> {
  try {
    const { data, error, count } = await supabase
      .from('sebastian_memory')
      .select('*', { count: 'exact' })
      .textSearch('search_content', query, {
        type: 'websearch',
        config: 'norwegian'
      })
      .order('importance', { ascending: false });

    return {
      data: data as SebastianMemory[],
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

// Get all learnings
export async function getAllLearnings(): Promise<QueryResult<SebastianMemory>> {
  try {
    const { data, error, count } = await supabase
      .from('sebastian_memory')
      .select('*', { count: 'exact' })
      .eq('category', 'learning')
      .order('importance', { ascending: false });

    return {
      data: data as SebastianMemory[],
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

// Get all preferences
export async function getPreferences(): Promise<QueryResult<SebastianMemory>> {
  try {
    const { data, error, count } = await supabase
      .from('sebastian_memory')
      .select('*', { count: 'exact' })
      .eq('category', 'preference')
      .order('importance', { ascending: false });

    return {
      data: data as SebastianMemory[],
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

// Store new memory
export async function storeMemory(memory: Omit<SebastianMemory, 'id' | 'created_at' | 'updated_at'>): Promise<SebastianMemory | null> {
  try {
    const { data, error } = await supabase
      .from('sebastian_memory')
      .insert([memory])
      .select()
      .single();

    if (error) throw error;
    return data as SebastianMemory;
  } catch (error) {
    console.error('Error storing memory:', error);
    return null;
  }
}

// Update memory
export async function updateMemory(id: string, updates: Partial<SebastianMemory>): Promise<SebastianMemory | null> {
  try {
    const { data, error } = await supabase
      .from('sebastian_memory')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as SebastianMemory;
  } catch (error) {
    console.error('Error updating memory:', error);
    return null;
  }
}

// Get recent updates
export async function getRecentUpdates(limitDays: number = 7): Promise<QueryResult<SebastianMemory>> {
  try {
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - limitDays);

    const { data, error, count } = await supabase
      .from('sebastian_memory')
      .select('*', { count: 'exact' })
      .gte('updated_at', daysAgo.toISOString())
      .order('updated_at', { ascending: false });

    return {
      data: data as SebastianMemory[],
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
