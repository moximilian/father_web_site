import { TelegramClient } from "messaging-api-telegram";
import { getAPIKey } from "../server/firebase_server";
import { firebaseConfig } from "../server/firebase_server";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore/lite";
import {useState} from 'react'
window.Buffer = window.Buffer || require("buffer").Buffer;



export default function SendMessageToTG(formData) {
  const [key, setKey] = useState('')
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  getAPIKey(db)
  .then((res)=>{
    const key = res
    // console.log(key)
    setKey(key[0].key)
  })
  .catch((err)=>{
    console.log(err)
  })


  const client = new TelegramClient({
    accessToken: key,
  });

  client.getWebhookInfo().catch((error) => {
    console.log(error); // formatted error message
    console.log(error.stack); // error stack trace
    console.log(error.config); // axios request config
    console.log(error.request); // HTTP request
    console.log(error.response); // HTTP response
  });
  var error;
  const email = formData.email !== "" ? `Адрес электронной почты: ${formData.email} \n`: "";
  const phone = formData.comment !== "" ? `Комментарий: ${formData.comment} \n` : "";
  const order = formData.order !== ""  && formData.order !== undefined ? `${formData.order}`: "";
  const total = formData.total !== "" && formData.total !== undefined ? `${formData.total}`: "";

  const message =
    "НОВЫЙ ЗАКАЗ \n" +
    `Заказчик: ${formData.name} \n` +
    `Номер телефона: ${formData.phone} \n` +
    email +
    phone +
    "Заказ: \n" +
    order +
    `Общая сумма заказа: ${total}₽`;
  console.log(formData.order);
    client
      .sendMessage("470176970", message)
      .then(() => {
        return true;
      })
      .catch((err) => {
        return false;
      });

}
