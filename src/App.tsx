import React, { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import I18n from "pages/i18n/Translates";
import Layout from "./containers/Layout";
import Test from "./pages/Test";
import State from "./state/State";
import { Provider } from "mobx-react";

const App: React.FC = () => {
  useEffect(() => {
    const listener = () => {
      State.editorShaker.shake();
    };
    window.addEventListener("resize", listener);
    return () => window.removeEventListener("resize", listener);
  }, []);
  return (
    <Provider {...State}>
      <Router>
        <Layout>
          <Route path="/" exact component={Test} />
          <Route path="/i18n" exact component={I18n} />
        </Layout>
      </Router>
    </Provider>
  );
};

export default App;
