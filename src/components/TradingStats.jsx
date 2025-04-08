import React, { useEffect, useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DollarSign, TrendingUp, ArrowUp, ArrowDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const TradingStats = ({ companyName, shortPeriod, longPeriod, marketData, signal }) => {
  const [currentPrice, setCurrentPrice] = useState(0);

  const calculateMovingAverage = (data, period) => {
    if (data.length < period) return null;
    const sum = data.slice(-period).reduce((acc, item) => acc + item.close, 0);
    return (sum / period).toFixed(4);
  };


  const sortedData = useMemo(() => {
    return Object.keys(marketData)
      .sort()
      .map((timestamp) => ({
        time: timestamp,
        close: parseFloat(marketData[timestamp]["4. close"]),
      }));
  }, [marketData]);

  useEffect(() => {
    if (sortedData.length === 0) return;
    setCurrentPrice(sortedData[sortedData.length - 1].close);
  }, [sortedData]);


  const shortMA = useMemo(() => calculateMovingAverage(sortedData, shortPeriod), [sortedData, shortPeriod]);
  const longMA = useMemo(() => calculateMovingAverage(sortedData, longPeriod), [sortedData, longPeriod]);

  const shortMAPct = currentPrice > 0 ? ((shortMA - currentPrice) / currentPrice) * 100 : 0;
  const longMAPct = currentPrice > 0 ? ((longMA - currentPrice) / currentPrice) * 100 : 0;

  
  

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
   
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Current Price</CardTitle>
          <CardDescription>{companyName}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline">
            <DollarSign className="h-4 w-4 text-muted-foreground mr-1" />
            <span className="text-2xl font-bold">
              {currentPrice ? currentPrice.toFixed(2) : "Loading..."}
            </span>
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-muted-foreground">
            Last updated: {new Date().toLocaleTimeString()}
          </p>
        </CardFooter>
      </Card>

   
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Moving Averages</CardTitle>
          <CardDescription>
            Short ({shortPeriod}) & Long ({longPeriod})
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* Short MA */}
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <TrendingUp className="h-4 w-4 text-orange-500 mr-1" />
                <span className="text-sm">Short MA</span>
              </div>
              <Badge variant={shortMAPct >= 0 ? "default" : "destructive"} className="text-xs flex items-center">
                {shortMAPct >= 0 ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                {Math.abs(shortMAPct).toFixed(2)}%
              </Badge>
            </div>

            {/* Long MA */}
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <TrendingUp className="h-4 w-4 text-purple-500 mr-1" />
                <span className="text-sm">Long MA</span>
              </div>
              <Badge variant={longMAPct >= 0 ? "default" : "destructive"} className="text-xs flex items-center">
                {longMAPct >= 0 ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                {Math.abs(longMAPct).toFixed(2)}%
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Latest Signal</CardTitle>
          <CardDescription>Based on MA crossover</CardDescription>
        </CardHeader>
        <CardContent>
          {signal ? (
            <Badge className={`px-3 py-1 text-sm font-medium ${signal === "BUY" ? "bg-green-500" : "bg-red-500"}`}>
              {signal}
            </Badge>
          ) : (
            <p className="text-sm text-muted-foreground text-center">No signals generated yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TradingStats;



