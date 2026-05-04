interface SearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const Search = ({searchTerm, setSearchTerm}: SearchProps) => {
  return (
    <div className="search">
        <div>
            <img src="./search.svg" alt="Search icon" />
            <input
                type="text"
                placeholder="Search for movies, TV shows, actors, more..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
    </div>
  )
}

export default Search