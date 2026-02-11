'use server';

export async function generateScreenshotAction(apiKey: string, url: string, display: 'desktop' | 'mobile') {
    if (!apiKey) {
        return { success: false, error: 'API Key is missing.' };
    }

    if (!url) {
        return { success: false, error: 'URL is required.' };
    }

    try {
        const response = await fetch('https://api.easywebscreenshot.com/screenshot', {
            method: 'POST',
            headers: {
                'x-api-key': apiKey,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                url,
                display,
                fullPage: false, // Default to viewport for playground
                json: true,      // We need JSON to get the base64 string
                delay: 1000      // Slight delay for better quality
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            // Try to parse error as JSON if possible
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
        return { success: false, error: 'Internal Server Error. Please try again.' };
    }
}
