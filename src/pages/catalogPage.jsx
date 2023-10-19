import Catalog from "../components/catalog";
import Header from "../components/header";
import Footer from "../components/footer";
import { useEffect, useState } from "react";
import { getAllProducts } from "../server/firebase_server";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore/lite";
import { getStorage } from "firebase/storage";
import { firebaseConfig } from "../server/firebase_server";
export default function CatalogPage() {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const storage = getStorage(app, "gs://house-of-dream-d101b.appspot.com");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const FetchData = async () => {
      const prod = await getAllProducts(db);
      setProducts(prod);
    };
    FetchData();
  }, [db]);
  return (
    <>
      <Header
        pages={[
          { name: "Главная", scrolled: false, path: "/" },
          { name: "Каталог", scrolled: false, path: "/catalog/" },
        ]}
      />
      <Catalog products={products} />
      <Footer />
    </>
  );
}
