const YOUTUBE_ID_PATTERN = /^[a-zA-Z0-9_-]{11}$/;

function isValidYouTubeId(id: string | undefined): id is string {
  return Boolean(id && YOUTUBE_ID_PATTERN.test(id));
}

export function extractYouTubeId(url: string | undefined): string | null {
  if (!url) {
    return null;
  }

  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "").toLowerCase();

    if (host === "youtu.be") {
      const id = parsed.pathname.split("/").filter(Boolean)[0];
      return isValidYouTubeId(id) ? id : null;
    }

    const youtubeHosts = new Set([
      "youtube.com",
      "m.youtube.com",
      "music.youtube.com",
      "youtube-nocookie.com",
    ]);

    if (!youtubeHosts.has(host)) {
      return null;
    }

    const videoParam = parsed.searchParams.get("v");
    if (isValidYouTubeId(videoParam ?? undefined)) {
      return videoParam;
    }

    const parts = parsed.pathname.split("/").filter(Boolean);
    const nestedId = parts[0] === "shorts" || parts[0] === "embed" || parts[0] === "live"
      ? parts[1]
      : undefined;

    return isValidYouTubeId(nestedId) ? nestedId : null;
  } catch {
    return null;
  }
}

export function getYouTubeEmbedUrl(url: string | undefined): string | null {
  const id = extractYouTubeId(url);
  return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
}

export function getYouTubeWatchUrl(url: string | undefined): string | null {
  const id = extractYouTubeId(url);
  return id ? `https://www.youtube.com/watch?v=${id}` : null;
}

export function getYouTubeThumbnail(url: string | undefined): string | null {
  const id = extractYouTubeId(url);
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null;
}
