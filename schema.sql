DROP TABLE IF EXISTS favMovies;

CREATE TABLE IF NOT EXISTS favMovies (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    poster_path IMAGE,
    overview TEXT(3000)
);