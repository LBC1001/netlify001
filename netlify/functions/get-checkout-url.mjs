import { getStore } from "@netlify/blobs";

export default async (req) => {
  try {
    const url = new URL(req.url);
    const submissionId = url.searchParams.get("submission_id");

    if (!submissionId) {
      return new Response(
        JSON.stringify({ error: "Missing submission_id" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    const store = getStore("checkout-links");
    const checkoutUrl = await store.get(submissionId, { type: "text" });

    if (!checkoutUrl) {
      return new Response(
        JSON.stringify({ error: "Missing checkout URL" }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        }
      );
    }

    return new Response(
      JSON.stringify({ checkout_url: checkoutUrl }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: String(err) }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      }
    );
  }
};