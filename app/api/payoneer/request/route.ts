import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Use service-role key to bypass RLS for subscription management
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { plan, amount, userId, email } = await req.json();

    if (!plan || !amount || !userId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Calculate expiry: 30 days for unlimited, null for pay-per-chase
    const expiresAt =
      plan === 'unlimited'
        ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        : null;

    // Deactivate any existing subscriptions for this user
    await supabaseAdmin
      .from('subscriptions')
      .update({ status: 'expired' })
      .eq('user_id', userId)
      .eq('status', 'active');

    // Insert new subscription
    const { data, error } = await supabaseAdmin
      .from('subscriptions')
      .insert({
        user_id: userId,
        plan,
        status: 'active',
        payment_method: 'payoneer',
        amount: Number(amount),
        expires_at: expiresAt,
      })
      .select()
      .single();

    if (error) {
      console.error('Subscription insert error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to activate subscription: ' + error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `${plan === 'unlimited' ? 'Unlimited Agent' : 'Pay-Per-Chase'} plan activated!`,
      subscription: data,
    });
  } catch (err: any) {
    console.error('Payoneer request error:', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
