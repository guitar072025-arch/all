// ALL AI backend for Cloudflare Workers
// Set your OpenAI API key as a Worker secret named OPENAI_API_KEY.
// Do NOT put the API key in index.html or GitHub.

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") return new Response("", {headers: cors});
    if (request.method !== "POST") return json({error:"POST only"},405);

    try {
      const body = await request.json();
      const message = String(body.message || "").trim();
      if (!message) return json({error:"message is required"},400);

      const r = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${env.OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "gpt-6-luna",
          instructions: "あなたはALL AI。日本語で、親しみやすく、わかりやすく答えてください。必要なら箇条書きを使ってください。",
          input: message,
          max_output_tokens: 700
        })
      });

      const data = await r.json();
      if (!r.ok) return json({error: data.error?.message || "OpenAI API error"}, r.status);

      let text = data.output_text || "";
      if (!text && Array.isArray(data.output)) {
        text = data.output.flatMap(x => x.content || [])
          .filter(x => x.type === "output_text").map(x => x.text).join("");
      }
      return json({text: text || "回答を生成できませんでした。"});
    } catch (e) {
      return json({error: "Server error"},500);
    }
  }
};

function json(data,status=200){
  return new Response(JSON.stringify(data),{
    status,headers:{"Content-Type":"application/json; charset=utf-8",...cors}
  });
}
