"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_router_1 = require("react-router");
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
    const [userId, setUserId] = (0, react_1.useState)(null);
    const [response, setResponse] = (0, react_1.useState)(null);
    const [error, setError] = (0, react_1.useState)(null);
    const navigate = (0, react_router_1.useNavigate)();
    (0, react_1.useEffect)(() => {
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
    const handleMoodClick = (mood) => __awaiter(void 0, void 0, void 0, function* () {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");
        if (!storedUser || !token) {
            setError("User not authenticated.");
            return;
        }
        const parsedUser = JSON.parse(storedUser);
        if (!(parsedUser === null || parsedUser === void 0 ? void 0 : parsedUser.id)) {
            setError("User ID not found.");
            return;
        }
        setUserId(parsedUser.id); // Ensure userId is set
        setError(null);
        setResponse(null);
        try {
            const res = yield fetch("http://localhost:3000/api/v1/mood/createmood", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ userId: parsedUser.id, mood }),
            });
            const data = yield res.json();
            if (!res.ok) {
                throw new Error(data.error || "Failed to create mood");
            }
            setResponse(`Mood "${mood}" created successfully!`);
            navigate(`/recommendation?mood=${mood}`);
        }
        catch (err) {
            setError(err.message);
        }
    });
    return (<div className="flex flex-col items-center mt-16 gap-6">
      <h2 className="text-2xl font-bold -mt-12 sm:text-xl md:text-3xl lg:text-4xl text-center">
        How's your mood today? 😊 <br />
      </h2>
      <p className=" text-gray-600 -mt-6 mb-3.5 sm:text-base md:text-xl lg:text-2xl text-center">
        Pick a mood that matches how you're feeling, and we'll suggest the
        perfect song, movie, or activity to lift your spirits! 🎶🎬✨
      </p>

      {/* Mood Cards */}
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {moods.map(({ name, emoji }) => (<button key={name} onClick={() => handleMoodClick(name)} className="cursor-pointer flex flex-col items-center justify-center w-28 h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 border rounded-lg shadow-md bg-gradient-to-r from-teal-800 to-teal-600 hover:bg-gray-100 transition-all transform hover:scale-105 duration-300 p-2 text-white">
            <span className="text-4xl md:text-5xl lg:text-6xl">{emoji}</span>
            <span className="text-sm font-semibold mt-4">{name}</span>
          </button>))}
      </div>

      {/* Response Messages */}
      {response && <p className="text-green-500 font-semibold">{response}</p>}
      {error && <p className="text-red-500 font-semibold">{error}</p>}
    </div>);
};
exports.default = CreateMood;
