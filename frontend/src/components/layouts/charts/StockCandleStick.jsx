import { api } from "@/lib/api";
import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

export default function CandleStick({ symbol, heading, isZoomed, isShow }) {
    const [range, setRange] = useState("1y");
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistoryData = async () => {
            try {
                const response = await api.get(`/api/stocks/${symbol}/history?range=${range}`);
                const history = response.data;
                // console.log('history data==', history.data);
                const candles = history.data.map(candle => ({
                    x: new Date(candle.date).toLocaleDateString(),
                    // x: new Date(candle.timestamp),
                    y: [
                        candle.open,
                        candle.high,
                        candle.low,
                        candle.close
                    ]
                }));
                setChartData(candles);
            } catch (error) {
                console.error('Error fetching stock history data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchHistoryData();
    }, [symbol, range]);

    const series = [{ data: chartData }];
    const options = {
        chart: {
            type: 'candlestick',
            height: 500,
            toolbar: {
                show: false,
            },
            zoom: {
                enabled: isZoomed,
            },
            background: "transparent",
        },
        xaxis: {
            type: 'datetime',
            labels: {
                style: {
                    colors: '#ffffff'
                },
                show: isShow
            },
        },
        yaxis: {
            tooltip: {
                enabled: false
            },
            labels: {
                style: {
                    colors: '#616161'
                },
                show: isShow
            }
        },
        grid: {
            borderColor: '#42535931'
        }
    };

    return (
        <div className="border-0 w-full">
            <div className={`w-full ${heading} items-center justify-between border-0 my-4`}>
                <p>OHLC Data</p>
                <div className="ml-auto border-0 place-items-stretch justify-center grid grid-cols-3 md:grid-cols-5 lg:grid-cols-5 gap-2">
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
            </div>
            {loading ? (
                <div>Loading chart...</div>
            ) : (
                <ReactApexChart
                    options={options}
                    series={series}
                    type="candlestick"
                    height={500}
                    width="100%"
                    style={{ borderWidth: 0 }}
                />
            )}
        </div>
    );
};