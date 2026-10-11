import { useEffect, useState, useRef } from "react";
import StarComponent from "./StarComponent";
import { useLocalStorage } from "./useLocalStorage";

const APIkey = "f84fc31d";
const findAverage = (arr) =>
  arr.length ? arr.reduce((sum, num) => sum + num, 0) / arr.length : 0;

export default function App() {
  const [search, setSearch] = useState("");
  const [load, setLoad] = useState(false);
  const [error, setError] = useState("");
  const [movies, setMovies] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  // const [watched, setWatched] = useState(() => {
  //   //getting movies from localStorage
  //   const values = JSON.parse(localStorage.getItem("watchedMovies"));
  //   return values ? values : [];
  // });
  //custom hook for local storage
  const [watched, setWatched] = useLocalStorage([], "watched");
  const numMovies = movies.length;

  const handleSelected = (id) => {
    setSelectedId(id);
    console.log(id);
  };

  const handleAddMovie = (movie) =>
    setWatched((watched) => [...watched, movie]);

  const handleRemoveMovie = (id) =>
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));

  const removeSelcted = () => setSelectedId(null);
  useEffect(() => {
    const controller = new AbortController();

    if (!search) {
      setMovies([]);
      return;
    }
    async function fetchMovie() {
      try {
        setLoad(true);
        setError("");
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${APIkey}&s=${search}`,
          { signal: controller.signal },
        );
        console.log(res);
        if (!res.ok) throw new Error("Something Went Wrong");

        const data = await res.json();
        console.log(data);
        if (data.Response === "False") throw new Error("Not Found");
        setMovies(data.Search);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setLoad(false);
      }
    }
    removeSelcted();
    fetchMovie();

    return function () {
      controller.abort();
    };
  }, [search]);

  // storing movies inside localStorage
  // useEffect(() => {
  //   localStorage.setItem("watchedMovies", JSON.stringify(watched));
  // }, [watched]);

  return (
    <>
      <Nav search={search} setSearch={setSearch} numMovies={numMovies} />
      <Main>
        <Box>
          {!search && !load && !error && (
            <p className="loader">Start Searching</p>
          )}
          {load && <Loader />}
          {error && <Error message={error} />}
          {!load && !error && (
            <Leftbox movies={movies} handleSelected={handleSelected} />
          )}
        </Box>
        <Box>
          {selectedId ? (
            <SelectedMovies
              selectedId={selectedId}
              removeSelcted={removeSelcted}
              watched={watched}
              handleAddMovie={handleAddMovie}
            />
          ) : (
            <Rightbox watched={watched} handleRemoveMovie={handleRemoveMovie} />
          )}
        </Box>
      </Main>
    </>
  );
}

function Nav({ search, setSearch, numMovies }) {
  const searchEl = useRef(null);
  console.log(searchEl);
  useEffect(() => {
    const callback = (e) => {
      if (document.activeElement === searchEl.current) return;
      if (e.code === "Enter") {
        searchEl.current.focus();
        setSearch("");
      }
    };

    document.addEventListener("keydown", callback);
    return () => document.removeEventListener("keydown", callback);
  }, [setSearch]);

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
        ref={searchEl}
      ></input>

      <p className="num-results">
        Showing <strong>{numMovies}</strong> top results
      </p>
    </div>
  );
}
function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Loader() {
  return <p className="loader">Loading..</p>;
}

function Error({ message }) {
  return <p className="error">{message}</p>;
}

function Box({ children }) {
  const [toggle, setToggle] = useState(true);

  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setToggle((tg) => !tg)}>
        {!toggle ? "-" : "+"}
      </button>
      {toggle && children}
    </div>
  );
}

function Leftbox({ movies, handleSelected }) {
  return (
    <ul className="list list-movies">
      {movies?.map((mov) => (
        <Movie movie={mov} key={mov.imdbID} handleSelected={handleSelected} />
      ))}
    </ul>
  );
}

function Rightbox({ watched, handleRemoveMovie }) {
  return (
    <>
      <Summary watched={watched} />
      <ul className="list">
        {watched.map((movie) => (
          <WatchedMovie
            watchedMovie={movie}
            key={movie.imdbID}
            handleRemoveMovie={handleRemoveMovie}
          />
        ))}
      </ul>
    </>
  );
}

function Summary({ watched }) {
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
          <span>{averageIMDBRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{averageUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{Math.round(averageRuntime / 60)} hr</span>
        </p>
      </div>
    </div>
  );
}

function Movie({ movie, handleSelected }) {
  return (
    <li onClick={() => handleSelected(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>Realesed:</p>
        <p>{movie.Year}</p>
      </div>
    </li>
  );
}

function WatchedMovie({ watchedMovie, handleRemoveMovie }) {
  return (
    <li>
      <button
        className="btn-delete"
        onClick={() => handleRemoveMovie(watchedMovie.imdbID)}
      >
        &times;
      </button>
      <img src={watchedMovie.poster} alt={`${watchedMovie.title} poster`} />
      <h3>{watchedMovie.title}</h3>
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

function SelectedMovies({
  selectedId,
  removeSelcted,
  watched,
  handleAddMovie,
}) {
  const [details, setDetails] = useState({});
  const [userRating, setUserRating] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    async function fetchMovieById() {
      try {
        setLoading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${APIkey}&i=${selectedId}`,
        );
        if (!res.ok) throw new Error("Something went wrong");
        const data = await res.json();
        if (data.Response === "False") throw new Error("Details not Found");
        console.log(data);
        setDetails(data);
        setLoading(false);
      } catch (err) {
        console.error(err.message);
      }
    }
    fetchMovieById();
  }, [selectedId]);

  const {
    Title: title,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
    Rated: rating,
    BoxOffice: boxOffice,
    Year: year,
  } = details;

  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);
  function addMovie() {
    const newMovie = {
      imdbID: selectedId,
      title,
      poster,
      year,
      imdbRating: Number(imdbRating),
      userRating,
      runtime: Number(runtime.split(" ").at(0)),
    };
    handleAddMovie(newMovie);
    removeSelcted();
  }

  useEffect(() => {
    if (!title) return title;
    document.title = `Movie | ${title}`;

    return () => {
      document.title = "WatchIt";
    };
  }, [title]);

  useEffect(() => {
    const esckey = (e) => {
      if (e.code === "Escape") removeSelcted();
    };

    document.addEventListener("keydown", esckey);

    return () => document.removeEventListener("keydown", esckey);
  }, [removeSelcted]);

  //storing in local storage
  useEffect(() => {}, []);

  return (
    <div className="details">
      {!loading ? (
        <>
          <header>
            <button className="btn-back" onClick={removeSelcted}>
              &larr;
            </button>
            <img src={poster} alt={`${title} Poster`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>⭐️ {imdbRating}</p>
            </div>
          </header>
          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarComponent
                    maxRating={10}
                    size={24}
                    onSetRating={setUserRating}
                  />
                  {userRating > 0 && (
                    <button className="btn-add" onClick={addMovie}>
                      Add to List
                    </button>
                  )}
                </>
              ) : (
                <p>
                  <em>You have already added this movie</em>
                </p>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>
              <strong>Actors: </strong> {actors}
            </p>
            <p>
              <strong>Directed By: </strong> {director}
            </p>
            <p>
              <strong>Rated For: </strong> {rating}
            </p>
            <p>
              <strong>Box Office Collection: </strong> {boxOffice}
            </p>
          </section>{" "}
        </>
      ) : (
        <Loader />
      )}
    </div>
  );
}
