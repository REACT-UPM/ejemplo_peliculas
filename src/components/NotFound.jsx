/*
 * NotFound: página 404. La renderiza la ruta path="*", que encaja con
 * cualquier URL que no haya encajado con las rutas anteriores.
 */
import { Link } from "react-router";

export default function NotFound() {
	return (
		<div>
			{/* Los ficheros de public/ se sirven desde la raíz: /404.jpg */}
			<img className="logo" src="/404.jpg" alt="logo" />
			<br />
			<div>Página 404 maquetada muy chula...</div>
			<Link to="/"><button className="show">VOLVER</button></Link>
		</div>
	);
}
