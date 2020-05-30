import SplitPane from "react-split-pane";
import * as React from "react";
import CodeEditor from "../components/CodeEditor/CodeEditor";
import { Link } from "react-router-dom";
export default () => {
  return (
    <div>
      <Link to={"/i18n"}>I18n</Link>
    </div>
  );
};
