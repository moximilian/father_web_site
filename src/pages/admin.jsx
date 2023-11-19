import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router";
import {
  getAdmin,
  addNewItem,
  getAllProducts,
  deleteItemFromDB,
  addNewProm,
  createNew,
  changeNew,
  getAllPromotions,
  delNew,
  getAllNews,
  changePromotion,
  deletePromFromDB,
} from "../server/firebase_server";
import { firebaseConfig } from "../server/firebase_server";
import { initializeApp } from "firebase/app";
import ScrollButton from "../components/ScrollButton";
import {
  getStorage,
  ref,
  uploadBytes,
  listAll,
  deleteObject,
} from "firebase/storage";
import "./admin.css";
import { getFirestore } from "firebase/firestore/lite";
export default function Admin() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [name, setName] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [pass, setPass] = useState("");
  const [products, setProducts] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [news, setNews] = useState([]);
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
      setPromotions(prom);
      const news = await getAllNews(db);
      setNews(news);
      localStorage.setItem("user_name", JSON.stringify(name));
      localStorage.setItem("user_pass", JSON.stringify(pass));
    }
  };
  const updatePage = async () => {
    const prod = await getAllProducts(db);
    setSelectedImage(null);

    setProducts(prod);
    getFileList(storage);
  };
  const handleNameChange = (e) => {
    const { name, value, validationMessage } = e.target;
    setName(value);
  };
  const handlePassChange = (e) => {
    const { name, value, validationMessage } = e.target;
    setPass(value);
  };

  var productsToShow = products;
  // const [productsToShow, SetproductsToShow] = useState(products);
  // var prodoctsGroups = products.slice(startIndex, endIndex);
  var prodoctsGroups;
  prodoctsGroups = products.reduce((unique, product) => {
    const group = unique.find((item) => item.name === product.group);
    if (!group) {
      unique.push({ id: unique.length + 1, name: product.group });
    }
    return unique;
  }, []);

  const logout = () => {
    setIsLoggedIn(false);
    setSelectedImage(null);
    navigate("/");
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
      const blob = new Blob([reader.result], { type: file.type });
      setSelectedImage(blob);
    };
    reader.readAsArrayBuffer(file);
  };
  // const [base64String, setBase4String] = useState('')
  const addNEWITEM = async (
    e,
    new_name,
    new_group,
    new_price,
    new_desc,
    base64String
  ) => {
    const new_id = products.length + 1;
    await addNewItem(
      db,
      new_name,
      new_group,
      new_price,
      new_desc,
      base64String,
      new_id
    );
    updatePage();
  };
  const addNEWPROM = async (e, new_name, new_date, new_desc, base64String) => {
    const new_id = promotions.length + 1;
    await addNewProm(db, new_name, new_date, new_desc, base64String, new_id);
    updatePage();
  };
  const addNEWNEW = async (e, new_name, new_date, new_desc, base64String) => {
    const new_id = news.length + 1;
    await createNew(db, new_name, new_date, new_desc, base64String, new_id);
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
        addNEWITEM(e, new_name, new_group, new_price, new_desc, base64String);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const createNewNew = async (e) => {
    //news_title news_date news_desc
    e.preventDefault();
    var news_title = document.getElementById("news_title")?.value;
    var news_date = document.getElementById("news_date")?.value;
    var news_desc = document.getElementById("news_desc")?.value;
    blobToString(selectedImage)
      .then((base64String) => {
        addNEWNEW(e, news_title, news_date, news_desc, base64String);
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
        addNEWPROM(e, new_name, new_date, new_desc, base64String);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const deleteProd = async (e, old_prod) => {
    e.preventDefault();
    await deleteItemFromDB(db, old_prod);
    updatePage();
  };
  const deleteProm = async (e, old_prom) => {
    e.preventDefault();
    await deletePromFromDB(db, old_prom);
    updatePage();
  };
  const deleteNew = async (e, old_news) => {
    e.preventDefault();
    await delNew(db, old_news);
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
    alert("Акция именена!");
  };

  const changeNewData = async (e, new_id, old_new) => {
    //title_new_no date_new_no desc_new_no
    var new_title = document.getElementById(`title_new_no${new_id}`)?.value;
    var new_date = document.getElementById(`date_new_no${new_id}`)?.value;
    var new_desc = document.getElementById(`desc_new_no${new_id}`)?.value;
    if (new_title === "") {
      new_title = old_new.name;
    }
    if (new_date === "") {
      new_date = old_new.date;
    }
    if (new_desc === "") {
      new_desc = old_new.description;
    }
    await changeNew(db, new_title, new_date, new_desc, old_new.id);
    alert("Новость именена!");
    updatePage();
  };

  const handleXLSXChange = (event) => {
    setFile(event.target.files[0]);
  };
  const handleXLSXUpload = (e) => {
    e.preventDefault();
    if (file) {
      const storageRef = ref(storage, file.name);
      uploadBytes(storageRef, file)
        .then((snapshot) => {
          alert(`Файл ${file.name} был добавлен в базу данных успешно`);
          getFileList(storage);
        })
        .catch((err) => {
          alert(` Файл ${file.name} не был добавлен в базу данных :(`);
          console.log(err);
        });
    }
  };
  const [alreadyCreatedFileLists, setCreatedFileLists] = useState([]);
  const getFileList = async (storage) => {
    try {
      const files_arr = [];
      const res = await listAll(ref(storage, "/"));
      res.items.map((file) => {
        return files_arr.push(file?.name);
      });
      setCreatedFileLists(files_arr);
    } catch (err) {
      console.log(err);
    }
  };
  const deletePriceList = async (e, file_name) => {
    e.preventDefault();
    await deleteObject(ref(storage, file_name));
    getFileList(storage);
  };
  const checkAuth = async (password, username) => {
    const result = await getAdmin(db);
    if (result[0]?.pass === password && result[0]?.username === username) {
      setIsLoggedIn(true);
      const prod = await getAllProducts(db);
      setProducts(prod);
      const prom = await getAllPromotions(db);
      setPromotions(prom);
      const news = await getAllNews(db);
      setNews(news);
    }
  };
  const SmoothScrollTo = (e, path) => {
    e.preventDefault();
    document.querySelector(path).scrollIntoView({
      behavior: "smooth",
    });
  };
  useEffect(() => {
    getFileList(storage);

    const user_name_LS = JSON.parse(localStorage.getItem("user_name"));
    const user_pass_LS = JSON.parse(localStorage.getItem("user_pass"));
    if (user_name_LS !== null && user_pass_LS !== null) {
      checkAuth(user_pass_LS, user_name_LS);
    }
  }, []);
  function removeHtmlTags(input) {
    const regex = /<[^>]+>/g;
    return input.replace(regex, "");
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
              <button
                onClick={(e) => SmoothScrollTo(e, "#catalog")}
                className="link"
              >
                {"Каталог"}
              </button>
              <button
                onClick={(e) => SmoothScrollTo(e, "#promotions")}
                className="link"
              >
                {"Акции"}
              </button>
              <button
                onClick={(e) => SmoothScrollTo(e, "#news")}
                className="link"
              >
                {"Новости"}
              </button>
            </div>
          </div>
          <>
            <ScrollButton />
            <div id="xlsx-files">
              <h1>Загрузка прайс листов</h1>
              <div className="item_container_">
                <div className="download">
                  <input
                    type="file"
                    accept=".xlsx, .xls, .pdf, .docx, .doc, .docm"
                    onChange={handleXLSXChange}
                  />
                  <button
                    className="admin_submit"
                    onClick={(e) => handleXLSXUpload(e)}
                  >
                    Загрузить файл
                  </button>
                </div>
              </div>
              <div className="item_container_">
                {alreadyCreatedFileLists.map((file) => (
                  <div className="pricelist">
                    {file}
                    <button
                      className="admin_submit_delete"
                      onClick={(e) => deletePriceList(e, file)}
                    >
                      {" "}
                      Удалить файл
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div id="catalog">
              <h1>Каталог</h1>
              <div className="item_container_">
                <form
                  onSubmit={(e) => createNewProduct(e)}
                  encType="multipart/form-data"
                >
                  <div className="product_one small">
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
                      id="new_group"
                      className="admin_prod_input"
                      placeholder="Группа"
                    />
                    <input
                      id="new_price"
                      className="admin_prod_input"
                      placeholder="Новая цена"
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
                  <Link to={"/item-change?id=" + product.id} className="link">
                    <div key={product.id} className="product_">
                      <img
                        src={"data:image/jpg;base64," + product.image}
                        alt=""
                        className="catalog-image_"
                      />
                      <div className="flex-col">
                        <div className="description-small">{product.name}</div>
                      </div>

                      <div className="flex-col">
                        <div>{product.group}</div>
                      </div>

                      <div className="flex-col">
                        <div>{product.price}</div>
                      </div>
                      <div>
                        <div className="flex-row">
                          <div className="description-small">
                            {removeHtmlTags(product.description.slice(0, 50))}
                            ...
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={(e) => deleteProd(e, product.id)}
                        className="admin_submit_delete"
                      >
                        Удалить
                      </button>
                    </div>
                  </Link>
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
                  <div className="product_one small">
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
                    <input
                      id="new_prom_date"
                      className="admin_prod_input"
                      placeholder="Новое время акции "
                    />
                    <textarea
                      id="new_prom_desc"
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
                {promotions.map((product) => (
                  <form
                    onSubmit={(e) =>
                      changePromotionData(e, product.id, product)
                    }
                  >
                    <div key={product.id} className="product_one">
                      <img
                        src={"data:image/jpg;base64," + product.image}
                        alt=""
                        className="catalog-image_"
                      />
                      <div className="flex-col">
                        <textarea
                          id={`name_prom_no${product.id}`}
                          className="admin_prod_input"
                          defaultValue={product.name}
                          cols={"50"}
                        />
                      </div>
                      <div className="flex-col">
                        <textarea
                          id={`date_prom_no${product.id}`}
                          className="admin_prod_input"
                          defaultValue={product.date}
                          cols={"30"}
                        />
                      </div>
                      <div>
                        <div className="flex-row">
                          <textarea
                            id={`desc_prom_no${product.id}`}
                            className="admin_prod_input_area"
                            defaultValue={product.description}
                          />
                        </div>
                      </div>
                      <input
                        className="admin_submit"
                        type="submit"
                        value="Изменить"
                      />
                      <button
                        onClick={(e) => deleteProm(e, product.id)}
                        className="admin_submit_delete"
                      >
                        Удалить
                      </button>
                    </div>
                  </form>
                ))}
              </div>
            </div>
            <div id="news">
              <h1>Новости</h1>
              <div className="item_container_">
                <form
                  onSubmit={(e) => createNewNew(e)}
                  encType="multipart/form-data"
                >
                  <div className="product_one small">
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
                    <textarea
                      id="news_title"
                      className="admin_prod_input"
                      placeholder="Название новости"
                      cols={"30"}
                    />
                    <input
                      id="news_date"
                      className="admin_prod_input"
                      placeholder="Дата новости"
                    />
                    <textarea
                      id="news_desc"
                      className="admin_prod_input_area"
                      placeholder="Описание новости"
                    />
                    <input
                      className="admin_submit"
                      type="submit"
                      value="Создать"
                    />
                  </div>
                </form>
              </div>
              {news.map((New) => (
                <>
                  <form onSubmit={(e) => changeNewData(e, New.id, New)}>
                    <div key={New.id} className="product_one">
                      <img
                        src={"data:image/jpg;base64," + New.image}
                        alt=""
                        className="catalog-image_"
                      />
                      <div className="flex-col">
                        <textarea
                          id={`title_new_no${New.id}`}
                          className="admin_prod_input"
                          defaultValue={New.title}
                          cols={"50"}
                        />
                      </div>
                      <div className="flex-col">
                        <input
                          id={`date_new_no${New.id}`}
                          className="admin_prod_input"
                          defaultValue={New.date}
                          cols={"50"}
                        />
                      </div>
                      <div className="flex-col">
                        <textarea
                          id={`desc_new_no${New.id}`}
                          className="admin_prod_input"
                          defaultValue={New.description}
                          cols={"50"}
                        />
                      </div>
                      <input
                        className="admin_submit"
                        type="submit"
                        value="Изменить"
                      />
                      <button
                        onClick={(e) => deleteNew(e, New.id)}
                        className="admin_submit_delete"
                      >
                        Удалить
                      </button>
                    </div>
                  </form>
                </>
              ))}
            </div>
          </>
        </div>
      )}
    </>
  );
}
