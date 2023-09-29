export default function Timetable() {
  return (
    <>
      <div className="timetable">
        <h4>График работы</h4>
        <div className="line"></div>
        <div className="days">
          <div className="day">
            Понедельник
            <div className="dot-line"></div>
            <div className="red-colored">выходной</div>
          </div>
          <div className="day">
            Вторник
            <div className="dot-line"></div>
            <div className="red-colored">выходной</div>
          </div>
          <div className="day">
            Среда
            <div className="dot-line"></div>
            <div>09:00 - 19:00</div>
          </div>
          <div className="day">
            Четверг
            <div className="dot-line"></div>
            <div>09:00 - 19:00</div>
          </div>
          <div className="day">
            Пятница
            <div className="dot-line"></div>
            <div>09:00 - 19:00</div>
          </div>
          <div className="day">
            Суббота
            <div className="dot-line"></div>
            <div>09:00 - 19:00</div>
          </div>
          <div className="day">
            Воскресенье
            <div className="dot-line"></div>
            <div>09:00 - 19:00</div>
          </div>
        </div>
      </div>
    </>
  );
}
