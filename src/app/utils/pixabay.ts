import Video from "~/src/app/model/Video"; // adjust path if your model lives elsewhere

const PIXABAY_API_KEY = process.env.EXPO_PUBLIC_PIXABAY_API_KEY;
const PIXABAY_ENDPOINT = "https://pixabay.com/api/videos/";

// A small pool of search terms so results aren't all one topic.
// Pixabay caps at ~200 results per query via pagination, but we only need
// enough combined to reach our target count.
const SEARCH_TERMS = ["nature", "city", "food", "travel", "people", "animals", "technology", "sports"];

const FAKE_USERNAMES = [
    "wanderlust_jo", "pixel.pete", "nova.reyes", "kai_outdoors", "mira.codes",
    "theo_travels", "lena.snaps", "sam_explores", "ari.makes", "juno_films",
];

function randomFrom<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function makePlaceholderUser(seed: string) {
    const username = randomFrom(FAKE_USERNAMES);
    return {
        id: `pixabay-user-${seed}`,
        username,
        image_url: `https://i.pravatar.cc/150?u=${seed}`, // stable per-video avatar, avoids the caching collision issue
    };
}

function makePlaceholderComments(seed: string, count: number) {
    const sampleTexts = [
        "This is amazing!",
        "Love this 😍",
        "Where was this filmed?",
        "So satisfying to watch",
        "Great quality video",
    ];
    return Array.from({ length: count }).map((_, i) => ({
        id: `pixabay-comment-${seed}-${i}`,
        username: randomFrom(FAKE_USERNAMES),
        text: randomFrom(sampleTexts),
        likes: randomInt(0, 40),
    }));
}

type PixabayHit = {
    id: number;
    tags: string;
    videos: {
        large: { url: string; width: number; height: number };
        medium: { url: string; width: number; height: number };
        small: { url: string; width: number; height: number };
    };
};

type PixabayResponse = {
    total: number;
    totalHits: number;
    hits: PixabayHit[];
};

/**
 * Fetches videos from Pixabay across a rotation of search terms until
 * `count` unique videos are collected (or sources are exhausted).
 */
export async function fetchPixabayVideos(count: number): Promise<Video[]> {
    if (!PIXABAY_API_KEY) {
        console.warn("EXPO_PUBLIC_PIXABAY_API_KEY is not set; skipping Pixabay fetch.");
        return [];
    }

    const collected: Video[] = [];
    const seenIds = new Set<number>();

    for (const term of SEARCH_TERMS) {
        if (collected.length >= count) break;

        try {
            const params = new URLSearchParams({
                key: PIXABAY_API_KEY,
                q: term,
                video_type: "film",
                safesearch: "true",
                per_page: "50", // Pixabay minimum is 3, max is 200; 50 is a reasonable page size
            });

            const res = await fetch(`${PIXABAY_ENDPOINT}?${params.toString()}`);
            if (!res.ok) {
                console.warn(`Pixabay request failed for "${term}": ${res.status}`);
                continue;
            }

            const data: PixabayResponse = await res.json();

            for (const hit of data.hits) {
                if (collected.length >= count) break;
                if (seenIds.has(hit.id)) continue;
                seenIds.add(hit.id);

                // Prefer medium size: good quality/bandwidth tradeoff for a mobile feed.
                const videoUrl = hit.videos.medium?.url ?? hit.videos.small?.url ?? hit.videos.large?.url;
                if (!videoUrl) continue;

                const seed = String(hit.id);

                collected.push({
                    id: `pixabay-${hit.id}`,
                    video_url: videoUrl,
                    likes: randomInt(50, 5000),
                    caption: 'Testing!',
                    comments: makePlaceholderComments(seed, randomInt(0, 8)),
                    user: makePlaceholderUser(seed),
                } as Video);
            }
        } catch (err) {
            console.warn(`Pixabay fetch error for "${term}":`, err);
        }
    }

    return collected;
}
