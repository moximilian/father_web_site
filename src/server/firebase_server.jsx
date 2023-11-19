import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  startAfter,
  limit,
  getDocs,
} from "firebase/firestore/lite";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

//father congig
export const firebaseConfig = {
  apiKey: "AIzaSyAK4cDCixWowzCo-1354Mhg5RqU-i6X8YU",
  authDomain: "house-of-dream-d101b.firebaseapp.com",
  projectId: "house-of-dream-d101b",
  storageBucket: "house-of-dream-d101b.appspot.com",
  messagingSenderId: "799520998278",
  appId: "1:799520998278:web:9ae3b625386e7d1c4ce207",
  measurementId: "G-1HMM55QZJ8",
};

//test config
// export const firebaseConfig = {
//   apiKey: "AIzaSyC9XULCVoZAvoukeyXRxYcW26fnUq4c0WA",
//   authDomain: "shop-5cb91.firebaseapp.com",
//   projectId: "shop-5cb91",
//   storageBucket: "shop-5cb91.appspot.com",
//   messagingSenderId: "848143579453",
//   appId: "1:848143579453:web:961ed6d9a18fc2c5296d54",
// };

// Initialize Firebase

export async function getAdmin(db) {
  const citiesCol = collection(db, "users");
  const citySnapshot = await getDocs(citiesCol);
  const cityList = citySnapshot.docs.map((doc) => doc.data());
  return cityList;
}
export async function getAllProducts(db) {
  const citiesCol = collection(db, "products");
  const citySnapshot = await getDocs(citiesCol);
  const cityList = citySnapshot.docs.map((doc) => doc.data());
  return cityList;
}
export async function getAllPromotions(db) {
  const citiesCol = collection(db, "promotions");
  const citySnapshot = await getDocs(citiesCol);
  const cityList = citySnapshot.docs.map((doc) => doc.data());
  return cityList;
}
export async function getAllNews(db) {
  const citiesCol = collection(db, "news");
  const citySnapshot = await getDocs(citiesCol);
  const cityList = citySnapshot.docs.map((doc) => doc.data());
  return cityList;
}
export async function getSomeNews(db, limit_l, offset) {
  const first = query(collection(db, "news"), limit(limit_l));
  const documentSnapshots = await getDocs(first);
  if (documentSnapshots.docs.length > 0) {
    const lastVisible = documentSnapshots.docs[offset];
    const next = query(
      collection(db, "news"),
      startAfter(lastVisible),
      limit(limit_l)
    );
    const page = await getDocs(next);
    const pageList = page.docs.map((doc) => doc.data());
    return pageList;
  }

  // Apply pagination using limit and offset

  if (offset === 0) {
    const pageList = documentSnapshots.docs.map((doc) => doc.data());
    return pageList;
  }
}

export async function addNewItem(db, name, new_group, price, desc, image, id) {
  await setDoc(doc(db, "products", "product_id=" + id), {
    name: name,
    group: new_group,
    price: price,
    description: desc,
    image: image,
    id: id,
  });
}
export async function getAPIKey(db) {
  const citiesCol = collection(db, "telegram_token");
  const citySnapshot = await getDocs(citiesCol);
  const cityList = citySnapshot.docs.map((doc) => doc.data());
  return cityList;
}
export async function addNewProm(
  db,
  new_name,
  new_date,
  new_desc,
  base64String,
  new_id
) {
  await setDoc(doc(db, "promotions", "prom_id=" + new_id), {
    name: new_name,
    date: new_date,
    description: new_desc,
    image: base64String,
    id: new_id,
  });
}
export async function changeItem(
  db,
  new_name,
  new_group,
  price,
  desc,
  size,
  manif,
  data,
  id
) {
  await updateDoc(doc(db, "products", "product_id=" + id), {
    name: new_name,
    group: new_group,
    price: price,
    description: desc,
    size: size,
    manif: manif,
    data: data,
    id: id,
  });
}
export async function changePromotion(db, new_name, new_date, new_desc, id) {
  await updateDoc(doc(db, "promotions", "prom_id=" + id), {
    name: new_name,
    date: new_date,
    description: new_desc,
    id: id,
  });
}
export async function deleteItemFromDB(db, old_id) {
  await deleteDoc(doc(db, "products", "product_id=" + old_id));
}
export async function deletePromFromDB(db, old_id) {
  await deleteDoc(doc(db, "promotions", "prom_id=" + old_id));
}

//news: create / change / delete

export async function createNew(
  db,
  new_title,
  new_date,
  new_desc,
  image,
  new_id
) {
  await setDoc(doc(db, "news", "new_id=" + new_id), {
    id: new_id,
    title: new_title,
    date: new_date,
    description: new_desc,
    image: image,
  });
}
export async function changeNew(db, new_title, new_date, new_desc, new_id) {
  await updateDoc(doc(db, "news", "new_id=" + new_id), {
    id: new_id,
    title: new_title,
    date: new_date,
    description: new_desc,
  });
}
export async function delNew(db, old_id) {
  await deleteDoc(doc(db, "news", "new_id=" + old_id));
}
