import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import Table from "./components/table.tsx";
import Pagination from "./pagination/pagination.tsx";
import useDebounce from "./components/debounce.tsx";
function App() {
  const [query, setQuery] = useState("");
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const debouncedQuery = useDebounce(query, 500);
  const fetchPlaces = async (searchQuery, currentPage) => {
    if (!searchQuery) {
      setPlaces([]);
      setTotalResults(0);
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(
        "https://wft-geo-db.p.rapidapi.com/v1/geo/cities",

        {
          params: {
            namePrefix: query,
            limit,
            offset: (currentPage - 1) * limit,
          },
          headers: {
            "x-rapidapi-key": process.env.REACT_APP_RAPIDAPI_KEY,
            "x-rapidapi-host": process.env.REACT_APP_RAPIDAPI_HOST,
          },
        }
      );
      setPlaces(response.data.data);
      console.log(response.data.metadata.totalCount);
      setTotalResults(response.data.metadata.totalCount);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaces(debouncedQuery, page);
  }, [debouncedQuery, page, limit]);

  const handleKeyPress = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "/") {
      e.preventDefault();
      document.getElementById("searchBox").focus();
    }
  };

  useEffect(() => {
    document.addEventListener("keypress", handleKeyPress);
    return () => document.removeEventListener("keypress", handleKeyPress);
  }, []);

  /* simple keydown commented because of bouns point*/
  // const handleKeyDown = (e) => {
  //   if ((e.ctrlKey || e.metaKey) && e.key === "/") {
  //     e.preventDefault();
  //     document.getElementById("searchBox").focus();
  //   }
  // };

  // useEffect(() => {
  //   document.addEventListener("keydown", handleKeyDown);
  //   return () => document.removeEventListener("keydown", handleKeyDown);
  // }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPlaces();
  };

  console.log(totalResults);
  const totalPages = Math.ceil(totalResults / limit);
  console.log(totalPages);
  return (
    <div className="app">
      <form onSubmit={handleSearch}>
        <input
          id="searchBox"
          className="search-box"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for places"
        />
      </form>
      <div className="controls"></div>
      {loading ? (
        <div className="spinner">Loading...</div>
      ) : (
        <Table places={places} />
      )}
      {places.length > 0 && (
        <div className="pageLabel">
          <label className="lable">
            Results per page:
            <input
              type="number"
              value={limit}
              onChange={(e) =>
                setLimit(Math.min(Math.max(e.target.value, 1), 10))
              }
              className="limit-input"
            />
          </label>
          <Pagination
            totlePage={totalPages}
            currentPage={page}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
}

export default App;
