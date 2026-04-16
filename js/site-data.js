(function () {
    const STORAGE_KEY = "our-love-site-content-v1";

    const defaultContent = {
        siteTitle: "鎴戜滑鐨勬亱鐖卞皬绔?,
        hero: {
            badge: "FOR THE TWO OF US",
            title: "鎶婂績鍔ㄣ€佺邯蹇垫棩鍜屾兂蹇碉紝閮界暀鍦ㄨ繖閲屻€?,
            subtitle: "杩欐槸灞炰簬鎴戜滑鐨勫皬涓栫晫锛屽儚涓€鏈細鍙戝厜鐨勭邯蹇靛唽锛屾參鎱㈡敹闆嗘瘡涓€娆¤闈€佹瘡涓€鍙ユ兂蹇点€佹瘡涓€寮犵収鐗囥€?,
            description: "椤甸潰鏀寔鍓嶇缂栬緫銆佺浉鍐屾洿鏂般€佹枃瀛楄皟鏁村拰 JSON 瀵煎叆瀵煎嚭銆備綘鍙互鎶婂畠褰撲綔涓€涓暱鏈熸洿鏂扮殑鎯呬荆涓婚〉銆?,
            backgroundImage: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1600&q=80",
            personA: {
                name: "浠?,
                image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80"
            },
            personB: {
                name: "濂?,
                image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80"
            }
        },
        counter: {
            title: "鎴戜滑宸茬粡鍦ㄤ竴璧?,
            description: "浠庨偅涓喅瀹氳蛋鍚戝郊姝ょ殑鏃ュ瓙寮€濮嬶紝姣忎竴鍒嗘瘡涓€绉掗兘鍊煎緱琚鐪熺邯蹇点€?
        },
        anniversaryDate: "2024-05-20T20:00",
        timeline: {
            title: "鎴戜滑鐨勬晠浜嬬嚎",
            description: "浠庡垵瑙侊紝鍒扮啛鎮夛紝鍒颁竴娆℃鍧氬畾鍦伴€夋嫨褰兼銆?
        },
        timelineItems: [
            {
                date: "2024.03.18",
                title: "绗竴娆¤鐪熻亰澶?,
                description: "鍘熸湰鍙槸闅忔剰璇村嚑鍙ワ紝鍚庢潵鍗磋秺鑱婅秺鑸嶄笉寰楃粨鏉燂紝閭ｄ竴澶╁儚鏄晠浜嬬湡姝ｅ紑濮嬬殑鎸夐挳銆?
            },
            {
                date: "2024.05.20",
                title: "姝ｅ紡鍦ㄤ竴璧?,
                description: "绾康鏃ヤ粠杩欏ぉ寮€濮嬫湁浜嗗悕瀛楋紝鎴戜滑涔熶粠姝ゅ彉鎴愪簡褰兼鐢熸椿閲屾渶鐗瑰埆鐨勪汉銆?
            },
            {
                date: "2024.08.12",
                title: "绗竴娆℃梾琛?,
                description: "涓€璧风湅椋庢櫙銆佷竴璧疯蛋闄岀敓鐨勮矾锛屽悗鏉ュ彂鐜帮紝鏈€鍠滄鐨勫叾瀹炰笉鏄煄甯傦紝鑰屾槸浣犲湪韬竟銆?
            }
        ],
        gallery: {
            title: "琚繚瀛樹笅鏉ョ殑鐬棿",
            description: "鐓х墖涔熻浼氭ā绯婏紝浣嗛偅涓€鍒荤殑蹇冩儏浼氫竴鐩磋璁板緱銆?
        },
        galleryItems: [
            {
                title: "鍌嶆櫄鏁ｆ",
                description: "璺伅鍒氫寒鐨勬椂鍊欙紝鎴戜滑鎱㈡參璧板洖瀹躲€?,
                image: "https://images.unsplash.com/photo-1511988617509-a57c8a288659?auto=format&fit=crop&w=900&q=80"
            },
            {
                title: "涓€璧风湅娴?,
                description: "椋庡緢澶э紝璇濆緢灏戯紝浣嗗績闈犲緱寰堣繎銆?,
                image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80"
            },
            {
                title: "鍜栧暋搴楃害浼?,
                description: "鏅€氱殑涓€澶╋紝鍥犱负浣犲彉寰楅棯闂彂浜€?,
                image: "https://images.unsplash.com/photo-1516589091380-5d8e87df6999?auto=format&fit=crop&w=900&q=80"
            }
        ],
        notes: {
            title: "鍐欑粰褰兼鐨勮瘽",
            description: "鍙互鏀炬棩甯哥纰庡康銆佺邯蹇垫棩鐣欒█銆佹兂璇村嵈娌℃潵寰楀強璇村嚭鍙ｇ殑璇濄€?
        },
        noteItems: [
            {
                title: "璋㈣阿浣犲嚭鐜?,
                content: "璋㈣阿浣犳妸娓╂煍銆佽€愬績鍜屽亸鐖遍兘缁欎簡鎴戯紝涔熻寰堝鍘熸湰鏅€氱殑鏃ュ瓙寮€濮嬫湁浜嗘湡寰呫€?
            },
            {
                title: "涓嬫鎯充竴璧峰仛鐨勪簨",
                content: "鎯充竴璧锋媿鏂扮殑鐓х墖銆佸悆涓€瀹舵病鍘昏繃鐨勫皬搴椼€佺湅澶滄櫙锛屽啀鎶婇偅涓€澶╄鐪熷啓杩涜繖閲屻€?
            },
            {
                title: "浠ュ悗涔熻澶氭寚鏁?,
                content: "濡傛灉鍋跺皵浼氶椆鍒壄锛屼篃璇峰埆杞绘槗鏀惧紑鎴戠殑鎵嬨€傛垜浠竴璧锋妸鏃ュ瓙杩囨垚鍠滄鐨勬牱瀛愩€?
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
