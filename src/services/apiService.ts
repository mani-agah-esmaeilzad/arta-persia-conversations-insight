import axios from 'axios';

const LARAVEL_BASE_URL = 'http://127.0.0.1:8000';

// کلاینت برای مسیرهای عمومی (مانند /login, /register)
const publicApiClient = axios.create({
    baseURL: LARAVEL_BASE_URL,
    withCredentials: true,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }
});

// کلاینت برای مسیرهای محافظت‌شده که با /api شروع می‌شوند
const protectedApiClient = axios.create({
    baseURL: `${LARAVEL_BASE_URL}/api`,
    withCredentials: true,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }
});

// این Interceptor توکن را به صورت خودکار به تمام درخواست‌های محافظت‌شده اضافه می‌کند
protectedApiClient.interceptors.request.use(config => {
    const token = localStorage.getItem('AUTH_TOKEN');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default {
    // === Auth Services ===
    login(credentials: { email: string, password: string }) {
        return publicApiClient.get('/sanctum/csrf-cookie').then(() => {
            return publicApiClient.post('/login', credentials);
        });
    },
    register(userData: any) {
        return publicApiClient.get('/sanctum/csrf-cookie').then(() => {
            return publicApiClient.post('/register', userData);
        });
    },
    logout() {
        return publicApiClient.post('/logout');
    },
    getUser() {
        return protectedApiClient.get('/user');
    },

    // === Chat Services ===
    startChat() {
        return protectedApiClient.post('/chat/start');
    },
    sendChatMessage(conversationId: number, message: string) {
        return protectedApiClient.post('/chat/send', {
            conversation_id: conversationId,
            message: message,
        });
    }
};

