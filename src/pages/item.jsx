import { useSearchParams, Link } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/footer";
import "../item.css";
import Contacts from "../components/contacts";
import useComponentVisible from "../hooks/useComponentVisible";
import TimeTable from "../components/timetable";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { firebaseConfig } from "../server/firebase_server";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore/lite";
import { getAllProducts } from "../server/firebase_server";
import { ReactComponent as ArrowLeft } from "../images/icons/arrow-left.svg";

export default function Item() {
  const itemsInCart = useSelector((state) => state.itemsInCart);
  // const [itemsInCart_no_need, setItemsInCart] = useState([{}]);

  const dispatch = useDispatch();
  const [timetableRef, isTimetableOpened, setTimetableOpened] =
    useComponentVisible(false);
  const handleVisibility = () => {
    const dim_element = document.getElementById("dim");
    dim_element.classList.add("dim_filter");
    const note = document.querySelector(".dim_filter");
    const main = document.querySelector("main");
    note.style.width =
      document.width !== undefined
        ? document.width
        : document.body.offsetWidth + "px";
    // main.height;
    note.style.height =
      document.height !== undefined
        ? document.height
        : document.body.offsetHeight + "px";
  };
  const handleVisibilityOfSchedule = () => {
    handleVisibility();
    setTimetableOpened(true);
  };
  const getCountById = (product_id) => {
    if (itemsInCart.length === 1) {
      return 0;
    }
    for (let i = 0; i < itemsInCart[1].length; i++) {
      if (itemsInCart[1][i].id === product_id) {
        return itemsInCart[1][i].count;
      }
    }
    return 0;
  };
  const handleItemsInCart = (product_id, operator, isFirstAdd = false) => {
    var old_fields = [{}];
    var old_count;

    for (let i = 0; i < itemsInCart[1]?.length; i++) {
      if (itemsInCart[1][i]?.id !== product_id) {
        old_fields.push(itemsInCart[1][i]);
      }
      if (itemsInCart[1][i]?.id === product_id) {
        old_count = itemsInCart[1][i].count;
      }
    }
    switch (operator) {
      case "add":
        if (isFirstAdd) {
          old_count = 0;
        }
        old_count++;
        break;
      case "del":
        old_count--;
        break;
      default:
        break;
    }
    if (old_count > 0) {
      old_fields.push({
        id: product_id,
        count: old_count,
      });
    }
    // setItemsInCart(old_fields);
    dispatch({
      type: "ADD_TO_CART",
      payload: old_fields,
    });
  };
  const [products, setProducts] = useState([]);
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  useEffect(() => {
    const FetchData = async () => {
      const prod = await getAllProducts(db);
      setProducts(prod);
    };
    FetchData();
  }, [db]);
  let [searchParams, setSearchParams] = useSearchParams();
  const product_id = searchParams.get("id");
  const product = products.find(
    (product_to) => product_to.id === parseInt(product_id)
  );

  return (
    <>
      <Header pages={[{ name: "Главная", scrolled: false, path: "/" }]} />
      <div id="dim"></div>
      <div className="main-thing">
        <div className="main-container">
          <Link to="/catalog/">
            <div className="get-back">
              <ArrowLeft />
              Каталог
            </div>
          </Link>
          {product ? (
            <>
              <div className="product-one">
                <img
                  className="image-item"
                  src={"data:image/jpg;base64," + product.image}
                  alt={product.name}
                />
                <div className="product-texting">
                  <div className="grey-text">{product.group}</div>
                  <h1>
                    <td dangerouslySetInnerHTML={{ __html: product.name }} />
                  </h1>
                  <h1 className="bold">{product.price}₽</h1>
                  {getCountById(product.id) === 0 ? (
                    <button
                      onClick={() => handleItemsInCart(product.id, "add", true)}
                      className="btn-product"
                    >
                      <b>В корзину</b>
                    </button>
                  ) : (
                    <div className="buttons_add_del">
                      <button
                        onClick={() => handleItemsInCart(product.id, "add")}
                        className="btn-product small"
                      >
                        <b>+</b>
                      </button>
                      {getCountById(product.id)}
                      <button
                        onClick={() => handleItemsInCart(product.id, "del")}
                        className="btn-product small"
                      >
                        <b>-</b>
                      </button>
                    </div>
                  )}
                  <div>
                    <div className="grey-text">
                      Доставка курьером, 3–5 дней — 1 500 ₽.
                    </div>
                    <div className="grey-text">
                      При заказе от 10 000 ₽ — бесплатно
                    </div>
                  </div>
                  <div>
                    Skill Market<br></br>
                    <button
                      onClick={() => handleVisibilityOfSchedule()}
                      className="grey-text btn-false"
                    >
                      Открыто
                    </button>
                    <div ref={timetableRef}>
                      {isTimetableOpened ? <TimeTable /> : <></>}
                    </div>
                  </div>
                </div>
              </div>

              <div className="desc">
                <h1>Описание</h1>
                <td dangerouslySetInnerHTML={{ __html: product.description }} />
              </div>
              {(product.manif !== "" || product.size !== "") && (
                <div className="desc">
                  <h1>Характеристики</h1>
                  {product.manif !== "" && (
                    <div className="items-row">
                      Производитель:
                      <td dangerouslySetInnerHTML={{ __html: product.manif }} />
                    </div>
                  )}
                  {product.size !== "" && (
                    <div className="items-row">
                      Габариты:
                      <td dangerouslySetInnerHTML={{ __html: product.size }} />
                    </div>
                  )}
                </div>
              )}

              <h1>Контакты</h1>
              <Contacts />
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
