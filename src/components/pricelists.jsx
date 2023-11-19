import { getStorage, ref, getDownloadURL, listAll } from "firebase/storage";
import { firebaseConfig } from "../server/firebase_server";
import { initializeApp } from "firebase/app";
import { useEffect, useState } from "react";

export default function Pricelists({ prodoctsGroups }) {
  const app = initializeApp(firebaseConfig);
  const [files, setFiles] = useState([]);
  const storage = getStorage(app, "gs://house-of-dream-d101b.appspot.com");
  const getFileList = async (storage) => {
    try {
      const files_arr = [];
      const res = await listAll(ref(storage, "/"));
      res.items.map((file) => {
        return files_arr.push(file?.name);
      });
      setFiles(files_arr);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getFileList(storage);
  }, []);
  const downloadfile = (e, filename) => {
    e.preventDefault();
    getDownloadURL(ref(storage, filename))
      .then((url) => {
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        link.click();
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <>
      <div className="pricelists">
        <h4>Скачать прайс листы товаров</h4>
        <div className="liner"></div>
        <div className="days">
          {files.map((file) => (
            <>
              <button
                onClick={(e) => downloadfile(e, file)}
                className="product_group active_button"
              >
                {file}
              </button>
            </>
          ))}
        </div>
      </div>
    </>
  );
}
