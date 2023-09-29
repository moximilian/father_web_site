import "../slider.css";
import { useEffect, useState } from "react";
import { firebaseConfig } from "../server/firebase_server";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore/lite";
import { getAllPromotions } from "../server/firebase_server";

export default function Promotions() {
  // const images = [
  //   {
  //     src: "images/priority-promotion1.png",
  //     main_text: "Сделайте заказ на сумму от 100 тыс руб, получите доп скидку.",
  //     alter_text:
  //       "Данная акция запускается с целью наибольшей лояльности по цене к новым клиентам компании, дополнительная скидка просчитывается индивидуально.",
  //     date: "с 31.08.2023 по 30.09.2023",
  //   },
  //   {
  //     src: "images/priority-promotion2.png",
  //     main_text: "Пика к отбойному молотку П11",
  //     alter_text:
  //       "Предлагаем со склада в Москве и под заказ пневмо отбойные молотки расходные материалы к ним, оснастки. Кратчайшие сроки поставки. Акция: до 1.10.2023 цена пики при заказе от 10 коробок (150шт) 290 руб",
  //     date: "с 21.08.2023 по 21.09.2023",
  //   },
  //   {
  //     src: "images/priority-promotion3.png",
  //     main_text:
  //       "Абонентское обслуживание окон рольставень гаражных секционных ворот",
  //     alter_text:
  //       "Новый проект нашей компании, годовое обслуживаете, платите раз в год, два сезонных обслуживания входят в эту стоимость работы, замена запчастей оплачивается отдельно. Выезд мастера, дефектовка.",
  //     date: "с 09.08.2023 по 30.11.2023",
  //   },
  // ];

  const [images, setPromotions] = useState([]);
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  useEffect(() => {
    const FetchData = async () => {
      const prod = await getAllPromotions(db);
      setPromotions(prod);
    };
    FetchData();
  }, [db]);
  const [currentSlide, setCurrentSlide] = useState(1);
  function createBlurredBackground(imageElement, containerElement) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    // Set canvas dimensions to match the image
    canvas.width = imageElement.width;
    canvas.height = imageElement.height;

    // Draw the image onto the canvas
    context.drawImage(imageElement, 0, 0);

    // Apply blur effect to the canvas
    context.filter = "blur(10px)";

    // Scale the canvas to fit the container
    const scale = Math.max(
      containerElement.offsetWidth / canvas.width,
      containerElement.offsetHeight / canvas.height
    );
    canvas.width *= scale;
    canvas.height *= scale;

    // Convert the canvas to a data URL
    const dataUrl = canvas.toDataURL();

    // Set the data URL as the background image of the container
    // containerElement.backgroundImage = `url(${dataUrl})`;
    containerElement.style.setProperty('background-image',`url(${dataUrl})`);
  }
  const nextSlide = () => {
    setCurrentSlide((currentSlide + 1) % images.length);

    const imageElement = document.getElementById("slider-image");
    const containerElement = document.getElementById("container");
    console.log(imageElement, containerElement)
    createBlurredBackground(imageElement, containerElement);
  };

  const prevSlide = () => {
    setCurrentSlide((currentSlide - 1 + images.length) % images.length);
    const imageElement = document.getElementById("slider-image");
    const containerElement = document.getElementById("container");
    createBlurredBackground(imageElement, containerElement);
  };

  return (
    <>
      <div id="promotions">
        <div className="slider-container">
          <div className="slider">
            {images.map((image, index) => (
              <div
                key={index}
                className={`slide ${index === currentSlide ? "active" : ""}`}
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                <div id="container">
                  <img
                    id="slider-image"
                    src={"data:image/jpg;base64," + image.image}
                    alt={`Slide ${index + 1}`}
                  />
                </div>
                <div className="text">
                  <div className="slide-main-text">{image.name}</div>
                  <div className="slide-alter-text">{image.description}</div>
                  <div className="grey-text">{image.date}</div>
                </div>
              </div>
            ))}
            <div className="slider-controls">
              <button className="prev-btn" onClick={prevSlide}>
                &#10094;
              </button>
              <button className="next-btn" onClick={nextSlide}>
                &#10095;
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
