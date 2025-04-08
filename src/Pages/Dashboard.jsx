import React, { useState, useEffect, useMemo } from "react";
import TradingStats from "@/components/TradingStats";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import TradingChart from "@/components/TradingChart";

const Dashboard = () => {
    const [marketData, setMarketData] = useState(null);
    const [shortPeriod, setShortPeriod] = useState(5);
    const [longPeriod, setLongPeriod] = useState(10);
    const [currentPrice, setCurrentPrice] = useState(0);
    const [signal, setSignal] = useState(null);

    const companies = [
        { name: "Apple Inc.", symbol: "AAPL" },
        { name: "Microsoft Corporation", symbol: "MSFT" },
        { name: "NVIDIA Corporation", symbol: "NVDA" },
        { name: "Amazon.com, Inc.", symbol: "AMZN" },
        { name: "Alphabet Inc.", symbol: "GOOG" },
        { name: "Meta Platforms, Inc.", symbol: "META" },
        { name: "Berkshire Hathaway Inc.", symbol: "BRK.A" },
        { name: "Tesla, Inc.", symbol: "TSLA" },
        { name: "Eli Lilly and Company", symbol: "LLY" },
        { name: "Visa Inc.", symbol: "V" }
    ];

    const [symbol, setSymbol] = useState(companies[0].symbol);
    const [companyName, setCompanyName] = useState(companies[0].name);
    const api_key = import.meta.env.VITE_API_KEY;

    // Fetch Market Data
    useEffect(() => {
        const FetchMarketData = async () => {
            try {
                const response = await fetch(
                    `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&apikey=demo`
                );
                const json = await response.json();

                if (json["Meta Data"] && json["Time Series (5min)"]) {
                    const company = companies.find(c => c.symbol === symbol);
                    setCompanyName(company ? company.name : symbol);
                    setMarketData(json["Time Series (5min)"]);
                } else {
                    console.error("Invalid API Response:", json);
                }
            } catch (error) {
                console.error("Error fetching market data:", error);
            }
        };

        FetchMarketData();
    }, [symbol, api_key]);

   
    const sortedData = useMemo(() => {
        if (!marketData) return [];
        return Object.keys(marketData)
            .sort()
            .map(timestamp => ({
                time: timestamp,
                close: parseFloat(marketData[timestamp]["4. close"])
            }));
    }, [marketData]);

   
    useEffect(() => {
        if (sortedData.length < longPeriod) return;
        
        setCurrentPrice(sortedData[sortedData.length - 1].close);

        const closingPrices = sortedData.map(data => data.close);
        const sma = closingPrices.slice(-shortPeriod).reduce((a, b) => a + b, 0) / shortPeriod;
        const lma = closingPrices.slice(-longPeriod).reduce((a, b) => a + b, 0) / longPeriod;
        
        setSignal(sma > lma ? "BUY" : "SELL");
    }, [sortedData, shortPeriod, longPeriod]);

    return (
        <div className="px-6 py-4">
            <div className="mb-8 sm:flex justify-between">
                <div className="sm:mt-0 mb-3">
                    <h1 className="text-3xl font-bold tracking-tight">Algorithmic Trading Dashboard</h1>
                    <p className="text-muted-foreground mt-1">
                        Real-time market data with moving average crossover strategy
                    </p>
                </div>
                <Select value={symbol} onValueChange={setSymbol}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder={companies.find(c => c.symbol === symbol)?.name} />
                    </SelectTrigger>
                    <SelectContent>
                        {companies.map((e) => (
                            <SelectItem key={e.symbol} value={e.symbol}>
                                {e.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {marketData && (
                <>
                    <TradingStats
                        companyName={companyName}
                        shortPeriod={shortPeriod}
                        longPeriod={longPeriod}
                        signal={signal}
                        marketData={marketData}
                    />

                    <div className="w-full mt-4 p-6">
                        <TradingChart marketData={marketData} shortPeriod={shortPeriod} longPeriod={longPeriod} />
                    </div>
                </>
            )}
        </div>
    );
};

export default Dashboard;


