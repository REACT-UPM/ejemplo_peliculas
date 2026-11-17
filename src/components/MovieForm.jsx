/*
 * MovieForm: formulario para CREAR (ruta /add) o EDITAR (ruta /edit/:movieId).
 *
 * Se usa con la API de formularios de React 19:
 *   - Los <input> NO son controlados: no tienen "value" + "onChange" ni un
 *     useState por campo. El navegador guarda lo que escribe el usuario.
 *   - Con "defaultValue" damos el valor inicial (vacío al crear, los datos de la
 *     película al editar).
 *   - Al <form> le pasamos una FUNCIÓN en la prop "action". Cuando se envía el
 *     formulario, React evita la recarga de la página (no hace falta
 *     e.preventDefault()) y llama a esa función pasándole un objeto FormData
 *     con los valores de todos los campos, indexados por su atributo "name".
 *
 * Props:
 *   isNew      -> true si estamos creando (ruta /add)
 *   create     -> callback de App para crear   (solo en /add)
 *   themovies  -> lista de películas            (solo en /edit/:movieId)
 *   update     -> callback de App para editar  (solo en /edit/:movieId)
 */
import { Link, useParams } from "react-router";

export default function MovieForm(props) {
	// En /edit/:movieId, useParams() devuelve { movieId: "17" }.
	// ¡Ojo! Los parámetros de la URL son siempre STRINGS -> Number() para comparar.
	const { movieId } = useParams();

	// Película que vamos a editar (o valores vacíos si estamos creando)
	const movie = props.isNew
		? { titulo: "", director: "", miniatura: "" }
		: props.themovies.find((m) => m.id === Number(movieId));

	// Si alguien escribe a mano /edit/999 y no existe esa película
	if (!movie) {
		return (
			<div id="main">
				<p>No existe ninguna película con id {movieId}</p>
				<Link to="/"><button className="index">Volver</button></Link>
			</div>
		);
	}

	// Función "action" del formulario: recibe el FormData al enviar.
	function handleSubmit(formData) {
		// formData.get("nombre") devuelve el valor del campo con name="nombre"
		const data = {
			titulo: formData.get("titulo"),
			director: formData.get("director"),
			miniatura: formData.get("miniatura") || "placeholder.png",
		};
		// Alternativa en una línea: const data = Object.fromEntries(formData);

		if (props.isNew) {
			props.create(data);                 // App le asignará el id
		} else {
			props.update({ ...data, id: movie.id }); // conservamos el id original
		}
	}

	return (
		<div id="main">
			<h2>{props.isNew ? "Nueva película" : "Editar película"}</h2>
			<form action={handleSubmit}>
				<div className="field">
					<label htmlFor="titulo">Título</label> <br />
					{/* "name" es la clave con la que el valor aparece en FormData */}
					<input type="text" id="titulo" name="titulo" placeholder="Título"
						defaultValue={movie.titulo} required />
				</div>
				<div className="field">
					<label htmlFor="director">Director</label> <br />
					<input type="text" id="director" name="director" placeholder="Director"
						defaultValue={movie.director} />
				</div>
				<div className="field">
					<label htmlFor="miniatura">Miniatura</label> <br />
					<input type="text" id="miniatura" name="miniatura" placeholder="URL de la miniatura"
						defaultValue={movie.miniatura} />
				</div>
				<div className="actions">
					{/* type="submit" envía el formulario -> se ejecuta handleSubmit */}
					<button type="submit" className={props.isNew ? "new" : "update"}>
						{props.isNew ? "Crear" : "Actualizar"}
					</button>
					{/* type="button" para que este botón NO envíe el formulario */}
					<Link to="/"><button type="button" className="index">Volver</button></Link>
				</div>
			</form>
		</div>
	);
}
