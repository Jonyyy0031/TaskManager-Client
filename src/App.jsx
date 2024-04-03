// eslint-disable-next-line no-unused-vars
import React, { Fragment, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/login/login";
import "./App.css";
import Registro from "./components/registro/registro";
import Home from "./components/usuarios/home";
import Homea from "./components/admin/Homea";
import Newuser from "./components/admin/newuser";

function App() {
  return (
    <Router>
      <Fragment>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home/>}/>
          <Route path="/homea" element={<Homea/>}/>
          <Route path="/registro" element={<Registro/>} />
          <Route path="/newuser" element={<Newuser/>} />
        </Routes>
      </Fragment>
    </Router>
  );
}

export default App;