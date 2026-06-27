const ENDPOINT = "https://models.github.ai/inference/chat/completions";

/**
 * Calls the GitHub Models inference endpoint.
 * Requires VITE_GITHUB_TOKEN in your .env file.
 * The token must have the "models:read" permission (fine-grained PAT)
 * or be a classic PAT (no scope needed for models).
 *
 * @param {object} model - Model object with `id` field
 * @param {Array}  history - Array of {role, content} message objects
 * @returns {Promise<string>} - The assistant reply text
 */
export async function callModel(model, history) {
  const token = import.meta.env.VITE_GITHUB_TOKEN;
  if (!token) {
    throw new Error(
      "No GitHub token found. Add VITE_GITHUB_TOKEN=your_token to your .env file."
    );
  }

  const messages = history.map(({ role, content }) => ({ role, content }));

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      model: model.id,
      messages,
      max_tokens: 1024,
      temperature: 0.7,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || err?.message || `HTTP ${res.status}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "(no response)";
}
