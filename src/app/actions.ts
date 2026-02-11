'use server';

import { createClient } from '@/utils/supabase/server';

export async function generateScreenshot(url: string, device: 'desktop' | 'mobile') {
    const supabase = await createClient();

    // 1. Check Authentication
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: 'unauthorized' }; // Client can catch this and redirect
    }

    if (!url) {
        return { success: false, error: 'URL is required.' };
    }

    try {
        // 2. Get User's Active API Key
        // Try to find an active key
        let { data: apiKeyData } = await supabase
            .from('api_keys')
            .select('key')
            .eq('user_id', user.id)
            .eq('is_active', true)
            .single();

        // 3. If no key, we could generate one on the fly, but for now let's error if missing
        // or we could just say "Please generate a key in your dashboard first"
        // But for better UX, let's create one if it doesn't exist? 
        // The dashboard logic does generate one on visit. Let's assume one exists or prompt user.
        // Actually, let's just create one if missing to be seamless.
        let apiKey = apiKeyData?.key;

        if (!apiKey) {
            const { randomBytes } = await import('crypto');
            const newKey = `sk_live_${randomBytes(16).toString('hex')}`;

            const { data: newKeyData } = await supabase
                .from('api_keys')
                .insert({
                    user_id: user.id,
                    key: newKey,
                    is_active: true
                })
                .select('key')
                .single();

            if (newKeyData) {
                apiKey = newKeyData.key;
            } else {
                return { success: false, error: 'Could not generate API key. Please visit dashboard.' };
            }
        }

        // 4. Call External API
        const response = await fetch('https://api.easywebscreenshot.com/screenshot', {
            method: 'POST',
            headers: {
                'x-api-key': apiKey,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                url,
                display: device,
                fullPage: false,
                json: true,
                delay: 1000
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            try {
                const errorJson = JSON.parse(errorText);
                return { success: false, error: errorJson.message || `API Error: ${response.status}` };
            } catch {
                return { success: false, error: `API Error: ${response.status} - ${errorText}` };
            }
        }

        const data = await response.json();

        if (data.status === 'success' && data.data && data.data.image_base64) {
            return { success: true, imageBase64: data.data.image_base64 };
        } else {
            return { success: false, error: 'Invalid response format from API.' };
        }

    } catch (error) {
        console.error('Screenshot Action Error:', error);
        return { success: false, error: 'Internal Server Error.' };
    }
}
