import { Link } from "react-router-dom";
import useComponentVisible from "../hooks/useComponentVisible";
import PhoneNumber from "./PhoneNumber";
import { ReactComponent as Telegram } from "../images/icons/tg.svg";
import { ReactComponent as Viber } from "../images/icons/viber.svg";
import { ReactComponent as Whatsup } from "../images/icons/whatsup.svg";
import { ReactComponent as Email } from "../images/icons/email.svg";
import { useState, useEffect } from "react";
export default function Contacts() {
  const [phoneRef, isPhoneShown, setPhoneShown] = useComponentVisible(false);
  const [isButtonsShown, setButtonsShown] = useState(true);
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
  const handleConatcts = (e) => {
    e.preventDefault();
    setButtonsShown(!isButtonsShown);

  };
  // const handleAnimationEnd = (e) => {
  //   e.preventDefault();
  //   setButtonsShown(true);
  // };
  useEffect(()=>{
    const contacts = document.getElementById('contacnts')
    // contacts.
    if(window.location.href.search('item')!==-1){
      contacts.style = 'width:450px'
    }
  },[])

  const Buttons = () => {
    return (
      <div 
      // className={`contacts_icons ${isButtonsShown ? 'hidden' : 'created'}`}
      className='contacts_icons'
      // onAnimationEnd={(e)=>handleConatcts(e)}

      >
        <a href="mailto:ImpulsServiceCentre@yandex.ru&body=Новый_Заказ" style={{left:"10px", position:"relative"}}>
          <Email />
        </a>
        <a href="https://t.me/+79854361331">
          <Telegram />
        </a>
        <a href="#/" alt="">
          <Viber />
        </a>
        <a href="https://api.whatsapp.com/send/?phone=79854361331&text&type=phone_number&app_absent=0">
          <Whatsup />
        </a>
      </div>
    );
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
          Показать номер
        </button>
        <Buttons />
        
        <div ref={phoneRef}>{isPhoneShown ? <PhoneNumber /> : <></>}</div>
      </div>
    </>
  );
}
