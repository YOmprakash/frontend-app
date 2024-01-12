// src/App.js
import React, { useState, useEffect, useCallback } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import "./App.css";

const App = () => {
  const [transactions, setTransactions] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("March");
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({});
  const [barChartData, setBarChartData] = useState([]);

  // Update the backend URL
  const backendUrl = "http://localhost:3001";

  // Use useCallback to memoize the fetchTransactions function
  const fetchTransactions = useCallback(async () => {
    try {
      const apiUrl = `${backendUrl}/api/transactions?month=${selectedMonth}&page=${currentPage}&searchText=${searchText}`;
      const response = await fetch(apiUrl);
      const data = await response.json();

      setTransactions(data.transactions || []);
      setTotalPages(Math.ceil(data.total / 10));

      // Fetch and update statistics
      fetchStatistics();

      // Fetch and update bar chart data
      fetchBarChartData();
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  }, [selectedMonth, currentPage, searchText]);

  useEffect(() => {
    // Call the memoized fetchTransactions function inside useEffect
    fetchTransactions();
  }, [fetchTransactions]);

  const fetchStatistics = async () => {
    try {
      const statsUrl = `${backendUrl}/api/statistics?month=${selectedMonth}`;
      const response = await fetch(statsUrl);
      const data = await response.json();

      setStats(data);
    } catch (error) {
      console.error("Error fetching statistics:", error);
    }
  };

  const fetchBarChartData = async () => {
    try {
      const barChartDataUrl = `${backendUrl}/api/bar-chart?month=${selectedMonth}`;
      const response = await fetch(barChartDataUrl);
      const data = await response.json();

      setBarChartData(data);
    } catch (error) {
      console.error("Error fetching bar chart data:", error);
    }
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
    setCurrentPage(1);
  };

  const handleSearch = (event) => {
    setSearchText(event.target.value);
    setCurrentPage(1);
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  return (
    <div>
      <h1>Transactions Dashboard</h1>

      <div>
        <label>Select Month:</label>
        <select value={selectedMonth} onChange={handleMonthChange}>
          {[
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ].map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Search Transactions:</label>
        <input type="text" value={searchText} onChange={handleSearch} />
      </div>

      <div>
        <button onClick={handlePrevPage} disabled={currentPage === 1}>
          Previous Page
        </button>
        <span>
          {" "}
          Page {currentPage} of {totalPages}{" "}
        </span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Next Page
        </button>
      </div>

      <div>
        <h2>Transactions Table</h2>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(transactions) && transactions.length > 0 ? (
              transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>{transaction.title}</td>
                  <td>{transaction.description}</td>
                  <td>{transaction.price}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">No transactions available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div>
        <h2>Transactions Statistics</h2>
        <div>Total Sale Amount: {stats.totalSaleAmount}</div>
        <div>Total Sold Items: {stats.totalSoldItems}</div>
        <div>Total Not Sold Items: {stats.totalNotSoldItems}</div>
      </div>

      <div>
        <h2>Transactions Bar Chart</h2>
        <BarChart width={600} height={300} data={barChartData}>
          <XAxis dataKey="priceRange" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="numItems" fill="#8884d8" />
        </BarChart>
      </div>
    </div>
  );
};

export default App;
