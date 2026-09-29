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
        Showing <strong>2</strong> top results
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
  return (
    <div className="box">
      <button className="btn-toggle">-</button>
      <ul className="list">
        {tempMovieData.map((mov) => (
          <Movie movie={mov} />
        ))}
      </ul>
    </div>
  );
}

function Rightbox() {
  return (
    <div className="box">
      <button className="btn-toggle">-</button>
    </div>
  );
}

function Movie({ movie }) {
  return (
    <li>
      <img src={movie.Posteroster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>Realesed:</p>
        <p>{movie.Year}</p>
      </div>
    </li>
  );
}
