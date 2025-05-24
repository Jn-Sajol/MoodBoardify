// // src/components/CreatePost.tsx
// import { useState } from "react";

// const moods = ["HAPPY", "SAD", "EXCITED", "ANGRY", "NEUTRAL"];

// const CreatePost = () => {
//   const [mood, setMood] = useState("");
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<string | null>(null);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);
//     setSuccess(null);

//     try {
//       const token = localStorage.getItem("token");
//       const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/feed/postfeed`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`, // assuming JWT token
//         },
//         body: JSON.stringify({ mood, message }),
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error || "Post creation failed.");

//       setSuccess("Post created successfully!");
//       setMood("");
//       setMessage("");
//     } catch (err: any) {
//       setError(err.message || "Something went wrong.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-xl rounded-2xl">
//       <h2 className="text-2xl font-semibold mb-4 text-center">Create a Post</h2>

//       {error && <p className="text-red-500 mb-3 text-center">{error}</p>}
//       {success && <p className="text-green-600 mb-3 text-center">{success}</p>}

//       <form onSubmit={handleSubmit} className="flex flex-col gap-4">
//         <select
//           value={mood}
//           onChange={(e) => setMood(e.target.value)}
//           className="border rounded-md p-2"
//           required
//         >
//           <option value="">Select Mood</option>
//           {moods.map((m) => (
//             <option key={m} value={m}>
//               {m}
//             </option>
//           ))}
//         </select>

//         <textarea
//           placeholder="What's on your mind?"
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           className="border rounded-md p-2 h-24 resize-none"
//           required
//         />

//         <button
//           type="submit"
//           className={`p-2 rounded-md font-semibold text-sm bg-gradient-to-r from-teal-800 to-teal-600 text-white hover:from-blue-400 hover:to-blue-900 cursor-pointer ${
//             loading
//               ? "bg-gray-400 cursor-not-allowed"
//               : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-blue-400 hover:to-blue-900 cursor-pointer"
//           }`}
//           disabled={loading}
//         >
//           {loading ? "Posting..." : "Post"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default CreatePost;


// src/components/CreatePost.tsx
import { useState } from "react";

const moods = [
  "HAPPY",
  "SAD",
  "EXCITED",
  "ANGRY",
  "NEUTRAL",
  "GRATEFUL",
  "ANXIOUS",
  "MOTIVATED",
  "TIRED",
  "OPTIMISTIC",
  "LONELY",
  "PRODUCTIVE",
  "FRUSTRATED",
  "PEACEFUL",
  "HOPEFUL"
];


const CreatePost = ({ setPosts }: { setPosts: React.Dispatch<React.SetStateAction<any[]>> }) => {
  const [mood, setMood] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/feed/postfeed`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ mood, message }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Post creation failed.");

      setSuccess("Post created successfully!");
      setMood("");
      setMessage("");

      // Prepend the new post to the existing posts
      setPosts((prevPosts) => [data.post, ...prevPosts]);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-xl rounded-2xl">
      <h2 className="text-2xl font-semibold mb-4 text-center">Create a Post</h2>

      {error && <p className="text-red-500 mb-3 text-center">{error}</p>}
      {success && <p className="text-green-600 mb-3 text-center">{success}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <select
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          className="border rounded-md p-2"
          required
        >
          <option value="">Select Mood</option>
          {moods.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        <textarea
          placeholder="What's on your mind?"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="border rounded-md p-2 h-24 resize-none"
          required
        />

        <button
          type="submit"
          className={`p-2 rounded-md font-semibold text-sm text-white ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-blue-400 hover:to-blue-900 cursor-pointer"
          }`}
          disabled={loading}
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </form>
    </div>
  );
};

export default CreatePost;

