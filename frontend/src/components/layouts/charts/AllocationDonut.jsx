'use client';
import React from "react";
import ReactApexChart from "react-apexcharts";

export default function DonutChart({ assets = [] }) {
    const seriesValues = assets.map(asset => asset.percent_val);
    const labelNames = assets.map(asset => asset.name);
    const colorHexCodes = assets.map(asset => asset.color);
    const totalPercentage = seriesValues.reduce((acc, curr) => acc + curr, 0);

    const chartOptions = {
        labels: labelNames,
        colors: colorHexCodes,
        legend: {
            show: false,
            labels: {
                colors: '#d1d1db'
            }
        },
        stroke: {
            show: false,
            width: 0,
        },
        tooltips: {
            y: {
                formatter: function (val) { return (val + "%") }
            }
        },
        dataLabels: {
            enabled: false,

        },
        plotOptions: {
            pie: {
                donut: {
                    size: '60%',
                    labels: {
                        show:true,
                        total:{
                            show:true,
                            label:'Total',
                            color:'#d1d1db',
                            formatter:function(){return totalPercentage}
                        }
                    }
                }
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center w-full text-gray-300">
            <div className="w-full flex justify-center">
                <ReactApexChart
                    options={chartOptions}
                    series={seriesValues}
                    type="donut"
                    height={150}
                    width="100%"
                />
            </div>
        </div>
    );
};