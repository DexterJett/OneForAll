// mangaDexApi.js
import axios from 'axios';

const API_BASE_URL = 'https://auth.mangadex.org/realms/mangadex/protocol/openid-connect';

const creds = {
    grant_type: "password",
    username: process.env.MANGADEX_USERNAME,
    password: process.env.MANGADEX_PASSWORD,
    client_id: process.env.MANGADEX_CLIENT_ID,
    client_secret: process.env.MANGADEX_CLIENT_SECRET
};

let tokens = {
    access_token: null,
    refresh_token: null,
    expires: null
};

// Authentifizieren und Tokens speichern
async function authenticateUser() {
    try {
        const response = await axios.post(`${API_BASE_URL}/token`, new URLSearchParams(creds).toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        tokens = {
            access_token: response.data.access_token,
            refresh_token: response.data.refresh_token,
            expires: Date.now() + response.data.expires_in * 1000 // Zeitpunkt des Ablaufs in ms
        };
        return tokens;
    } catch (error) {
        console.error('Fehler bei der Authentifizierung:', error.response ? error.response.data : error.message);
        return null;
    }
}

// Token erneuern, wenn abgelaufen
async function refreshToken() {
    if (!tokens.refresh_token) return null;

    try {
        const response = await axios.post(`${API_BASE_URL}/token`, new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: tokens.refresh_token,
            client_id: creds.client_id,
            client_secret: creds.client_secret
        }).toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        tokens = {
            access_token: response.data.access_token,
            refresh_token: response.data.refresh_token || tokens.refresh_token, // Manchmal wird kein neuer Refresh-Token zurückgegeben
            expires: Date.now() + response.data.expires_in * 1000
        };
        return tokens;
    } catch (error) {
        console.error('Fehler beim Erneuern des Tokens:', error.response ? error.response.data : error.message);
        return null;
    }
}

export async function getAccessToken() {
    if (!tokens.access_token || tokens.expires < Date.now()) {
        await refreshToken();
    }
    return tokens.access_token;
}

export async function ensureAuthentication() {
    if (!tokens.access_token || tokens.expires < Date.now()) {
        await authenticateUser();
    }
    return tokens;
}
