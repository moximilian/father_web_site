import Main from "../components/main";
import Header from "../components/header";
import Footer from "../components/footer";
export default function MainPage() {
  return (
    <>
      <Header
        pages={[
          { name: "Каталог", scrolled: false, path: "/catalog/" },
          { name: "О нас", scrolled: true, path: "#about-us" },
          { name: "Контакты", scrolled: true, path: "main" },
        ]}
      />
      <Main />
      <Footer />
    </>
  );
}
