import { useState, useEffect } from "react";

const moods = [
  "HAPPY", "SAD", "ANGRY", "EXCITED", "CALM", "ANXIOUS", "NERVOUS",
  "RELAXED", "CONFIDENT", "FRUSTRATED", "BORED", "HOPEFUL", "GRATEFUL",
  "LONELY", "TIRED", "ENERGETIC", "CURIOUS", "SCARED", "LOVE", "GUILTY", "SHY"
];

const CreateMood = () => {
  const [mood, setMood] = useState("");
  const [userId, setUserId] = useState(null);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  // ✅ Fetch userId from localStorage or auth context
  useEffect(() => {
    const storedUser = localStorage.getItem("user"); // Assuming user is stored as JSON
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserId(parsedUser.id); // Adjust based on how user data is stored
    }
  }, []);

  const handleSubmit = async () => {
    setError(null);
    setResponse(null);

    const token = localStorage.getItem("token");
    if (!token || !userId) {
      setError("User not authenticated.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/v1/mood/createmood", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, 
        },
        body: JSON.stringify({ userId, mood }), 
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create mood");
      }

      setResponse("Mood created successfully!");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center mt-16 gap-4">
      <h2 className="text-xl font-bold">How are you feeling today?</h2>

      {/* Mood Selection Dropdown */}
      <select
        value={mood}
        onChange={(e) => setMood(e.target.value)}
        className="border p-2 rounded w-60"
      >
        <option value="">Select a mood</option>
        {moods.map((mood) => (
          <option key={mood} value={mood}>
            {mood}
          </option>
        ))}
      </select>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={!mood || !userId}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-300"
      >
        Submit Mood
      </button>

      {/* Response Messages */}
      {response && <p className="text-green-500">{response}</p>}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default CreateMood;
