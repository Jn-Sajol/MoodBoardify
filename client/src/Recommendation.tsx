// import { useEffect, useState } from "react";
// import { useSearchParams } from "react-router-dom";

// interface Recommendation {
//   songs: { title: string; link: string; avatar: string }[];
//   movies: { title: string; link: string; avatar: string }[];
//   books: { title: string; link: string; avatar: string }[];
//   quotes: { text: string; author: string }[];
//   activities: { title: string; link: string; avatar: string }[];
// }

// export default function RecommendationPage() {
//   const [searchParams] = useSearchParams();
//   const mood = searchParams.get("mood");
//   const [recommendations, setRecommendations] = useState<Recommendation | null>(
//     null
//   );
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     if (!mood) return;

//     const cachedRecommendations = localStorage.getItem(
//       `recommendations-${mood}`
//     );
//     if (cachedRecommendations) {
//       setRecommendations(JSON.parse(cachedRecommendations));
//       setLoading(false);
//     } else {
//       fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/mood/recommendation`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ mood }),
//       })
//         .then((res) => res.json())
//         .then((data) => {
//           if (data.recommendations) {
//             setRecommendations(data.recommendations);
//             localStorage.setItem(
//               `recommendations-${mood}`,
//               JSON.stringify(data.recommendations)
//             );
//           } else {
//             setError("No recommendations found.");
//           }
//         })
//         .catch(() => setError("Failed to fetch recommendations."))
//         .finally(() => setLoading(false));
//     }
//   }, [mood]);

//   const handleGetAnotherRecommendation = () => {
//     setLoading(true);
//     setRecommendations(null);
//     setError("");

//     fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/mood/recommendation`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ mood }),
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         if (data.recommendations) {
//           setRecommendations(data.recommendations);
//           localStorage.setItem(
//             `recommendations-${mood}`,
//             JSON.stringify(data.recommendations)
//           );
//         } else {
//           setError("No recommendations found.");
//         }
//       })
//       .catch(() => setError("Failed to fetch recommendations."))
//       .finally(() => setLoading(false));
//   };

//   if (loading)
//     return (
//       <>
//         <div className="text-center text-lg font-semibold mt-10">
//           Wait a Moment plz! Your mood data is being analyzed to bring the perfect recommendations 🚀👩🏻‍💻
//         </div>

//         <div className="flex justify-center mt-6">
//           <div className="animate-spin rounded-full border-t-4 border-teal-600 w-16 h-16 border-solid"></div>
//         </div>
//       </>
//     );
//   if (error)
//     return <div className="text-center text-red-500 mt-10">{error}</div>;

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <h2 className="text-3xl font-bold text-center mb-6 capitalize">
//         You're in a {mood} mood! Let’s find something perfect to match your
//         vibe👇
//       </h2>

//       {recommendations && (
//         <div className="space-y-8">
//           <RecommendationSection
//             title="Songs"
//             category="songs"
//             items={recommendations.songs}
//           />
//           <RecommendationSection
//             title="Movies"
//             category="movies"
//             items={recommendations.movies}
//           />
//           <RecommendationSection
//             title="Books"
//             category="books"
//             items={recommendations.books}
//           />

//           <div className="bg-gray-100 p-4 rounded-lg shadow">
//             <h3 className="text-xl font-semibold mb-3">Quotes</h3>
//             {recommendations.quotes.map((quote, index) => (
//               <p key={index} className="italic text-gray-700 mb-2">
//                 "{quote.text}" —{" "}
//                 <span className="font-semibold">{quote.author}</span>
//               </p>
//             ))}
//           </div>

//           <RecommendationSection
//             title="Activities"
//             category="activities"
//             items={recommendations.activities}
//           />
//         </div>
//       )}

//       <div className="mt-6 text-center">
//         <button
//           onClick={handleGetAnotherRecommendation}
//           className="bg-gradient-to-r from-teal-800 to-teal-600 text-white hover:from-blue-400 hover:to-blue-900 cursor-pointer p-2 rounded-md"
//         >
//           Get New Recommendation
//         </button>
//       </div>
//     </div>
//   );
// }

// function RecommendationSection({
//   title,
//   category,
//   items,
// }: {
//   title: string;
//   category: string;
//   items: { title: string; link: string; avatar: string }[];
// }) {
//   if (!items || items.length === 0) return null;

//   // Default images for each category
//   const defaultImages: Record<string, string> = {
//     songs: "https://i.postimg.cc/132R2ZTK/music-placeholder.jpg",
//     movies: "https://i.postimg.cc/k4dJMv76/movie-placeholder.jpg",
//     books: "https://i.postimg.cc/pdjVt6MM/book-placeholder.jpg",
//     activities: "https://i.postimg.cc/hjd6ZkmN/woman-placeholder.jpg",
//   };

//   return (
//     <div className="bg-white p-4 rounded-lg shadow-md">
//       <h3 className="text-xl font-semibold mb-4">{title}</h3>
//       <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-6">
//         {items.map((item, index) => (
//           <a
//             key={index}
//             href={item.link}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="flex items-center space-x-3 border p-3 rounded-lg transition-transform transform hover:scale-105 hover:shadow-xl hover:bg-teal-600"
//           >
//             <img
//               src={item.avatar}
//               alt={item.title}
//               className="w-16 h-16 rounded-md object-cover"
//               onError={(e) => {
//                 e.currentTarget.src =
//                   defaultImages[category] ||
//                   "https://i.postimg.cc/8c6bN8fX/default-placeholder.jpg";
//               }}
//             />
//             <span className="text-lg font-medium">{item.title}</span>
//           </a>
//         ))}
//       </div>
//     </div>
//   );
// }

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

    const cachedRecommendations = localStorage.getItem(`recommendations-${mood}`);
    if (cachedRecommendations) {
      setRecommendations(JSON.parse(cachedRecommendations));
      setLoading(false);
    } else {
      fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/mood/recommendation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data && data.recommendations && Object.keys(data.recommendations).length > 0) {
            setRecommendations(data.recommendations);
            localStorage.setItem(
              `recommendations-${mood}`,
              JSON.stringify(data.recommendations)
            );
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

    fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/mood/recommendation`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mood }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.recommendations && Object.keys(data.recommendations).length > 0) {
          setRecommendations(data.recommendations);
          localStorage.setItem(
            `recommendations-${mood}`,
            JSON.stringify(data.recommendations)
          );
        } else {
          setError("No recommendations found.");
        }
      })
      .catch(() => setError("Failed to fetch recommendations."))
      .finally(() => setLoading(false));
  };

  if (loading)
    return (
      <>
        <div className="text-center text-lg font-semibold mt-10">
          Wait a Moment plz! Your mood data is being analyzed to bring the perfect recommendations 🚀👩🏻‍💻
        </div>
        <div className="flex justify-center mt-6">
          <div className="animate-spin rounded-full border-t-4 border-teal-600 w-16 h-16 border-solid"></div>
        </div>
      </>
    );

  if (error)
    return <div className="text-center text-red-500 mt-10">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-center mb-6 capitalize">
        You're in a {mood} mood! Let’s find something perfect to match your vibe👇
      </h2>

      {recommendations && (
        <div className="space-y-8">
          <RecommendationSection
            title="Songs"
            category="songs"
            items={recommendations.songs}
          />
          <RecommendationSection
            title="Movies"
            category="movies"
            items={recommendations.movies}
          />
          <RecommendationSection
            title="Books"
            category="books"
            items={recommendations.books}
          />

          <div className="bg-gray-100 p-4 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-3">Quotes</h3>
            {recommendations.quotes.map((quote, index) => (
              <p key={index} className="italic text-gray-700 mb-2">
                "{quote.text}" — <span className="font-semibold">{quote.author}</span>
              </p>
            ))}
          </div>

          <RecommendationSection
            title="Activities"
            category="activities"
            items={recommendations.activities}
          />
        </div>
      )}

      <div className="mt-6 text-center">
        <button
          onClick={handleGetAnotherRecommendation}
          className="bg-gradient-to-r from-teal-800 to-teal-600 text-white hover:from-blue-400 hover:to-blue-900 cursor-pointer p-2 rounded-md"
        >
          Get New Recommendation
        </button>
      </div>
    </div>
  );
}

function RecommendationSection({
  title,
  category,
  items,
}: {
  title: string;
  category: string;
  items: { title: string; link: string; avatar: string }[];
}) {
  if (!items || items.length === 0) return null;

  const defaultImages: Record<string, string> = {
    songs: "https://i.postimg.cc/132R2ZTK/music-placeholder.jpg",
    movies: "https://i.postimg.cc/k4dJMv76/movie-placeholder.jpg",
    books: "https://i.postimg.cc/pdjVt6MM/book-placeholder.jpg",
    activities: "https://i.postimg.cc/hjd6ZkmN/woman-placeholder.jpg",
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((item, index) => (
          <a
            key={index}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-3 border p-3 rounded-lg transition-transform transform hover:scale-105 hover:shadow-xl hover:bg-teal-600"
          >
            <img
              src={item.avatar}
              alt={item.title}
              className="w-16 h-16 rounded-md object-cover"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src =
                  defaultImages[category] ||
                  "https://i.postimg.cc/8c6bN8fX/default-placeholder.jpg";
              }}
            />
            <span className="text-lg font-medium">{item.title}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
