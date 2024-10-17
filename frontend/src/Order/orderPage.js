import React, { useState, useEffect } from "react";
import { usePersonalFinance } from "../context/financeContext";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import { useAuth } from "../context/authContext";

const ExpenseList = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Amount",
        data: [],
        fill: false,
        borderColor: "rgba(75, 192, 192, 1)",
      },
    ],
  });
  const { getFinance } = usePersonalFinance();
  const { user } = useAuth();

  const getFinances = async () => {
    const finances = await getFinance();
    if (!user.userRoles.includes("Admin")) {
      return finances.filter((x) => x.username === user.username);
    }

    return finances;
  };

  function calculateCumulativeTotals(input) {
    const dailyTotals = {};
    const currentDate = new Date().toISOString().split("T")[0];

    input.forEach((item) => {
      const date = item.formatedDateTimeString;
      const amount = item.amount;
      const type = item.expenceIncomeType;

      if (!dailyTotals[date]) {
        dailyTotals[date] = 0;
      }

      dailyTotals[date] += type === "income" ? amount : -amount;
    });

    let allDates = Object.keys(dailyTotals).sort();
    let cumulativeTotal = 0;
    const results = [];

    let datePointer = allDates.length > 0 ? new Date(allDates[0]) : new Date();

    while (datePointer.toISOString().split("T")[0] <= currentDate) {
      const dateString = datePointer.toISOString().split("T")[0];

      if (dailyTotals[dateString] !== undefined) {
        cumulativeTotal += dailyTotals[dateString];
      }

      results.push({ date: dateString, totalAmount: cumulativeTotal });

      datePointer.setDate(datePointer.getDate() + 1);
    }

    return results;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const financeData = await getFinances();
        const chartData = calculateCumulativeTotals(financeData);

        const dates = chartData.map((x) => x.date);
        const amounts = chartData.map((x) => x.totalAmount);

        setChartData({
          labels: dates,
          datasets: [
            {
              label: "Biudžetas",
              data: amounts,
              fill: false,
              borderColor: "rgba(75, 192, 192, 1)",
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [getFinance]);

  return <Line data={chartData} />;
};

export default ExpenseList;
