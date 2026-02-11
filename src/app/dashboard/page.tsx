
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Dashboard from './Dashboard'
import { randomBytes } from 'crypto'

function generateApiKey() {
    return `sk_live_${randomBytes(16).toString('hex')}`
}

export default async function DashboardPage() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return redirect('/login')
    }

    // 1. Fetch Profile (Plan & Credits)
    const { data: profile } = await supabase
        .from('profiles')
        .select('plan, credits_limit')
        .eq('id', user.id)
        .single()

    // 2. Fetch API Key
    let { data: apiKeyData } = await supabase
        .from('api_keys')
        .select('key, id')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .single()

    // If no API key exists, generate one
    if (!apiKeyData) {
        const newKey = generateApiKey()
        const { data: newKeyData } = await supabase
            .from('api_keys')
            .insert({
                user_id: user.id,
                key: newKey,
                is_active: true
            })
            .select('key, id')
            .single()

        if (newKeyData) {
            apiKeyData = newKeyData
        }
    }

    // 3. Fetch Usage
    let usage = 0;
    if (apiKeyData?.id) {
        const { data: usageLogs } = await supabase
            .from('usage_logs')
            .select('request_count')
            .eq('key_id', apiKeyData.id)

        if (usageLogs) {
            usage = usageLogs.reduce((acc, log) => acc + (log.request_count || 0), 0);
        }
    }

    // Server Action for Logout
    const signOut = async () => {
        'use server'
        const supabase = await createClient()
        await supabase.auth.signOut()
        return redirect('/login')
    }

    // Defaults
    const plan = profile?.plan || 'free';
    const credits = profile?.credits_limit || 100; // Default limit
    const apiKey = apiKeyData?.key || null;

    return (
        <Dashboard
            user={user}
            signOut={signOut}
            plan={plan}
            credits={credits}
            usage={usage}
            apiKey={apiKey}
        />
    )
}
