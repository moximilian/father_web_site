import { useSearchParams, Link } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/footer";
import { useNavigate } from "react-router";
import "../item.css";
import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore/lite";
import {
  firebaseConfig,
  getAllProducts,
  changeItem,
} from "../server/firebase_server";
import { ReactComponent as ArrowLeft } from "../images/icons/arrow-left.svg";

export default function ItemInAdmin() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState();
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  useEffect(() => {
    const FetchData = async () => {
      const prod = await getAllProducts(db);
      setProducts(prod);
    };
    FetchData();
  }, []);
  useEffect(() => {
    const product_id = searchParams.get("id");
    const product_l = products.find(
      (product_to) => product_to.id === parseInt(product_id)
    );
    setProduct(product_l);
  }, [products]);
  let [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const user_name_LS = JSON.parse(localStorage.getItem("user_name"));
    const user_pass_LS = JSON.parse(localStorage.getItem("user_pass"));
    if (user_name_LS === null || user_pass_LS === null) {
      navigate("/");
    }
  }, []);
  const [additionalFieldsCount, setAdditionalFieldsCount] = useState(0);
  const createNewProp = (e) => {
    e.preventDefault();
    const desc = document.getElementById("description");
    const input1 = document.createElement("input");
    const div = document.createElement("div");

    setAdditionalFieldsCount(additionalFieldsCount + 1);
    input1.setAttribute("id", "field_name_no" + additionalFieldsCount);
    const input2 = document.createElement("input");
    input2.setAttribute("id", "field_value_no" + additionalFieldsCount);

    div.appendChild(input1);
    div.appendChild(input2);

    desc.appendChild(div);
  };

  const changeData = async (e, product_id, old_prod) => {
    e.preventDefault();
    var new_name = document.getElementById(`name_no${product_id}`)?.value;
    var new_price = document.getElementById(`price_no${product_id}`)?.value;
    var new_desc = document.getElementById(`desc_no${product_id}`)?.value;
    var new_group = document.getElementById(`group_no${product_id}`)?.value;
    var new_size = document.getElementById(`size_no${product_id}`)?.value;
    var new_manif = document.getElementById(`manif_no${product_id}`)?.value;

    var data = [];
    for (let i = 0; i < additionalFieldsCount; i++) {
      var field_name = document.getElementById(`field_name_no${i}`)?.value;
      var field_value = document.getElementById(`field_value_no${i}`)?.value;
      var obj = {};
      obj[field_name] = field_value;
      data.push(obj);
    }

    if (new_name === "") {
      new_name = old_prod.name;
    }
    if (new_price === "") {
      new_price = old_prod.price;
    }
    if (new_desc === "") {
      new_desc = old_prod.description;
    }
    if (new_group === "") {
      new_group = old_prod.group;
    }
    if (new_size === "") {
      new_size = old_prod.size;
    }
    if (new_manif === "") {
      new_manif = old_prod.manif;
    }
    if (typeof new_size === "undefined") {
      new_size = " ";
    }
    if (typeof new_manif === "undefined") {
      new_manif = " ";
    }

    try {
      await changeItem(
        db,
        new_name,
        new_group,
        new_price,
        new_desc,
        new_size,
        new_manif,
        JSON.stringify(data),
        old_prod.id
      );
      alert("Данные успешно обновились!");
    } catch (err) {
      console.log(err);
      alert("Произошла ошибка");
    }
  };

  return (
    <>
      <Header
        pages={[
          { name: "Главная", scrolled: false, path: "/" },
          { name: "Каталог", scrolled: false, path: "/catalog" },
          { name: "Администрирование", scrolled: false, path: "/admin" },
          { name: "Товар", scrolled: false, path: `/item?id=${product?.id}` },
        ]}
      />
      <div id="dim"></div>
      <div className="main-thing">
        <div className="main-container">
          <Link to="/admin/">
            <div className="get-back">
              <ArrowLeft />
              Назад
            </div>
          </Link>
          {product ? (
            <>
              <form onSubmit={(e) => changeData(e, product.id, product)}>
                <div className="product-one">
                  <img
                    className="image-item"
                    src={"data:image/jpg;base64," + product.image}
                    alt={product.name}
                  />
                  <div className="product-texting">
                    <input
                      id={`group_no${product.id}`}
                      className="grey-text"
                      onChange={(e) => {
                        e.preventDefault();
                        const new_prod_group = e.target.value;
                        product.group = new_prod_group;
                      }}
                      defaultValue={product.group}
                    />
                    <h1>
                      <input
                        defaultValue={product.name}
                        id={`name_no${product.id}`}
                        className="bold-small-item"
                        onChange={(e) => {
                          e.preventDefault();
                          const new_prod_name = e.target.value;
                          product.name = new_prod_name;
                        }}
                      />
                    </h1>
                    <input
                      className="price"
                      defaultValue={product.price}
                      id={`price_no${product.id}`}
                      onChange={(e) => {
                        e.preventDefault();
                        const new_prod_price = e.target.value;
                        product.price = new_prod_price;
                      }}
                    />
                  </div>
                </div>
                <div className="desc">
                  <h1>Описание</h1>
                  <textarea
                    cols="140"
                    id={`desc_no${product.id}`}
                    // className="admin_prod_input_area"
                    defaultValue={product.description}
                    onChange={(e) => {
                      e.preventDefault();
                      const new_prod_desc = e.target.value;
                      product.price = new_prod_desc;
                    }}
                  />
                </div>
                <div className="desc">
                  <h1>Характеристики</h1>
                  <button onClick={(e) => createNewProp(e)}>
                    Добавить поле
                  </button>
                  <br></br>
                  <div id="description">
                    {product.data ? (
                      JSON.parse(product?.data)?.map((value, index) => {
                        return (
                          <div>
                            <input
                              defaultValue={Object.keys(value)[0]}
                              id={"field_name_no" + index}
                            ></input>
                            <input
                              defaultValue={Object.values(value)[0]}
                              id={"field_value_no" + index}
                            ></input>
                          </div>
                        );
                      })
                    ) : (
                      <></>
                    )}
                  </div>
                  Производитель:{" "}
                  <input
                    id={`manif_no${product.id}`}
                    // className="admin_prod_input_area"
                    defaultValue={product.manif}
                    onChange={(e) => {
                      e.preventDefault();
                      const new_prod_manif = e.target.value;
                      product.manif = new_prod_manif;
                    }}
                  />
                  <br></br>
                  Габариты:{" "}
                  <input
                    id={`size_no${product.id}`}
                    // className="admin_prod_input_area"
                    defaultValue={product.size}
                    onChange={(e) => {
                      e.preventDefault();
                      const new_prod_size = e.target.value;
                      product.size = new_prod_size;
                    }}
                  />
                </div>
                <input className="asubmit" type="submit" value="Изменить" />
              </form>
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
