import React from "react";
import OfflineSupport from "../components/OfflineSupport";

import "../styles/main.css";

// First, checks if it isn't implemented yet.
if (!String.prototype.format) {
  String.prototype.format = () => {
    var args = arguments;
    return this.replace(/{(\d+)}/g, (match, number) => {
      return typeof args[number] != "undefined" ? args[number] : match;
    });
  };
}

function Container({ children }) {
  return children;
}

function MyApp({ Component, pageProps }) {
  return (
    <Container>
      <OfflineSupport />
      <Component {...pageProps} />
    </Container>
  );
}

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
// MyApp.getInitialProps = async (appContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);
//
//   return { ...appProps }
// }

export default MyApp;
