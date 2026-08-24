interface SearchBarProps {
  city: string;
  loading: boolean;
  onCityChange: (city: string) => void;
  onSearch: () => void;
}

function SearchBar({
  city,
  loading,
  onCityChange,
  onSearch,
}: SearchBarProps) {
  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!city.trim()) {
      return;
    }

    onSearch();
  }

  return (
    <form
      className="search-bar"
      onSubmit={handleSubmit}
    >
      <input
        type="search"
        aria-label="Search for a city"
        placeholder="Search for a city..."
        value={city}
        onChange={(event) =>
          onCityChange(event.target.value)
        }
        disabled={loading}
      />

      <button
        type="submit"
        disabled={loading || !city.trim()}
      >
        {loading ? "Searching..." : "Search"}
      </button>
    </form>
  );
}

export default SearchBar;