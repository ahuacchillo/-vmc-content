import { publishImage } from "../../../lib/instagram.mjs";

export async function POST(req) {
  const { imageUrl, caption } = await req.json();
  try {
    const id = await publishImage({
      igId: process.env.IG_USER_ID,
      token: process.env.IG_ACCESS_TOKEN,
      imageUrl,
      caption,
    });
    return Response.json({ ok: true, id });
  } catch (e) {
    return Response.json({ ok: false, error: e.message }, { status: 400 });
  }
}
