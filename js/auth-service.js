(function () {
    const STORAGE_KEY = "love-site-auth-session-v1";

    function getUsers() {
        const config = globalThis.LoveSiteAuthConfig || {};
        return Array.isArray(config.users) ? config.users : [];
    }

    function findUser(username) {
        return getUsers().find((user) => user.username === username) || null;
    }

    function getSession() {
        try {
            const raw = globalThis.localStorage.getItem(STORAGE_KEY);
            if (!raw) return null;

            const session = JSON.parse(raw);
            const user = findUser(session.username);
            if (!user) return null;

            return {
                username: user.username,
                displayName: user.displayName,
                loggedInAt: session.loggedInAt || ""
            };
        } catch (_error) {
            return null;
        }
    }

    function isLoggedIn() {
        return Boolean(getSession());
    }

    function login(username, password) {
        const normalizedUsername = String(username || "").trim();
        const normalizedPassword = String(password || "");
        const user = findUser(normalizedUsername);

        if (!user || user.password !== normalizedPassword) {
            return { ok: false, error: "用户名或密码不正确。" };
        }

        const session = {
            username: user.username,
            loggedInAt: new Date().toISOString()
        };

        globalThis.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
        return {
            ok: true,
            data: {
                username: user.username,
                displayName: user.displayName,
                loggedInAt: session.loggedInAt
            }
        };
    }

    function logout() {
        globalThis.localStorage.removeItem(STORAGE_KEY);
    }

    globalThis.LoveSiteAuth = {
        getUsers,
        getSession,
        isLoggedIn,
        login,
        logout
    };
})();
