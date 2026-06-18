import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { RechartsDevtools } from '@recharts/devtools';
import { useEffect, useState } from 'react';
import axios from 'axios';

const SimpleAreaChart = ({ symbol }) => {
    const [range, setRange] = useState("1y");
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        const fetchHistoryData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/stocks/${symbol}/history?range=${range}`);
                const history = response.data;
                // console.log('history data==', history.data);
                const formattedHistory = history.data.map(item => ({
                    date:
                        range === "1d"
                            ? new Date(item.date).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                            })
                            : new Date(item.date).toLocaleDateString(),
                    price: item.close,
                }));
                setChartData(formattedHistory);
            } catch (error) {
                console.error('Error fetching stock history data:', error);
            }
        };
        fetchHistoryData();
    }, [symbol, range]);

    return (
        <div className="w-full h-full flex flex-col">
            <div className="ml-auto flex gap-2 mb-4">
                {["1d", "1w", "1mo", "1y"].map((r) => (
                    <button
                        key={r}
                        onClick={() => setRange(r)}
                        className={`px-3 py-1 rounded ${range === r
                            ? "bg-[#cca649] text-gray-800"
                            : "bg-transparent border border-gray-700"
                            }`}
                    >
                        {r.toUpperCase()}
                    </button>
                ))}
            </div>
            <ResponsiveContainer width="100%" height={250} border="0px solid red">
                <AreaChart
                    // style={{ width: '100%', maxWidth: '700px', maxHeight: '70vh', aspectRatio: 1.618 }}
                    // responsive
                    data={chartData}
                    margin={{
                        top: 20,
                        right: 0,
                        left: 0,
                        bottom: 0,
                    }}
                    onContextMenu={(_, e) => e.preventDefault()}
                >
                    <CartesianGrid strokeDasharray="0 3" />
                    <XAxis dataKey="date" niceTicks="snap125" />
                    <YAxis dataKey="price" width="auto" niceTicks="snap125" />
                    <Tooltip />
                    <Area type="monotone" dataKey="price" stroke="#cca649" fill="#cca74955" />
                    <RechartsDevtools />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};
export default SimpleAreaChart;