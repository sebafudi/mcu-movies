import React from "react";
import styled from "styled-components";

const MovieCardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f0f0f0;
  padding: 20px;
  border-radius: 10px;
  margin: 10px;
`;

const MovieTitle = styled.h2`
  font-size: 24px;
  margin-bottom: 10px;
`;

const ReleaseDate = styled.p`
  font-size: 18px;
  color: #666;
  font-style: italic;
`;

const MovieCard = ({
  title,
  releaseDate,
}: {
  title: string;
  releaseDate: string;
}) => {
  return (
    <MovieCardContainer>
      <MovieTitle>{title}</MovieTitle>
      <ReleaseDate>{releaseDate}</ReleaseDate>
    </MovieCardContainer>
  );
};

export default MovieCard;
