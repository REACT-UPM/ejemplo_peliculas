/*
 * MovieInfo: detalle de una película. Ruta /show/:movieId
 *
 * Props:
 *   themovies -> lista completa de películas (la buscamos por id)
 */
import { Link, useParams } from "react-router";

export default function MovieInfo(props) {
	// Para la URL /show/17, useParams() devuelve { movieId: "17" } (string)
	const { movieId } = useParams();
	const movie = props.themovies.find((m) => m.id === Number(movieId));

	return (
		<div id="main">
			{movie ? (
				<p>
					La película <b>{movie.titulo}</b> fue dirigida por <b>{movie.director}</b>!
				</p>
			) : (
				<p>No existe ninguna película con id {movieId}</p>
			)}
			<Link to="/"><button className="index">Volver</button></Link>
		</div>
	);
}
