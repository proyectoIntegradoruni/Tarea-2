// AppRouter.js
import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";

import Login from "./Login";
import App2 from "./App2"
import Registro from "./registro";
import Home from "./Home";
export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />   
        <Route path="/Home" element={<Home />} />           
        <Route path="/www" element={<App2 />} />      

      </Routes>
    </BrowserRouter>
    
  );
};