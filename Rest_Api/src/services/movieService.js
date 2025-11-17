import Movie from '../models/Movie.js'

export const getAllMovies = () => {
	return Movie.findAll()
}

export const getMovieById = (id) => {
	return Movie.findById(id)
}

export const getMoviesByDirector = (director) => {
	return Movie.findByDirector(director)
}

export const getMoviesByYear = (year) => {
	return Movie.findByYear(year)
}

export const createMovie = (movieData) => {
	const { title, director, year, rating } = movieData
	
	if (rating !== undefined && (rating < 0 || rating > 10)) {
		throw new Error('Rating must be between 0 and 10')
	}
	
	const currentYear = new Date().getFullYear()
	if (year !== undefined && (year < 1888 || year > currentYear + 5)) {
		throw new Error(`Year must be between 1888 and ${currentYear + 5}`)
	}
	
	return Movie.create({ title, director, year, rating })
}

export const updateMovie = (id, movieData) => {
	const { title, director, year, rating } = movieData
	
	const existingMovie = Movie.findById(id)
	if (!existingMovie) {
		return null
	}
	
	if (rating !== undefined && (rating < 0 || rating > 10)) {
		throw new Error('Rating must be between 0 and 10')
	}
	
	const currentYear = new Date().getFullYear()
	if (year !== undefined && (year < 1888 || year > currentYear + 5)) {
		throw new Error(`Year must be between 1888 and ${currentYear + 5}`)
	}
	
	return Movie.update(id, { title, director, year, rating })
}

export const deleteMovie = (id) => {
	return Movie.delete(id)
}

export const getMovieCount = () => {
	return Movie.count()
}
