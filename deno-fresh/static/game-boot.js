// Firebase config
window.firebaseConfig = window.firebaseConfig || {
    apiKey: "AIzaSyAHY_agipyNEXvY2J4jDgnlk9kLeM6O37Y",
    authDomain: "evil-invaders.firebaseapp.com",
    databaseURL: "https://evil-invaders-default-rtdb.firebaseio.com",
    projectId: "evil-invaders",
    storageBucket: "evil-invaders.firebasestorage.app",
    messagingSenderId: "149257705855",
    appId: "1:149257705855:web:3f048481dfc66cef61224a",
};
window.__FIREBASE_CONFIG__ = window.__FIREBASE_CONFIG__ || window.firebaseConfig;
window.__FIREBASE_DATABASE_PATH__ = window.__FIREBASE_DATABASE_PATH__ || "leaderboards/globalHighScore";

// -----------------------------------------------------------------------
// How-to modal open/close
// -----------------------------------------------------------------------
window.howtoModalOpen = function () {
    var modal = document.getElementById("howtoModal");
    var iframe = document.getElementById("howtoIframe");
    if (!modal) return;
    if (iframe) iframe.src = "level-editor.html";
    modal.classList.add("visible");
};
window.howtoModalClose = function () {
    var modal = document.getElementById("howtoModal");
    var iframe = document.getElementById("howtoIframe");
    if (modal) modal.classList.remove("visible");
    if (iframe) iframe.src = "about:blank";
};

// -----------------------------------------------------------------------
// Orientation lock
// -----------------------------------------------------------------------
function lockPortrait() {
    if (window.screen && window.screen.orientation && window.screen.orientation.lock) {
        window.screen.orientation.lock("portrait").catch(function () {});
    }
}

// -----------------------------------------------------------------------
// Fullscreen helpers
// -----------------------------------------------------------------------
function enterFullscreen(element) {
    var el = element || document.documentElement;
    var rfs = el.requestFullscreen
        || el.webkitRequestFullscreen
        || el.msRequestFullscreen;
    if (!rfs) return;
    var promise = rfs.call(el, { navigationUI: "hide" });
    if (promise && promise.then) {
        promise.then(lockPortrait).catch(function () {});
    } else {
        lockPortrait();
    }
}

function isFullscreen() {
    return !!(document.fullscreenElement
        || document.webkitFullscreenElement
        || document.msFullscreenElement);
}

function onFullscreenChange() {
    if (!isFullscreen()) {
        setTimeout(function () {
            if (!isFullscreen()) {
                enterFullscreen(
                    document.querySelector("#phaser-canvas canvas")
                    || document.documentElement
                );
            }
        }, 300);
    }
}

if (document.fullscreenEnabled || document.webkitFullscreenEnabled) {
    document.addEventListener("fullscreenchange", onFullscreenChange, false);
    document.addEventListener("webkitfullscreenchange", onFullscreenChange, false);
}

// -----------------------------------------------------------------------
// Mobile audio unlock
// -----------------------------------------------------------------------
(function unlockAudioContext() {
    var allContexts = [];
    var unlocked = false;
    var OrigAC = window.AudioContext || window.webkitAudioContext;
    if (!OrigAC) return;

    function PatchedAC() {
        var ctx = new OrigAC();
        allContexts.push(ctx);
        return ctx;
    }
    PatchedAC.prototype = OrigAC.prototype;
    if (window.AudioContext) window.AudioContext = PatchedAC;
    if (window.webkitAudioContext) window.webkitAudioContext = PatchedAC;

    function resumeContext(ctx) {
        if (!ctx) return;
        if (ctx.state === "suspended" || ctx.state === "interrupted") {
            ctx.resume().catch(function () {});
        }
        try {
            var buf = ctx.createBuffer(1, 1, 22050);
            var src = ctx.createBufferSource();
            src.buffer = buf;
            src.connect(ctx.destination);
            if (src.start) { src.start(0); } else { src.noteOn(0); }
        } catch (e) {}
    }

    function unlock() {
        if (unlocked) return;
        unlocked = true;

        for (var i = 0; i < allContexts.length; i++) {
            resumeContext(allContexts[i]);
        }

        var game = window.__PHASER_4_GAME__;
        if (game && game.sound) {
            var ctx = game.sound.context || game.sound.audioContext;
            if (ctx) resumeContext(ctx);
            if (typeof game.sound.unlock === "function") {
                try { game.sound.unlock(); } catch (e) {}
            }
            if (game.sound.locked) game.sound.locked = false;
        }

        if (allContexts.length === 0) {
            resumeContext(new OrigAC());
        }

        var a = new Audio();
        a.src = "data:audio/mpeg;base64,/+NIxAAAAAANIAAAAAExBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV";
        a.play().catch(function(){});

        document.removeEventListener("touchstart", unlock, true);
        document.removeEventListener("touchend", unlock, true);
        document.removeEventListener("click", unlock, true);
        document.removeEventListener("pointerup", unlock, true);
    }

    document.addEventListener("touchstart", unlock, true);
    document.addEventListener("touchend", unlock, true);
    document.addEventListener("click", unlock, true);
    document.addEventListener("pointerup", unlock, true);
})();

// -----------------------------------------------------------------------
// Edge-swipe prevention
// -----------------------------------------------------------------------
(function preventEdgeSwipe() {
    var EDGE_PX = 30;
    document.addEventListener("touchstart", function (e) {
        if (!e.touches || e.touches.length === 0) return;
        var x = e.touches[0].clientX;
        var w = window.innerWidth;
        if (x < EDGE_PX || x > w - EDGE_PX) e.preventDefault();
    }, { passive: false, capture: true });
    document.addEventListener("touchmove", function (e) {
        if (!e.touches || e.touches.length === 0) return;
        var x = e.touches[0].clientX;
        var w = window.innerWidth;
        if (x < EDGE_PX || x > w - EDGE_PX) e.preventDefault();
    }, { passive: false, capture: true });
})();

// -----------------------------------------------------------------------
// Canvas FIT scaling — scales 256x480 to fill viewport
// -----------------------------------------------------------------------
function fitCanvas() {
    var pc = document.querySelector("#phaser-canvas canvas");
    if (!pc) return;
    var vw = window.innerWidth;
    var vh = window.innerHeight;
    var htmlTransform = window.getComputedStyle(document.documentElement).transform;
    var cssRotated = htmlTransform && htmlTransform !== "none";
    if (cssRotated && vw > vh) { var tmp = vw; vw = vh; vh = tmp; }
    var scale = Math.min(vw / 256, vh / 480);
    pc.style.width = Math.floor(256 * scale) + "px";
    pc.style.height = Math.floor(480 * scale) + "px";
}
window.addEventListener("resize", fitCanvas);
window.__fitCanvas = fitCanvas;

// Watch for Phaser canvas creation and auto-fit
(function observeCanvas() {
    var container = document.getElementById("phaser-canvas");
    if (!container) return;
    var obs = new MutationObserver(function (mutations) {
        for (var i = 0; i < mutations.length; i++) {
            for (var j = 0; j < mutations[i].addedNodes.length; j++) {
                if (mutations[i].addedNodes[j].tagName === "CANVAS") {
                    fitCanvas();
                    patchCanvasInputForRotation(mutations[i].addedNodes[j]);
                    obs.disconnect();
                    return;
                }
            }
        }
    });
    obs.observe(container, { childList: true });
})();

// -----------------------------------------------------------------------
// Fix Phaser hit-testing when CSS rotation is active
// -----------------------------------------------------------------------
function patchCanvasInputForRotation(canvas) {
    var htmlStyle = window.getComputedStyle(document.documentElement);
    if (!htmlStyle.transform || htmlStyle.transform === "none") return;

    var origBCR = HTMLElement.prototype.getBoundingClientRect;

    canvas.getBoundingClientRect = function () {
        var r = origBCR.call(canvas);
        return {
            left: r.top,
            top: window.innerHeight - r.right,
            right: r.bottom,
            bottom: window.innerHeight - r.left,
            width: r.height,
            height: r.width,
            x: r.top,
            y: window.innerHeight - r.right,
        };
    };

    var vh = window.innerHeight;
    function swapCoords(e) {
        var cx = e.clientX;
        var cy = e.clientY;
        Object.defineProperty(e, "clientX", { value: cy });
        Object.defineProperty(e, "clientY", { value: vh - cx });
    }
    var evts = ["pointerdown", "pointerup", "pointermove",
                "mousedown", "mouseup", "mousemove"];
    for (var i = 0; i < evts.length; i++) {
        canvas.addEventListener(evts[i], swapCoords, true);
    }
}

// Prevent back-navigation
window.addEventListener("popstate", function () {
    history.pushState(null, "", location.href);
});
history.pushState(null, "", location.href);

// -----------------------------------------------------------------------
// iOS Safari "Add to Home Screen" prompt
// -----------------------------------------------------------------------
(function iosInstallPrompt() {
    if (typeof navigator === "undefined") return;
    var ua = navigator.userAgent;
    var isIOS = /iPad|iPhone|iPod/.test(ua)
        || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    var isStandalone = window.navigator.standalone === true
        || window.matchMedia("(display-mode: standalone)").matches;
    if (!isIOS || isStandalone || window.cordova) return;
    try { if (localStorage.getItem("iosInstallDismissed")) return; } catch (e) {}
    setTimeout(function () {
        var banner = document.getElementById("iosInstallBanner");
        if (!banner) return;
        banner.style.display = "";
        var btn = document.getElementById("iosInstallDismiss");
        if (btn) {
            btn.addEventListener("click", function () {
                banner.style.display = "none";
                try { localStorage.setItem("iosInstallDismissed", "1"); } catch (e) {}
            }, false);
        }
        setTimeout(function () {
            if (banner.style.display !== "none") banner.style.display = "none";
        }, 15000);
    }, 2000);
})();

// -----------------------------------------------------------------------
// Boot the Phaser 4 game via ES module import
// -----------------------------------------------------------------------
(async function boot() {
    const { gameState } = await import("/src/shared/gameState.js");
    const { initializeFirebaseScores } = await import("/src/shared/firebaseScores.js");
    const { createPhaserGame } = await import("/src/phaser/PhaserGame.js");

    // Auto-hide Phaser audio load errors on iOS TestFlight
    (function hideAudioErrors() {
        function hideErrorElements() {
            var children = document.body.childNodes;
            for (var i = children.length - 1; i >= 0; i--) {
                var node = children[i];
                if (node.id === "baseUrl" || node.id === "phaser-canvas" ||
                    node.id === "iosInstallBanner" || node.id === "howtoModal" ||
                    node.tagName === "SCRIPT" || node.tagName === "LINK") {
                    continue;
                }
                var text = node.textContent || "";
                if (text.indexOf("ERR:") !== -1) {
                    if (node.style) node.style.display = "none";
                    if (node.nodeType === 3) node.textContent = "";
                }
            }
        }

        var timer = null;
        var observer = new MutationObserver(function () {
            if (timer) return;
            var bodyText = document.body.innerText || "";
            if (bodyText.indexOf("ERR:") !== -1) {
                timer = setTimeout(function () {
                    hideErrorElements();
                    observer.disconnect();
                }, 6700);
            }
        });

        observer.observe(document.body, { childList: true, subtree: true, characterData: true });
        setTimeout(function () { observer.disconnect(); }, 30000);
    })();

    function waitFor(ms) {
        return new Promise(function (resolve) { setTimeout(resolve, ms); });
    }

    if (new URLSearchParams(window.location.search).get("lowmode") === "1") {
        gameState.lowModeFlg = true;
    }

    function checkEditorAtlases() {
        var keys = ["game_ui", "game_asset", "title_ui"];
        var checks = keys.map(function (k) {
            return fetch("/assets/_" + k + ".json", { method: "HEAD" })
                .then(function (r) { return r.ok ? k : null; })
                .catch(function () { return null; });
        });
        return Promise.all(checks).then(function (results) {
            var found = {};
            results.forEach(function (k) { if (k) found[k] = true; });
            window.__editorAtlases = found;
        });
    }

    Promise.race([
        initializeFirebaseScores().catch(function () {}),
        waitFor(1500),
    ]).then(function () {
        return checkEditorAtlases();
    }).then(function () {
        createPhaserGame();
        fitCanvas();
    });
})();
