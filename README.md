# Mis Películas Favoritas — ejemplo React 19 + React Router

Aplicación de una sola página (SPA) para gestionar una lista de películas. Junta
casi todos los conceptos de React vistos en la asignatura:

- componentes, props y estado (`useState`)
- elevar el estado al componente padre y pasar callbacks a los hijos
- efectos (`useEffect`) y peticiones al servidor con `fetch`
- enrutado con React Router: rutas, parámetros de ruta, `Link`, `useNavigate`
- formularios con la API de React 19 (`<form action>` + `FormData`)
- persistencia en el navegador con `localStorage`

## Cómo arrancarlo

```bash
npm install      # o: yarn
npm run dev      # servidor de desarrollo en http://localhost:5173
npm run build    # genera la versión de producción en dist/
npm run lint     # comprueba el código con ESLint
```

## Estructura de ficheros

```
index.html                  HTML con <div id="root">, donde se monta React
public/                     Ficheros estáticos (imágenes). Se sirven desde la raíz: /avatar.png
src/
  main.jsx                  Punto de entrada: monta <App> dentro de <BrowserRouter>
  constants/constants.js    Películas por defecto (si falla el servidor)
  assets/index.css          Estilos
  components/
    App.jsx                 Componente raíz: estado, lógica y definición de rutas
    Navbar.jsx              Cabecera (en todas las páginas)
    Movies.jsx              Listado de películas + botones          → ruta /
    Movie.jsx               Tarjeta de una película (la usa Movies)
    MovieForm.jsx           Formulario de crear/editar              → rutas /add y /edit/:movieId
    MovieInfo.jsx           Detalle de una película                 → ruta /show/:movieId
    NotFound.jsx            Página 404                              → cualquier otra ruta
    ShowInfo.jsx            Log de acciones (en todas las páginas)
```

## Árbol de componentes y flujo de datos

```
<BrowserRouter>
  <App>                       estado: loading, mymovies, actions
    <Navbar/>
    <Routes>                  según la URL se pinta UNO de estos:
      <Movies/>        /                 ──► <Movie/> × N
      <MovieForm/>     /add  y  /edit/:movieId
      <MovieInfo/>     /show/:movieId
      <NotFound/>      *
    </Routes>
    <ShowInfo/>
  </App>
```

**Todo el estado está en `App`.** Los hijos nunca modifican `mymovies` directamente:

- Los **datos bajan** por props: `themovies={mymovies}`.
- Los **eventos suben** llamando a callbacks que `App` pasa por props:
  `create`, `update`, `delete` (que en App se llama `erase`), `download`...

Por ejemplo, al borrar: el usuario pulsa *borrar* en `Movie` → se ejecuta
`props.delete()` → que es `() => props.delete(pelicula.id)` en `Movies` → que es
`erase(id)` en `App` → `setMymovies(...)` → React vuelve a renderizar el listado.

Las funciones que cambian el estado **nunca mutan** el array; siempre crean uno nuevo:

| Operación | Código en `App.jsx` |
|---|---|
| Crear | `setMymovies([...mymovies, { ...movie, id: newId }])` |
| Editar | `setMymovies(mymovies.map(m => m.id === updated.id ? updated : m))` |
| Borrar | `setMymovies(mymovies.filter(m => m.id !== id))` |

## Las rutas, una a una

Las rutas se definen en `App.jsx` dentro de `<Routes>`. `main.jsx` envuelve la
aplicación en `<BrowserRouter>`, que usa la *History API* del navegador: la URL
cambia pero la página **no se recarga** (el estado de `App` se conserva).

Para navegar se usan dos mecanismos:

- `<Link to="/add">` — un enlace que pulsa el usuario.
- `navigate("/")` — desde código, con la función que devuelve `useNavigate()`.
  `App` lo usa para volver al listado tras crear, editar o borrar.

> **Ojo:** si escribes la URL a mano en la barra del navegador y pulsas Intro,
> la página **sí** se recarga: React arranca de cero, se pierde el estado y se
> vuelven a descargar las películas. Por eso existe la opción de guardar en
> localStorage.

### `/` — Listado (`Movies`)

| | |
|---|---|
| Parámetros de ruta | ninguno |
| Props que recibe | `themovies`, `delete`, `download`, `saveLocalStorage`, `loadLocalStorage`, `reset` |
| Qué hace | Pinta una `<Movie>` por película (con `map`, usando `key={pelicula.id}`) y los botones de acciones generales |

Cada tarjeta `Movie` tiene enlaces a `/show/:id` y `/edit/:id`, y un botón de borrar.

### `/add` — Crear película (`MovieForm`)

| | |
|---|---|
| Parámetros de ruta | ninguno |
| Props que recibe | `isNew={true}`, `create` |
| Qué hace | Muestra el formulario vacío. Al enviarlo llama a `create(data)` con `{titulo, director, miniatura}` (sin id) |

`App.create` calcula el id como *el mayor id existente + 1*, añade la película y
navega a `/`.

### `/edit/:movieId` — Editar película (`MovieForm`)

| | |
|---|---|
| Parámetros de ruta | `movieId` — id de la película a editar. Ej.: `/edit/17` |
| Props que recibe | `themovies`, `update` |
| Qué hace | Lee `movieId` con `useParams()`, busca la película y rellena el formulario con sus datos. Al enviarlo llama a `update({...data, id})` |

El **mismo componente** sirve para crear y editar: lo distingue la prop `isNew`.

### `/show/:movieId` — Detalle (`MovieInfo`)

| | |
|---|---|
| Parámetros de ruta | `movieId` — id de la película a mostrar. Ej.: `/show/2` |
| Props que recibe | `themovies` |
| Qué hace | Lee `movieId` con `useParams()`, busca la película y muestra título y director |

### `*` — Página no encontrada (`NotFound`)

`path="*"` encaja con **cualquier** URL que no haya encajado con las rutas de
arriba (por ejemplo `/hola`) y muestra la página 404.

### Cómo se leen los parámetros de ruta

```jsx
// Ruta definida en App:  <Route path="/show/:movieId" element={<MovieInfo .../>} />
// URL visitada:          /show/17

const { movieId } = useParams();   // movieId === "17"  ← ¡es un STRING!
const movie = props.themovies.find(m => m.id === Number(movieId));
```

Los parámetros de la URL **siempre son strings**. Como los ids de las películas
son números, hay que convertir con `Number()` antes de comparar con `===`
(`17 === "17"` es `false`).

Si el id no existe (por ejemplo `/show/999`), `find` devuelve `undefined`;
`MovieInfo` y `MovieForm` lo comprueban y muestran un mensaje en lugar de fallar.

## Formularios en React 19: `<form action>` + `FormData`

### Antes: componentes controlados

En la versión anterior cada campo estaba **controlado** por React: su valor
vivía en el estado y cada tecla pulsada provocaba un `setState` y un re-render.

```jsx
const [movie, setMovie] = useState({ titulo: "", director: "", miniatura: "" });

<input value={movie.titulo}
       onChange={e => setMovie({ ...movie, titulo: e.target.value })} />
...
<button onClick={() => props.create(movie)}>Crear</button>
```

### Ahora: formulario no controlado con una *action*

React 19 permite pasar una **función** a la prop `action` del `<form>`. Al enviar
el formulario, React:

1. evita la recarga de página (no hace falta `e.preventDefault()`),
2. construye un objeto [`FormData`](https://developer.mozilla.org/es/docs/Web/API/FormData)
   con los valores de todos los campos,
3. llama a tu función pasándole ese `FormData`.

```jsx
function handleSubmit(formData) {
  const data = {
    titulo:    formData.get("titulo"),     // valor del <input name="titulo">
    director:  formData.get("director"),
    miniatura: formData.get("miniatura") || "placeholder.png",
  };
  props.isNew ? props.create(data) : props.update({ ...data, id: movie.id });
}

<form action={handleSubmit}>
  <input name="titulo" defaultValue={movie.titulo} required />
  <input name="director" defaultValue={movie.director} />
  <input name="miniatura" defaultValue={movie.miniatura} />
  <button type="submit">Crear</button>
</form>
```

Claves a recordar:

- **`name`** es obligatorio: es la clave con la que el valor aparece en el `FormData`.
- **`defaultValue`** (no `value`) fija el valor inicial; a partir de ahí el
  navegador gestiona lo que escribe el usuario. Al editar, ahí van los datos actuales.
- Ya **no hay `useState`** en el formulario: los datos solo se leen al enviar.
- El botón que envía es `type="submit"`. El botón *Volver* es `type="button"`
  para que no envíe el formulario.
- `required` es validación nativa del navegador: no deja enviar sin título.
- Atajo: `Object.fromEntries(formData)` convierte todo el `FormData` en un objeto.
- Tras ejecutar la action, React **resetea** los campos del formulario. Aquí no
  se nota porque navegamos a `/` justo después.

¿Cuándo seguir usando componentes controlados? Cuando necesitas reaccionar a
cada tecla: validar mientras se escribe, deshabilitar el botón si un campo está
vacío, autocompletar, etc. Para "rellenar y enviar", la *action* es más simple.

> Para ir más allá: con `useActionState` la action puede devolver un estado
> (por ejemplo mensajes de error de validación) y con `useFormStatus` un botón
> puede saber si el formulario se está enviando (útil con actions `async` que
> llaman a un servidor).

## Peticiones al servidor: `fetch` y `useEffect`

Al arrancar, `App` descarga las películas de una API REST de ejemplo:

```jsx
useEffect(() => {
  async function fetchData() {
    await download();
    setTimeout(() => setLoading(false), 500);   // retardo para ver el spinner
  }
  fetchData();
}, []);   // [] → solo se ejecuta una vez, al montar el componente
```

- Mientras `loading` es `true` se muestra `spinner.gif` en lugar de las rutas.
- `download()` hace un `GET` a `SERVER_URL` con `fetch`, comprueba `res.ok`,
  convierte la respuesta con `res.json()` y la guarda con `setMymovies`.
- Si algo falla (sin red, error HTTP...) el `catch` carga las películas por
  defecto de `constants.js` y avisa con un `alert`.
- El botón *Descargar del servidor* llama a la misma función `download`.

En `saveLocalStorage` hay comentado cómo sería un `POST` para guardar en un
servidor que lo admitiese.

## localStorage

`localStorage` es un almacén **clave → valor** del navegador, asociado al
origen (protocolo + dominio + puerto, p. ej. `http://localhost:5173`). Los datos
**persisten** aunque recargues la página o cierres el navegador.

Solo guarda **strings**, así que hay que convertir el array de películas:

| Botón | Función en `App` | Qué hace |
|---|---|---|
| Guardar en LocalStorage | `saveLocalStorage` | `localStorage.setItem("pelis", JSON.stringify(mymovies))` |
| Cargar de LocalStorage | `loadLocalStorage` | `localStorage.getItem("pelis")` → si no es `null`, `JSON.parse(...)` y `setMymovies` |
| Reiniciar LocalStorage | `reset` | `localStorage.clear()` — borra **todas** las claves del origen |

- `getItem` devuelve `null` si la clave no existe; por eso se comprueba antes de parsear.
- Para borrar solo nuestra clave usaríamos `localStorage.removeItem("pelis")`.
- La clave `"pelis"` está en la constante `LS_KEY` de `App.jsx`.
- Puedes ver y editar lo guardado en las DevTools del navegador:
  *Application* (Chrome) / *Almacenamiento* (Firefox) → *Local Storage*.

**Prueba en clase:** añade una película, guarda en localStorage, recarga la
página (vuelven las del servidor) y pulsa *Cargar de LocalStorage*.

> Esta app **no** carga localStorage automáticamente al arrancar: es manual con
> el botón. Un ejercicio interesante es hacerlo automático (ver más abajo).

## El log de acciones (`ShowInfo`)

Cada operación añade una línea al array `actions` con la función `log`:

```jsx
const log = (msg) => {
  setActions(prev => [...prev, msg + " a las " + new Date().toLocaleTimeString()]);
};
```

Se usa la **forma funcional** del setter (`prev => ...`). Así siempre se parte
del valor más reciente de `actions`, aunque `log` se llame desde una función
creada en un render anterior (como `download` dentro del `useEffect` inicial).
`ShowInfo` está fuera de `<Routes>`, por eso se ve en todas las páginas.

## Otros detalles que conviene fijarse

- **`key` en listas:** `Movies` usa `key={pelicula.id}`. Con el índice, al
  borrar una película todas las siguientes cambiarían de `key` y React
  asociaría cada tarjeta con el elemento equivocado (si las tarjetas tuviesen
  estado propio, se vería mezclado). En `ShowInfo` el índice sí vale porque la
  lista solo crece por el final.
- **Imágenes de `public/`:** se referencian desde la raíz (`/404.jpg`). En
  `Movie`, si la miniatura empieza por `http` se usa tal cual (URL externa); si
  no, se le antepone `/`. Si no hay miniatura se usa `placeholder.png`.
- **Ids nuevos:** se calculan como `max(ids) + 1` para no repetir ids tras
  descargar del servidor o cargar de localStorage.

## Ejercicios propuestos

1. Cargar automáticamente las películas de localStorage al arrancar, si las hay,
   y descargar del servidor solo si no hay nada guardado.
2. Guardar automáticamente en localStorage cada vez que cambie `mymovies`
   (pista: un `useEffect` con `[mymovies]` como dependencias).
3. Añadir un campo *año* al formulario y mostrarlo en `MovieInfo`.
4. Usar `useActionState` en `MovieForm` para mostrar un mensaje de error si el
   título tiene menos de 2 caracteres.
5. Pedir confirmación (`confirm(...)`) antes de borrar una película.
