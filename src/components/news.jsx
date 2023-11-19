import { useState, useEffect } from "react";
import "../catalog.css";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore/lite";
import { firebaseConfig } from "../server/firebase_server";
import { getSomeNews } from "../server/firebase_server";
import { Link } from "react-router-dom";

export default function News() {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const [news, setNews] = useState([]);
  function removeHtmlTags(input) {
    const regex = /<[^>]+>/g;
    return input.replace(regex, "");
  }
  useEffect(() => {
    const FetchData = async () => {
      const news = await getSomeNews(db, 12, 0);
      setNews(news);
    };
    FetchData();
  }, []);
  return (
    <>
      <div className="main-container">
        <div id="news">
          <h1>Наши новости</h1>
          <div className="new_container">
            {news.map((New) => (
              <>
                <Link
                  to={"/new?id=" + New.id}
                  style={{
                    textDecoration: "none",
                    outline: "none",
                    color: "black",
                  }}
                >
                  <div key={New.id} className="new_item">
                    <img
                      src={"data:image/jpg;base64," + New.image}
                      alt={New.name}
                      className="new-image"
                    />
                    <div className="new_text">
                      <div className="grey-text"> {New.date}</div>
                      <td dangerouslySetInnerHTML={{ __html: New.title }} />
                      {removeHtmlTags(New.description).slice(0, 45)}
                    </div>
                  </div>
                </Link>
              </>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
