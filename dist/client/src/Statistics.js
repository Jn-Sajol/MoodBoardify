"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MoodStatisticsPage;
const react_1 = require("react");
const react_chartjs_2_1 = require("react-chartjs-2");
const chart_js_1 = require("chart.js");
const chartjs_plugin_datalabels_1 = __importDefault(require("chartjs-plugin-datalabels"));
chart_js_1.Chart.register(chart_js_1.CategoryScale, chart_js_1.LinearScale, chart_js_1.PointElement, chart_js_1.LineElement, chart_js_1.Title, chart_js_1.Tooltip, chart_js_1.Legend, chart_js_1.ArcElement, chartjs_plugin_datalabels_1.default);
function MoodStatisticsPage() {
    const [moodData, setMoodData] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    const [days, setDays] = (0, react_1.useState)(7);
    (0, react_1.useEffect)(() => {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");
        if (!storedUser || !token) {
            setError("User not authenticated.");
            setLoading(false);
            return;
        }
        const parsedUser = JSON.parse(storedUser);
        if (!(parsedUser === null || parsedUser === void 0 ? void 0 : parsedUser.id)) {
            setError("User ID not found.");
            setLoading(false);
            return;
        }
        const userId = parsedUser.id;
        fetch(`http://localhost:3000/api/v1/mood/history/${userId}/${days}`, {
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
    if (loading)
        return <div>Loading...</div>;
    if (error)
        return <div>{error}</div>;
    // Generate colors for moods
    const getMoodColor = (mood) => {
        const moodColors = {
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
        if (moodData.length === 0)
            return null;
        const labels = moodData.map((entry) => entry.date); // X-axis = Dates
        const moodNames = Array.from(new Set(moodData.flatMap((entry) => Object.keys(entry.moods))));
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
        const aggregatedMoods = {};
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
    const pieChartOptions = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: `Mood Distribution (Last ${days} Days)`,
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
                color: "white",
                formatter: (value, ctx) => {
                    const total = ctx.dataset.data.reduce((acc, val) => acc + val, 0);
                    const percentage = ((value / total) * 100).toFixed(2);
                    return `${percentage}%`;
                },
                font: {
                    weight: "bold",
                    size: 14,
                },
            },
        },
    };
    return (<div className="p-6">
      <h2 className="text-3xl font-bold text-center mb-6">Mood History</h2>

      <div className="flex justify-center mb-6 gap-3">
        {[1, 3, 5, 7, 30].map((d) => (<button key={d} onClick={() => setDays(d)} className={`px-4 py-2 border rounded-lg ${days === d ? "bg-teal-700 text-white" : "bg-white"}`}>
            Last {d} Days
          </button>))}
      </div>

      {moodData.length === 0 ? (<div className="bg-white p-4 rounded-lg shadow-md text-center">
          <h3 className="text-xl font-semibold">No mood data created yet</h3>
        </div>) : (<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {days > 1 && getLineChartData() && (<div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Mood Over Time</h3>
              <react_chartjs_2_1.Line data={getLineChartData()} options={{
                    responsive: true,
                    plugins: { title: { display: true, text: "Mood Trends" } },
                }}/>
            </div>)}

          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">
              Mood Distribution (Last {days} Days)
            </h3>
            <react_chartjs_2_1.Pie data={getPieChartData()} options={pieChartOptions}/>
          </div>
        </div>)}
    </div>);
}
