import { useEffect, useState } from "react";
import parse from "html-react-parser";
export const MakeHTMLfromString = (string) => {
  const [html, setHtml] = useState("");
  useEffect(() => {
    setHtml(string);
  }, [html, string]);

  return <>{parse(html)}</>;
};
