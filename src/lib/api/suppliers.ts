import { supabase } from '../supabase';
import type { Database } from '../database.types';

type Supplier = Database['public']['Tables']['suppliers']['Row'];
type SupplierInsert = Database['public']['Tables']['suppliers']['Insert'];
type SupplierUpdate = Database['public']['Tables']['suppliers']['Update'];

/**
 * Get all suppliers with optional filters
 */
export async function getSuppliers(filters?: {
  province?: string;
  certificationStatus?: 'active' | 'expired' | 'pending';
  excludeBlacklisted?: boolean;
}) {
  let query = supabase
    .from('suppliers')
    .select('*')
    .order('name', { ascending: true });

  if (filters?.province) {
    query = query.eq('province', filters.province);
  }

  if (filters?.certificationStatus) {
    query = query.eq('certification_status', filters.certificationStatus);
  }

  if (filters?.excludeBlacklisted) {
    query = query.eq('blacklisted', false);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching suppliers:', error);
    throw new Error(error.message);
  }

  return data as Supplier[];
}

/**
 * Get a single supplier by ID
 */
export async function getSupplierById(id: string) {
  const { data, error } = await supabase
    .from('suppliers')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching supplier:', error);
    throw new Error(error.message);
  }

  return data as Supplier;
}

/**
 * Create a new supplier
 */
export async function createSupplier(supplier: SupplierInsert) {
  const { data, error } = await supabase
    .from('suppliers')
    .insert(supplier)
    .select()
    .single();

  if (error) {
    console.error('Error creating supplier:', error);
    throw new Error(error.message);
  }

  return data as Supplier;
}

/**
 * Update an existing supplier
 */
export async function updateSupplier(id: string, updates: SupplierUpdate) {
  const { data, error } = await supabase
    .from('suppliers')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating supplier:', error);
    throw new Error(error.message);
  }

  return data as Supplier;
}

/**
 * Delete a supplier (soft delete by blacklisting)
 */
export async function deleteSupplier(id: string) {
  const { error } = await supabase
    .from('suppliers')
    .update({ blacklisted: true })
    .eq('id', id);

  if (error) {
    console.error('Error deleting supplier:', error);
    throw new Error(error.message);
  }
}

/**
 * Search suppliers by name or CIPC
 */
export async function searchSuppliers(query: string) {
  const { data, error } = await supabase
    .from('suppliers')
    .select('*')
    .or(`name.ilike.%${query}%,cipc.ilike.%${query}%`)
    .limit(20);

  if (error) {
    console.error('Error searching suppliers:', error);
    throw new Error(error.message);
  }

  return data as Supplier[];
}
