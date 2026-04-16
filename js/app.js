const STORAGE_KEY = "our-love-site-content-v1";

const defaultContent = {
    siteTitle: "我们的恋爱小站",
    hero: {
        badge: "FOR THE TWO OF US",
        title: "把心动、纪念日和想念，都留在这里。",
        subtitle: "这是属于我们的小世界，像一本会发光的纪念册，慢慢收集每一次见面、每一句想念、每一张照片。",
        description: "页面支持前端编辑、相册更新、文字调整和 JSON 导入导出。你可以把它当作一个长期更新的情侣主页。",
        backgroundImage: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1600&q=80",
        personA: {
            name: "他",
            image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80"
        },
        personB: {
            name: "她",
            image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80"
        }
    },
    counter: {
        title: "我们已经在一起",
        description: "从那个决定走向彼此的日子开始，每一分每一秒都值得被认真纪念。"
    },
    anniversaryDate: "2024-05-20T20:00",
    timeline: {
        title: "我们的故事线",
        description: "从初见，到熟悉，到一次次坚定地选择彼此。"
    },
    timelineItems: [
        {
            date: "2024.03.18",
            title: "第一次认真聊天",
            description: "原本只是随意说几句，后来却越聊越舍不得结束，那一天像是故事真正开始的按钮。"
        },
        {
            date: "2024.05.20",
            title: "正式在一起",
            description: "纪念日从这天开始有了名字，我们也从此变成了彼此生活里最特别的人。"
        },
        {
            date: "2024.08.12",
            title: "第一次旅行",
            description: "一起看风景、一起走陌生的路，后来发现，最喜欢的其实不是城市，而是你在身边。"
        }
    ],
    gallery: {
        title: "被保存下来的瞬间",
        description: "照片也许会模糊，但那一刻的心情会一直被记得。"
    },
    galleryItems: [
        {
            title: "傍晚散步",
            description: "路灯刚亮的时候，我们慢慢走回家。",
            image: "https://images.unsplash.com/photo-1511988617509-a57c8a288659?auto=format&fit=crop&w=900&q=80"
        },
        {
            title: "一起看海",
            description: "风很大，话很少，但心靠得很近。",
            image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80"
        },
        {
            title: "咖啡店约会",
            description: "普通的一天，因为你变得闪闪发亮。",
            image: "https://images.unsplash.com/photo-1516589091380-5d8e87df6999?auto=format&fit=crop&w=900&q=80"
        }
    ],
    notes: {
        title: "写给彼此的话",
        description: "可以放日常碎碎念、纪念日留言、想说却没来得及说出口的话。"
    },
    noteItems: [
        {
            title: "谢谢你出现",
            content: "谢谢你把温柔、耐心和偏爱都给了我，也让很多原本普通的日子开始有了期待。"
        },
        {
            title: "下次想一起做的事",
            content: "想一起拍新的照片、吃一家没去过的小店、看夜景，再把那一天认真写进这里。"
        },
        {
            title: "以后也请多指教",
            content: "如果偶尔会闹别扭，也请别轻易放开我的手。我们一起把日子过成喜欢的样子。"
        }
    ],
    footerText: "Love is built in ordinary days, one memory at a time."
};

const state = {
    content: loadContent()
};

const dom = {};
let counterTimer = null;
let gsapContext = null;

document.addEventListener("DOMContentLoaded", () => {
    cacheDom();
    bindEvents();
    renderPage();
    fillEditor();
    startCounter();
    initGsapAnimations();
});

function cacheDom() {
    const byId = (id) => document.getElementById(id);

    dom.title = document.querySelector("title");
    dom.heroBackdrop = document.querySelector(".hero__backdrop");
    dom.heroBadge = byId("hero-badge");
    dom.heroTitle = byId("hero-title");
    dom.heroSubtitle = byId("hero-subtitle");
    dom.heroDescription = byId("hero-description");
    dom.personAName = byId("person-a-name");
    dom.personAImage = byId("person-a-image");
    dom.personBName = byId("person-b-name");
    dom.personBImage = byId("person-b-image");
    dom.counterTitle = byId("counter-title");
    dom.counterDescription = byId("counter-description");
    dom.days = byId("days-value");
    dom.hours = byId("hours-value");
    dom.minutes = byId("minutes-value");
    dom.seconds = byId("seconds-value");
    dom.timelineTitle = byId("timeline-title");
    dom.timelineDescription = byId("timeline-description");
    dom.timelineList = byId("timeline-list");
    dom.galleryTitle = byId("gallery-title");
    dom.galleryDescription = byId("gallery-description");
    dom.galleryList = byId("gallery-list");
    dom.notesTitle = byId("notes-title");
    dom.notesDescription = byId("notes-description");
    dom.notesList = byId("notes-list");
    dom.footerText = byId("footer-text");

    dom.editorPanel = byId("editor-panel");
    dom.timelineEditorList = byId("timeline-editor-list");
    dom.galleryEditorList = byId("gallery-editor-list");
    dom.noteEditorList = byId("note-editor-list");

    dom.openEditor = byId("open-editor");
    dom.editorFab = byId("editor-fab");
    dom.closeEditor = byId("close-editor");
    dom.editorOverlay = byId("editor-overlay");
    dom.saveEditor = byId("save-editor");
    dom.exportJson = byId("export-json");
    dom.importJson = byId("import-json");
    dom.resetContent = byId("reset-content");
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
    dom.openEditor.addEventListener("click", openEditor);
    dom.editorFab.addEventListener("click", openEditor);
    dom.closeEditor.addEventListener("click", closeEditor);
    dom.editorOverlay.addEventListener("click", closeEditor);
    dom.saveEditor.addEventListener("click", saveEditorContent);
    dom.exportJson.addEventListener("click", exportJson);
    dom.importJson.addEventListener("change", importJson);
    dom.resetContent.addEventListener("click", resetContent);
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

function renderPage() {
    const content = state.content;

    dom.title.textContent = content.siteTitle;
    dom.heroBadge.textContent = content.hero.badge;
    dom.heroTitle.textContent = content.hero.title;
    dom.heroSubtitle.textContent = content.hero.subtitle;
    dom.heroDescription.textContent = content.hero.description;
    dom.personAName.textContent = content.hero.personA.name;
    dom.personAImage.src = content.hero.personA.image;
    dom.personBName.textContent = content.hero.personB.name;
    dom.personBImage.src = content.hero.personB.image;
    dom.heroBackdrop.style.backgroundImage = `linear-gradient(135deg, rgba(58, 25, 17, 0.55), rgba(184, 80, 66, 0.18)), url("${content.hero.backgroundImage}")`;

    dom.counterTitle.textContent = content.counter.title;
    dom.counterDescription.textContent = content.counter.description;

    dom.timelineTitle.textContent = content.timeline.title;
    dom.timelineDescription.textContent = content.timeline.description;
    dom.timelineList.innerHTML = content.timelineItems.map((item) => `
        <article class="timeline-card">
            <span>${escapeHtml(item.date)}</span>
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.description)}</p>
        </article>
    `).join("");

    dom.galleryTitle.textContent = content.gallery.title;
    dom.galleryDescription.textContent = content.gallery.description;
    dom.galleryList.innerHTML = content.galleryItems.map((item) => `
        <article class="gallery-card">
            <img src="${escapeAttribute(item.image)}" alt="${escapeAttribute(item.title)}">
            <div class="gallery-card__body">
                <h3>${escapeHtml(item.title)}</h3>
                <p>${escapeHtml(item.description)}</p>
            </div>
        </article>
    `).join("");

    dom.notesTitle.textContent = content.notes.title;
    dom.notesDescription.textContent = content.notes.description;
    dom.notesList.innerHTML = content.noteItems.map((item) => `
        <article class="note-card">
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.content)}</p>
        </article>
    `).join("");

    dom.footerText.textContent = content.footerText;
    refreshGsapAnimations();
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

function saveEditorContent() {
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
    persistContent();
    renderPage();
    fillEditor();
    restartCounter();
    closeEditor();
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

function openEditor() {
    dom.editorPanel.classList.remove("hidden");
    dom.editorPanel.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
}

function closeEditor() {
    dom.editorPanel.classList.add("hidden");
    dom.editorPanel.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
}

function initGsapAnimations() {
    if (!globalThis.gsap) {
        return;
    }

    if (globalThis.ScrollTrigger) {
        globalThis.gsap.registerPlugin(globalThis.ScrollTrigger);
    }

    buildGsapAnimations();
}

function refreshGsapAnimations() {
    if (!globalThis.gsap) {
        return;
    }

    globalThis.requestAnimationFrame(() => {
        buildGsapAnimations();
    });
}

function buildGsapAnimations() {
    if (gsapContext && typeof gsapContext.revert === "function") {
        gsapContext.revert();
    }

    gsapContext = globalThis.gsap.context(() => {
        const gsap = globalThis.gsap;
        const ScrollTrigger = globalThis.ScrollTrigger;

        gsap.set([
            ".hero__decor .sticker",
            ".hero__mascot-strip .mascot-pill",
            ".counter-card",
            ".timeline-card",
            ".gallery-card",
            ".note-card"
        ], { clearProps: "all" });

        const heroTimeline = gsap.timeline({ defaults: { ease: "power3.out" } });
        heroTimeline
            .from(".hero__decor .sticker", {
                y: 30,
                scale: 0.75,
                opacity: 0,
                duration: 1,
                stagger: 0.08
            })
            .from("#hero-badge, #hero-title, #hero-subtitle, #hero-description", {
                y: 36,
                opacity: 0,
                duration: 0.9,
                stagger: 0.12
            }, "-=0.6")
            .from(".hero__actions .button", {
                y: 20,
                opacity: 0,
                duration: 0.7,
                stagger: 0.12
            }, "-=0.45")
            .from(".person-card, .hero__heart", {
                y: 22,
                scale: 0.92,
                opacity: 0,
                duration: 0.8,
                stagger: 0.12
            }, "-=0.45")
            .from(".hero__mascot-strip .mascot-pill", {
                y: 14,
                opacity: 0,
                duration: 0.45,
                stagger: 0.07
            }, "-=0.4");

        gsap.to(".hero__decor--top-left .sticker", {
            y: -12,
            x: 8,
            rotate: 6,
            duration: 2.4,
            repeat: -1,
            yoyo: true,
            stagger: 0.18,
            ease: "sine.inOut"
        });

        gsap.to(".hero__decor--top-right .sticker, .hero__decor--bottom .sticker", {
            y: 10,
            x: -6,
            rotate: -4,
            duration: 2.8,
            repeat: -1,
            yoyo: true,
            stagger: 0.15,
            ease: "sine.inOut"
        });

        gsap.to(".mascot-pill", {
            y: -8,
            duration: 1.8,
            repeat: -1,
            yoyo: true,
            stagger: 0.1,
            ease: "sine.inOut"
        });

        gsap.to(".editor-fab", {
            scale: 1.06,
            boxShadow: "0 24px 40px rgba(255, 125, 178, 0.42)",
            duration: 1.6,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });

        if (!ScrollTrigger) {
            return;
        }

        gsap.from(".counter-card", {
            scrollTrigger: {
                trigger: ".section--counter",
                start: "top 82%"
            },
            y: 38,
            opacity: 0,
            scale: 0.9,
            duration: 0.8,
            stagger: 0.12,
            ease: "back.out(1.4)"
        });

        gsap.utils.toArray(".timeline-card").forEach((card, index) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: "top 84%"
                },
                x: index % 2 === 0 ? -50 : 50,
                y: 24,
                opacity: 0,
                rotate: index % 2 === 0 ? -2 : 2,
                duration: 0.8,
                ease: "power3.out"
            });
        });

        gsap.utils.toArray(".gallery-card").forEach((card, index) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: "top 88%"
                },
                y: 46,
                opacity: 0,
                scale: 0.92,
                rotate: index % 2 === 0 ? -1.2 : 1.2,
                duration: 0.9,
                ease: "back.out(1.2)"
            });
        });

        gsap.utils.toArray(".note-card").forEach((card, index) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: "top 88%"
                },
                y: 30,
                opacity: 0,
                scale: 0.9,
                rotate: index % 2 === 0 ? -4 : 4,
                duration: 0.75,
                ease: "power2.out"
            });
        });

        gsap.utils.toArray(".section__ornament").forEach((ornament, index) => {
            gsap.to(ornament, {
                y: index % 2 === 0 ? -18 : 18,
                x: index % 2 === 0 ? 10 : -10,
                duration: 3.2,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });
        });

        ScrollTrigger.refresh();
    });
}

function startCounter() {
    restartCounter();
}

function restartCounter() {
    if (counterTimer) {
        globalThis.clearInterval(counterTimer);
    }
    updateCounter();
    counterTimer = globalThis.setInterval(updateCounter, 1000);
}

function updateCounter() {
    const target = new Date(state.content.anniversaryDate).getTime();
    const now = Date.now();
    const diff = Number.isNaN(target) ? 0 : Math.max(now - target, 0);

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    dom.days.textContent = String(days);
    dom.hours.textContent = padNumber(hours);
    dom.minutes.textContent = padNumber(minutes);
    dom.seconds.textContent = padNumber(seconds);
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

function importJson(event) {
    const [file] = event.target.files;
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
        try {
            const parsed = JSON.parse(String(reader.result));
            state.content = mergeContent(parsed);
            persistContent();
            renderPage();
            fillEditor();
            restartCounter();
        } catch (_error) {
            globalThis.alert("JSON 解析失败，请确认文件格式正确。");
        } finally {
            event.target.value = "";
        }
    };
    reader.readAsText(file, "utf-8");
}

function resetContent() {
    const shouldReset = globalThis.confirm("确认恢复默认内容吗？当前浏览器中的修改会被清空。");
    if (!shouldReset) return;

    state.content = structuredClone(defaultContent);
    persistContent();
    renderPage();
    fillEditor();
    restartCounter();
}

function persistContent() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.content));
}

function loadContent() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) return structuredClone(defaultContent);
        return mergeContent(JSON.parse(saved));
    } catch (_error) {
        return structuredClone(defaultContent);
    }
}

function mergeContent(input) {
    const merged = structuredClone(defaultContent);
    if (!input || typeof input !== "object") return merged;

    merged.siteTitle = input.siteTitle || merged.siteTitle;
    merged.anniversaryDate = input.anniversaryDate || merged.anniversaryDate;
    merged.footerText = input.footerText || merged.footerText;

    Object.assign(merged.counter, input.counter || {});
    Object.assign(merged.timeline, input.timeline || {});
    Object.assign(merged.gallery, input.gallery || {});
    Object.assign(merged.notes, input.notes || {});

    merged.hero = {
        ...merged.hero,
        ...(input.hero || {}),
        personA: {
            ...merged.hero.personA,
            ...((input.hero && input.hero.personA) || {})
        },
        personB: {
            ...merged.hero.personB,
            ...((input.hero && input.hero.personB) || {})
        }
    };

    if (Array.isArray(input.timelineItems)) merged.timelineItems = input.timelineItems;
    if (Array.isArray(input.galleryItems)) merged.galleryItems = input.galleryItems;
    if (Array.isArray(input.noteItems)) merged.noteItems = input.noteItems;

    return merged;
}

function fileToDataUrl(file) {
    if (!file) return Promise.resolve("");

    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
}

function escapeAttribute(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll('"', "&quot;");
}

function padNumber(value) {
    return String(value).padStart(2, "0");
}
