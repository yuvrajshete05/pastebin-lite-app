import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // Try to query the pastes table to verify database connection
    const { error } = await supabase.from('pastes').select('id').limit(1);

    if (error) {
      return NextResponse.json(
        { ok: false, error: 'Database connection failed' },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: 'Health check failed' },
      { status: 500 }
    );
  }
}
