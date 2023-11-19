export default function DeliveryInfo() {
  return (
    <>
      <div className="pricelists">
        <h4>Мы доставляем</h4>
        <div className="liner"></div>
        <div className="deliverys">
          <div className="delivery">
            По РФ :
            <a href="https://www.cdek.ru/ru/">
              <img className="sdek" src="./images/logos/sdek.png" alt="" />
            </a>
            <a href="https://www.ordertracker.com/ru/perevozchiki/yandex">
              <img className="sdek" src="./images/logos/yandex.png" alt="" />
            </a>
            <a href="https://www.baikalsr.ru/">
              <img className="sdek" src="./images/logos/baykal.png" alt="" />
            </a>
            <a href="https://pecom.ru/">
              <img className="sdek" src="./images/logos/pek.png" alt="" />
            </a>
          </div>
          <div className="delivery">
            По Москве :
            <a href="https://www.ordertracker.com/ru/perevozchiki/yandex">
              <img className="sdek" src="./images/logos/yandex.png" alt="" />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
