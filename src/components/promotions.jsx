import "../slider.css";
import { useEffect, useState } from "react";
import { firebaseConfig } from "../server/firebase_server";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore/lite";
import { getAllPromotions } from "../server/firebase_server";

export default function Promotions() {
  const [images, setPromotions] = useState([]);
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  useEffect(() => {
    const FetchData = async () => {
      const prod = await getAllPromotions(db);
      setPromotions(prod);
      const slider = document.querySelector('.slider');
      slider.style.backgroundColor = 'transparent';
    };
    FetchData();
  }, []);
  const [currentSlide, setCurrentSlide] = useState(1);
  const nextSlide = () => {
    setCurrentSlide((currentSlide + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentSlide((currentSlide - 1 + images.length) % images.length);
  };

  setTimeout(()=> {
    nextSlide()
}, 5000);
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
                

                  <div className="slide-main-text"><td dangerouslySetInnerHTML={{__html: image.name}} /></div>
                  <div className="slide-alter-text"><td dangerouslySetInnerHTML={{__html: image.description}} /></div>
                  <div className="grey-text"><td dangerouslySetInnerHTML={{__html: image.date}} /></div>
                </div>
              </div>
            ))}

            {images.length === 0 ? (
              <>
                <div
                  className="slide active"
                  style={{ transform: `translateX(-${0 * 100}%)` }}
                >
                  <div id="container" className="fake-animation">
                      <div id="slider-image" className="fake-image"></div>


                    <div className="fake-text">
                      <div className="slide-main-text fake-main"></div>
                      <div className="slide-alter-text fake-alter"></div>
                      <div className="grey-text fake"></div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="slider-controls">
                  <button className="prev-btn" onClick={prevSlide}>
                    &#10094;
                  </button>
                  <button className="next-btn" onClick={nextSlide}>
                    &#10095;
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
