import { useEffect, useState } from "react";

import "./App.css";
const ITEMS_PER_PAGE = 6;
const API_ENDPOINT = "https://hacker-news.firebaseio.com/v0";
const EXEMPLE_RESPONSE = {
  by: "jamaibabu",
  id: 22131342,
  score: 1,
  time: 385835,
  title: "TCS is hiring IT Coolies",
  type: "🌬️ job",
  url: "https://www.ycombinator.com/companies/freezone/jobs",
};
const JobPosting = ({ title, by, url, time }) => {
  const formattedTime = new Date(time * 1000).toLocaleString();
  return (
    <div className="post" role="listItem">
      <h1 className="post__title">
        <a
          href={url}
          className={url ? "" : "inactiveLink"}
          target="_blank"
          rel="noopener"
        >
          {title}
        </a>
      </h1>

      <span>
        By {by}.{formattedTime}
      </span>
    </div>
  );
};

function App() {
  const [items, setItems] = useState([]);
  const [ids, setIds] = useState(null);
  const [fetchingDetails, setFetchingDetails] = useState(false);
  const [currentPage, setcurrentPage] = useState(0);

  const fetchItems = async (currPage) => {
    setcurrentPage(currPage);
    setFetchingDetails(true);

    let itemList = ids;
    if (itemList === null) {
      const response = await fetch(`${API_ENDPOINT}/jobstories.json`);
      itemList = await response.json();
      setIds(itemList);
    }
    const itemsIdsForPage = itemList.slice(
      currPage * ITEMS_PER_PAGE,
      currPage * ITEMS_PER_PAGE + ITEMS_PER_PAGE
    );

    const itemsForPage = await Promise.all(
      itemsIdsForPage.map((itemId) =>
        fetch(`${API_ENDPOINT}/item/${itemId}.json`).then((res) => res.json())
      )
    );

    setItems([...items, ...itemsForPage]);
    setFetchingDetails(false);
  };

  useEffect(
    (pages) => {
      currentPage === 0 ? fetchItems(currentPage) : "";
    },
    [currentPage]
  );

  return (
    <>
      <div className="app">
        <h1 className="title">My Company JOB news.</h1>
        {ids === null || items.length < 1 ? (
          <p className="loading">Loading...</p>
        ) : (
          <div>
            <div className="items" role="list">
              {items.map((items) => {
                return <JobPosting key={items.id} {...items} />;
              })}
            </div>
          </div>
        )}

        <button
          className="load-more-button"
          onClick={() => fetchItems(currentPage + 1)}
          disabled={fetchingDetails}
        >
          Load more jobs
        </button>
      </div>
    </>
  );
}

export default App;
