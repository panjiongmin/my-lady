const {
    loadContent,
    loadSharedContentFromUrl,
    escapeHtml,
    escapeAttribute
} = globalThis.LoveSiteData;

const state = {
    content: loadSharedContentFromUrl() || loadContent()
};

const dom = {};
let counterTimer = null;
let gsapContext = null;

document.addEventListener("DOMContentLoaded", () => {
    cacheDom();
    renderPage();
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

function initGsapAnimations() {
    if (!globalThis.gsap) return;
    if (globalThis.ScrollTrigger) {
        globalThis.gsap.registerPlugin(globalThis.ScrollTrigger);
    }
    buildGsapAnimations();
}

function refreshGsapAnimations() {
    if (!globalThis.gsap) return;
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

        gsap.timeline({ defaults: { ease: "power3.out" } })
            .from(".hero__decor .sticker", { y: 30, scale: 0.75, opacity: 0, duration: 1, stagger: 0.08 })
            .from("#hero-badge, #hero-title, #hero-subtitle, #hero-description", { y: 36, opacity: 0, duration: 0.9, stagger: 0.12 }, "-=0.6")
            .from(".hero__actions .button", { y: 20, opacity: 0, duration: 0.7, stagger: 0.12 }, "-=0.45")
            .from(".person-card, .hero__heart", { y: 22, scale: 0.92, opacity: 0, duration: 0.8, stagger: 0.12 }, "-=0.45")
            .from(".hero__mascot-strip .mascot-pill", { y: 14, opacity: 0, duration: 0.45, stagger: 0.07 }, "-=0.4");

        gsap.to(".hero__decor--top-left .sticker", { y: -12, x: 8, rotate: 6, duration: 2.4, repeat: -1, yoyo: true, stagger: 0.18, ease: "sine.inOut" });
        gsap.to(".hero__decor--top-right .sticker, .hero__decor--bottom .sticker", { y: 10, x: -6, rotate: -4, duration: 2.8, repeat: -1, yoyo: true, stagger: 0.15, ease: "sine.inOut" });
        gsap.to(".mascot-pill", { y: -8, duration: 1.8, repeat: -1, yoyo: true, stagger: 0.1, ease: "sine.inOut" });

        if (!ScrollTrigger) return;

        gsap.from(".counter-card", {
            scrollTrigger: { trigger: ".section--counter", start: "top 82%" },
            y: 38,
            opacity: 0,
            scale: 0.9,
            duration: 0.8,
            stagger: 0.12,
            ease: "back.out(1.4)"
        });

        gsap.utils.toArray(".timeline-card").forEach((card, index) => {
            gsap.from(card, {
                scrollTrigger: { trigger: card, start: "top 84%" },
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
                scrollTrigger: { trigger: card, start: "top 88%" },
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
                scrollTrigger: { trigger: card, start: "top 88%" },
                y: 30,
                opacity: 0,
                scale: 0.9,
                rotate: index % 2 === 0 ? -4 : 4,
                duration: 0.75,
                ease: "power2.out"
            });
        });

        gsap.utils.toArray(".section__ornament").forEach((ornament, index) => {
            gsap.to(ornament, { y: index % 2 === 0 ? -18 : 18, x: index % 2 === 0 ? 10 : -10, duration: 3.2, repeat: -1, yoyo: true, ease: "sine.inOut" });
        });

        ScrollTrigger.refresh();
    });
}

function startCounter() {
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

function padNumber(value) {
    return String(value).padStart(2, "0");
}
