/*
 * Punto de entrada de la aplicación (lo carga index.html).
 *
 * <BrowserRouter> envuelve a toda la App para que los componentes puedan usar
 * el enrutado (<Routes>, <Route>, <Link>, useParams, useNavigate...). Usa la
 * History API del navegador: las URLs cambian (/add, /show/3...) sin recargar.
 */
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./components/App";
import "./assets/index.css";

createRoot(document.getElementById("root")).render(
	<BrowserRouter>
		<App />
	</BrowserRouter>
);
