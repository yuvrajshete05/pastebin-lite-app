import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Get test mode and x-test-now-ms header
    const isTestMode = process.env.TEST_MODE === '1';
    let testNowMs: number | undefined;
    
    if (isTestMode) {
      const testNowHeader = request.headers.get('x-test-now-ms');
      if (testNowHeader) {
        testNowMs = parseInt(testNowHeader, 10);
        if (isNaN(testNowMs)) {
          return NextResponse.json(
            { error: 'Invalid x-test-now-ms header' },
            { status: 400 }
          );
        }
      }
    }

    // Fetch paste
    const { data, error } = await supabase
      .from('pastes')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: 'Paste not found' },
        { status: 404 }
      );
    }

    // Check if paste has expired
    if (data.ttl_seconds) {
      const createdAt = new Date(data.created_at).getTime();
      const currentTime = testNowMs || Date.now();
      const expiryTime = createdAt + data.ttl_seconds * 1000;

      if (currentTime >= expiryTime) {
        return NextResponse.json(
          { error: 'Paste has expired' },
          { status: 404 }
        );
      }
    }

    // Check if view limit exceeded
    if (data.max_views && data.views_count >= data.max_views) {
      return NextResponse.json(
        { error: 'View limit exceeded' },
        { status: 404 }
      );
    }

    // Increment view count first
    const { error: updateError } = await supabase
      .from('pastes')
      .update({ views_count: data.views_count + 1 })
      .eq('id', id);

    if (updateError) {
      throw updateError;
    }

    // Calculate remaining views AFTER incrementing
    let remaining_views = null;
    if (data.max_views !== null) {
      remaining_views = Math.max(0, data.max_views - (data.views_count + 1));
    }

    // Calculate expires_at
    let expires_at = null;
    if (data.ttl_seconds) {
      const expiryMs = new Date(data.created_at).getTime() + data.ttl_seconds * 1000;
      expires_at = new Date(expiryMs).toISOString();
    }

    return NextResponse.json({
      content: data.content,
      remaining_views,
      expires_at,
    });
  } catch (error) {
    console.error('Error fetching paste:', error);
    return NextResponse.json(
      { error: 'Failed to fetch paste' },
      { status: 500 }
    );
  }
}
