/*
 * ShowInfo: muestra el log de acciones que va acumulando App.
 * Está fuera de <Routes>, por lo que aparece en todas las páginas.
 *
 * Props:
 *   actions -> array de strings
 */
export default function ShowInfo(props) {
	return (
		<div>
			<h4>ACCIONES LOGUEADAS:</h4>
			<ul>
				{/* Aquí el índice como key es aceptable: la lista solo crece al final
				    y los elementos nunca se reordenan ni se borran */}
				{props.actions.map((item, index) => (
					<li key={index}>{item}</li>
				))}
			</ul>
		</div>
	);
}
