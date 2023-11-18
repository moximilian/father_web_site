import Header from "../components/header";
import { useState, useEffect } from "react";
import Footer from "../components/footer";
import { firebaseConfig } from "../server/firebase_server";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore/lite";
import { getAllNews } from "../server/firebase_server";
import { useSearchParams } from "react-router-dom";

export default function New() {
  const [news, setNews] = useState([]);
  const [New, setNew] = useState();

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  let [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const FetchData = async () => {
      const news = await getAllNews(db);
      setNews(news);
    };
    FetchData();
    const new_id = searchParams.get("id");
    console.log(new_id)
    const New_l = news.find((new_to) => new_to.id === parseInt(new_id));
    setNew(New_l);
  }, [news]);

  return (
    <>
      <Header
        pages={[
          { name: "Каталог", scrolled: false, path: "/catalog/" },
          { name: `О&nbsp;нас`, scrolled: false, path: "/about" },
          { name: "Контакты", scrolled: true, path: "main" },
        ]}
      />
      <div className="main-thing">
        <div className="main-container">
          {New ? (
            <>
              <div className="product-one">
                <img
                  className="image-item"
                  src={"data:image/jpg;base64," + New.image}
                  alt={New.title}
                />
                <div className="product-texting">
                  <div className="grey-text">{New.date}</div>
                  <td dangerouslySetInnerHTML={{ __html: New.title }} />
                  <td dangerouslySetInnerHTML={{ __html: New.description }} />
                </div>
              </div>
            </>
          ) : (
            <div>Не нашел</div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
