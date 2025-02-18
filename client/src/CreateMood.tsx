import { useState, useEffect } from "react";

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
  const [userId, setUserId] = useState(null);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  // ✅ Fetch userId from localStorage or auth context
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
  
    console.log("Stored User:", storedUser);
    console.log("Stored Token:", storedToken);
  
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      console.log("Parsed User ID:", parsedUser.id);
      setUserId(parsedUser.id);
    }
  }, []);
  

  // const handleMoodClick = async (mood) => {
  //   setError(null);
  //   setResponse(null);

  //   const token = localStorage.getItem("token");
  //   if (!token || !userId) {
  //     setError("User not authenticated.");
  //     return;
  //   }

  //   try {
  //     const res = await fetch("http://localhost:3000/api/v1/mood/createmood", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //       body: JSON.stringify({ userId, mood }),
  //     });

  //     const data = await res.json();

  //     if (!res.ok) {
  //       throw new Error(data.error || "Failed to create mood");
  //     }

  //     setResponse(`Mood "${mood}" created successfully!`);
  //   } catch (err) {
  //     setError(err.message);
  //   }
  // };

  const handleMoodClick = async (mood) => {
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
  
    setUserId(parsedUser.id); // Ensure userId is set
    setError(null);
    setResponse(null);
  
    try {
      const res = await fetch("http://localhost:3000/api/v1/mood/createmood", {
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
    } catch (err) {
      setError(err.message);
    }
  };
  
  return (
    <div className="flex flex-col items-center mt-16 gap-6">
      <h2 className="text-2xl font-bold">How are you feeling today?</h2>

      {/* Mood Cards */}
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {moods.map(({ name, emoji }) => (
          <button
            key={name}
            onClick={() => handleMoodClick(name)}
            className=" cursor-pointer flex flex-col items-center justify-center w-24 h-24 bg-gray-100 border rounded-lg shadow-md hover:bg-gray-500 transition p-2"
          >
            <span className="text-3xl">{emoji}</span>
            <span className="text-sm font-semibold">{name}</span>
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
