import TimeTable from "./timetable";
import Pricelists from "./pricelists";
import Promotions from "./promotions";
import Catalog from "./catalog";
import Contacts from "./contacts";
import DeliveryInfo from './delivery'
import { useState, useEffect } from "react";
import useComponentVisible from "../hooks/useComponentVisible";
import { ReactComponent as Star } from "../images/icons/star.svg";
import { getAllProducts } from "../server/firebase_server";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore/lite";
import { getStorage } from "firebase/storage";
import { firebaseConfig } from "../server/firebase_server";

export default function Main() {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const storage = getStorage(app, "gs://house-of-dream-d101b.appspot.com");
  const [timetableRef, isTimetableOpened, setTimetableOpened] = useComponentVisible(false);
  const [isPriceListsOpened, setPriceListsOpened] = useState(false);
  const [isdeliveryInfoOpened, setDeliveryInfoOpened] = useState(false);
  const handleVisibility = () => {
    const dim_element = document.getElementById("dim");
    dim_element.classList.add("dim_filter");
    const note = document.querySelector(".dim_filter");
    note.style.width = window.innerWidth + "px";
    const main = document.querySelector("html");

    // note.style.height = main.height;
    note.style.height =
      document.height !== undefined
        ? document.height
        : document.body.offsetHeight + "px";
  };
  const handleVisibilityOfSchedule = () => {
    handleVisibility();
    setTimetableOpened(true);
  };
  const handlePriceListsVisibility = (e) => {
    // handleVisibility();
    e.preventDefault();
    if (isPriceListsOpened) {
      setPriceListsOpened(false);
    } else {
      setPriceListsOpened(true);
    }
  };
  const handletDeliveryInfoOpened = (e) => {
    e.preventDefault();
    if (isdeliveryInfoOpened) {
      setDeliveryInfoOpened(false);
    } else {
      setDeliveryInfoOpened(true);
    }
  };

  const [products, setProducts] = useState([]);

  useEffect(() => {
    const FetchData = async () => {
      const prod = await getAllProducts(db);
      setProducts(prod);
    };
    FetchData();
  }, [db]);

  var prodoctsGroups = products;
  prodoctsGroups = prodoctsGroups.reduce((unique, product) => {
    const group = unique.find((item) => item.name === product.group);
    if (!group) {
      unique.push({ id: unique.length + 1, name: product.group });
    }
    return unique;
  }, []);
  return (
    <>
      <main>
        <div id="dim"></div>
        <div className="main-container">
          <div className="basic-info">
            <div className="basic-text">
              <div className="bold">Skill Market</div>
              <div className="grey-text">
                Компания строительных инструментов и не только.
              </div>
              <div>Наша компрания поможет решением ваших задач</div>
            </div>
            <img src="./images/logo.png" alt="im" className="logo_medium" />
          </div>
          <Contacts />
          <button
            onClick={() => handleVisibilityOfSchedule()}
            className="grey-text btn-false"
          >
            Открыто
          </button>
          <div ref={timetableRef}>
            {isTimetableOpened ? <TimeTable /> : <></>}
          </div>
          <Promotions />
          <h1>О нас</h1>
          <div id="about-us">
            Основная задача нашей компании решить уже имеющиеся проблемы наших
            партнеров, да именно партнеров, а главное сделать все что бы не
            допустить их возникновение, с этой целью запускается пилотный проект
            с 25 августа 2023 года наша компания совместно с Томским Заводом
            Кузнецова (ТЗК) начала поставку на склад в Москве пневмоинструмента
            оснастки и комплектующих к ним. А с октября 2023 года был создан
            проект совместно с двумя крупнейшими производителями РФ, по
            размещению на наших складах производимой ими продукции, обратите
            внимание на новый прайс лист и загруженные товары на сайт.
          </div>

          <div className="points">
            <button
              onClick={(e) => handlePriceListsVisibility(e)}
              className={
                isPriceListsOpened
                  ? "star-component isOpened"
                  : "star-component"
              }
            >
              <Star />
              Оптовые продажи
            </button>
            <button
              onClick={(e) => handletDeliveryInfoOpened(e)}
              className={
                isdeliveryInfoOpened
                  ? "star-component isOpened"
                  : "star-component"
              }
            >
              <Star />
              Доставка
            </button>
          </div>
          <div>
            {isPriceListsOpened ? (
              <Pricelists prodoctsGroups={prodoctsGroups} />
            ) : (
              <></>
            )}
          </div>
          {isdeliveryInfoOpened ? <><DeliveryInfo/></> : <></>}
        </div>
      </main>
    </>
  );
}
