import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import PO from "../src/App";

ReactDOM.render(
  <React.StrictMode>
    <Router>
      {" "}

      <PO />
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);
