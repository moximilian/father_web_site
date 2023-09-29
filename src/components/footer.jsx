import {ReactComponent as Git} from '../images/icons/git.svg'
import '../footer.css'
export default function Footer() {
    return <>
        <div className="footer">
            <div className="footer-container">
                @М.Е Сыров по заказу ООО "Дом твоей мечты"
                <a href="https://github.com/moximilian"><Git/></a>
            </div>
        </div>
    </>
}