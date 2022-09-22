import React from 'react';
import {Link} from "react-router-dom";

export default function Movie(props) {
		let filmimg;
		if(props.miniatura.startsWith("http")){
			//es url completa
			filmimg = props.miniatura;
		} else {
			//es local o relativo a public/
			filmimg = process.env.PUBLIC_URL + "/" + props.miniatura;
		}
		
		return <div className="movie">
			<div className="movie-img">
				<img className="show" src={filmimg} alt="miniatura de la película"/>
			</div>
			<div className="title">
			 	{props.titulo || <em>Sin título</em>}
			</div>
			<div className="actions">
				<Link to={"/show/"+props.id}><button className="show">ver</button></Link>
				<Link to={"/edit/"+props.id}><button className="edit">editar</button></Link>
				<button className="delete" onClick={props.delete}>borrar</button>
			</div>
		</div>
}
