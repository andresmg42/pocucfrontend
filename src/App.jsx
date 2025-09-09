import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router";
import Home from "./home/Home.jsx";
import Login from "./session/Login.jsx";
import Layout from "./layout/Layout.jsx";
function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route index path="/" element={<Home />}></Route>
          <Route index path="login/" element={<Login />}></Route>
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
