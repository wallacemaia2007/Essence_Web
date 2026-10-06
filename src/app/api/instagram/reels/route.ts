import { NextResponse } from "next/server";

type MetaInstagramMedia = {
  id: string;
  caption?: string;
  media_type?: "CAROUSEL_ALBUM" | "IMAGE" | "VIDEO";
  media_product_type?: "AD" | "FEED" | "STORY" | "REELS";
  media_url?: string;
  thumbnail_url?: string;
  permalink?: string;
  timestamp?: string;
  username?: string;
};

type MetaInstagramResponse = {
  data?: MetaInstagramMedia[];
  paging?: { cursors?: { after?: string } };
};

const GRAPH_API_VERSION = "v26.0";
const REVALIDATE_SECONDS = 15 * 60;
const MAX_MEDIA_PAGES = 6;
const PAGE_SIZE = 50;

export async function GET() {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN?.trim();
  const instagramUserId = process.env.INSTAGRAM_USER_ID?.trim();

  if (!accessToken || !instagramUserId || !/^\d+$/.test(instagramUserId)) {
    return NextResponse.json({ configured: false, reels: [] });
  }

  const mediaEndpoint = new URL(
    `https://graph.facebook.com/${GRAPH_API_VERSION}/${instagramUserId}/media`,
  );
  const query = new URLSearchParams({
    access_token: accessToken,
    fields:
      "id,caption,media_type,media_product_type,media_url,thumbnail_url,permalink,timestamp,username",
    limit: String(PAGE_SIZE),
  });
  const abortSignal = AbortSignal.timeout(12_000);
  const reels: MetaInstagramMedia[] = [];
  let after: string | undefined;

  try {
    for (let page = 0; page < MAX_MEDIA_PAGES && reels.length < 3; page += 1) {
      const pageUrl = new URL(mediaEndpoint);
      pageUrl.search = query.toString();
      if (after) pageUrl.searchParams.set("after", after);

      const response = await fetch(pageUrl, {
        headers: { Accept: "application/json" },
        next: { revalidate: REVALIDATE_SECONDS },
        signal: abortSignal,
      });

      if (!response.ok) {
        // Do not log the URL: Meta requires the access token as a query parameter.
        console.error(
          "[Instagram API] Meta returned a non-success status",
          response.status,
        );
        return NextResponse.json(
          { configured: true, reels: [] },
          { status: 502 },
        );
      }

      const payload = (await response.json()) as MetaInstagramResponse;
      reels.push(
        ...(payload.data ?? []).filter(
          (media) =>
            media.media_product_type === "REELS" && Boolean(media.permalink),
        ),
      );
      after = payload.paging?.cursors?.after;
      if (!after) break;
    }

    const latestReels = reels
      .sort((left, right) => {
        const leftTime = Date.parse(left.timestamp ?? "") || 0;
        const rightTime = Date.parse(right.timestamp ?? "") || 0;
        return rightTime - leftTime;
      })
      .slice(0, 3)
      .map((media) => ({
        id: media.id,
        caption: media.caption ?? null,
        permalink: media.permalink as string,
        timestamp: media.timestamp ?? null,
        thumbnailUrl: media.thumbnail_url ?? null,
      }));

    return NextResponse.json({ configured: true, reels: latestReels });
  } catch {
    console.error("[Instagram API] Could not retrieve media from Meta");
    return NextResponse.json({ configured: true, reels: [] }, { status: 502 });
  }
}
