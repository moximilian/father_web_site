import TimeTable from './timetable'
import Promotions from './promotions'
import Catalog from './catalog'
import Contacts from './contacts'
import useComponentVisible from "../hooks/useComponentVisible";
import {ReactComponent as Star} from '../images/icons/star.svg'
export default function Main() {
  const [timetableRef, isTimetableOpened, setTimetableOpened ] =
    useComponentVisible(false);
  const handleVisibility = () => {
    const dim_element = document.getElementById("dim");
    dim_element.classList.add("dim_filter");
    const note = document.querySelector(".dim_filter");
    note.style.width = window.innerWidth + "px";
    const main = document.querySelector("html");

    // note.style.height = main.height;
    note.style.height = (document.height !== undefined) ? document.height : document.body.offsetHeight + "px";
  } 
  const handleVisibilityOfSchedule = () => {
    handleVisibility();
    setTimetableOpened(true);
  };
  return (
    <>
      <main>
        <div id="dim"></div>
        <div className="main-container">
          <div className="basic-info">
            <div className="basic-text">
              <div className="bold">Skill Market</div>
              <div className="grey-text">
                Компания строительных инструментов и не только.
              </div>
              <div>Наша компрания поможет решением ваших задач</div>
            </div>
            <img src="./images/logo.png" alt="im" className="logo_medium" />
          </div>
          <Contacts/>
          <button
            onClick={() => handleVisibilityOfSchedule()}
            className="grey-text btn-false"
          >
            Открыто
          </button>
          <div ref={timetableRef}>
            {isTimetableOpened ? (
              <TimeTable/>
            ) : (
              <></>
            )}
          </div>
          <Promotions/>
          <Catalog/>
          <h1>О нас</h1>
          <div id="about-us">
            Основная задача нашей компании решить уже имеющиеся проблемы наших
            партнеров, да именно партнеров, а главное сделать все что бы не
            допустить их возникновение, с этой целью запускается «Пилотный
            проект» по годовому абонентскому обслуживанию, за приемлемую плату
            два раза в год наш специалист сделает сезонное обслуживание ваших
            окон, рольставень, секционных ворот, откатных ворот, так же
            предоставит диагностику возможных замен запчастей, партнеры имеющий
            статус абонемента имеют дополнительную скидку на работы. Так же с 25
            августа 2023 года наша компания совместно с Томским Заводом
            Кузнецова (ТЗК) начала поставку на склад в Москве пневмоинструмента
            оснастки и комплектующих к ним.
          </div>
          <div className="points">
            <div className='star-component'><Star/>Оптовые продажи</div>
            <div className='star-component'><Star/>Доставка</div>
            <div className='star-component'><Star/>Запчасти для строительного инструмента</div>
            <div className='star-component'><Star/>Ремонт зданий</div>
            <div className='star-component'><Star/>Самовывоз</div>
            <div className='star-component'><Star/>Гражданское строительство</div>
          </div>
          <Contacts/>
        </div>
      </main>
    </>
  );
}
