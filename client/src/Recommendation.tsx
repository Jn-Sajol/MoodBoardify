import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

interface Recommendation {
  songs: { title: string; link: string; avatar: string }[];
  movies: { title: string; link: string; avatar: string }[];
  books: { title: string; link: string; avatar: string }[];
  quotes: { text: string; author: string }[];
  activities: { title: string; link: string; avatar: string }[];
}

export default function RecommendationPage() {
  const [searchParams] = useSearchParams();
  const mood = searchParams.get("mood");
  const [recommendations, setRecommendations] = useState<Recommendation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!mood) return;

    // Check if recommendations are already cached in localStorage
    const cachedRecommendations = localStorage.getItem(`recommendations-${mood}`);
    if (cachedRecommendations) {
      setRecommendations(JSON.parse(cachedRecommendations));
      setLoading(false); // No need to load if cached data is found
    } else {
      // Fetch recommendations from the backend if not cached
      fetch("http://localhost:3000/api/v1/mood/recommendation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mood }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.recommendations) {
            setRecommendations(data.recommendations);
            localStorage.setItem(`recommendations-${mood}`, JSON.stringify(data.recommendations)); // Cache the data
          } else {
            setError("No recommendations found.");
          }
        })
        .catch(() => setError("Failed to fetch recommendations."))
        .finally(() => setLoading(false));
    }
  }, [mood]);

  const handleGetAnotherRecommendation = () => {
    setLoading(true);
    setRecommendations(null);
    setError("");
    // Fetch fresh recommendations from the backend
    fetch("http://localhost:3000/api/v1/mood/recommendation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ mood }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.recommendations) {
          setRecommendations(data.recommendations);
          localStorage.setItem(`recommendations-${mood}`, JSON.stringify(data.recommendations)); // Cache the new data
        } else {
          setError("No recommendations found.");
        }
      })
      .catch(() => setError("Failed to fetch recommendations."))
      .finally(() => setLoading(false));
  };

  if (loading) return <div className="text-center text-lg font-semibold mt-10">Loading...</div>;
  if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-center mb-6 capitalize">{mood} Recommendations</h2>

      {recommendations && (
        <div className="space-y-8">
          <RecommendationSection title="Songs" items={recommendations.songs} />
          <RecommendationSection title="Movies" items={recommendations.movies} />
          <RecommendationSection title="Books" items={recommendations.books} />

          <div className="bg-gray-100 p-4 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-3">Quotes</h3>
            {recommendations.quotes.map((quote, index) => (
              <p key={index} className="italic text-gray-700 mb-2">
                "{quote.text}" — <span className="font-semibold">{quote.author}</span>
              </p>
            ))}
          </div>

          <RecommendationSection title="Activities" items={recommendations.activities} />
        </div>
      )}

      <div className="mt-6 text-center">
        <button
          onClick={handleGetAnotherRecommendation}
          className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
        >
          Get Another Recommendation
        </button>
      </div>
    </div>
  );
}

function RecommendationSection({ title, items }: { title: string; items: { title: string; link: string; avatar: string }[] }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <div className="grid grid-cols-2 gap-4">
        {items.map((item, index) => (
          <a key={index} href={item.link} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 border p-3 rounded-lg hover:bg-gray-50">
            <img src={item.avatar} alt={item.title} className="w-16 h-16 rounded-md object-cover" />
            <span className="text-lg font-medium">{item.title}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
