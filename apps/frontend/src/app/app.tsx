import styled from "styled-components";
import React from "react";

import MovieCard from "./MovieCard";

const StyledApp = styled.div``;

export function App() {
  const [movies, setMovies] = React.useState([]);

  React.useEffect(() => {
    fetch("/api/movies")
      .then((response) => response.json())
      .then((data) => setMovies(data.list));
  }, []);

  type Movie = {
    title: string;
    globalReleaseDate: string;
  };

  const movieList = movies.map((movie: Movie) => {
    return (
      <MovieCard
        title={movie.title}
        releaseDate={new Date(movie.globalReleaseDate).toDateString()}
        key={movie.title}
      />
    );
  });
  return <StyledApp>{movieList}</StyledApp>;
}

export default App;
