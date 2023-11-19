import Main from "../components/main";
import Header from "../components/header";
import Footer from "../components/footer";
export default function MainPage() {
  return (
    <>
      <Header
        pages={[
          { name: "Каталог", scrolled: false, path: "/catalog/" },
          { name: `О&nbsp;нас`, scrolled: false, path: "/about" },
        ]}
      />
      <Main />
      <Footer />
    </>
  );
}
