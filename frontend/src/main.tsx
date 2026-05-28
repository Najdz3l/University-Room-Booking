import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "@styles/global.css";
import App from "./pages/App";
import { FormDataProvider } from "@lib/store/FormDataContext";
import { ReservationDataProvider } from "@lib/store/ReservationDataContext";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <FormDataProvider>
        <ReservationDataProvider>
          <App />
        </ReservationDataProvider>
      </FormDataProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
