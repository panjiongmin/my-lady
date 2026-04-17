(function () {
    let client = null;

    function getConfig() {
        return globalThis.LoveSiteSupabaseConfig || {};
    }

    function isConfigured() {
        const config = getConfig();
        return Boolean(config.url && config.anonKey);
    }

    function getClient() {
        if (!isConfigured()) return null;
        if (client) return client;
        if (!globalThis.supabase || typeof globalThis.supabase.createClient !== "function") {
            return null;
        }

        const config = getConfig();
        client = globalThis.supabase.createClient(config.url, config.anonKey);
        return client;
    }

    async function loadCloudContent() {
        const supabase = getClient();
        if (!supabase) {
            return { ok: false, error: "Supabase not configured." };
        }

        const config = getConfig();
        const { data, error } = await supabase
            .from(config.table)
            .select("content")
            .eq("site_key", config.siteKey)
            .maybeSingle();

        if (error) {
            return { ok: false, error: error.message };
        }

        return { ok: true, data: data ? data.content : null };
    }

    async function saveCloudContent(content) {
        const supabase = getClient();
        if (!supabase) {
            return { ok: false, error: "Supabase not configured." };
        }

        const config = getConfig();
        const payload = {
            site_key: config.siteKey,
            content,
            updated_at: new Date().toISOString()
        };

        const { error } = await supabase
            .from(config.table)
            .upsert(payload, { onConflict: "site_key" });

        if (error) {
            return { ok: false, error: error.message };
        }

        return { ok: true };
    }

    async function uploadImage(file, folder = "gallery") {
        const supabase = getClient();
        if (!supabase) {
            return { ok: false, error: "Supabase not configured." };
        }

        const config = getConfig();
        const ext = getFileExtension(file);
        const path = `${config.siteKey}/${folder}/${Date.now()}-${randomId()}${ext}`;
        const { error } = await supabase.storage
            .from(config.bucket)
            .upload(path, file, {
                upsert: false,
                contentType: file.type || "application/octet-stream"
            });

        if (error) {
            return { ok: false, error: formatStorageError(error, config.bucket) };
        }

        const { data } = supabase.storage.from(config.bucket).getPublicUrl(path);
        return { ok: true, data: { path, publicUrl: data.publicUrl } };
    }

    function getFileExtension(file) {
        if (!file || !file.name || !file.name.includes(".")) {
            return "";
        }

        return `.${String(file.name).split(".").pop().toLowerCase()}`;
    }

    function randomId() {
        return Math.random().toString(36).slice(2, 10);
    }

    function formatStorageError(error, bucket) {
        const message = String(error && error.message ? error.message : "未知上传错误");
        const normalized = message.toLowerCase();

        if (normalized.includes("bucket not found")) {
            return `Bucket "${bucket}" 不存在，请先在 Supabase Storage 里创建同名 bucket。原始错误：${message}`;
        }

        if (normalized.includes("row-level security") || normalized.includes("permission")) {
            return `Bucket "${bucket}" 的 Storage 权限未放开，请为 storage.objects 配置该 bucket 的上传策略。原始错误：${message}`;
        }

        return message;
    }

    globalThis.LoveSiteSupabase = {
        getConfig,
        isConfigured,
        getClient,
        loadCloudContent,
        saveCloudContent,
        uploadImage
    };
})();
