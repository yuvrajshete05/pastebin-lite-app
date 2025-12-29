import { supabase, Paste } from './supabase';
import { nanoid } from 'nanoid';

/**
 * Create a new paste
 */
export async function createPaste(
  content: string,
  ttl_seconds?: number,
  max_views?: number
): Promise<{ id: string; url: string }> {
  if (!content || content.trim().length === 0) {
    throw new Error('Content is required and cannot be empty');
  }

  if (ttl_seconds !== undefined && ttl_seconds < 1) {
    throw new Error('ttl_seconds must be at least 1');
  }

  if (max_views !== undefined && max_views < 1) {
    throw new Error('max_views must be at least 1');
  }

  const id = nanoid(10);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  const { error } = await supabase.from('pastes').insert({
    id,
    content,
    ttl_seconds: ttl_seconds || null,
    max_views: max_views || null,
    views_count: 0,
  });

  if (error) {
    throw error;
  }

  return {
    id,
    url: `${appUrl}/p/${id}`,
  };
}

/**
 * Get a paste by ID and increment view count
 */
export async function getPaste(id: string, testNowMs?: number): Promise<Paste | null> {
  const { data, error } = await supabase
    .from('pastes')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    return null;
  }

  const paste = data as Paste;

  // Check if paste has expired
  if (paste.ttl_seconds) {
    const createdAt = new Date(paste.created_at).getTime();
    const currentTime = testNowMs || Date.now();
    const expiryTime = createdAt + paste.ttl_seconds * 1000;

    if (currentTime >= expiryTime) {
      return null; // Paste has expired
    }
  }

  // Check if view limit exceeded
  if (paste.max_views && paste.views_count >= paste.max_views) {
    return null; // View limit exceeded
  }

  // Increment view count
  const { error: updateError } = await supabase
    .from('pastes')
    .update({ views_count: paste.views_count + 1 })
    .eq('id', id);

  if (updateError) {
    throw updateError;
  }

  // Return with updated view count
  return {
    ...paste,
    views_count: paste.views_count + 1,
  };
}

/**
 * Check if paste is available (without incrementing views)
 */
export async function isPasteAvailable(id: string, testNowMs?: number): Promise<boolean> {
  const { data, error } = await supabase
    .from('pastes')
    .select('created_at, ttl_seconds, views_count, max_views')
    .eq('id', id)
    .single();

  if (error || !data) {
    return false;
  }

  // Check if paste has expired
  if (data.ttl_seconds) {
    const createdAt = new Date(data.created_at).getTime();
    const currentTime = testNowMs || Date.now();
    const expiryTime = createdAt + data.ttl_seconds * 1000;

    if (currentTime >= expiryTime) {
      return false; // Paste has expired
    }
  }

  // Check if view limit exceeded
  if (data.max_views && data.views_count >= data.max_views) {
    return false; // View limit exceeded
  }

  return true;
}

/**
 * Get paste metadata (without counting as a view)
 */
export async function getPasteMetadata(id: string, testNowMs?: number) {
  const { data, error } = await supabase
    .from('pastes')
    .select('created_at, ttl_seconds, views_count, max_views')
    .eq('id', id)
    .single();

  if (error || !data) {
    return null;
  }

  // Calculate remaining views
  let remaining_views = null;
  if (data.max_views !== null) {
    remaining_views = Math.max(0, data.max_views - data.views_count);
  }

  // Calculate expiry time
  let expires_at = null;
  if (data.ttl_seconds) {
    const expiryMs = new Date(data.created_at).getTime() + data.ttl_seconds * 1000;
    expires_at = new Date(expiryMs).toISOString();
  }

  return {
    remaining_views,
    expires_at,
    is_available: await isPasteAvailable(id, testNowMs),
  };
}
