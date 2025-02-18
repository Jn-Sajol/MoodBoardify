import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

interface MoodData {
  date: string;
  moods: { [key: string]: number };
}

export default function MoodStatisticsPage() {
  const [moodData, setMoodData] = useState<MoodData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [days, setDays] = useState(7); // Default to last 7 days
  
  // Get userId and token from localStorage
  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");

  // Check if user is authenticated
  if (!storedUser || !token) {
    setError("User not authenticated.");
    return <div>{error}</div>; // Return early if user is not authenticated
  }

  const parsedUser = JSON.parse(storedUser);
  if (!parsedUser?.id) {
    setError("User ID not found.");
    return <div>{error}</div>; // Return early if user ID is not found
  }

  const userId = parsedUser.id;

  useEffect(() => {
    if (!userId || !token) return;

    fetch(`http://localhost:3000/api/v1/mood/history/${userId}/${days}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`, // Use token directly from localStorage
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setMoodData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch mood data");
        setLoading(false);
      });
  }, [userId, days, token]); // Fetch data when userId, days, or token change

  console.log(moodData);

  const getLineChartData = () => {
    const labels = moodData.map((entry) => entry.date);
    const moods = ["SHY", "SCARED", "ENERGETIC", "LOVE", "GUILTY", "SAD"]; // List of moods
    const datasets = moods.map((mood) => ({
      label: mood,
      data: moodData.map((entry) => entry.moods[mood] || 0),
      borderColor: getMoodColor(mood),
      tension: 0.1,
      fill: false,
    }));

    return {
      labels,
      datasets,
    };
  };

  const getPieChartData = () => {
    const moodCounts = moodData.reduce((acc, entry) => {
      Object.keys(entry.moods).forEach((mood) => {
        acc[mood] = (acc[mood] || 0) + entry.moods[mood];
      });
      return acc;
    }, {} as { [key: string]: number });

    return {
      labels: Object.keys(moodCounts),
      datasets: [
        {
          data: Object.values(moodCounts),
          backgroundColor: Object.keys(moodCounts).map(getMoodColor),
        },
      ],
    };
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case "SHY": return "#ffb3b3";
      case "SCARED": return "#ff6666";
      case "ENERGETIC": return "#66ff66";
      case "LOVE": return "#ff3399";
      case "GUILTY": return "#cccc00";
      case "SAD": return "#6666ff";
      default: return "#cccccc";
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-center mb-6">Mood History for User {userId}</h2>

      <div className="flex justify-center mb-6">
        <button onClick={() => setDays(7)} className="px-4 py-2 border rounded-lg">Last 7 Days</button>
        <button onClick={() => setDays(30)} className="px-4 py-2 ml-2 border rounded-lg">Last 30 Days</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Mood Over Time</h3>
          <Line data={getLineChartData()} options={{ responsive: true, plugins: { title: { display: true, text: "Mood Swings Over Time" } } }} />
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Mood Distribution</h3>
          <Pie data={getPieChartData()} options={{ responsive: true, plugins: { title: { display: true, text: "Mood Distribution" } } }} />
        </div>
      </div>
    </div>
  );
}
