document.addEventListener("DOMContentLoaded", () => {
    const videosContainer = document.getElementById("youtube-videos");

    if (!videosContainer) {
        return;
    }

    const channelId = "UCsBi9Otx4roig-RqbHsEftA";
    const numberOfVideos = 10;

    const youtubeFeedUrl =
        `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;

    const rssToJsonUrl =
        `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(youtubeFeedUrl)}`;

    fetch(rssToJsonUrl)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Feed request failed: ${response.status}`);
            }

            return response.json();
        })
        .then((data) => {
            if (data.status !== "ok" || !Array.isArray(data.items)) {
                throw new Error("The YouTube feed returned no usable videos.");
            }

            const videos = data.items.slice(0, numberOfVideos);

            if (videos.length === 0) {
                throw new Error("No videos were found.");
            }

            videosContainer.innerHTML = "";

            videos.forEach((video) => {
                const videoId = getYouTubeVideoId(video.link);

                if (!videoId) {
                    return;
                }

                const videoCard = createVideoCard(video, videoId);
                videosContainer.appendChild(videoCard);
            });

            if (!videosContainer.children.length) {
                throw new Error("No valid YouTube videos were found.");
            }
        })
        .catch((error) => {
            console.error("Unable to load YouTube videos:", error);

            videosContainer.innerHTML = `
                <div class="videos-error">
                    <p>
                        Enzo's latest video evidence could not be loaded
                        at the moment.
                    </p>

                    <a
                        href="https://www.youtube.com/channel/${channelId}"
                        class="youtube-button"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <i class="fa-brands fa-youtube"></i>
                        Visit Enzo on YouTube
                    </a>
                </div>
            `;
        });


    function getYouTubeVideoId(videoUrl) {
        try {
            const url = new URL(videoUrl);

            if (url.hostname === "youtu.be") {
                return url.pathname.slice(1);
            }

            if (url.pathname.startsWith("/shorts/")) {
                return url.pathname.split("/shorts/")[1];
            }

            if (url.pathname.startsWith("/embed/")) {
                return url.pathname.split("/embed/")[1];
            }

            return url.searchParams.get("v");
        } catch (error) {
            console.error("Invalid YouTube URL:", videoUrl);
            return null;
        }
    }


    function createVideoCard(video, videoId) {
        const article = document.createElement("article");
        article.className = "video-card";

        const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
        const thumbnailUrl =
            `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;

        article.innerHTML = `
            <a
                href="${videoUrl}"
                class="video-card-link"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Watch ${escapeHtml(video.title)} on YouTube"
            >
                <div class="latest-video-thumbnail">

                    <img
                        src="${thumbnailUrl}"
                        alt=""
                        loading="lazy"
                        onerror="this.src='https://i.ytimg.com/vi/${videoId}/hqdefault.jpg'"
                    >

                    <span class="latest-video-play" aria-hidden="true">
                        <i class="fa-solid fa-play"></i>
                    </span>

                    <span class="latest-video-youtube" aria-hidden="true">
                        Watch on
                        <i class="fa-brands fa-youtube"></i>
                        YouTube
                    </span>

                </div>

                <h3 class="latest-video-title">
                    ${escapeHtml(video.title)}
                </h3>
            </a>
        `;

        return article;
    }


    function formatVideoDate(dateString) {
        const date = new Date(dateString);

        if (Number.isNaN(date.getTime())) {
            return "Recently uploaded";
        }

        return new Intl.DateTimeFormat("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric"
        }).format(date);
    }


    function escapeHtml(text = "") {
        return text
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }
});