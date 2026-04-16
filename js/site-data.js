(function () {
    const STORAGE_KEY = "our-love-site-content-v1";
    const REPOSITORY_CONTENT_PATH = "data/site-content.json";

    const defaultContent = {
        siteTitle: "我们的恋爱小站",
        hero: {
            badge: "只属于我们的故事",
            title: "把心动、纪念日和想念，都认真留在这里。",
            subtitle: "这里是属于我们的恋爱角落，记录相遇、陪伴、惊喜和那些平凡却闪闪发光的日常。",
            description: "你可以在编辑页修改文字和图片，保存到本地，或者生成分享链接，让对方也能看到同样的内容。",
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
            description: "从确定心意的那一刻开始，往后的每一天、每一小时、每一分钟都值得被珍藏。"
        },
        anniversaryDate: "2024-05-20T20:00",
        timeline: {
            title: "我们的故事线",
            description: "从第一次认真聊天，到后来的每一次靠近，这些瞬间慢慢变成了我们的故事。"
        },
        timelineItems: [
            {
                date: "2024.03.18",
                title: "第一次聊到舍不得说晚安",
                description: "原本只是随口说几句，后来却越聊越晚，像是故事从那天开始悄悄按下了开始键。"
            },
            {
                date: "2024.05.20",
                title: "正式在一起",
                description: "这一天有了特别的名字，也让以后的日子都多了一层温柔又坚定的意义。"
            },
            {
                date: "2024.08.12",
                title: "一次难忘的约会",
                description: "一起散步、拍照、吃喜欢的东西，原来和对的人在一起，连平常的一天都会发光。"
            }
        ],
        gallery: {
            title: "回忆相册",
            description: "把那些值得反复翻看的瞬间都放进来，留给以后慢慢回味。"
        },
        galleryItems: [
            {
                title: "傍晚散步",
                description: "天色刚刚好，风也很温柔，和你一起走的路总会变得特别一点。",
                image: "https://images.unsplash.com/photo-1511988617509-a57c8a288659?auto=format&fit=crop&w=900&q=80"
            },
            {
                title: "周末咖啡约会",
                description: "一杯咖啡，一整个下午，还有那些怎么都聊不完的话题。",
                image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80"
            },
            {
                title: "夜晚的城市灯光",
                description: "照片也许拍不出当时的心情，但那一晚的心动会一直记得。",
                image: "https://images.unsplash.com/photo-1516589091380-5d8e87df6999?auto=format&fit=crop&w=900&q=80"
            }
        ],
        notes: {
            title: "想对你说的话",
            description: "有些话不一定每天都说出口，但我想把它们认真地留在这里。"
        },
        noteItems: [
            {
                title: "谢谢你出现",
                content: "谢谢你把普通的日子变得值得期待，也谢谢你让我的生活里多了很多温柔和开心。"
            },
            {
                title: "和你在一起很安心",
                content: "你的陪伴总会让我觉得很踏实，好像很多烦恼在你身边都会慢慢变轻。"
            },
            {
                title: "以后也请多多指教",
                content: "不管未来会遇到什么，我都想和你一起慢慢走，把喜欢过成很久很久的日常。"
            }
        ],
        footerText: "喜欢不是一瞬间的热闹，而是很多普通日子里的认真陪伴。"
    };

    function mergeContentWithBase(baseContent, input) {
        const merged = structuredClone(baseContent);
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

    function mergeContent(input) {
        return mergeContentWithBase(defaultContent, input);
    }

    async function loadRepositoryContent() {
        if (typeof globalThis.fetch !== "function") {
            return structuredClone(defaultContent);
        }

        try {
            const response = await globalThis.fetch(REPOSITORY_CONTENT_PATH, { cache: "no-store" });
            if (!response.ok) {
                return structuredClone(defaultContent);
            }

            return mergeContent(await response.json());
        } catch (_error) {
            return structuredClone(defaultContent);
        }
    }

    async function loadContent() {
        const repositoryContent = await loadRepositoryContent();

        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (!saved) return repositoryContent;
            return mergeContentWithBase(repositoryContent, JSON.parse(saved));
        } catch (_error) {
            return repositoryContent;
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
        REPOSITORY_CONTENT_PATH,
        defaultContent,
        mergeContent,
        loadRepositoryContent,
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
