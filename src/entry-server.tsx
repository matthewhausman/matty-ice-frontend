import React from "react";
import ReactDOMServer from "react-dom/server";
import App from "./App";
import indexStyles from "./index.css";
import appStyles from "./App.css";

const allStyles = [indexStyles, appStyles];

const joined = allStyles.join("");

export function render() {
  const html = ReactDOMServer.renderToString(
    <React.StrictMode>
      <style
        key="matty-ice-css"
        dangerouslySetInnerHTML={{
          __html: joined,
        }}
      />
      <App />
    </React.StrictMode>
  );
  return { html };
}
