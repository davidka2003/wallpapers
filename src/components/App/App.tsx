import React from "react";
// import Footer from "./components/Footer";
// import MainLayout from "./components/MainLayout";
import logo from "./logo.svg";
import styles from "./App.module.scss";
import Header from "../Header/Header";
import Layout from "../Layout/Layout";

function App() {
  return (
    <div className={styles.App}>
      <Header />
      <Layout />
    </div>
  );
}

export default App;
