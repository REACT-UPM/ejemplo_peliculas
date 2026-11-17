/*
 * Movies: listado de películas. Ruta /
 *
 * Props (todas vienen de App):
 *   themovies        -> array de películas a mostrar
 *   delete(id)       -> borra una película
 *   download()       -> descarga las películas del servidor
 *   saveLocalStorage -> guarda la lista actual en localStorage
 *   loadLocalStorage -> sustituye la lista por la guardada en localStorage
 *   reset            -> vacía localStorage
 */
import Movie from "./Movie";
import { Link } from "react-router";

export default function Movies(props) {
	return (
		<div id="main">
			{props.themovies.map((pelicula) => (
				<Movie
					// key debe ser estable y única: usamos el id, no el índice del array
					key={pelicula.id}
					// Envolvemos la llamada en una función para "fijar" el id de ESTA película
					delete={() => props.delete(pelicula.id)}
					id={pelicula.id}
					titulo={pelicula.titulo}
					director={pelicula.director}
					miniatura={pelicula.miniatura}
				/>
			))}
			<div className="actions">
				<Link to="/add"><button className="new">Añadir película</button></Link>
				<button className="down" onClick={props.download}>Descargar del servidor</button>
				<button className="up" onClick={props.saveLocalStorage}>Guardar en LocalStorage</button>
				<button className="up" onClick={props.loadLocalStorage}>Cargar de LocalStorage</button>
				<button className="reset" onClick={props.reset}>Reiniciar LocalStorage</button>
			</div>
		</div>
	);
}
