import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Movies from "./Movies";
import MovieInfo from "./MovieInfo";
import MovieForm from "./MovieForm";
import NotFound from "./NotFound";
import ShowInfo from "./ShowInfo";
import { myInitialMovies } from "../constants/constants";

import { Routes, Route} from "react-router-dom";
import {useNavigate} from "react-router-dom";

const SERVER_URL = "https://api.npoint.io/91b69d0a72d2ee88b573";

export default function App() {
	const [loading, setLoading] = useState(true);
	const [mymovies, setMymovies] = useState([]);
	const [nextid, setNextid] = useState(3);
	const [actions, setActions] = useState([]);

	const navigate = useNavigate();

	const update = (updatedmovie) => {
		setMymovies(mymovies.map((movie, index) => updatedmovie.id === movie.id ? updatedmovie : movie));
		setActions([...actions, "Pelicula " + updatedmovie.titulo + " actualizada a las "+ new Date().toLocaleTimeString()])
		
		navigate('/');
	}

	const erase = (idtoerase) => {
		setActions([...actions, "Pelicula " + idtoerase + " borrada a las "+ new Date().toLocaleTimeString()])
		setMymovies(mymovies.filter((movie) => movie.id !== idtoerase));
		navigate('/');
	}	

	const create = (movie)  => {
		movie.id = nextid;
		setMymovies([...mymovies, movie]);
		setNextid(nextid + 1);
		setActions([...actions, "Pelicula " + movie.titulo + " creada a las "+ new Date().toLocaleTimeString()])

		navigate('/');
	}

	const download = async () => {
		let downloadedMovies;
		try {
			const res = await fetch(SERVER_URL);
			downloadedMovies = await res.json();
		} catch (e) {
			alert("No se ha podido recuperar la información.");
		}
		setMymovies(downloadedMovies);
		setActions([...actions, "Películas descargadas de " + SERVER_URL + " a las " + new Date().toLocaleTimeString()])
	}

	const saveLocalStorage = () => {
		localStorage.setItem("pelis", JSON.stringify(mymovies));
		setActions([...actions, "Salvado en LocalStorage a las " + new Date().toLocaleTimeString()])
		/* Si quisiésemos además salvarlo en el server (si tiene un controlador que lo salve claro):
		const res = await fetch(SERVER_URL, {
          method: 'POST', 
          headers:{
              "Content-Type": "application/json",
          },
          body: JSON.stringify(mymovies)
        });
        const {uri} = await res.json();
    */
	}

	const loadLocalStorage = async () => {
		if(localStorage.getItem("pelis")!==null){
			let lsmovies = JSON.parse(localStorage.getItem("pelis"));
			setMymovies(lsmovies);
			setActions([...actions, "Peliculas cargadas de LocalStorage a las "+ new Date().toLocaleTimeString()])
		} else {
			setActions([...actions, "LocalStorage vacio, error al cargar peliculas a las "+ new Date().toLocaleTimeString()])
			alert("No hay nada guardado en localstorage");
		}		
	}

	const reset = () => {
		localStorage.clear();
		setActions([...actions, "LocalStorage clear a las "+ new Date().toLocaleTimeString()])
	}

	useEffect(() => {
    async function fetchData() {
      await download();
				
			setTimeout(()=>{
				setLoading(false);
			},500);		
    }

    fetchData();
  }, []);
	
	  	return (
					<div className="root">
						<Navbar/>
						{loading ? <img src={process.env.PUBLIC_URL + "/spinner.gif"} className="spinner" alt="spinner" />: <Routes>
								<Route path="/add" element={<MovieForm themovie={{}} create={create} new/>}/>
								<Route path="/edit/:movieId" element={<MovieForm themovies={mymovies} update={update}/>}/>
								<Route path="/show/:movieId" element={<MovieInfo themovies={mymovies} />}/>
								<Route path="/" element={<Movies themovies={mymovies} delete={erase} download={download} saveLocalStorage={saveLocalStorage} loadLocalStorage={loadLocalStorage} reset={reset}/>}/>
								<Route path="*" element={<NotFound />} />
							</Routes>}
						<ShowInfo actions={actions}/>
					</div>
	  );
	}


