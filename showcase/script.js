// Configuration
const MAIN_DEMO_VIDEO_URL = "https://youtu.be/-OnnS_Dqfr4";

// Utility: extract YouTube video ID from any YouTube URL format
function getYouTubeVideoId(videoUrl) {
  try {
    const parsedUrl = new URL(videoUrl);
    const hostname = parsedUrl.hostname.replace(/^www\./, "");
    let videoId = "";
    if (hostname === "youtu.be") {
      videoId = parsedUrl.pathname.slice(1).split("/")[0];
    } else if (
      ["youtube.com", "m.youtube.com", "youtube-nocookie.com"].includes(hostname)
    ) {
      videoId =
        parsedUrl.searchParams.get("v") ||
        parsedUrl.pathname.match(/^\/(?:embed|shorts)\/([^/]+)/)?.[1] ||
        "";
    }
    return /^[\w-]{11}$/.test(videoId) ? videoId : "";
  } catch {
    return "";
  }
}

// ============================================================
// VIDEO EMBED + GRADUAL VOLUME RAMP
// ============================================================
//
// FIX FOR ERROR 153:
// The previous approach used:
//   new YT.Player(divId, { videoId: "..." })
// This constructs the embed URL internally and can produce Error 153
// with certain player configurations.
//
// The correct approach is to build a plain <iframe> using the
// /embed/ URL directly, then attach the IFrame API to that
// existing iframe purely for volume control.
//
const demoVideoId = getYouTubeVideoId(MAIN_DEMO_VIDEO_URL);
const demoStage = document.querySelector("#demo-video-stage");

if (demoVideoId && demoStage) {

  // 1. Build a plain <iframe> with the correct embed URL
  const params = new URLSearchParams({
    autoplay:    "1",
    mute:        "1",   // required for browsers to permit autoplay
    controls:    "1",
    rel:         "0",
    playsinline: "1",
    enablejsapi: "1",   // needed for IFrame API volume control
    origin:      location.origin,
  });

  const iframe = document.createElement("iframe");
  iframe.id              = "yt-player-iframe";
  iframe.src             = "https://www.youtube.com/embed/" + demoVideoId + "?" + params;
  iframe.title           = "BODH main demonstration video";
  iframe.allow           = "autoplay; encrypted-media; picture-in-picture; web-share";
  iframe.allowFullscreen = true;
  iframe.loading         = "eager";
  iframe.referrerPolicy  = "strict-origin-when-cross-origin";
  iframe.style.cssText   = "position:absolute;inset:0;width:100%;height:100%;border:0;display:block;";

  // Hide the static placeholder
  const placeholder = document.querySelector("#demo-video-placeholder");
  if (placeholder) placeholder.style.display = "none";

  // Make demoStage a positioning context, insert the iframe
  demoStage.style.position = "relative";
  demoStage.appendChild(iframe);

  // 2. Load the IFrame API — it will attach to the existing iframe for
  //    volume control only. No new embed is created, so no Error 153.
  const apiScript = document.createElement("script");
  apiScript.src = "https://www.youtube.com/iframe_api";
  document.head.appendChild(apiScript);

  window.onYouTubeIframeAPIReady = function () {
    let rampStarted = false;

    new YT.Player("yt-player-iframe", {   // attaches to the existing iframe
      events: {
        onReady: function (event) {
          // Nudge playback in case the browser needed the API-ready signal
          event.target.playVideo();
        },
        onStateChange: function (event) {
          // Run the volume ramp exactly once on the first real playback start
          if (!rampStarted && event.data === YT.PlayerState.PLAYING) {
            rampStarted = true;

            var TARGET_VOLUME = 70;   // 0-100
            var RAMP_STEPS    = 20;
            var RAMP_INTERVAL = 300;  // ms — 20 x 300 ms = 6 s total ramp
            var INITIAL_DELAY = 2000; // 2 s of silence before volume starts rising

            var playerRef = event.target;

            setTimeout(function () {
              if (playerRef.getPlayerState() !== YT.PlayerState.PLAYING) return;
              var step = 0;
              var ramp = setInterval(function () {
                step++;
                playerRef.setVolume(Math.min(Math.round((TARGET_VOLUME / RAMP_STEPS) * step), TARGET_VOLUME));
                if (step >= RAMP_STEPS) clearInterval(ramp);
              }, RAMP_INTERVAL);
            }, INITIAL_DELAY);
          }
        },
      },
    });
  };
}

// Demo section reveal animation (preserves existing .demo-reveal behaviour)
const demoSection = document.querySelector(".demo-section");
if (demoSection && "IntersectionObserver" in window) {
  demoSection.classList.add("demo-reveal");
  const demoObserver = new IntersectionObserver(
    function (entries) {
      if (entries.some(function (entry) { return entry.isIntersecting; })) {
        demoSection.classList.add("is-visible");
        demoObserver.disconnect();
      }
    },
    { threshold: 0.12 }
  );
  demoObserver.observe(demoSection);
}

// About panel (desktop drawer)
const aboutToggle = document.querySelector("#about-toggle");
const aboutPanel  = document.querySelector("#about-panel");
const aboutClose  = document.querySelector(".about-close");

function closeAboutPanel() {
  aboutPanel.classList.remove("is-open");
  aboutToggle.setAttribute("aria-expanded", "false");
  (window.matchMedia("(max-width: 760px)").matches ? menuToggle : aboutToggle).focus();
}

aboutToggle.addEventListener("click", function (event) {
  if (!window.matchMedia("(max-width: 760px)").matches) return;
  event.preventDefault();
  aboutPanel.classList.add("is-open");
  aboutToggle.setAttribute("aria-expanded", "true");
});

aboutClose.addEventListener("click", closeAboutPanel);

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape" && aboutPanel.classList.contains("is-open")) {
    closeAboutPanel();
  }
});

// Mobile navigation menu
const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".nav-links");

menuToggle.addEventListener("click", function () {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  menuToggle.setAttribute(
    "aria-label",
    isExpanded ? "Open navigation menu" : "Close navigation menu"
  );
  navigation.classList.toggle("is-open", !isExpanded);
});

navigation.addEventListener("click", function (event) {
  if (event.target.closest("a")) {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
    navigation.classList.remove("is-open");
    if (
      event.target.closest("#about-toggle") &&
      aboutPanel.classList.contains("is-open")
    ) {
      setTimeout(function () { aboutClose.focus({ preventScroll: true }); }, 0);
    }
  }
});
