import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import I18n from "pages/i18n/i18n_root";
import Layout from "./containers/Layout";

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Route path="/" exact component={I18n} />
      </Layout>
    </Router>
  );
};

export default App;
