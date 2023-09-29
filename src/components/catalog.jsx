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
import { getAdmin, addNewItem, getAllProducts, changeItem } from "../server/firebase_server";

export default function Catalog() {
  const dispatch = useDispatch();

  const itemsPerPage = 12; // Number of items per page
  const [itemsInCart, setItemsInCart] = useState([{}]);
  const itemsInCartRDX = useSelector((state) => state.itemsInCart);

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
  const [products, setProducts] = useState([])
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  useEffect(()=>{
    const FetchData = async () =>{
      const prod = await getAllProducts(db);
      setProducts(prod)
    }
    FetchData()
  
  },[db])
  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const productsToShow = products.slice(startIndex, endIndex);
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
        <div className="item_container">
          {productsToShow.map((product) => (
            <div key={product.id} className="product">
              <img
                src={"data:image/jpg;base64," + product.image }
                alt={product.name}
                className="catalog-image"
              />
              <Link to={"/item?id=" + product.id}><div className="bold-small">{product.name}</div></Link>
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
            </div>
          ))}
        </div>
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
      </div>
    </>
  );
}
