import Movie from './Movie';
import {Link} from "react-router-dom";


export default function Movies(props) {
	return <div id="main">
		{props.themovies.map((pelicula,index)=>
			<Movie 
			  key={index}				
				delete={()=>props.delete(pelicula.id)}
				id={pelicula.id}
				titulo={pelicula.titulo} 
				director={pelicula.director} 
				miniatura={pelicula.miniatura} />)}
		<div className="actions">
						<Link to="/add"><button className="new">Añadir película</button></Link>
            <button className="down" onClick={props.download}>Descargar del servidor</button>
            <button className="up" onClick={props.saveLocalStorage}>Guardar en LocalStorage</button>
						<button className="up" onClick={props.loadLocalStorage}>Cargar de LocalStorage</button>
            <button className="reset" onClick={props.reset}>Reiniciar LocalStorage</button>
    </div>		
	</div>
}