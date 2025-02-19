import { useState, useEffect } from "react";
import { Line, Pie } from "react-chartjs-2";
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
  ChartOptions,
  TooltipItem,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

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
  const [days, setDays] = useState(7);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!storedUser || !token) {
      setError("User not authenticated.");
      setLoading(false);
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    if (!parsedUser?.id) {
      setError("User ID not found.");
      setLoading(false);
      return;
    }

    const userId = parsedUser.id;

    fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/mood/history/${userId}/${days}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setMoodData(data); // Store full array of mood data
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch mood data");
        setLoading(false);
      });
  }, [days]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  // Generate colors for moods
  const getMoodColor = (mood: string) => {
    const moodColors: { [key: string]: string } = {
      HAPPY: "#FFD700",
      SAD: "#6666FF",
      ANGRY: "#FF0000",
      EXCITED: "#FF4500",
      CALM: "#00CED1",
      ANXIOUS: "#FF8C00",
      NERVOUS: "#FF6347",
      RELAXED: "#98FB98",
      CONFIDENT: "#1E90FF",
      FRUSTRATED: "#8B0000",
      BORED: "#A9A9A9",
      HOPEFUL: "#32CD32",
      GRATEFUL: "#FFA500",
      LONELY: "#4B0082",
      TIRED: "#708090",
      ENERGETIC: "#66FF66",
      CURIOUS: "#DAA520",
      SCARED: "#FF6666",
      LOVE: "#FF3399",
      GUILTY: "#CCCC00",
      SHY: "#FFB3B3",
    };
    return moodColors[mood] || "#CCCCCC";
  };

  // Process Line Chart Data (Fixing Multi-Day Processing)
  const getLineChartData = () => {
    if (moodData.length === 0) return null;

    const labels = moodData.map((entry) => entry.date); // X-axis = Dates
    const moodNames = Array.from(
      new Set(moodData.flatMap((entry) => Object.keys(entry.moods)))
    );

    const datasets = moodNames.map((mood) => ({
      label: mood,
      data: moodData.map((entry) => entry.moods[mood] || 0), // Ensure missing values are filled with 0
      borderColor: getMoodColor(mood),
      backgroundColor: getMoodColor(mood),
      tension: 0.1,
      fill: false,
    }));

    return { labels, datasets };
  };

  // Process Pie Chart Data (Fix: Aggregate Across All Days)
  const getPieChartData = () => {
    const aggregatedMoods: { [key: string]: number } = {};

    moodData.forEach((entry) => {
      Object.entries(entry.moods).forEach(([mood, count]) => {
        aggregatedMoods[mood] = (aggregatedMoods[mood] || 0) + count;
      });
    });

    return {
      labels: Object.keys(aggregatedMoods),
      datasets: [
        {
          data: Object.values(aggregatedMoods),
          backgroundColor: Object.keys(aggregatedMoods).map(getMoodColor),
        },
      ],
    };
  };

  const pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Mood Distribution",
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem: TooltipItem<'pie'>) => {
            const total = tooltipItem.dataset.data.reduce((acc: number, val: number) => acc + val, 0);
            const percentage = ((tooltipItem.raw as number / total) * 100).toFixed(2);
            return `${tooltipItem.label}: ${tooltipItem.raw} (${percentage}%)`;
          },
        },
      },
      datalabels: {
        display: true,
        color: "white",
        formatter: (value: number, ctx: any) => {
          const total = ctx.dataset.data.reduce((acc: number, val: number) => acc + val, 0);
          const percentage = ((value / total) * 100).toFixed(2);
          return `${percentage}%`;
        },
        font: {
          weight: 'bold' as const,
          size: 12
        },
      },
    },
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-center mb-6">Mood History</h2>

      <div className="flex justify-center mb-6 gap-3">
        {[1, 3, 5, 7, 30].map((d) => (
          <button
            key={d}
            onClick={() => setDays(d)}
            className={`px-4 py-2 border rounded-lg ${
              days === d ? "bg-teal-700 text-white" : "bg-white"
            }`}
          >
            Last {d} Days
          </button>
        ))}
      </div>

      {moodData.length === 0 ? (
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <h3 className="text-xl font-semibold">No mood data created yet</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {days > 1 && getLineChartData() && (
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Mood Over Time</h3>
              <Line
                data={getLineChartData()!}
                options={{
                  responsive: true,
                  plugins: { title: { display: true, text: "Mood Trends" } },
                }}
              />
            </div>
          )}

          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">
              Mood Distribution (Last {days} Days)
            </h3>
            <Pie data={getPieChartData()} options={pieChartOptions} />
          </div>
        </div>
      )}
    </div>
  );
}
