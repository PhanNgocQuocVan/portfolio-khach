// lib/youtube.ts — dùng chung ở mọi nơi cần embed YouTube

export function toYouTubeEmbed(url: string): string {
  try {
    const u = new URL(url);
    if (u.pathname.startsWith("/embed/")) return url;
    if (u.hostname === "youtu.be")
      return `https://www.youtube.com/embed${u.pathname}`;
    if (u.pathname.startsWith("/shorts/"))
      return `https://www.youtube.com/embed/${u.pathname.replace("/shorts/", "")}`;
    const v = u.searchParams.get("v");
    if (v) return `https://www.youtube.com/embed/${v}`;
  } catch {}
  return url;
}
