import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  ChartDataLabels
);

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
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // Use token directly from localStorage
        "Content-Type": "application/json",
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

  console.log('mood data getting',moodData);

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case "HAPPY":
        return "#FFD700";
      case "SAD":
        return "#6666FF";
      case "ANGRY":
        return "#FF0000";
      case "EXCITED":
        return "#FF4500";
      case "CALM":
        return "#00CED1";
      case "ANXIOUS":
        return "#FF8C00";
      case "NERVOUS":
        return "#FF6347";
      case "RELAXED":
        return "#98FB98";
      case "CONFIDENT":
        return "#1E90FF";
      case "FRUSTRATED":
        return "#8B0000";
      case "BORED":
        return "#A9A9A9";
      case "HOPEFUL":
        return "#32CD32";
      case "GRATEFUL":
        return "#FFA500";
      case "LONELY":
        return "#4B0082";
      case "TIRED":
        return "#708090";
      case "ENERGETIC":
        return "#66FF66";
      case "CURIOUS":
        return "#DAA520";
      case "SCARED":
        return "#FF6666";
      case "LOVE":
        return "#FF3399";
      case "GUILTY":
        return "#CCCC00";
      case "SHY":
        return "#FFB3B3";
      default:
        return "#CCCCCC"; // Default color
    }
  };
  const getLineChartData = () => {
    const labels = moodData.map((entry) => entry.date); // Extract unique dates
    const moods = Array.from(new Set(moodData.flatMap((entry) => Object.keys(entry.moods)))); // Extract unique moods
  
    const datasets = moods.map((mood) => ({
      label: mood,
      data: labels.map((date) => {
        const entry = moodData.find((e) => e.date === date);
        return entry ? entry.moods[mood] || 0 : 0; // Get the mood count for each date
      }),
      borderColor: getMoodColor(mood),
      backgroundColor: getMoodColor(mood),
      tension: 0.1,
      fill: false,
    }));
  
    console.log("labels =", labels, "datasets =", datasets);
  
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

  // Pie chart options
  const pieChartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Mood Distribution',
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const total = tooltipItem.dataset.data.reduce((acc, val) => acc + val, 0);
            const percentage = ((tooltipItem.raw / total) * 100).toFixed(2);
            return `${tooltipItem.label}: ${tooltipItem.raw} (${percentage}%)`;
          },
        },
      },
      datalabels: {
        display: true,
        color: 'white',  // Set label color to white or any color you prefer
        formatter: (value, ctx) => {
          const total = ctx.dataset.data.reduce((acc, val) => acc + val, 0);
          const percentage = ((value / total) * 100).toFixed(2);
          return `${percentage}%`;  // Display percentage
        },
        font: {
          weight: 'bold',
          size: 14,
        },
        anchor: 'center',  // Position of label inside the slice
        align: 'center',  // Align text to the center of the slice
      },
    },
  };
    
  
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-center mb-6">
        Mood History
      </h2>

      <div className="flex justify-center mb-6">
        <button
          onClick={() => setDays(1)}
          className={`cursor-pointer px-4 py-2 border rounded-lg ${
            days === 1 ? "bg-blue-500 text-white" : "bg-white"
          }`}
        >
          Last 1 Days
        </button>
        <button
          onClick={() => setDays(3)}
          className={`cursor-pointer px-4 py-2 ml-2 border rounded-lg ${
            days === 3 ? "bg-blue-500 text-white" : "bg-white"
          }`}
        >
          Last 3 Days
        </button>
        <button
          onClick={() => setDays(5)}
          className={`cursor-pointer px-4 py-2 ml-2 border rounded-lg ${
            days === 5 ? "bg-blue-500 text-white" : "bg-white"
          }`}
        >
          Last 5 Days
        </button>
        <button
          onClick={() => setDays(7)}
          className={`cursor-pointer px-4 py-2 ml-2 border rounded-lg ${
            days === 7 ? "bg-blue-500 text-white" : "bg-white"
          }`}
        >
          Last 7 Days
        </button>

        <button
          onClick={() => setDays(30)}
          className={`cursor-pointer px-4 py-2 ml-2 border rounded-lg ${
            days === 30 ? "bg-blue-500 text-white" : "bg-white"
          }`}
        >
          Last 30 Days
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Mood Over Time</h3>
          <Line
            data={getLineChartData()}
            options={{
              responsive: true,
              plugins: {
                title: { display: true, text: "Mood Swings Over Time" },
              },
            }}
          />
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Mood Distribution</h3>
          <Pie
            data={getPieChartData()}
            options={pieChartOptions} // Apply options to show percentage
          />
        </div>
      </div>
    </div>
  );
}
