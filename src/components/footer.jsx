import { ReactComponent as Git } from "../images/icons/git.svg";
import "../footer.css";
export default function Footer() {
  return (
    <>
      <div className="footer">
        <div className="footer-container">
          2023 @ М.Е Сыров по заказу ООО "Skill"<br></br>
          Указанные на сайте цены, характеристики, фотографии не являются
          публичной офертой.<br></br>
          Для уточнения информации, обращайтесь к менеджерам компании.
          <a href="https://github.com/moximilian">
            <Git />
          </a>
        </div>
      </div>
    </>
  );
}
