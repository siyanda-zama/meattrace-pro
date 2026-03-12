import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getSessions,
  getSessionById,
  createSession,
  updateSession,
  deleteSession,
  getActiveSession,
  getTodaySessions,
  calculateHACCPScore,
} from '@/lib/api/sessions';
import type { Database } from '@/lib/database.types';

type SessionInsert = Database['public']['Tables']['sessions']['Insert'];
type SessionUpdate = Database['public']['Tables']['sessions']['Update'];

/**
 * Fetch all sessions with optional filters
 */
export function useSessions(filters?: {
  status?: 'completed' | 'in-progress' | 'flagged' | 'paused';
  dateFrom?: string;
  dateTo?: string;
  supplierId?: string;
  limit?: number;
}) {
  return useQuery({
    queryKey: ['sessions', filters],
    queryFn: () => getSessions(filters),
  });
}

/**
 * Fetch a single session by ID with all related data
 */
export function useSession(id: string) {
  return useQuery({
    queryKey: ['sessions', id],
    queryFn: () => getSessionById(id),
    enabled: !!id,
  });
}

/**
 * Fetch the current active session
 */
export function useActiveSession() {
  return useQuery({
    queryKey: ['sessions', 'active'],
    queryFn: () => getActiveSession(),
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

/**
 * Fetch today's sessions
 */
export function useTodaySessions() {
  return useQuery({
    queryKey: ['sessions', 'today'],
    queryFn: () => getTodaySessions(),
    refetchInterval: 60000, // Refetch every minute
  });
}

/**
 * Create a new session
 */
export function useCreateSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (session: SessionInsert) => createSession(session),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });
}

/**
 * Update an existing session
 */
export function useUpdateSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: SessionUpdate }) =>
      updateSession(id, updates),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      queryClient.invalidateQueries({ queryKey: ['sessions', variables.id] });
    },
  });
}

/**
 * Delete a session
 */
export function useDeleteSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteSession(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });
}

/**
 * Calculate HACCP score for a session
 */
export function useCalculateHACCPScore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: string) => calculateHACCPScore(sessionId),
    onSuccess: (_, sessionId) => {
      queryClient.invalidateQueries({ queryKey: ['sessions', sessionId] });
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });
}
