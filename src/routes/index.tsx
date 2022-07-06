import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "../pages/signUp";
import SignIn from "../pages/login";
import Dashboard from "../pages/dashboard";
import Title from "../components/title";
import Categories from "../pages/categories";
import Todos from "../pages/todos";
import Home from "../pages/home";

const IndexRoutes = () => {
  return (
    <React.Fragment>
      <Router>
        <Routes>
          <Route path="" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/dashboard/" element={<Dashboard />}>
            <Route index element={<Todos />} />
            <Route path="categories" element={<Categories />} />
          </Route>
        </Routes>
      </Router>
    </React.Fragment>
  );
};

export default IndexRoutes;
