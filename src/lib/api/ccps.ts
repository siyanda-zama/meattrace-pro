import { supabase } from '../supabase';
import type { Database } from '../database.types';

type CCPRecord = Database['public']['Tables']['ccp_records']['Row'];
type CCPInsert = Database['public']['Tables']['ccp_records']['Insert'];
type CCPUpdate = Database['public']['Tables']['ccp_records']['Update'];

/**
 * Get all CCP records for a session
 */
export async function getCCPRecordsBySession(sessionId: string) {
  const { data, error } = await supabase
    .from('ccp_records')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching CCP records:', error);
    throw new Error(error.message);
  }

  return data as CCPRecord[];
}

/**
 * Get all failed CCP records (for deviation log)
 */
export async function getFailedCCPRecords(limit?: number) {
  let query = supabase
    .from('ccp_records')
    .select('*')
    .eq('status', 'fail')
    .order('timestamp', { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error} = await query;

  if (error) {
    console.error('Error fetching failed CCP records:', error);
    throw new Error(error.message);
  }

  return data as CCPRecord[];
}

/**
 * Create a new CCP record
 */
export async function createCCPRecord(ccp: CCPInsert) {
  const { data: user } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('ccp_records')
    .insert({
      ...ccp,
      recorded_by: user.user?.id,
      timestamp: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating CCP record:', error);
    throw new Error(error.message);
  }

  return data as CCPRecord;
}

/**
 * Update a CCP record
 */
export async function updateCCPRecord(id: string, updates: CCPUpdate) {
  const { data, error } = await supabase
    .from('ccp_records')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating CCP record:', error);
    throw new Error(error.message);
  }

  return data as CCPRecord[];
}

/**
 * Get CCP compliance statistics
 */
export async function getCCPStatistics(filters?: {
  sessionId?: string;
  dateFrom?: string;
  dateTo?: string;
}) {
  let query = supabase
    .from('ccp_records')
    .select('status');

  if (filters?.sessionId) {
    query = query.eq('session_id', filters.sessionId);
  }

  if (filters?.dateFrom) {
    query = query.gte('timestamp', filters.dateFrom);
  }

  if (filters?.dateTo) {
    query = query.lte('timestamp', filters.dateTo);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching CCP statistics:', error);
    throw new Error(error.message);
  }

  const total = data.length;
  const passed = data.filter((r) => r.status === 'pass').length;
  const failed = data.filter((r) => r.status === 'fail').length;
  const pending = data.filter((r) => r.status === 'pending').length;
  const complianceScore = total > 0 ? Math.round((passed / total) * 100) : 0;

  return {
    total,
    passed,
    failed,
    pending,
    complianceScore,
  };
}
