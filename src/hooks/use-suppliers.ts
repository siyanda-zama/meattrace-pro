import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  searchSuppliers,
} from '@/lib/api/suppliers';
import type { Database } from '@/lib/database.types';

type SupplierInsert = Database['public']['Tables']['suppliers']['Insert'];
type SupplierUpdate = Database['public']['Tables']['suppliers']['Update'];

/**
 * Fetch all suppliers with optional filters
 */
export function useSuppliers(filters?: {
  province?: string;
  certificationStatus?: 'active' | 'expired' | 'pending';
  excludeBlacklisted?: boolean;
}) {
  return useQuery({
    queryKey: ['suppliers', filters],
    queryFn: () => getSuppliers(filters),
  });
}

/**
 * Fetch a single supplier by ID
 */
export function useSupplier(id: string) {
  return useQuery({
    queryKey: ['suppliers', id],
    queryFn: () => getSupplierById(id),
    enabled: !!id,
  });
}

/**
 * Search suppliers by name or CIPC
 */
export function useSearchSuppliers(query: string) {
  return useQuery({
    queryKey: ['suppliers', 'search', query],
    queryFn: () => searchSuppliers(query),
    enabled: query.length >= 2,
  });
}

/**
 * Create a new supplier
 */
export function useCreateSupplier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (supplier: SupplierInsert) => createSupplier(supplier),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
    },
  });
}

/**
 * Update an existing supplier
 */
export function useUpdateSupplier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: SupplierUpdate }) =>
      updateSupplier(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
    },
  });
}

/**
 * Delete (blacklist) a supplier
 */
export function useDeleteSupplier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteSupplier(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
    },
  });
}
