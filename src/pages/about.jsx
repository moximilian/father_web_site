import Header from "../components/header";
import Footer from "../components/footer";
export default function About() {
  return (
    <>
      <Header
        pages={[{ name: "Каталог", scrolled: false, path: "/catalog/" }]}
      />
      <main>
        <div id="dim"></div>
        <div className="main-container">
          <div id="about-us">
            <h1>О нас</h1>
            Основная задача нашей компании решить уже имеющиеся проблемы наших
            партнеров, да именно партнеров, а главное сделать все что бы не
            допустить их возникновение, с этой целью запускается пилотный проект
            с 25 августа 2023 года наша компания совместно с Томским Заводом
            Кузнецова (ТЗК) начала поставку на склад в Москве пневмоинструмента
            оснастки и комплектующих к ним. А с октября 2023 года был создан
            проект совместно с двумя крупнейшими производителями РФ, по
            размещению на наших складах производимой ими продукции, обратите
            внимание на новый прайс лист и загруженные товары на сайт.
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
