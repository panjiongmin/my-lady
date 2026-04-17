(function () {
    const STORAGE_KEY = "our-love-site-content-v2";

    const defaultContent = {
        siteTitle: "我们的恋爱小站",
        hero: {
            badge: "FOR THE TWO OF US",
            title: "把心动、纪念日和想念，都认真留在这里。",
            subtitle: "这是属于我们的小世界，慢慢收集每一次见面、每一句想念、每一张照片。",
            description: "现在支持把内容保存到 Supabase 云端。你上传的图片和文字，只要保存成功，对方打开网站就能看到最新内容。",
            backgroundImage: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1600&q=80",
            personA: {
                name: "男主角",
                image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80"
            },
            personB: {
                name: "女主角",
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

    function loadLocalContent() {
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
        loadLocalContent,
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
