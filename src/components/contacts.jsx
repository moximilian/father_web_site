import { Link } from "react-router-dom";
import useComponentVisible from "../hooks/useComponentVisible";
import PhoneNumber from './PhoneNumber'
export default function Contacts() {
  const [phoneRef, isPhoneShown, setPhoneShown] = useComponentVisible(false);
  const handleVisibility = () => {
    const dim_element = document.getElementById("dim");
    dim_element.classList.add("dim_filter");
    const note = document.querySelector(".dim_filter");
    note.style.width = window.innerWidth + "px";
    note.style.height =
      document.height !== undefined
        ? document.height
        : document.body.offsetHeight + "px";
  };
  const togglePhone = () => {
    handleVisibility();
    setPhoneShown(true);
  };
  return (
    <>
      <div id="contacnts">
        <Link to="/cart/" className="order">
          Оформить заказ
        </Link>
        <button onClick={() => togglePhone()} className="contact no_bg">
          <b>Показать номер</b>
        </button>
        <div className="contact">Написать</div>
        <a className="contact" href="https://t.me/+79854361331">
          Telegram
        </a>
        <div className="contact">Viber</div>
        <div
          className="contact"
          href="https://api.whatsapp.com/send/?phone=79854361331&text&type=phone_number&app_absent=0"
        >
          WhatsApp
        </div>
        <div ref={phoneRef}>
            {isPhoneShown ? (
              <PhoneNumber/>
            ) : (
              <></>
            )}
          </div>
      </div>
    </>
  );
}
