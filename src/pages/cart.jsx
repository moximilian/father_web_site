import Header from "../components/header";
import { Link } from "react-router-dom";
import { ReactComponent as ArrowLeft } from "../images/icons/arrow-left.svg";
import Footer from "../components/footer";
import { useSelector } from "react-redux";
import FormSubmit from "../components/FormSubmit";
import "../cart.css";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { firebaseConfig } from "../server/firebase_server";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore/lite";
import { getAdmin, addNewItem, getAllProducts, changeItem } from "../server/firebase_server";
export default function Cart() {
  const dispatch = useDispatch();
  const itemsInCart = useSelector((state) => state.itemsInCart);

  const [sumAll, setSumAll] = useState();
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
  const idsToSelect = itemsInCart[1]?.map((product) => product.id);
  const filteredProducts = products?.filter((product) =>
    idsToSelect?.includes(product.id)
  );
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

  useEffect(() => {
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

    var items_sum = 0;
    if (filteredProducts.length === 0) {
      return;
    }
    for (let i = 0; i < filteredProducts.length; i++) {
      if (filteredProducts[i].id) {
        var cur_sum =
          filteredProducts[i].price * getCountById(filteredProducts[i].id);
        items_sum += cur_sum;
      }
    }
    setSumAll(items_sum);
  }, [filteredProducts, itemsInCart]);

  return (
    <>
      <Header />
      <div id="dim"></div>
      <div className="main-thing-cart">
        <div className="cart-container">
          <Link to="/#catalog">
            <div className="get-back">
              <ArrowLeft />
              Каталог
            </div>
          </Link>
          <div className="main-container-cart">
            <h1>Корзина</h1>
            <div className="items">
              {filteredProducts !== undefined &&
                filteredProducts.map((product) => (
                  <>
                    <div className="items-row">
                      <div className="small-pic">
                        <img
                          className="small-pic"
                          src={"data:image/jpg;base64," + product.image }
                          alt={product.name}
                        />
                      </div>
                      <div className="product-info">
                        <div key={product.id} className="bold-small">
                          {product.name}
                        </div>
                        <div>{product.price}₽</div>
                        <div>
                          {getCountById(product.id) === 0 ? (
                            <div className="buttons_add_del">
                              <button
                                onClick={() =>
                                  handleItemsInCart(product.id, "add")
                                }
                                className="btn-product small"
                              >
                                <b>+</b>
                              </button>
                              {getCountById(product.id)}
                              <button
                                disabled="true"
                                onClick={() =>
                                  handleItemsInCart(product.id, "del")
                                }
                                className="btn-product small"
                              >
                                <b>-</b>
                              </button>
                            </div>
                          ) : (
                            <div className="buttons_add_del">
                              <button
                                onClick={() =>
                                  handleItemsInCart(product.id, "add")
                                }
                                className="btn-product small"
                              >
                                <b>+</b>
                              </button>
                              {getCountById(product.id)}
                              <button
                                onClick={() =>
                                  handleItemsInCart(product.id, "del")
                                }
                                className="btn-product small"
                              >
                                <b>-</b>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      {product.price * getCountById(product.id)}₽
                    </div>
                  </>
                ))}
              {products.length === 0 && (<>
                <div className="items-row">
                  <div className="small-pic fake-prod-image"></div>
                  <div className="product-info">
                      <div className="fake"></div>
                      <div className="fake"></div>
                      <div className="fake"></div>
                  </div>
                </div>
              </> )}
               
              <div className="line-large"></div>
              <div className="summary">
                <h3>Итого </h3>
                <h3>{sumAll}₽</h3>
              </div>
            </div>
          </div>
          <FormSubmit />
        </div>
      </div>

      <Footer />
    </>
  );
}
