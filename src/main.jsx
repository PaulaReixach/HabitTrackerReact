import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HabitsProvider } from "./context/HabitsContext";
import App from "./App";

import "./index.css";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <HabitsProvider>
         <App />
      </HabitsProvider>
    </BrowserRouter>
  </React.StrictMode>
);