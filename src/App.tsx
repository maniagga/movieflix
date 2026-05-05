import { useState, useEffect } from "react"
import Search from "./components/Search"
import Loader from "./components/Loader";
import MovieCard from "./components/MovieCard";
import {useDebounce} from "react-use";
import {updateSearchCount} from "./appwrite";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMTB_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`
  }
}

//const API_BASE_URL = "http://localhost:5000";

const App = () => {

  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  const fetchMovies = async (query: string = '') => {
    setIsLoading(true);
    setErrorMessage("");
    try{
      const endPoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const moviesResponse = await fetch(endPoint, API_OPTIONS);
      if (!moviesResponse.ok) {
        throw new Error(`HTTP error! status: ${moviesResponse.status}`);
      }
      const moviesData = await moviesResponse.json();
      if(!moviesData.results) {
        throw new Error("Invalid response structure: 'results' field is missing");
      }
      console.log("Fetched movies:", moviesData);
      updateSearchCount()
      setMovies(moviesData.results);
    } catch(error) {
        console.error("Error fetching movies:", error);
        setErrorMessage("Failed to fetch movies. Please try again later.");
        setMovies([]);
    } finally {
      setIsLoading(false);
    }
  }

  // use debounce for search
  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);


  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  return (
    <main>
      <div className="pattern">
        <div className="wrapper">
          <header>
            <img src="./hero-img.png" alt="Hero banner" />
            <h1>Find <span className="text-gradient">Movies</span> You'll enjoy without the hassle</h1>
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </header>
          <section className="all-movies">
            <h2 className="mt-[40px]">All Movies</h2>
            { isLoading ? (
              <Loader />
            ) : errorMessage ? (
              <p className="text-red-500">{errorMessage}</p>
            ) : (
              <ul>
                {movies.map((movie: any) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </ul>
            )}
               
          </section>
        </div>
      </div>
    </main>

  )
}

export default App