import { TelegramClient } from "messaging-api-telegram";
import { getAPIKey } from "../server/firebase_server";
window.Buffer = window.Buffer || require("buffer").Buffer;

export default function SendMessageToTG(formData) {
  const client = new TelegramClient({
    accessToken: "6315442051:AAGFVYYo_N_RG7ytaGqcbY7y90Acw05FxWY",
  });

  client.getWebhookInfo().catch((error) => {
    console.log(error); // formatted error message
    console.log(error.stack); // error stack trace
    console.log(error.config); // axios request config
    console.log(error.request); // HTTP request
    console.log(error.response); // HTTP response
  });
  var error;
  const email =
    formData.email !== ""
      ? `Адрес электронной почты: ${formData.email} \n`
      : "";
  const phone =
    formData.comment !== "" ? `Комментарий: ${formData.comment} \n` : "";
  const order =
    formData.order !== "" && formData.order !== undefined
      ? `${formData.order}`
      : "";
  const total =
    formData.total !== "" && formData.total !== undefined
      ? `${formData.total}`
      : "";

  const message =
    "НОВЫЙ ЗАКАЗ \n" +
    `Заказчик: ${formData.name} \n` +
    `Номер телефона: ${formData.phone} \n` +
    email +
    phone +
    "Заказ: \n" +
    order +
    `Общая сумма заказа: ${total}₽`;
  client
    .sendMessage("781825346", message)
    .then(() => {
      return true;
    })
    .catch((err) => {
      return false;
    });
}
