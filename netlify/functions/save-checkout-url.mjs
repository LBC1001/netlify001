import { getStore } from "@netlify/blobs";

export default async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const body = await req.json();
    const { submission_id, checkout_url } = body;

    if (!submission_id || !checkout_url) {
      return new Response(
        JSON.stringify({ error: "Missing submission_id or checkout_url" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    const store = getStore("checkout-links");
    await store.set(submission_id, checkout_url);

    return new Response(
      JSON.stringify({ ok: true }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: String(err) }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
};