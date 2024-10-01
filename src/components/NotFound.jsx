import {Link} from "react-router-dom";

export default function NotFound(props){
  return <div>
    <img className="logo" src={process.env.PUBLIC_URL + "/404.jpg"} alt="logo" />
    <br/>
    <div>Página 404 maquetada muy chula...</div>  
    <Link to="/"><button className="show">VOLVER</button></Link>  
    </div>
}