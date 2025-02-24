import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import "@fontsource/poppins/100.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/700.css";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
<BrowserRouter>
    <App />
</BrowserRouter>);
