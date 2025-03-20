import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

const moods = [
  { name: "HAPPY", emoji: "😊" },
  { name: "SAD", emoji: "😢" },
  { name: "ANGRY", emoji: "😠" },
  { name: "EXCITED", emoji: "🤩" },
  { name: "CALM", emoji: "😌" },
  { name: "ANXIOUS", emoji: "😰" },
  { name: "NERVOUS", emoji: "😨" },
  { name: "RELAXED", emoji: "😎" },
  { name: "CONFIDENT", emoji: "😏" },
  { name: "FRUSTRATED", emoji: "😤" },
  { name: "BORED", emoji: "😐" },
  { name: "HOPEFUL", emoji: "🤞" },
  { name: "GRATEFUL", emoji: "🙏" },
  { name: "LONELY", emoji: "😔" },
  { name: "TIRED", emoji: "😴" },
  { name: "ENERGETIC", emoji: "⚡" },
  { name: "CURIOUS", emoji: "🤔" },
  { name: "SCARED", emoji: "😱" },
  { name: "LOVE", emoji: "❤️" },
  { name: "GUILTY", emoji: "😓" },
  { name: "SHY", emoji: "🙈" },
];

const CreateMood = () => {
  const [_, setUserId] = useState<number | null>(null);
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false); // New loading state
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserId(parsedUser.id);
    }
  }, []);

  const handleMoodClick = async (mood: string) => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!storedUser || !token) {
      setError("User not authenticated.");
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    if (!parsedUser?.id) {
      setError("User ID not found.");
      return;
    }

    setUserId(parsedUser.id);
    setError(null);
    setResponse(null);
    setLoading(true); // Start loading

    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/mood/createmood`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId: parsedUser.id, mood }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create mood");
      }

      setResponse(`Mood "${mood}" created successfully!`);
      navigate(`/recommendation?mood=${mood}`);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="flex flex-col items-center mt-16 gap-6">
      <h2 className="text-2xl font-bold -mt-12 sm:text-xl md:text-3xl lg:text-4xl text-center">
        How's your mood today? 😊 <br />
      </h2>
      <p className="text-gray-600 -mt-6 mb-3.5 sm:text-base md:text-xl lg:text-2xl text-center">
        Pick a mood that matches how you're feeling, and we'll suggest the
        perfect song, movie, or activity to lift your spirits! 🎶🎬✨
      </p>

        {/* Loading Spinner */}
        {loading && (
        <div className="flex items-center justify-center mt-4">
          <div className="w-6 h-6 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
          <span className="ml-2 text-blue-500 font-semibold">Processing...</span>
        </div>
      )}

      {/* Mood Cards */}
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {moods.map(({ name, emoji }) => (
          <button
            key={name}
            onClick={() => handleMoodClick(name)}
            disabled={loading} // Disable button while loading
            className={`cursor-pointer flex flex-col items-center justify-center w-28 h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 border rounded-lg shadow-md bg-gradient-to-r from-teal-800 to-teal-600 transition-all transform ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
            } duration-300 p-2 text-white`}
          >
            <span className="text-4xl md:text-5xl lg:text-6xl">{emoji}</span>
            <span className="text-sm font-semibold mt-4">{name}</span>
          </button>
        ))}
      </div>

      {/* Response Messages */}
      {response && <p className="text-green-500 font-semibold">{response}</p>}
      {error && <p className="text-red-500 font-semibold">{error}</p>}
    </div>
  );
};

export default CreateMood;
