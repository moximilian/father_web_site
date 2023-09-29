import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, setDoc, updateDoc, deleteDoc  } from 'firebase/firestore/lite';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const  firebaseConfig = {
  apiKey: "AIzaSyAK4cDCixWowzCo-1354Mhg5RqU-i6X8YU",
  authDomain: "house-of-dream-d101b.firebaseapp.com",
  projectId: "house-of-dream-d101b",
  storageBucket: "house-of-dream-d101b.appspot.com",
  messagingSenderId: "799520998278",
  appId: "1:799520998278:web:9ae3b625386e7d1c4ce207",
  measurementId: "G-1HMM55QZJ8"
};

// Initialize Firebase


export async function getAdmin(db) {
    const citiesCol = collection(db, 'users');
    const citySnapshot = await getDocs(citiesCol);
    const cityList = citySnapshot.docs.map(doc => doc.data());
    return cityList;
  }
export async function getAllProducts(db) {
    const citiesCol = collection(db, 'products');
    const citySnapshot = await getDocs(citiesCol);
    const cityList = citySnapshot.docs.map(doc => doc.data());
    return cityList;
  }
  export async function getAllPromotions(db){
    const citiesCol = collection(db, 'promotions');
    const citySnapshot = await getDocs(citiesCol);
    const cityList = citySnapshot.docs.map(doc => doc.data());
    return cityList;
  }
  export async function getAPIKey(db){
    const citiesCol = collection(db, 'telegram_token');
    const citySnapshot = await getDocs(citiesCol);
    const cityList = citySnapshot.docs.map(doc => doc.data());
    return cityList;
  }

export async function addNewItem(db, name,price, desc, image, id) {
    await setDoc(doc(db, "products", 'product_id=' + id), {
        name: name,
        price: price,
        description: desc,
        image:image,
        id:id
      });
  }
  export async function addNewProm(db,new_name,new_date,new_desc, base64String, new_id){
    await setDoc(doc(db, "promotions", 'prom_id=' + new_id), {
        name: new_name,
        date: new_date,
        description: new_desc,
        image:base64String,
        id:new_id,
      });
  }
  export async function changeItem(db,new_name,price, desc, id) {
    await updateDoc(doc(db, "products", 'product_id=' + id), {
        name: new_name,
        price: price,
        description: desc,
        id:id
      });
  }
  export async function changePromotion(db,new_name, new_date,new_desc, id){
    await updateDoc(doc(db,'promotions', 'prom_id='+id),{
        name:new_name,
        date:new_date,
        description:new_desc,
        id:id
    })
  }
  export async function deleteItemFromDB(db, old_id){
    await deleteDoc(doc(db,'products','product_id='+old_id));
  }
export async function deletePromFromDB(db, old_id){
    await deleteDoc(doc(db,'promotions','prom_id='+old_id));

}

