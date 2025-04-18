import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function Header({ pages }) {
  const itemsInCart = useSelector((state) => state.itemsInCart);

  const [itemCount, setItemCount] = useState();
  const addCartCouner = () => {
    const cart_counter = document.getElementById("cart-counter");
    cart_counter.style.width = `${20 * `${itemCount}`.length * 0.75}px`;
    // cart_counter.style.width = "12.5px";
    cart_counter.style.backgroundColor = "red";
    cart_counter.innerHTML = itemCount;
    const container = document.getElementById("container_c");
    // container.style.display = "contents";
    // container.style.marginTop = "calc(auto + 5px)";
  };
  const removeCartCouner = () => {
    const cart_counter = document.getElementById("cart-counter");
    cart_counter.innerHTML = "";
    cart_counter.style.backgroundColor = "transparent";
    cart_counter.style.width = "0px";
  };
  const SmoothScrollTo = (e, path) => {
    e.preventDefault();
    document.querySelector(path).scrollIntoView({
      behavior: "smooth",
    });
  };
  useEffect(() => {
    var items_count = 0;
    if (itemsInCart.length === 1) {
      return;
    }
    for (let i = 0; i < itemsInCart[1].length; i++) {
      if (itemsInCart[1][i].id) {
        items_count += itemsInCart[1][i].count;
      }
    }

    setItemCount(items_count);
    if (items_count > 0) {
      addCartCouner();
    }
    if (items_count === 0) {
      removeCartCouner();
    }
  }, [setItemCount, itemsInCart, itemCount]);
  const [showHiddenDiv, setShowHiddenDiv] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const scrollTriggerPosition =
        document.getElementById("container_c").offsetTop;

      if (scrollPosition > scrollTriggerPosition) {
        setShowHiddenDiv(true);
      } else {
        setShowHiddenDiv(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <header>
        <div className="header-container">
          <div className="links">
            <Link to="/" className="main-link">
              <img
                src="./images/logo.png"
                alt="logo_small"
                className="logo_small"
              />
              SkillMarket
            </Link>
            {pages.map((page) =>
              page.scrolled ? (
                <>
                  <button
                    onClick={(e) => SmoothScrollTo(e, page.path)}
                    className="link"
                  >
                    <td dangerouslySetInnerHTML={{ __html: page.name }} />
                  </button>
                </>
              ) : (
                <>
                  <Link to={page.path} className="link">
                    <td dangerouslySetInnerHTML={{ __html: page.name }} />
                  </Link>
                </>
              )
            )}
          </div>
          <div id="container_c">
            <Link to="/cart/" className="cart">
              Корзина
            </Link>
            <div id="cart-counter" className="cart-after"></div>
          </div>
        </div>
      </header>
    </>
  );
}
