const {
    defaultContent,
    mergeContent,
    loadContent,
    persistContent,
    buildShareUrl,
    fileToDataUrl
} = globalThis.LoveSiteData;

const state = {
    content: loadContent()
};

const dom = {};

document.addEventListener("DOMContentLoaded", () => {
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
    setShareStatus("Saved in this browser. Send the share link if you want the other person to see the same content.");
    if (!options.silent) {
        globalThis.alert("Saved locally. Copy the share link and send it to the other person.");
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
    link.download = "love-site-content.json";
    link.click();
    URL.revokeObjectURL(url);
}

async function copyShareLink() {
    saveEditorContent({ silent: true });

    const shareUrl = buildShareUrl(state.content, "index.html");
    if (shareUrl.length > 180000) {
        setShareStatus("The share link may be too long because the images are large. Compress the images if needed.");
    }

    try {
        await globalThis.navigator.clipboard.writeText(shareUrl);
        setShareStatus("Share link copied. Send it to the other person and they will see the same images and text.");
    } catch (_error) {
        setShareStatus(`Copy failed. Please copy this link manually: ${shareUrl}`);
        globalThis.prompt("Copy this share link and send it to the other person:", shareUrl);
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
            setShareStatus("Import completed. You can now copy the share link.");
            globalThis.alert("Import completed.");
        } catch (_error) {
            globalThis.alert("JSON parse failed. Please check the file format.");
        } finally {
            event.target.value = "";
        }
    };
    reader.readAsText(file, "utf-8");
}

function resetContent() {
    const shouldReset = globalThis.confirm("Reset to default content? Local changes in this browser will be cleared.");
    if (!shouldReset) return;

    state.content = structuredClone(defaultContent);
    persistContent(state.content);
    fillEditor();
    setShareStatus("Reset to default content.");
}

function setShareStatus(message) {
    if (dom.shareStatus) {
        dom.shareStatus.textContent = message;
    }
}