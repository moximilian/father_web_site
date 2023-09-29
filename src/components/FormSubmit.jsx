import { Formik, Form, Field, ErrorMessage } from "formik";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import * as yup from "yup";
import { schema } from "./validation";
import products from "../products.json";
import SendMessageToTG from "../hooks/telegram_send";
import Inputmask from "inputmask";
export default function FormSubmit() {
  const itemsInCart = useSelector((state) => state.itemsInCart);
  const [Name, setName] = useState("");
  const [Email, setEmail] = useState("");
  const [Phone, setPhone] = useState("");
  const [Comment, setComment] = useState("");

  const [isValidPhone, setIsValidPhone] = useState(false);
  const [errors, setErrors] = useState({ name: "", phone: "", email: "" });
  const [isValidName, setIsValidName] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [isSubmited, setIsSubmited] = useState("undefined");

  const [sumAll, setSumAll] = useState();
  const idsToSelect = itemsInCart[1]?.map((product) => product.id);
  const filteredProducts = products?.filter((product) =>
    idsToSelect?.includes(product.id)
  );

  const [submissionCounter, setSubmissionCounter] = useState(0);
  const [submissionTimestamps, setSubmissionTimestamps] = useState([]);
  // console.log(filteredProducts.find((p)=>p?.id === 1).name)

  const result = itemsInCart[1]?.map((item) => ({
    name: filteredProducts?.find((p) => Number(p?.id) === Number(item?.id))?.name,
    count: item?.count,
  }));
  const cleanedResult = result?.filter((item) =>Object?.values(item)?.every((value) => value !== undefined));
  //   const result ='';

  const handleChangeName = (e) => {
    setIsSubmited("undefined");
    const { name, value, validationMessage } = e.target;
    const nameschema = yup.object().shape({
      name: schema.fields.name,
    });
    nameschema
      .validate({ name: value })
      .then(() => {
        setIsValidName(true);
        setErrors((prev) => ({
          ...prev,
          name: "",
        }));
        console.log("good", value);
      })
      .catch((errors) => {
        setIsValidName(false);
        console.log("bad");
        setErrors((prev) => ({
          ...prev,
          name: errors.errors,
        }));
      });
    setName(value);
  };
  useEffect(() => {
    const form = document.querySelector(".form");
    const telSelector = form.querySelector('input[type="tel"');
    const inputMask = new Inputmask("+7 (999) 999-99-99");
    inputMask.mask(telSelector);
  }, []);
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

  const handleChangePhone = async (e) => {
    setIsSubmited("undefined");
    const { name, value, validationMessage } = e.target;

    const phoneSchema = yup.object().shape({
      phone: schema.fields.phone,
    });
    phoneSchema
      .validate({ phone: value })
      .then(() => {
        setIsValidPhone(true);
        setErrors((prev) => ({
          ...prev,
          phone: "",
        }));
      })
      .catch((errors) => {
        setIsValidPhone(false);
        setErrors((prev) => ({
          ...prev,
          phone: errors.errors,
        }));
      });

    setPhone(value);
  };
  const handleChangeEmail = async (e) => {
    setIsSubmited("undefined");
    const { name, value, validationMessage } = e.target;

    const emailSchema = yup.object().shape({
      email: schema.fields.email,
    });
    emailSchema
      .validate({ email: value })
      .then(() => {
        setErrors((prev) => ({
          ...prev,
          email: "",
        }));
      })
      .catch((errors) => {
        setErrors((prev) => ({
          ...prev,
          email: errors.errors,
        }));
      });

    setEmail(value);
  };
  const handleChangeComment = (e) => {
    setIsSubmited("undefined");
    const { name, value, validationMessage } = e.target;
    setComment(value);
  };
  useEffect(() => {
    // Retrieve submission data from local storage when the component mounts
    const storedSubmissionCounter = localStorage.getItem("submissionCounter");
    const storedSubmissionTimestamps = localStorage.getItem(
      "submissionTimestamps"
    );

    if (storedSubmissionCounter && storedSubmissionTimestamps) {
      setSubmissionCounter(parseInt(storedSubmissionCounter));
      setSubmissionTimestamps(JSON.parse(storedSubmissionTimestamps));
    }
  }, []);

  useEffect(() => {
    // Save submission data to local storage whenever it changes
    localStorage.setItem("submissionCounter", submissionCounter);
    localStorage.setItem(
      "submissionTimestamps",
      JSON.stringify(submissionTimestamps)
    );
  }, [submissionCounter, submissionTimestamps]);

  const tableHtml = `${cleanedResult?.map((row) => `${row.name} --- ${row.count}шт\n`).join("")}`;

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmissionCounter(submissionCounter + 1);
    const currentTimestamp = new Date().getTime();
    setSubmissionTimestamps([...submissionTimestamps, currentTimestamp]);
    const oneHourAgo = currentTimestamp - 3600000; // 3600000 milliseconds = 1 hour
    const recentSubmissions = submissionTimestamps.filter(
      (timestamp) => timestamp > oneHourAgo
    );
    if (recentSubmissions.length >= 100000) {
      // make 5 later
      setErrors({
        name: "",
        phone: "",
        email: "Слишком много попыток отправить, повторите позднее",
      });
      setIsSubmited(false);
      return;
    }

    if (isValidName && isValidPhone) {
      const formData = {
        name: Name,
        phone: Phone,
        email: Email,
        comment: Comment,
        order: tableHtml,
        total: sumAll,
      };

      if (
        formData.order !== "" &&
        formData.order !== undefined &&
        formData.order !== "undefined"
      ) {
        const isSent = SendMessageToTG(formData);
        // if (isSent) {
        //   setIsSubmited(true);
        // } else {
        //   setErrors({ name: "", phone: "", email: "Ошибка отправки формы, повторите позднее" });
        //   setIsSubmited(false);
        //   return
        // }
        // console.log(cleanedResult);
        setIsSubmited(true);
        document.getElementById("form").reset();
      } else {
        setErrors({ name: "", phone: "", email: "Корзина пуста" });
        setIsSubmited(false);
      }
    } else {
      setErrors({ name: "", phone: "", email: "Ошибка валидации" });

      setIsSubmited(false);
    }
  };
  return (
    <>
      <div className="delivery-info">
        <div className="bold-medium">Информация о доставке</div>
        <div>
          Доставка курьером, 3–5 дней — 1 500 ₽. при заказе от 10 000 ₽ —
          бесплатно
        </div>
      </div>
      <div className="form-container">
        
        <form
          action="#"
          onSubmit={handleFormSubmit}
          className="form"
          method="POST"
          id="form"
        >
          {isSubmited === true && (
          <div className="success">
            Успешно! В близжайшее время мы с вами свяжемся!
          </div>
        )}
          <input
            className={errors.name || isSubmited === false ? "error" : "input"}
            name="name"
            placeholder="Как вас зовут*"
            onChange={handleChangeName}
            value={Name}
          />
          {errors.name || isSubmited === false ? (
            <div className=".input_err">{errors.name}</div>
          ) : (
            <></>
          )}

          <input
            className={errors.phone || isSubmited === false ? "error" : "input"}
            name="phone"
            placeholder="Телефон*"
            type="tel"
            onChange={handleChangePhone}
            value={Phone}
          />
          {errors.phone || isSubmited === false ? (
            <div className=".input_err">{errors.phone}</div>
          ) : (
            <></>
          )}

          <input
            className={errors.email || isSubmited === false ? "error" : "input"}
            name="mail"
            type="email"
            placeholder="Эл. почта"
            onChange={handleChangeEmail}
            value={Email}
          />

          {errors.email || isSubmited === false ? (
            <div className=".input_err">{errors.email}</div>
          ) : (
            <></>
          )}

          <input
            className="input"
            name="comment"
            placeholder="Комментарий"
            onChange={handleChangeComment}
            value={Comment}
          />
          <input
            type="text"
            name="order"
            value={JSON.stringify(cleanedResult)}
            hidden
          />
          <input type="text" name="total" value={sumAll} hidden />

          <button type="submit" className="btn-submit">
            Оформить заказ
          </button>
        </form>

        <div className="personal-data">
          Нажимая «Оформить заказ», вы соглашаетесь на обработку указанных
          данных на условиях Политики конфиденциальности и организацией,
          оказывающей услуги, для целей бронирования услуг.
        </div>
        
      </div>
    </>
  );
}
