'use server';

import { stripe } from '@/lib/stripe';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export async function createCheckoutSession(priceId: string) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login?next=/pricing');
    }

    // Check if user already has a customer ID in profiles
    const { data: profile } = await supabase
        .from('profiles')
        .select('stripe_customer_id')
        .eq('id', user.id)
        .single();

    let customerId = profile?.stripe_customer_id;

    if (!customerId) {
        // Create new customer in Stripe
        const customer = await stripe.customers.create({
            email: user.email,
            metadata: {
                supabase_user_id: user.id,
            },
        });
        customerId = customer.id;

        // Save customer ID to Supabase
        await supabase
            .from('profiles')
            .update({ stripe_customer_id: customerId })
            .eq('id', user.id);
    }

    const session = await stripe.checkout.sessions.create({
        customer: customerId,
        line_items: [
            {
                price: priceId,
                quantity: 1,
            },
        ],
        mode: 'subscription',
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/dashboard?success=true`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/pricing?canceled=true`,
        metadata: {
            supabase_user_id: user.id,
        }
    });

    if (session.url) {
        redirect(session.url);
    }
}
