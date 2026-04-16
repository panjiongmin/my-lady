(function () {
    const STORAGE_KEY = "our-love-site-content-v1";

    const defaultContent = {
        siteTitle: "Our Love Story",
        hero: {
            badge: "FOR THE TWO OF US",
            title: "A little place for every moment we keep choosing each other.",
            subtitle: "From first hellos to ordinary evenings, this page keeps the memories, photos, and notes that make your story feel like home.",
            description: "Edit the content, save it in the browser, or share it with a link so the same story can be opened on another device.",
            backgroundImage: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1600&q=80",
            personA: {
                name: "Alex",
                image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80"
            },
            personB: {
                name: "Mia",
                image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80"
            }
        },
        counter: {
            title: "Time We Have Loved",
            description: "A live counter for the days, hours, minutes, and seconds since your anniversary began."
        },
        anniversaryDate: "2024-05-20T20:00",
        timeline: {
            title: "Our Timeline",
            description: "A few chapters that turned into the story you are still writing together."
        },
        timelineItems: [
            {
                date: "2024.03.18",
                title: "The First Real Conversation",
                description: "A message turned into a late-night chat, and suddenly time felt a little lighter."
            },
            {
                date: "2024.05.20",
                title: "The Day We Made It Official",
                description: "You chose a date to remember, and everything after that started feeling like a shared future."
            },
            {
                date: "2024.08.12",
                title: "A Favorite Day Out",
                description: "Photos, snacks, a long walk, and the kind of calm that only happens with the right person."
            }
        ],
        gallery: {
            title: "Photo Album",
            description: "Small snapshots of trips, quiet dates, and the ordinary scenes worth keeping."
        },
        galleryItems: [
            {
                title: "Golden Hour Walk",
                description: "The light was soft, the road was quiet, and everything felt easy.",
                image: "https://images.unsplash.com/photo-1511988617509-a57c8a288659?auto=format&fit=crop&w=900&q=80"
            },
            {
                title: "Weekend Coffee Date",
                description: "A slow afternoon, two drinks, and stories that kept stretching past sunset.",
                image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80"
            },
            {
                title: "City Lights",
                description: "One of those nights that looked simple in photos but felt unforgettable in person.",
                image: "https://images.unsplash.com/photo-1516589091380-5d8e87df6999?auto=format&fit=crop&w=900&q=80"
            }
        ],
        notes: {
            title: "Love Notes",
            description: "A few words for the moments when photos are not enough and feelings deserve a place to stay."
        },
        noteItems: [
            {
                title: "Thank You for the Ordinary Days",
                content: "You make routine days softer, funnier, and much more meaningful than they used to be."
            },
            {
                title: "You Still Surprise Me",
                content: "Even now, there are new little things about you that keep me curious and grateful."
            },
            {
                title: "For the Next Chapter",
                content: "No matter how busy life gets, I hope we keep building something gentle, brave, and real together."
            }
        ],
        footerText: "Love is built in ordinary days, one memory at a time."
    };

    function mergeContent(input) {
        const merged = structuredClone(defaultContent);
        if (!input || typeof input !== "object") {
            return merged;
        }

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

    function loadContent() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (!saved) return structuredClone(defaultContent);
            return mergeContent(JSON.parse(saved));
        } catch (_error) {
            return structuredClone(defaultContent);
        }
    }

    function persistContent(content) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
    }

    function encodeSharePayload(content) {
        const json = JSON.stringify(content);
        const bytes = new TextEncoder().encode(json);
        let binary = "";

        bytes.forEach((byte) => {
            binary += String.fromCharCode(byte);
        });

        return btoa(binary)
            .replaceAll("+", "-")
            .replaceAll("/", "_")
            .replaceAll("=", "");
    }

    function decodeSharePayload(payload) {
        if (!payload) return null;

        try {
            const normalized = payload
                .replaceAll("-", "+")
                .replaceAll("_", "/")
                .padEnd(Math.ceil(payload.length / 4) * 4, "=");
            const binary = atob(normalized);
            const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
            const json = new TextDecoder().decode(bytes);
            return mergeContent(JSON.parse(json));
        } catch (_error) {
            return null;
        }
    }

    function buildShareUrl(content, page = "index.html") {
        const url = new URL(page, globalThis.location.href);
        url.hash = `share=${encodeSharePayload(content)}`;
        return url.toString();
    }

    function loadSharedContentFromUrl() {
        const hash = String(globalThis.location.hash || "").replace(/^#/, "");
        const params = new URLSearchParams(hash);
        return decodeSharePayload(params.get("share"));
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

    globalThis.LoveSiteData = {
        STORAGE_KEY,
        defaultContent,
        mergeContent,
        loadContent,
        persistContent,
        encodeSharePayload,
        decodeSharePayload,
        buildShareUrl,
        loadSharedContentFromUrl,
        fileToDataUrl,
        escapeHtml,
        escapeAttribute
    };
})();
