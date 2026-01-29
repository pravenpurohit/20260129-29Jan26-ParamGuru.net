/**
 * YouTube API Configuration
 * 
 * Access the API key securely via environment variables.
 * Note: Since this is a client-side app, the key is technically visible to users in the browser network tab.
 * Best Practice: Restrict this key in Google Cloud Console to your specific domain (e.g., paramguru.net).
 */

export const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
export const YOUTUBE_API_BASE_URL = 'https://www.googleapis.com/youtube/v3';

/**
 * Example function to fetch channel details
 * @param {string} channelId 
 */
export const fetchChannelDetails = async (channelId) => {
    if (!YOUTUBE_API_KEY) {
        console.error('YouTube API Key is missing. Check your .env file.');
        return null;
    }

    const url = `${YOUTUBE_API_BASE_URL}/channels?part=snippet,statistics&id=${channelId}&key=${YOUTUBE_API_KEY}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching YouTube data:', error);
        return null;
    }
};
