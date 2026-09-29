import { useState } from "react";

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const watched = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const findAverage = (arr) =>
  arr.reduce((sum, num) => sum + num, 0) / arr.length;

export default function App() {
  return (
    <>
      <Nav />
      <Main />
    </>
  );
}

function Nav() {
  const [search, setSearch] = useState("");

  return (
    <div className="nav-bar">
      <nav className="logo">
        <span role="img">🍿</span>
        <h1>watchit</h1>
      </nav>

      <input
        className="search"
        type="text"
        placeholder="search movies.."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      ></input>

      <p className="num-results">
        Showing <strong>{tempMovieData.length}</strong> top results
      </p>
    </div>
  );
}
function Main() {
  return (
    <main className="main">
      <Leftbox />
      <Rightbox />
    </main>
  );
}
function Leftbox() {
  const [toggle, setToggle] = useState(true);

  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setToggle((tg) => !tg)}>
        {!toggle ? "-" : "+"}
      </button>
      {toggle && (
        <ul className="list">
          {tempMovieData.map((mov) => (
            <Movie movie={mov} />
          ))}
        </ul>
      )}
    </div>
  );
}

function Rightbox() {
  const [toggle, setToggle] = useState(true);

  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setToggle((tg) => !tg)}>
        {!toggle ? "-" : "+"}
      </button>
      {toggle && (
        <>
          <Summary />
          <ul className="list">
            {watched.map((movie) => (
              <WatchedMovie watchedMovie={movie} />
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

function Summary() {
  const averageIMDBRating = findAverage(
    watched.map((movie) => movie.imdbRating),
  );
  const averageUserRating = findAverage(
    watched.map((movie) => movie.userRating),
  );
  const averageRuntime = findAverage(watched.map((movie) => movie.runtime));

  return (
    <div className="summary">
      <h2>Watched Movies</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{averageIMDBRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{averageUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{Math.round(averageRuntime / 60)} hr</span>
        </p>
      </div>
    </div>
  );
}

function Movie({ movie }) {
  return (
    <li>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>Realesed:</p>
        <p>{movie.Year}</p>
      </div>
    </li>
  );
}

function WatchedMovie({ watchedMovie }) {
  return (
    <li>
      <img src={watchedMovie.Poster} alt={`${watchedMovie.Title} poster`} />
      <h3>{watchedMovie.Title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{watchedMovie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{watchedMovie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{Math.round(watchedMovie.runtime / 60)} hr</span>
        </p>
      </div>
    </li>
  );
}
