export default function ShowInfo(props){
  return <div>
    <h4>ACCIONES LOGUEADAS:</h4>
    <ul>
      {props.actions.map((item, index)=>{
        return <li key={index}>{item}</li>;
      })}
    </ul>
    </div>
}