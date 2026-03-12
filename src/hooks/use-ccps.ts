import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getCCPRecordsBySession,
  getFailedCCPRecords,
  createCCPRecord,
  updateCCPRecord,
  getCCPStatistics,
} from '@/lib/api/ccps';
import type { Database } from '@/lib/database.types';

type CCPInsert = Database['public']['Tables']['ccp_records']['Insert'];
type CCPUpdate = Database['public']['Tables']['ccp_records']['Update'];

/**
 * Fetch all CCP records for a session
 */
export function useCCPRecordsBySession(sessionId: string) {
  return useQuery({
    queryKey: ['ccp_records', 'session', sessionId],
    queryFn: () => getCCPRecordsBySession(sessionId),
    enabled: !!sessionId,
  });
}

/**
 * Fetch failed CCP records for deviation log
 */
export function useFailedCCPRecords(limit?: number) {
  return useQuery({
    queryKey: ['ccp_records', 'failed', limit],
    queryFn: () => getFailedCCPRecords(limit),
  });
}

/**
 * Fetch CCP compliance statistics
 */
export function useCCPStatistics(filters?: {
  sessionId?: string;
  dateFrom?: string;
  dateTo?: string;
}) {
  return useQuery({
    queryKey: ['ccp_statistics', filters],
    queryFn: () => getCCPStatistics(filters),
  });
}

/**
 * Create a new CCP record
 */
export function useCreateCCPRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ccp: CCPInsert) => createCCPRecord(ccp),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['ccp_records'] });
      if (variables.session_id) {
        queryClient.invalidateQueries({ queryKey: ['ccp_records', 'session', variables.session_id] });
        queryClient.invalidateQueries({ queryKey: ['sessions', variables.session_id] });
      }
      queryClient.invalidateQueries({ queryKey: ['ccp_statistics'] });
    },
  });
}

/**
 * Update a CCP record
 */
export function useUpdateCCPRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: CCPUpdate }) =>
      updateCCPRecord(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ccp_records'] });
      queryClient.invalidateQueries({ queryKey: ['ccp_statistics'] });
    },
  });
}
