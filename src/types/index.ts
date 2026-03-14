// SEBASTIAN'S SECOND BRAIN - TYPES

// Memory
export interface SebastianMemory {
  id: string;
  category: 'project' | 'decision' | 'learning' | 'preference' | 'contact' | 'observation';
  subcategory?: string;
  content: string;
  tags: string[];
  importance: number;
  created_at: string;
  updated_at: string;
  source: string;
  notes?: string;
}

// Ads
export interface AdsCampaign {
  id: string;
  campaign_name: string;
  ad_set_number?: number;
  angle?: string;
  headline?: string;
  body_text?: string;
  visual_url?: string;
  visual_path?: string;
  aspect_ratio?: string;
  status: 'draft' | 'testing' | 'live' | 'paused' | 'archived';
  created_date: string;
  live_date?: string;
  impressions: number;
  clicks: number;
  ctr?: number;
  cpc?: number;
  signups: number;
  cps?: number;
  conversion_rate?: number;
  quality_score?: number;
  notes?: string;
  winning: boolean;
  learnings?: string;
  next_iteration?: string;
  tags: string[];
  updated_at: string;
}

// Marketing Learnings
export interface MarketingLearning {
  id: string;
  topic: string;
  insight: string;
  source: string;
  date_learned: string;
  relevance: number;
  applications: string[];
  examples?: string;
  tags: string[];
  updated_at: string;
}

// Projects
export interface Project {
  id: string;
  name: string;
  status: 'planning' | 'active' | 'testing' | 'live' | 'paused';
  description?: string;
  goals: string[];
  timeline?: Record<string, any>;
  team: string[];
  blockers: string[];
  progress_percent: number;
  last_updated: string;
  memory_notes?: string;
  related_ads: string[];
}

// Files
export interface FileMetadata {
  id: string;
  filename: string;
  file_path: string;
  file_type?: string;
  category: 'ad' | 'document' | 'research' | 'learning' | 'reference';
  uploaded_date: string;
  size_bytes: number;
  description?: string;
  tags: string[];
  relevant_projects: string[];
  extracted_text?: string;
}

// Marketing Agent Memory
export interface MarketingAgentMemory {
  id: string;
  agent_name: string;
  memory_type: 'instruction' | 'learning' | 'decision' | 'observation';
  content: string;
  importance: number;
  created_at: string;
  updated_at: string;
  task_completed: boolean;
  outcome?: string;
  metrics?: Record<string, any>;
  next_action?: string;
  tags: string[];
}

// Query Results
export interface QueryResult<T> {
  data: T[] | null;
  error: Error | null;
  count: number;
}

// Search Results
export interface SearchResult {
  source: 'memory' | 'ads' | 'learnings' | 'files' | 'agent';
  data: any;
  relevance: number;
}
