// import products from "../products.json";
import { useState, useEffect } from "react";
import "../catalog.css";
import { Link } from "react-router-dom";
import { ReactComponent as ArrowRight } from "../images/icons/arrow-right.svg";
import { ReactComponent as ArrowLeft } from "../images/icons/arrow-left.svg";
import { useDispatch, useSelector } from "react-redux";
// import { firebaseConfig } from "../server/firebase_server";
// import { initializeApp } from "firebase/app";
// import { getStorage, ref, getDownloadURL } from "firebase/storage";

export default function Catalog({ products }) {
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
  function removeHtmlTags(input) {
    const regex = /<[^>]+>/g;
    return input.replace(regex, "");
  }
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
  // var prodoctsGroups = products.slice(startIndex, endIndex);
  var prodoctsGroups = products;
  prodoctsGroups = prodoctsGroups.reduce((unique, product) => {
    const group = unique.find((item) => item.name === product.group);
    if (!group) {
      unique.push({ id: unique.length + 1, name: product.group });
    }
    return unique;
  }, []);

  const filterItemsByGroup = (e, group_name) => {
    e.preventDefault();
    var productsToShowLocal = products.filter(
      (product) => product.group === group_name
    );
    productsToShowLocal = productsToShowLocal.slice(startIndex, endIndex);

    setProductsToShow(productsToShowLocal);
    setActiveButton(group_name);
  };

  useEffect(() => {
    const filterItemsByFirstGroup = (productToShowLocal, group_name) => {
      setActiveButton(group_name);
      return productToShowLocal.filter(
        (product) => product.group === group_name
      );
    };
    var productToShowLocal = filterItemsByFirstGroup(
      products,
      prodoctsGroups[0]?.name
    );
    productToShowLocal = productToShowLocal.slice(startIndex, endIndex);

    setProductsToShow(productToShowLocal);
  }, [startIndex, endIndex, products]);

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
      <main>
        <div className="main-container">
          <div id="catalog">
            <h1>Каталог</h1>
            <div className="buttons">
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
                  <Link to={"/item?id=" + product.id} className="column-flex">
                    <img
                      src={"data:image/jpg;base64," + product.image}
                      alt={product.name}
                      className="catalog-image"
                    />

                    <div>
                      <div className="bold-small">{product.name}</div>
                    </div>

                    <b>{product.price}₽</b>
                    <div className="grey-text">
                      {/* <td dangerouslySetInnerHTML={{__html: product.description.slice(0, 50)}} /> */}
                      {removeHtmlTags(product.description.slice(0, 50))}...
                    </div>
                  </Link>
                  {getCountById(product.id) === 0 ? (
                    <button
                      onClick={() => handleItemsInCart(product.id, "add", true)}
                      className="btn-product"
                    >
                      <b>В корзину</b>
                    </button>
                  ) : (
                    <div className="buttons_add_del column-flex">
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
        </div>
      </main>
    </>
  );
}
