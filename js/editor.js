const {
    defaultContent,
    mergeContent,
    loadContent,
    persistContent,
    buildShareUrl,
    fileToDataUrl
} = globalThis.LoveSiteData;

const state = {
    content: null
};

const dom = {};

document.addEventListener("DOMContentLoaded", async () => {
    state.content = await loadContent();
    cacheDom();
    bindEvents();
    fillEditor();
});

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
    dom.shareStatus = byId("share-status");
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

function bindEvents() {
    dom.saveEditor.addEventListener("click", saveEditorContent);
    dom.exportJson.addEventListener("click", exportJson);
    dom.importJson.addEventListener("change", importJson);
    dom.resetContent.addEventListener("click", resetContent);
    dom.copyShareLink.addEventListener("click", copyShareLink);
    dom.addTimelineItem.addEventListener("click", () => {
        state.content.timelineItems.push({ date: "", title: "", description: "" });
        fillEditor();
    });
    dom.addGalleryItem.addEventListener("click", () => {
        state.content.galleryItems.push({ title: "", description: "", image: "" });
        fillEditor();
    });
    dom.addNoteItem.addEventListener("click", () => {
        state.content.noteItems.push({ title: "", content: "" });
        fillEditor();
    });

    dom.personAUploadInput.addEventListener("change", async (event) => {
        const image = await fileToDataUrl(event.target.files[0]);
        if (image) dom.personAImageInput.value = image;
    });
    dom.personBUploadInput.addEventListener("change", async (event) => {
        const image = await fileToDataUrl(event.target.files[0]);
        if (image) dom.personBImageInput.value = image;
    });
    dom.heroUploadInput.addEventListener("change", async (event) => {
        const image = await fileToDataUrl(event.target.files[0]);
        if (image) dom.heroImageInput.value = image;
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
        uploadField: null
    });
    renderRepeatEditor({
        list: dom.galleryEditorList,
        items: content.galleryItems,
        templateId: "gallery-editor-template",
        fields: ["title", "description", "image"],
        uploadField: "upload"
    });
    renderRepeatEditor({
        list: dom.noteEditorList,
        items: content.noteItems,
        templateId: "note-editor-template",
        fields: ["title", "content"],
        uploadField: null
    });
}

function renderRepeatEditor(config) {
    const template = document.getElementById(config.templateId);
    config.list.innerHTML = "";

    config.items.forEach((item, index) => {
        const fragment = template.content.cloneNode(true);
        const card = fragment.querySelector(".repeat-card");

        config.fields.forEach((field) => {
            const input = card.querySelector(`[data-field="${field}"]`);
            input.value = item[field] || "";
        });

        card.querySelector('[data-action="remove"]').addEventListener("click", () => {
            config.items.splice(index, 1);
            fillEditor();
        });

        if (config.uploadField) {
            card.querySelector(`[data-field="${config.uploadField}"]`).addEventListener("change", async (event) => {
                const image = await fileToDataUrl(event.target.files[0]);
                if (!image) return;
                card.querySelector('[data-field="image"]').value = image;
            });
        }

        config.list.appendChild(fragment);
    });
}

function saveEditorContent(options = {}) {
    const nextContent = mergeContent(state.content);

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

    state.content = nextContent;
    persistContent(state.content);
    fillEditor();
    setShareStatus("内容已保存到当前浏览器。如果想同步给所有访问者，请导出 JSON 后覆盖仓库里的 data/site-content.json 并提交。");
    if (!options.silent) {
        globalThis.alert("已保存到本地浏览器。想同步到网站和代码仓库时，请导出 JSON，覆盖 data/site-content.json 后提交。");
    }
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
    const blob = new Blob([JSON.stringify(state.content, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "site-content.json";
    link.click();
    URL.revokeObjectURL(url);
    setShareStatus("已导出 site-content.json。把它覆盖到仓库里的 data/site-content.json 并提交后，所有人都会看到这份内容。");
}

async function copyShareLink() {
    saveEditorContent({ silent: true });

    const shareUrl = buildShareUrl(state.content, "index.html");
    if (shareUrl.length > 180000) {
        setShareStatus("分享链接可能过长，通常是因为图片太大。可以先压缩图片后再生成分享链接。");
    }

    try {
        await globalThis.navigator.clipboard.writeText(shareUrl);
        setShareStatus("分享链接已复制。把它发给对方后，对方就能看到同样的文字和图片。");
    } catch (_error) {
        setShareStatus(`复制失败，请手动复制这个链接：${shareUrl}`);
        globalThis.prompt("请复制这个分享链接并发给对方：", shareUrl);
    }
}

function importJson(event) {
    const [file] = event.target.files;
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
        try {
            const parsed = JSON.parse(String(reader.result));
            state.content = mergeContent(parsed);
            persistContent(state.content);
            fillEditor();
            setShareStatus("导入完成，现在可以复制分享链接发给对方。");
            globalThis.alert("导入完成。");
        } catch (_error) {
            globalThis.alert("JSON 解析失败，请检查文件格式是否正确。");
        } finally {
            event.target.value = "";
        }
    };
    reader.readAsText(file, "utf-8");
}

function resetContent() {
    const shouldReset = globalThis.confirm("要恢复默认内容吗？当前浏览器里的本地修改会被清空。");
    if (!shouldReset) return;

    state.content = structuredClone(defaultContent);
    persistContent(state.content);
    fillEditor();
    setShareStatus("已恢复为默认内容。");
}

function setShareStatus(message) {
    if (dom.shareStatus) {
        dom.shareStatus.textContent = message;
    }
}
