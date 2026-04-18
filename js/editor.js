const {
    defaultContent,
    mergeContent,
    loadLocalContent,
    persistContent,
    buildShareUrl,
    fileToDataUrl
} = globalThis.LoveSiteData;
const {
    isConfigured,
    loadCloudContent,
    saveCloudContent,
    uploadImage,
    getConfig
} = globalThis.LoveSiteSupabase;
const { getSession, login, logout } = globalThis.LoveSiteAuth;

const state = {
    content: null,
    saving: false,
    uploading: false,
    session: null
};

const dom = {};

document.addEventListener("DOMContentLoaded", async () => {
    cacheDom();
    state.session = getSession();
    bindAuthEvents();
    if (state.session) {
        state.content = await resolveInitialContent();
    } else {
        state.content = loadLocalContent();
    }
    bindEvents();
    fillEditor();
    updateCloudHint();
    updateAuthUi();
});

async function resolveInitialContent() {
    if (isConfigured()) {
        const result = await loadCloudContent();
        if (result.ok && result.data) {
            persistContent(mergeContent(result.data));
            return mergeContent(result.data);
        }
    }

    return loadLocalContent();
}

function cacheDom() {
    const byId = (id) => document.getElementById(id);

    dom.timelineEditorList = byId("timeline-editor-list");
    dom.galleryEditorList = byId("gallery-editor-list");
    dom.noteEditorList = byId("note-editor-list");

    dom.saveEditor = byId("save-editor");
    dom.exportJson = byId("export-json");
    dom.importJson = byId("import-json");
    dom.resetContent = byId("reset-content");
    dom.copyShareLink = byId("copy-share-link");
    dom.editorLogoutButton = byId("editor-logout-button");
    dom.shareStatus = byId("share-status");
    dom.cloudHint = byId("cloud-hint");
    dom.editorAuthStatus = byId("editor-auth-status");
    dom.editorLoginPanel = byId("editor-login-panel");
    dom.editorContentPanel = byId("editor-content-panel");
    dom.editorAuthForm = byId("editor-auth-form");
    dom.editorAuthUsername = byId("editor-auth-username");
    dom.editorAuthPassword = byId("editor-auth-password");
    dom.editorAuthFormStatus = byId("editor-auth-form-status");
    dom.addTimelineItem = byId("add-timeline-item");
    dom.addGalleryItem = byId("add-gallery-item");
    dom.addNoteItem = byId("add-note-item");

    dom.siteTitleInput = byId("site-title-input");
    dom.heroBadgeInput = byId("hero-badge-input");
    dom.heroTitleInput = byId("hero-title-input");
    dom.heroSubtitleInput = byId("hero-subtitle-input");
    dom.heroDescriptionInput = byId("hero-description-input");
    dom.anniversaryInput = byId("anniversary-input");
    dom.footerTextInput = byId("footer-text-input");

    dom.personANameInput = byId("person-a-name-input");
    dom.personAImageInput = byId("person-a-image-input");
    dom.personAUploadInput = byId("person-a-upload-input");
    dom.personBNameInput = byId("person-b-name-input");
    dom.personBImageInput = byId("person-b-image-input");
    dom.personBUploadInput = byId("person-b-upload-input");
    dom.heroImageInput = byId("hero-image-input");
    dom.heroUploadInput = byId("hero-upload-input");
}

function bindAuthEvents() {
    dom.editorAuthForm.addEventListener("submit", handleEditorLogin);
    dom.editorLogoutButton.addEventListener("click", handleEditorLogout);
}

function bindEvents() {
    dom.saveEditor.addEventListener("click", saveEditorContent);
    dom.exportJson.addEventListener("click", exportJson);
    dom.importJson.addEventListener("change", importJson);
    dom.resetContent.addEventListener("click", resetContent);
    dom.copyShareLink.addEventListener("click", copyShareLink);
    dom.addTimelineItem.addEventListener("click", () => {
        syncStateWithForm();
        state.content.timelineItems.push({ date: "", title: "", description: "" });
        fillEditor();
    });
    dom.addGalleryItem.addEventListener("click", () => {
        syncStateWithForm();
        state.content.galleryItems.push({ title: "", description: "", image: "" });
        fillEditor();
    });
    dom.addNoteItem.addEventListener("click", () => {
        syncStateWithForm();
        state.content.noteItems.push({ title: "", content: "" });
        fillEditor();
    });

    dom.personAUploadInput.addEventListener("change", (event) => {
        handleSingleImageUpload(event, dom.personAImageInput, "avatars");
    });
    dom.personBUploadInput.addEventListener("change", (event) => {
        handleSingleImageUpload(event, dom.personBImageInput, "avatars");
    });
    dom.heroUploadInput.addEventListener("change", (event) => {
        handleSingleImageUpload(event, dom.heroImageInput, "hero");
    });
}

function fillEditor() {
    const content = state.content;

    dom.siteTitleInput.value = content.siteTitle;
    dom.heroBadgeInput.value = content.hero.badge;
    dom.heroTitleInput.value = content.hero.title;
    dom.heroSubtitleInput.value = content.hero.subtitle;
    dom.heroDescriptionInput.value = content.hero.description;
    dom.anniversaryInput.value = content.anniversaryDate;
    dom.footerTextInput.value = content.footerText;

    dom.personANameInput.value = content.hero.personA.name;
    dom.personAImageInput.value = content.hero.personA.image;
    dom.personBNameInput.value = content.hero.personB.name;
    dom.personBImageInput.value = content.hero.personB.image;
    dom.heroImageInput.value = content.hero.backgroundImage;

    renderRepeatEditor({
        list: dom.timelineEditorList,
        items: content.timelineItems,
        templateId: "timeline-editor-template",
        fields: ["date", "title", "description"],
        uploadFolder: ""
    });
    renderRepeatEditor({
        list: dom.galleryEditorList,
        items: content.galleryItems,
        templateId: "gallery-editor-template",
        fields: ["title", "description", "image"],
        uploadFolder: "gallery"
    });
    renderRepeatEditor({
        list: dom.noteEditorList,
        items: content.noteItems,
        templateId: "note-editor-template",
        fields: ["title", "content"],
        uploadFolder: ""
    });

    updateSaveButton();
}

function renderRepeatEditor(config) {
    const template = document.getElementById(config.templateId);
    config.list.innerHTML = "";

    config.items.forEach((item, index) => {
        const fragment = template.content.cloneNode(true);
        const card = fragment.querySelector(".repeat-card");

        config.fields.forEach((field) => {
            const input = card.querySelector(`[data-field="${field}"]`);
            if (input) input.value = item[field] || "";
        });

        card.querySelector('[data-action="remove"]').addEventListener("click", () => {
            syncStateWithForm();
            config.items.splice(index, 1);
            fillEditor();
        });

        const uploadInput = card.querySelector('[data-field="upload"]');
        if (uploadInput && config.uploadFolder) {
            uploadInput.addEventListener("change", async (event) => {
                const imageInput = card.querySelector('[data-field="image"]');
                await handleSingleImageUpload(event, imageInput, config.uploadFolder);
            });
        }

        config.list.appendChild(fragment);
    });
}

async function handleSingleImageUpload(event, targetInput, folder) {
    const file = event.target.files[0];
    if (!file) return;

    state.uploading = true;
    updateSaveButton();

    try {
        if (isConfigured()) {
            setShareStatus("正在上传图片到 Supabase Storage...");
            const result = await uploadImage(file, folder);
            if (!result.ok) {
                const embeddedImage = await fileToDataUrl(file);
                if (embeddedImage) {
                    targetInput.value = embeddedImage;
                    setShareStatus(`图片上传到 Storage 失败，已自动改为内嵌图片。点击“保存到云端”后，对方也能看到。原因：${result.error}`);
                    return;
                }

                setShareStatus(`图片上传失败：${result.error}`);
                return;
            }
            targetInput.value = result.data.publicUrl;
            setShareStatus("图片已上传到云端，保存后全站可见。");
        } else {
            const image = await fileToDataUrl(file);
            if (image) {
                targetInput.value = image;
                setShareStatus("当前未配置 Supabase，图片暂时只保存在本地浏览器或分享链接里。");
            }
        }
    } finally {
        event.target.value = "";
        state.uploading = false;
        updateSaveButton();
    }
}

async function saveEditorContent(options = {}) {
    if (!state.session) return;
    if (state.saving) return;

    state.saving = true;
    updateSaveButton();

    try {
        const nextContent = buildContentFromForm();
        state.content = nextContent;
        persistContent(state.content);

        if (isConfigured()) {
            setShareStatus("正在保存到 Supabase 云端...");
            const result = await saveCloudContent(state.content);
            if (!result.ok) {
                setShareStatus(`云端保存失败：${result.error}`);
                if (!options.silent) {
                    globalThis.alert(`云端保存失败：${result.error}`);
                }
                return;
            }

            setShareStatus("已保存到 Supabase 云端。对方刷新页面后就能看到最新内容。");
            if (!options.silent) {
                globalThis.alert("已保存到 Supabase 云端。对方打开网站就能看到最新内容。");
            }
        } else {
            setShareStatus("已保存到当前浏览器。配置 Supabase 后，内容才能自动同步给对方。"
            );
            if (!options.silent) {
                globalThis.alert("已保存到当前浏览器。配置 Supabase 后，内容才能自动同步给对方。");
            }
        }

        fillEditor();
    } finally {
        state.saving = false;
        updateSaveButton();
    }
}

function buildContentFromForm() {
    const nextContent = mergeContent(state.content || defaultContent);

    nextContent.siteTitle = dom.siteTitleInput.value.trim() || defaultContent.siteTitle;
    nextContent.hero.badge = dom.heroBadgeInput.value.trim() || defaultContent.hero.badge;
    nextContent.hero.title = dom.heroTitleInput.value.trim() || defaultContent.hero.title;
    nextContent.hero.subtitle = dom.heroSubtitleInput.value.trim() || defaultContent.hero.subtitle;
    nextContent.hero.description = dom.heroDescriptionInput.value.trim() || defaultContent.hero.description;
    nextContent.anniversaryDate = dom.anniversaryInput.value || defaultContent.anniversaryDate;
    nextContent.footerText = dom.footerTextInput.value.trim() || defaultContent.footerText;

    nextContent.hero.personA.name = dom.personANameInput.value.trim() || defaultContent.hero.personA.name;
    nextContent.hero.personA.image = dom.personAImageInput.value.trim() || defaultContent.hero.personA.image;
    nextContent.hero.personB.name = dom.personBNameInput.value.trim() || defaultContent.hero.personB.name;
    nextContent.hero.personB.image = dom.personBImageInput.value.trim() || defaultContent.hero.personB.image;
    nextContent.hero.backgroundImage = dom.heroImageInput.value.trim() || defaultContent.hero.backgroundImage;

    nextContent.timelineItems = readRepeatValues(dom.timelineEditorList, ["date", "title", "description"]).filter((item) => item.date || item.title || item.description);
    nextContent.galleryItems = readRepeatValues(dom.galleryEditorList, ["title", "description", "image"]).filter((item) => item.title || item.description || item.image);
    nextContent.noteItems = readRepeatValues(dom.noteEditorList, ["title", "content"]).filter((item) => item.title || item.content);

    return nextContent;
}

function syncStateWithForm() {
    if (!dom.siteTitleInput) return;
    state.content = buildContentFromForm();
}

function readRepeatValues(container, fields) {
    return Array.from(container.querySelectorAll(".repeat-card")).map((card) => {
        const item = {};
        fields.forEach((field) => {
            item[field] = card.querySelector(`[data-field="${field}"]`).value.trim();
        });
        return item;
    });
}

function exportJson() {
    if (!state.session) return;
    const content = buildContentFromForm();
    const blob = new Blob([JSON.stringify(content, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "love-site-content.json";
    link.click();
    URL.revokeObjectURL(url);
    setShareStatus("已导出 JSON 备份。");
}

async function copyShareLink() {
    if (!state.session) return;
    state.content = buildContentFromForm();
    persistContent(state.content);

    const shareUrl = buildShareUrl(state.content, "index.html");
    if (shareUrl.length > 180000) {
        setShareStatus("分享链接可能过长，通常是因为图片太大。建议先压缩图片。"
        );
    }

    try {
        await globalThis.navigator.clipboard.writeText(shareUrl);
        setShareStatus("分享链接已复制。把它发给对方，对方打开后会看到当前这份内容。"
        );
    } catch (_error) {
        setShareStatus(`复制失败，请手动复制这个链接：${shareUrl}`);
        globalThis.prompt("复制这个分享链接并发给对方：", shareUrl);
    }
}

function importJson(event) {
    if (!state.session) return;
    const [file] = event.target.files;
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
        try {
            const parsed = JSON.parse(String(reader.result));
            state.content = mergeContent(parsed);
            persistContent(state.content);
            fillEditor();
            setShareStatus("导入成功。现在可以直接保存到云端。"
            );
            globalThis.alert("导入成功。");
        } catch (_error) {
            globalThis.alert("JSON 解析失败，请检查文件格式。");
        } finally {
            event.target.value = "";
        }
    };
    reader.readAsText(file, "utf-8");
}

function resetContent() {
    if (!state.session) return;
    const shouldReset = globalThis.confirm("确认恢复默认内容吗？当前浏览器中的本地修改会被清空。"
    );
    if (!shouldReset) return;

    state.content = structuredClone(defaultContent);
    persistContent(state.content);
    fillEditor();
    setShareStatus("已恢复默认内容。");
}

function updateCloudHint() {
    if (!dom.cloudHint) return;

    if (isConfigured()) {
        const config = getConfig();
        dom.cloudHint.textContent = `Supabase 已连接。siteKey: ${config.siteKey}，bucket: ${config.bucket}`;
        dom.cloudHint.dataset.state = "ready";
        return;
    }

    dom.cloudHint.textContent = "Supabase 尚未配置。请先在 js/supabase-config.js 填入 url 和 anonKey。";
    dom.cloudHint.dataset.state = "pending";
}

function updateAuthUi() {
    const loggedIn = Boolean(state.session);

    dom.editorLoginPanel.classList.toggle("hidden", loggedIn);
    dom.editorContentPanel.classList.toggle("hidden", !loggedIn);
    dom.editorLogoutButton.classList.toggle("hidden", !loggedIn);
    dom.editorAuthStatus.textContent = loggedIn
        ? `已登录：${state.session.displayName}。当前浏览器会长期保持登录状态。`
        : "未登录。只有情侣双方账号可以进入编辑页。";
}

async function handleEditorLogin(event) {
    event.preventDefault();

    const result = login(dom.editorAuthUsername.value, dom.editorAuthPassword.value);
    if (!result.ok) {
        dom.editorAuthFormStatus.textContent = result.error;
        return;
    }

    state.session = result.data;
    dom.editorAuthFormStatus.textContent = "";
    state.content = await resolveInitialContent();
    fillEditor();
    updateCloudHint();
    updateAuthUi();
}

function handleEditorLogout() {
    logout();
    state.session = null;
    state.content = loadLocalContent();
    fillEditor();
    updateCloudHint();
    updateAuthUi();
}

function updateSaveButton() {
    if (!dom.saveEditor) return;

    if (state.uploading) {
        dom.saveEditor.textContent = "上传中...";
        dom.saveEditor.disabled = true;
        return;
    }

    if (state.saving) {
        dom.saveEditor.textContent = "保存中...";
        dom.saveEditor.disabled = true;
        return;
    }

    dom.saveEditor.textContent = isConfigured() ? "保存到云端" : "保存到本地";
    dom.saveEditor.disabled = false;
}

function setShareStatus(message) {
    if (dom.shareStatus) {
        dom.shareStatus.textContent = message;
    }
}
