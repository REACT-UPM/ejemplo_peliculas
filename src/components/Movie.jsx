/*
 * Movie: tarjeta de UNA película dentro del listado (la usa Movies).
 * Es un componente "presentacional": solo pinta lo que recibe por props.
 *
 * Props: id, titulo, director, miniatura, delete()
 */
import { Link } from "react-router";

export default function Movie(props) {
	const miniatura = props.miniatura || "placeholder.png";
	// Si empieza por http es una URL completa; si no, es una imagen de public/
	const filmimg = miniatura.startsWith("http") ? miniatura : "/" + miniatura;

	return (
		<div className="movie">
			{/* <Link> cambia la URL sin recargar la página (navegación SPA) */}
			<Link to={"/show/" + props.id}>
				<div className="movie-img">
					<img className="show" src={filmimg} alt="miniatura de la película" />
				</div>
			</Link>
			<div className="title">
				{props.titulo || <em>Sin título</em>}
			</div>
			<div className="actions">
				<Link to={"/show/" + props.id}><button className="show">ver</button></Link>
				<Link to={"/edit/" + props.id}><button className="edit">editar</button></Link>
				<button className="delete" onClick={props.delete}>borrar</button>
			</div>
		</div>
	);
}
