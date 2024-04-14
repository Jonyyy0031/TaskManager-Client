// eslint-disable-next-line no-unused-vars
import React, { Fragment, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/login/login";
import "./App.css";
import Registro from "./components/registro/registro";
import Home from "./components/usuarios/home";
import Homea from "./components/admin/Homea";
import Roles from "./components/admin/roles";

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
          <Route path="/roles" element={<Roles/>} />
        </Routes>
      </Fragment>
    </Router>
  );
}

export default App;