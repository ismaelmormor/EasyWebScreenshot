import { stripe } from '@/lib/stripe';
import { createClient } from '@/utils/supabase/server';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(req: Request) {
    const body = await req.text();
    const signature = (await headers()).get('Stripe-Signature') as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (error: any) {
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
    }

    const supabase = await createClient();

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.supabase_user_id;

        if (userId) {
            await supabase
                .from('profiles')
                .update({
                    plan: 'pro',
                    credits_limit: 5000,
                    stripe_customer_id: session.customer as string,
                })
                .eq('id', userId);
        }
    }

    // Handle other relevant events like invoice.payment_succeeded for renewals
    if (event.type === 'invoice.payment_succeeded') {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        // Find user by stripe_customer_id
        const { data: profile } = await supabase
            .from('profiles')
            .select('id')
            .eq('stripe_customer_id', customerId)
            .single();

        if (profile) {
            await supabase
                .from('profiles')
                .update({
                    plan: 'pro',
                    credits_limit: 5000,
                })
                .eq('id', profile.id);
        }
    }

    return new NextResponse('Webhook received', { status: 200 });
}
