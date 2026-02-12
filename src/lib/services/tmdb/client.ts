const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const MIN_REQUEST_INTERVAL = 250; // 250ms = 4 req/sec (under TMDB's 40/10sec limit)

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

class TMDBClient {
  private lastRequestTime = 0;
  private apiKey: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_TMDB_API_KEY || "";
    if (!this.apiKey) {
      console.warn(
        "TMDB API key not found. Set VITE_TMDB_API_KEY in your .env file."
      );
    }
  }

  async request<T>(
    endpoint: string,
    params: Record<string, string | number> = {}
  ): Promise<T> {
    // Rate limiting
    const timeSince = Date.now() - this.lastRequestTime;
    if (timeSince < MIN_REQUEST_INTERVAL) {
      await sleep(MIN_REQUEST_INTERVAL - timeSince);
    }
    this.lastRequestTime = Date.now();

    const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
    url.searchParams.set("api_key", this.apiKey);

    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, String(value));
    }

    const response = await fetch(url.toString());

    if (response.status === 429) {
      // Rate limited - wait and retry
      const retryAfter = parseInt(
        response.headers.get("Retry-After") || "2",
        10
      );
      await sleep(retryAfter * 1000);
      return this.request<T>(endpoint, params);
    }

    if (!response.ok) {
      throw new Error(
        `TMDB API error: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  }
}

export const tmdbClient = new TMDBClient();
