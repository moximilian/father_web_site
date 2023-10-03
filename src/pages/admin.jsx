import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  getAdmin,
  addNewItem,
  getAllProducts,
  changeItem,
  deleteItemFromDB,
  addNewProm,
  getAllPromotions,
  changePromotion,
  deletePromFromDB
} from "../server/firebase_server";
import { firebaseConfig } from "../server/firebase_server";
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes  } from "firebase/storage";
import Footer from "../components/footer";
import "./admin.css";
import {
  getFirestore,
  collection,
  getDocs,
  Bytes,
} from "firebase/firestore/lite";
import { ReactComponent as ArrowRight } from "../images/icons/arrow-right.svg";
import { ReactComponent as ArrowLeft } from "../images/icons/arrow-left.svg";
export default function Admin() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [name, setName] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [pass, setPass] = useState("");
  const [products, setProducts] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [file, setFile] = useState(null);

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const storage = getStorage(app, "gs://house-of-dream-d101b.appspot.com");
  const logInUser = async (e) => {
    e.preventDefault();
    const result = await getAdmin(db);
    if (result[0]?.pass === pass && result[0]?.username === name) {
      setIsLoggedIn(true);
      const prod = await getAllProducts(db);
      setProducts(prod);
      const prom = await getAllPromotions(db);
      console.log(prom);
      setPromotions(prom);
    }
  };
  const updatePage = async () => {
    const prod = await getAllProducts(db);
    setSelectedImage(null);

    setProducts(prod);
  };
  const handleNameChange = (e) => {
    const { name, value, validationMessage } = e.target;
    setName(value);
  };
  const handlePassChange = (e) => {
    const { name, value, validationMessage } = e.target;
    setPass(value);
  };

  const productsToShow = products;

  const logout = () => {
    setIsLoggedIn(false);
    setSelectedImage(null);
    // navigate('/')
  };

  function blobToString(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        const base64String = btoa(
          new Uint8Array(reader.result).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ""
          )
        );
        resolve(base64String);
      };

      reader.onerror = reject;

      reader.readAsArrayBuffer(blob);
    });
  }

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      console.log(reader.result);
      const blob = new Blob([reader.result], { type: file.type });
      setSelectedImage(blob);
    };
    reader.readAsArrayBuffer(file);
  };
  // const [base64String, setBase4String] = useState('')
  const addNEWITEM = async (e, new_name,new_group, new_price, new_desc, base64String) => {
    const new_id = products.length + 1;
    await addNewItem(db, new_name,new_group, new_price, new_desc, base64String, new_id);
    updatePage();
  };
  const addNEWPROM = async (e, new_name, new_date, new_desc, base64String) => {
    const new_id = promotions.length + 1;
    await addNewProm(db, new_name, new_date, new_desc, base64String, new_id);
    updatePage();
  };
  const createNewProduct = async (e) => {
    e.preventDefault();
    var new_name = document.getElementById("new_name")?.value;
    var new_price = document.getElementById("new_price")?.value;
    var new_desc = document.getElementById("new_desc")?.value;
    var new_group = document.getElementById("new_group")?.value; 
    blobToString(selectedImage)
      .then((base64String) => {
        // setBase4String(base64String)
        addNEWITEM(e, new_name,new_group, new_price, new_desc, base64String);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const createNewPromotion = async (e) => {
    e.preventDefault();
    var new_name = document.getElementById("new_prom_name")?.value;
    var new_date = document.getElementById("new_prom_date")?.value;
    var new_desc = document.getElementById("new_prom_desc")?.value;
    blobToString(selectedImage)
      .then((base64String) => {
        // setBase4String(base64String)
        addNEWPROM(e, new_name, new_date, new_desc, base64String);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const deleteProd = async (e, old_prod) => {
    e.preventDefault();
    console.log(old_prod);
    await deleteItemFromDB(db, old_prod);
    updatePage();
  };
  const deleteProm = async (e, old_prom)=>{
    e.preventDefault();
    console.log(old_prom);
    await deletePromFromDB(db, old_prom);
    updatePage();
  }
  const changeData = async (e, product_id, old_prod) => {
    e.preventDefault();
    var new_name = document.getElementById(`name_no${product_id}`)?.value;
    var new_price = document.getElementById(`price_no${product_id}`)?.value;
    var new_desc = document.getElementById(`desc_no${product_id}`)?.value;
    var new_group = document.getElementById(`group_no${product_id}`)?.value; 
    if (new_name === "") {
      new_name = old_prod.name;
    }
    if (new_price === "") {
      new_price = old_prod.price;
    }
    if (new_desc === "") {
      new_desc = old_prod.description;
    }
    if (new_group === ""){
      new_group = old_prod.group;
    }
    await changeItem(db, new_name,new_group, new_price, new_desc, old_prod.id);
    updatePage();
  };
  const changePromotionData = async (e, product_id, old_prod) => {
    e.preventDefault();
    var new_name = document.getElementById(`name_prom_no${product_id}`)?.value;
    var new_date = document.getElementById(`date_prom_no${product_id}`)?.value;
    var new_desc = document.getElementById(`desc_prom_no${product_id}`)?.value;
    if (new_name === "") {
      new_name = old_prod.name;
    }
    if (new_date === "") {
      new_date = old_prod.date;
    }
    if (new_desc === "") {
      new_desc = old_prod.description;
    }
    await changePromotion(db, new_name, new_date, new_desc, old_prod.id);
    updatePage();
  };

  const handleXLSXChange = (event) => {
    setFile(event.target.files[0]);
  }
  const handleXLSXUpload = () =>{
    if (file) {
      const storageRef = ref(storage, file.name)
      // const storageRef = getStorage(app).ref();
      // const fileRef = storageRef.child(file.name);
      uploadBytes(storageRef, file).then((snapshot)=>{
        console.log('uploaded a blob or file!');
        alert(`Файл ${file.name} был добавлен в базу данных успешно` )
      })
    }
  }

  return (
    <>
      {!isLoggedIn ? (
        <div className="admin-body-login">
          <div className="form_container_admin">
            <form onSubmit={(e) => logInUser(e)} className="login_form">
              <b>Войти как администратор</b>
              <input
                placeholder="Имя пользователя"
                className="login_admin_input"
                type="text"
                onChange={handleNameChange}
                value={name}
              />
              <input
                placeholder="Пароль"
                className="login_admin_input"
                type="password"
                onChange={handlePassChange}
                value={pass}
              />
              <input className="login_submit" type="submit" value="Войти" />
            </form>
          </div>
        </div>
      ) : (
        <div className="admin-body">
          <div className="navbar_container">
            <div className="navbar">
              <button className="admin_submit" onClick={() => logout()}>
                Выйти
              </button>
              <button className="admin_submit" onClick={() => updatePage()}>
                Обновить
              </button>
              
            </div>
          </div>
          <>
            <div id='xlsx-files'>
              <h1>Загрузка прайс листов</h1>
              <p>Пожалуйста, называйте свои файлы xlsx слово в слово с категориями товаров!</p>
              <div className="item_container_">
                  <div>
                  <input type="file" accept=".xlsx" onChange={handleXLSXChange} />
                  <button onClick={handleXLSXUpload}>Upload</button>
                  </div>
              </div>
            </div>
            <div id="catalog">
            <h1>Каталог</h1>
              <div className="item_container_">
                <form onSubmit={(e) => createNewProduct(e)}
                  encType="multipart/form-data"
                >
                  <div className="product_ small">
                    {selectedImage ? (
                      <img
                        className="catalog-image_"
                        src={URL.createObjectURL(selectedImage)}
                        alt="Uploaded"
                      />
                    ) : (
                      <input
                        id="fileupload"
                        type="file"
                        onChange={handleImageUpload}
                      />
                    )}
                    <input
                      id="new_name"
                      className="admin_prod_input"
                      placeholder="Новое название "
                    />
                    <input
                      id="new_price"
                      className="admin_prod_input"
                      placeholder="Новая цена"
                    />
                    <input
                      id="new_group"
                      className="admin_prod_input"
                      placeholder="Группа"
                    />
                    <textarea
                      id="new_desc"
                      className="admin_prod_input_area"
                      placeholder="Новое описание"
                    />
                    <input
                      className="admin_submit"
                      type="submit"
                      value="Создать"
                    />
                  </div>
                </form>
                {productsToShow.map((product) => (
                  <form onSubmit={(e) => changeData(e, product.id, product)}>
                    <div key={product.id} className="product_">
                      <img
                        src={"data:image/jpg;base64," + product.image}
                        alt=""
                        className="catalog-image_"
                      />
                      <div className="flex-col">
                        <div className="bold-small no-border">
                          {product.name}
                        </div>
                        <input
                          id={`name_no${product.id}`}
                          className="admin_prod_input"
                          placeholder="новое название"
                        />
                      </div>

                      <div className="flex-col">
                        <div className="bold-small no-border">
                          {product.group}
                        </div>
                        <input
                          id={`group_no${product.id}`}
                          className="admin_prod_input"
                          placeholder="новая группа"
                        />
                      </div>

                      <div className="flex-col">
                        <div className="no-border">{product.price}</div>
                        <input
                          id={`price_no${product.id}`}
                          className="admin_prod_input"
                          placeholder="новая цена"
                        />
                      </div>
                      <div>
                        <div className="flex-row">
                          <textarea
                            className="admin_prod_input_area no-border"
                            value={product.description}
                          />
                          <textarea
                            id={`desc_no${product.id}`}
                            className="admin_prod_input_area"
                            placeholder="новое описание"
                          />
                        </div>
                      </div>
                      <input
                        className="admin_submit"
                        type="submit"
                        value="Изменить"
                      />
                      <button
                        onClick={(e) => deleteProd(e, product.id)}
                        className="admin_submit_delete"
                      >
                        Удалить
                      </button>
                    </div>
                  </form>
                ))}
              </div>
            </div>
            <div id={"promotions"}>
              <h1>Акции</h1>
              <div className="item_container_">
                <form
                  onSubmit={(e) => createNewPromotion(e)}
                  encType="multipart/form-data"
                >
                  <div className="product_ small">
                    {selectedImage ? (
                      <img
                        className="catalog-image_"
                        src={URL.createObjectURL(selectedImage)}
                        alt="Uploaded"
                      />
                    ) : (
                      <input
                        id="fileupload"
                        type="file"
                        onChange={handleImageUpload}
                      />
                    )}
                    <input
                      id="new_prom_name"
                      className="admin_prod_input"
                      placeholder="Новое название "
                    />
                    <textarea
                      id="new_prom_desc"
                      className="admin_prod_input_area"
                      placeholder="Новое описание"
                    />
                    <input
                      id="new_prom_date"
                      className="admin_prod_input"
                      placeholder="Новое время акции "
                    />
                    <input
                      className="admin_submit"
                      type="submit"
                      value="Создать"
                    />
                  </div>
                </form>
                {promotions.map((product) => (
                  <form
                    onSubmit={(e) =>
                      changePromotionData(e, product.id, product)
                    }
                  >
                    <div key={product.id} className="product_">
                      <img
                        src={"data:image/jpg;base64," + product.image}
                        alt=""
                        className="catalog-image_"
                      />
                      <div className="flex-col">
                        <div className="bold-small no-border">
                          {product.name}
                        </div>
                        <input
                          id={`name_prom_no${product.id}`}
                          className="admin_prod_input"
                          placeholder="новое название акции"
                        />
                      </div>
                      <div className="flex-col">
                        <div className="no-border">{product.date}</div>
                        <input
                          id={`date_prom_no${product.id}`}
                          className="admin_prod_input"
                          placeholder="новое время акции"
                        />
                      </div>
                      <div>
                        <div className="flex-row">
                          <textarea
                            className="admin_prod_input_area no-border"
                            value={product.description}
                          />
                          <textarea
                            id={`desc_prom_no${product.id}`}
                            className="admin_prod_input_area"
                            placeholder="новое описание"
                          />
                        </div>
                      </div>
                      <input
                        className="admin_submit"
                        type="submit"
                        value="Изменить"
                      />
                      <button onClick = {(e)=>deleteProm(e,product.id)}className="admin_submit_delete"  >Удалить</button>
                    </div>
                  </form>
                ))}
              </div>
            </div>
          </>
        </div>
      )}
    </>
  );
}
