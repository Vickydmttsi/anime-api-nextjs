import { DEFAULT_HEADERS } from "../configs/header.config.js";

export const http = {
    get: async (url, config = {}) => {
        const headers = { ...DEFAULT_HEADERS, ...config.headers };
        const response = await fetch(url, { ...config, method: 'GET', headers });

        if (!response.ok && !(config.redirect === 'manual' && response.status >= 300 && response.status < 400)) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentType = response.headers.get("content-type") || "";
        const text = await response.text();

        if (contentType.includes("application/json")) {
            try {
                return { data: JSON.parse(text), status: response.status, headers: response.headers };
            } catch (e) {
                return { data: text, status: response.status, headers: response.headers };
            }
        } else {
            return { data: text, status: response.status, headers: response.headers };
        }
    },
    post: async (url, data, config = {}) => {
        const headers = {
            ...DEFAULT_HEADERS,
            "Content-Type": "application/json",
            ...config.headers
        };
        const response = await fetch(url, {
            ...config,
            method: 'POST',
            headers,
            body: typeof data === 'string' ? data : JSON.stringify(data)
        });

        if (!response.ok && !(config.redirect === 'manual' && response.status >= 300 && response.status < 400)) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentType = response.headers.get("content-type") || "";
        const text = await response.text();

        if (contentType.includes("application/json")) {
            try {
                return { data: JSON.parse(text), status: response.status, headers: response.headers };
            } catch (e) {
                return { data: text, status: response.status, headers: response.headers };
            }
        } else {
            return { data: text, status: response.status, headers: response.headers };
        }
    }
};

export default http;
