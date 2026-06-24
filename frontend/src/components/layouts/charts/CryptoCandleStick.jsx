'use client';
import axios from "axios";
import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

export default function CandleStick({ data, coin_id }) {
    const [range, setRange] = useState("30d");
    const [coinData, setCoinData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistoryData = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API}/api/crypto/${coin_id}/history?range=${range}`);
                const history = response.data;
                // console.log('history data candlestick', history.data[range]);
                const candles = history.data[range].map(candle => ({
                    x: new Date(candle.timestamp),
                    y: [
                        candle.open,
                        candle.high,
                        candle.low,
                        candle.close
                    ]
                }));
                setCoinData(candles);
            } catch (error) {
                console.error('Error fetching stock history data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchHistoryData();
    }, [coin_id, range]);

    const series = [{ data: coinData }];
    const options = {
        chart: {
            type: 'candlestick',
            height: 500,
            toolbar: {
                show: false,
            },
            zoom: {
                enabled: false,
            },
            background: "transparent",
        },
        xaxis: {
            type: 'datetime',
            labels: {
                style: {
                    colors: '#ffffff'
                }
            }
        },
        yaxis: {
            tooltip: {
                enabled: false
            },
            labels: {
                style: {
                    colors: '#616161'
                }
            }
        },
        grid: {
            borderColor: '#42535931'
        }
    };

    return (
        <div className="border-0 w-full">
            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 place-items-stretch justify-between gap-2 mb-4">
                <div>
                    <p className="capitalize">{coin_id}</p>
                </div>
                <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-5 gap-2">
                    {["1d", "7d", "30d", "180d", "365d"].map((r) => (
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