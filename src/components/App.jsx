/*
 * App: componente raíz de la aplicación.
 *
 * Aquí vive TODO el estado compartido (la lista de películas y el registro de
 * acciones). Los componentes hijos no modifican el estado directamente: reciben
 * los datos por props y, para cambiarlos, llaman a las funciones (callbacks)
 * que App les pasa también por props (create, update, erase...).
 * Es el patrón "lifting state up" (elevar el estado al ancestro común).
 *
 * Mapa de rutas (ver README.md para el detalle):
 *   /                -> Movies     (listado + botones servidor/localStorage)
 *   /add             -> MovieForm  (formulario vacío para crear)
 *   /edit/:movieId   -> MovieForm  (formulario relleno para editar)
 *   /show/:movieId   -> MovieInfo  (detalle de una película)
 *   *                -> NotFound   (cualquier otra URL: página 404)
 */
import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router";

import Navbar from "./Navbar";
import Movies from "./Movies";
import MovieInfo from "./MovieInfo";
import MovieForm from "./MovieForm";
import NotFound from "./NotFound";
import ShowInfo from "./ShowInfo";
import { myInitialMovies } from "../constants/constants";

// API REST de ejemplo (npoint.io) que devuelve un array JSON de películas
const SERVER_URL = "https://api.npoint.io/91b69d0a72d2ee88b573";

// Clave con la que guardamos las películas en localStorage
const LS_KEY = "pelis";

export default function App() {
	// ---------------------------------------------------------------------------
	// ESTADO
	// ---------------------------------------------------------------------------
	const [loading, setLoading] = useState(true);   // ¿mostramos el spinner?
	const [mymovies, setMymovies] = useState([]);   // lista de películas
	const [actions, setActions] = useState([]);     // log de acciones (ShowInfo)

	// useNavigate nos da una función para cambiar de ruta desde código
	// (equivale a pulsar un <Link>, pero lo hacemos tras crear/editar/borrar).
	const navigate = useNavigate();

	// Añade un mensaje al log con la hora actual.
	// Usamos la forma FUNCIONAL del setter (prev => ...) para partir siempre del
	// valor más reciente del estado, aunque la función se llame desde un closure
	// "antiguo" (por ejemplo desde el useEffect inicial).
	const log = (msg) => {
		setActions((prev) => [...prev, msg + " a las " + new Date().toLocaleTimeString()]);
	};

	// ---------------------------------------------------------------------------
	// CRUD: crear, actualizar y borrar películas
	// ---------------------------------------------------------------------------

	// Recibe un objeto película SIN id (viene del formulario de /add)
	const create = (movie) => {
		// Nuevo id = mayor id existente + 1. Así no colisiona con los ids que
		// vengan del servidor o de localStorage.
		const newId = mymovies.length === 0 ? 0 : Math.max(...mymovies.map((m) => m.id)) + 1;
		// Nunca mutamos el estado: creamos un array NUEVO con la película añadida
		setMymovies([...mymovies, { ...movie, id: newId }]);
		log("Película " + movie.titulo + " creada");
		navigate("/"); // volvemos al listado
	};

	// Recibe la película completa (con id) ya modificada (viene de /edit/:movieId)
	const update = (updatedmovie) => {
		// map devuelve un array nuevo: sustituimos solo la película con ese id
		setMymovies(mymovies.map((movie) => (movie.id === updatedmovie.id ? updatedmovie : movie)));
		log("Película " + updatedmovie.titulo + " actualizada");
		navigate("/");
	};

	const erase = (idtoerase) => {
		// filter devuelve un array nuevo sin la película borrada
		setMymovies(mymovies.filter((movie) => movie.id !== idtoerase));
		log("Película con id " + idtoerase + " borrada");
		navigate("/");
	};

	// ---------------------------------------------------------------------------
	// SERVIDOR: descargar películas con fetch (petición GET asíncrona)
	// ---------------------------------------------------------------------------
	const download = async () => {
		try {
			const res = await fetch(SERVER_URL);
			if (!res.ok) throw new Error("HTTP " + res.status);
			const downloadedMovies = await res.json();
			setMymovies(downloadedMovies);
			log("Películas descargadas de " + SERVER_URL);
		} catch (e) {
			// Si falla la red o el servidor, usamos las películas por defecto
			setMymovies(myInitialMovies);
			log("Error al descargar (" + e.message + "), cargadas películas por defecto");
			alert("No se ha podido recuperar la información del servidor.");
		}
	};

	// ---------------------------------------------------------------------------
	// LOCALSTORAGE: almacenamiento clave/valor del navegador.
	// Solo guarda STRINGS, por eso convertimos con JSON.stringify / JSON.parse.
	// Los datos persisten aunque se recargue la página o se cierre el navegador.
	// ---------------------------------------------------------------------------
	const saveLocalStorage = () => {
		localStorage.setItem(LS_KEY, JSON.stringify(mymovies));
		log("Guardado en LocalStorage");
		/* Si además quisiésemos guardarlo en el servidor (si tuviese un endpoint
		   que lo admitiese), haríamos una petición POST:

			const res = await fetch(SERVER_URL, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(mymovies),
			});
			const { uri } = await res.json();
		*/
	};

	const loadLocalStorage = () => {
		const saved = localStorage.getItem(LS_KEY); // null si la clave no existe
		if (saved !== null) {
			setMymovies(JSON.parse(saved));
			log("Películas cargadas de LocalStorage");
		} else {
			log("LocalStorage vacío, error al cargar películas");
			alert("No hay nada guardado en localStorage");
		}
	};

	const reset = () => {
		// clear() borra TODAS las claves de este origen. Para borrar solo la
		// nuestra usaríamos localStorage.removeItem(LS_KEY).
		localStorage.clear();
		log("LocalStorage borrado (clear)");
	};

	// ---------------------------------------------------------------------------
	// EFECTO INICIAL: el array de dependencias vacío [] hace que se ejecute
	// una sola vez, cuando el componente se monta por primera vez.
	// ---------------------------------------------------------------------------
	useEffect(() => {
		async function fetchData() {
			await download();
			// Retardo artificial para que se llegue a ver el spinner en clase
			setTimeout(() => setLoading(false), 500);
		}
		fetchData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// ---------------------------------------------------------------------------
	// RENDER
	// <Routes> elige la PRIMERA <Route> cuyo path encaje con la URL actual y
	// renderiza su "element". Navbar y ShowInfo están fuera de <Routes>, así que
	// se muestran en todas las páginas.
	// ---------------------------------------------------------------------------
	return (
		<div className="root">
			<Navbar />
			{loading ? (
				<img src="/spinner.gif" className="spinner" alt="spinner" />
			) : (
				<Routes>
					<Route
						path="/"
						element={
							<Movies
								themovies={mymovies}
								delete={erase}
								download={download}
								saveLocalStorage={saveLocalStorage}
								loadLocalStorage={loadLocalStorage}
								reset={reset}
							/>
						}
					/>
					{/* Mismo componente MovieForm para crear y para editar */}
					<Route path="/add" element={<MovieForm isNew={true} create={create} />} />
					<Route path="/edit/:movieId" element={<MovieForm themovies={mymovies} update={update} />} />
					{/* :movieId es un parámetro de ruta. Se lee con useParams() */}
					<Route path="/show/:movieId" element={<MovieInfo themovies={mymovies} />} />
					<Route path="*" element={<NotFound />} />
				</Routes>
			)}
			<ShowInfo actions={actions} />
		</div>
	);
}
