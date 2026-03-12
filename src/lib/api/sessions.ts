import { supabase } from '../supabase';
import type { Database } from '../database.types';

type Session = Database['public']['Tables']['sessions']['Row'];
type SessionInsert = Database['public']['Tables']['sessions']['Insert'];
type SessionUpdate = Database['public']['Tables']['sessions']['Update'];

export interface SessionWithRelations extends Session {
  supplier?: {
    id: string;
    name: string;
    cipc: string;
  };
  operator?: {
    id: string;
    name: string;
    role: string;
  };
}

/**
 * Get all sessions with related supplier and operator data
 */
export async function getSessions(filters?: {
  status?: 'completed' | 'in-progress' | 'flagged' | 'paused';
  dateFrom?: string;
  dateTo?: string;
  supplierId?: string;
  limit?: number;
}) {
  let query = supabase
    .from('sessions')
    .select(`
      *,
      supplier:suppliers(id, name, cipc),
      operator:profiles(id, name, role)
    `)
    .order('date', { ascending: false });

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  if (filters?.dateFrom) {
    query = query.gte('date', filters.dateFrom);
  }

  if (filters?.dateTo) {
    query = query.lte('date', filters.dateTo);
  }

  if (filters?.supplierId) {
    query = query.eq('supplier_id', filters.supplierId);
  }

  if (filters?.limit) {
    query = query.limit(filters.limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching sessions:', error);
    throw new Error(error.message);
  }

  return data as SessionWithRelations[];
}

/**
 * Get a single session by ID with all related data
 */
export async function getSessionById(id: string) {
  const { data, error } = await supabase
    .from('sessions')
    .select(`
      *,
      supplier:suppliers(*),
      operator:profiles(*),
      intake_records(*),
      ccp_records(*),
      by_products(*)
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching session:', error);
    throw new Error(error.message);
  }

  return data;
}

/**
 * Create a new session
 */
export async function createSession(session: SessionInsert) {
  // Generate session ID in format SS-YYYY-NNN
  const { data: lastSession } = await supabase
    .from('sessions')
    .select('id')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  const year = new Date().getFullYear();
  let nextNumber = 1;

  if (lastSession?.id) {
    const match = lastSession.id.match(/SS-(\d{4})-(\d{3})/);
    if (match && match[1] === year.toString()) {
      nextNumber = parseInt(match[2]) + 1;
    }
  }

  const sessionId = `SS-${year}-${nextNumber.toString().padStart(3, '0')}`;

  const { data, error } = await supabase
    .from('sessions')
    .insert({ ...session, id: sessionId })
    .select()
    .single();

  if (error) {
    console.error('Error creating session:', error);
    throw new Error(error.message);
  }

  return data as Session;
}

/**
 * Update a session
 */
export async function updateSession(id: string, updates: SessionUpdate) {
  const { data, error } = await supabase
    .from('sessions')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating session:', error);
    throw new Error(error.message);
  }

  return data as Session;
}

/**
 * Delete a session (only if no related records exist)
 */
export async function deleteSession(id: string) {
  const { error } = await supabase
    .from('sessions')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting session:', error);
    throw new Error(error.message);
  }
}

/**
 * Get active (in-progress) session
 */
export async function getActiveSession() {
  const { data, error } = await supabase
    .from('sessions')
    .select(`
      *,
      supplier:suppliers(id, name, cipc),
      operator:profiles(id, name, role)
    `)
    .eq('status', 'in-progress')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('Error fetching active session:', error);
    throw new Error(error.message);
  }

  return data as SessionWithRelations | null;
}

/**
 * Get sessions for today
 */
export async function getTodaySessions() {
  const today = new Date().toISOString().split('T')[0];

  return getSessions({
    dateFrom: today,
    dateTo: today,
  });
}

/**
 * Calculate and update session HACCP score based on CCP records
 */
export async function calculateHACCPScore(sessionId: string) {
  const { data: ccps, error } = await supabase
    .from('ccp_records')
    .select('status')
    .eq('session_id', sessionId);

  if (error || !ccps || ccps.length === 0) {
    return;
  }

  const passCount = ccps.filter((c) => c.status === 'pass').length;
  const score = Math.round((passCount / ccps.length) * 100);

  await updateSession(sessionId, { haccp_score: score });

  return score;
}
