import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

const TradingChart = ({ marketData, shortPeriod, longPeriod }) => {
  const sortedData = Object.keys(marketData)
    .sort()
    .map(timestamp => ({
      time: timestamp,
      close: parseFloat(marketData[timestamp]["4. close"]),
    }));

  const calculateMovingAverage = (data, period, key) => {
    return data.map((entry, index) => {
      if (index < period - 1) return { ...entry, [key]: null };
      const avg =
        data.slice(index - period + 1, index + 1).reduce((sum, item) => sum + item.close, 0) /
        period;
      return { ...entry, [key]: avg };
    });
  };

  let processedData = calculateMovingAverage(sortedData, shortPeriod, "sma");
  processedData = calculateMovingAverage(processedData, longPeriod, "lma");

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={processedData}>
        <XAxis dataKey="time" tick={{ fontSize: 12 }} tickFormatter={(tick) => tick.slice(11, 16)} />
        <YAxis domain={["auto", "auto"]} />
        <Tooltip formatter={(value) => value?.toFixed(2)} />
        <Legend />
        <Line type="monotone" dataKey="close" stroke="#8884d8" strokeWidth={2} name="Price" />
        <Line type="monotone" dataKey="sma" stroke="#82ca9d" strokeWidth={2} name="Short MA" />
        <Line type="monotone" dataKey="lma" stroke="#ff7300" strokeWidth={2} name="Long MA" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default TradingChart;
