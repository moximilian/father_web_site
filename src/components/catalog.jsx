// import products from "../products.json";
import { useState, useEffect } from "react";
import "../catalog.css";
import { Link } from "react-router-dom";
import { ReactComponent as ArrowRight } from "../images/icons/arrow-right.svg";
import { ReactComponent as ArrowLeft } from "../images/icons/arrow-left.svg";
import { useDispatch, useSelector } from "react-redux";
import { firebaseConfig } from "../server/firebase_server";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore/lite";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import {
  getAdmin,
  addNewItem,
  getAllProducts,
  changeItem,
} from "../server/firebase_server";

export default function Catalog() {
  const dispatch = useDispatch();

  const itemsPerPage = 12; // Number of items per page
  const [itemsInCart, setItemsInCart] = useState([{}]);
  const itemsInCartRDX = useSelector((state) => state.itemsInCart);
  const [activeButton, setActiveButton] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const [productsToShow, setProductsToShow] = useState([]);

  const getCountById = (product_id) => {
    if (itemsInCartRDX[1]?.length > 0) {
      for (let i = 0; i < itemsInCartRDX[1].length; i++) {
        if (itemsInCartRDX[1][i].id === product_id) {
          return itemsInCartRDX[1][i].count;
        }
      }
      return 0;
    } else {
      for (let i = 0; i < itemsInCart.length; i++) {
        if (itemsInCart[i].id === product_id) {
          return itemsInCart[i].count;
        }
      }
      return 0;
    }
  };
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const storage = getStorage(app, "gs://house-of-dream-d101b.appspot.com");
  const downloadfile = (e, file_name) => {
    e.preventDefault();
    getDownloadURL(ref(storage, file_name + ".xlsx"))
      .then((url) => {
        // const xhr = new XMLHttpRequest();
        // xhr.responseType = 'blob';
        // xhr.onload = (event) => {
        //   const blob = xhr.response;
        // };
        // xhr.open('GET', url);
        // xhr.send();
        console.log(url);
        const link = document.createElement("a");
        link.href = url;
        link.download = file_name + ".xlsx";
        link.click();
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleItemsInCart = (product_id, operator, isFirstAdd = false) => {
    var old_fields = [{}];
    var old_count;
    if (itemsInCartRDX[1]?.length > 0) {
      for (let i = 0; i < itemsInCartRDX[1].length; i++) {
        if (itemsInCartRDX[1][i].id !== product_id && itemsInCartRDX[1][i].id) {
          old_fields.push(itemsInCartRDX[1][i]);
        }
        if (itemsInCartRDX[1][i].id === product_id) {
          old_count = itemsInCartRDX[1][i].count;
        }
      }
    } else {
      for (let i = 0; i < itemsInCart.length; i++) {
        if (itemsInCart[i].id !== product_id && itemsInCart[i].id) {
          old_fields.push(itemsInCart[i]);
        }
        if (itemsInCart[i].id === product_id) {
          old_count = itemsInCart[i].count;
        }
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
    setItemsInCart(old_fields);
    dispatch({
      type: "ADD_TO_CART",
      payload: old_fields,
    });
    localStorage.setItem("cart_products", JSON.stringify(itemsInCart));
  };
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const FetchData = async () => {
      const prod = await getAllProducts(db);
      setProducts(prod);
    };
    FetchData();
  }, [db]);

  var prodoctsGroups = products.slice(startIndex, endIndex);
  prodoctsGroups = prodoctsGroups.reduce((unique, product) => {
    const group = unique.find((item) => item.name === product.group);
    if (!group) {
      unique.push({ id: unique.length + 1, name: product.group });
    }
    return unique;
  }, []);

  const showAllProds = (e) => {
    e.preventDefault();
    const productToShowLocal = products.slice(startIndex, endIndex);
    setProductsToShow(productToShowLocal);
    setActiveButton(null);
  };
  useEffect(() => {
    const productToShowLocal = products.slice(startIndex, endIndex);
    setProductsToShow(productToShowLocal);
  }, [startIndex, endIndex, products]);
  const filterItemsByGroup = (e, group_name) => {
    e.preventDefault();

    const productsToShowLocal = productsToShow.filter(
      (product) => product.group === group_name
    );
    setProductsToShow(productsToShowLocal);
    setActiveButton(group_name);
  };
  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  return (
    <>
      <div id="catalog">
        <h1>Каталог</h1>
        <div className="buttons">
          <button
            onClick={(e) => showAllProds(e)}
            className={`product_group ${
              activeButton === null ? "active_button" : ""
            }`}
          >
            Показать все
          </button>
          {prodoctsGroups.map((group) => (
            <button
              onClick={(e) => filterItemsByGroup(e, group.name)}
              key={group.id}
              className={`product_group ${
                activeButton === group.name ? "active_button" : ""
              }`}
            >
              {group.name}
            </button>
          ))}
        </div>
        <div className="item_container">
          {productsToShow.map((product) => (
            <div key={product.id} className="product">
              <img
                src={"data:image/jpg;base64," + product.image}
                alt={product.name}
                className="catalog-image"
              />
              <Link to={"/item?id=" + product.id}>
                <div className="bold-small">{product.name}</div>
              </Link>
              <b>{product.price}₽</b>
              <div className="grey-text">
                {product.description.slice(0, 50)}...
              </div>

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
                    onClick={() => handleItemsInCart(product.id, "del")}
                    className="btn-product small"
                  >
                    <b>-</b>
                  </button>
                  {getCountById(product.id)}
                  <button
                    onClick={() => handleItemsInCart(product.id, "add")}
                    className="btn-product small"
                  >
                    <b>+</b>
                  </button>
                </div>
              )}
            </div>
          ))}
          {products.length === 0 ? (
            <>
              <div className="product">
                <div className="catalog-image fake-prod-image"></div>
                <div className="bold-small fake-n"></div>
                <div className="fake-n"></div>
                <div className="grey-text fake-n"></div>
                <div className="fake-n"></div>
                <div className="fake-n"></div>
              </div>
              <div className="product">
                <div className="catalog-image fake-prod-image"></div>
                <div className="bold-small fake-n"></div>
                <div className="fake-n"></div>
                <div className="grey-text fake-n"></div>
                <div className="fake-n"></div>
                <div className="fake-n"></div>
              </div>
              <div className="product">
                <div className="catalog-image fake-prod-image"></div>
                <div className="bold-small fake-n"></div>
                <div className="fake-n"></div>
                <div className="grey-text fake-n"></div>
                <div className="fake-n"></div>
                <div className="fake-n"></div>
              </div>
              <div className="product">
                <div className="catalog-image fake-prod-image"></div>
                <div className="bold-small fake-n"></div>
                <div className="fake-n"></div>
                <div className="grey-text fake-n"></div>
                <div className="fake-n"></div>
                <div className="fake-n"></div>
              </div>
            </>
          ) : (
            <></>
          )}
          <div className="pagination">
            {currentPage !== 1 && (
              <button className="btn-false" onClick={() => prevPage()}>
                <ArrowLeft />
              </button>
            )}

            <span>{currentPage}</span>
            {endIndex < products.length && (
              <button className="btn-false" onClick={() => nextPage()}>
                <ArrowRight />
              </button>
            )}
          </div>
          {activeButton !== null && (
            <span className="download">
              <button
                onClick={(e) => downloadfile(e, activeButton)}
                className="product_group active_button"
              >
                Скачать этот прайс-лист
              </button>
            </span>
          )}
        </div>
      </div>
    </>
  );
}
