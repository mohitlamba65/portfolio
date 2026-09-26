import { getNavbarAvatarIcon } from "@/lib/site-icon";

export const dynamic = "force-dynamic";
export const size = { width: 32, height: 32 };

export default async function Icon() {
  const { body, contentType } = await getNavbarAvatarIcon();
  return new Response(new Uint8Array(body), {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
