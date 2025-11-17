import db from '../config/database.js'

class Movie {
	static tableName = 'movies'
	
	static createTable() {
		const sql = `
			CREATE TABLE IF NOT EXISTS ${this.tableName} (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				title TEXT NOT NULL,
				director TEXT NOT NULL,
				year INTEGER,
				rating REAL,
				created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
				updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
			)
		`
		db.exec(sql)
		console.log(`Table '${this.tableName}' created/verified`)
	}
	
	static findAll() {
		const stmt = db.prepare(`SELECT * FROM ${this.tableName} ORDER BY id`)
		return stmt.all()
	}
	
	static findById(id) {
		const stmt = db.prepare(`SELECT * FROM ${this.tableName} WHERE id = ?`)
		return stmt.get(id)
	}
	
	static findByDirector(director) {
		const stmt = db.prepare(`SELECT * FROM ${this.tableName} WHERE director LIKE ?`)
		return stmt.all(`%${director}%`)
	}
	
	static findByYear(year) {
		const stmt = db.prepare(`SELECT * FROM ${this.tableName} WHERE year = ?`)
		return stmt.all(year)
	}
	
	static create(movieData) {
		const { title, director, year, rating } = movieData
		const stmt = db.prepare(`
			INSERT INTO ${this.tableName} (title, director, year, rating) 
			VALUES (?, ?, ?, ?)
		`)
		const result = stmt.run(title, director, year || null, rating || null)
		return this.findById(result.lastInsertRowid)
	}
	
	static update(id, movieData) {
		const { title, director, year, rating } = movieData
		
		const updates = []
		const values = []
		
		if (title !== undefined) {
			updates.push('title = ?')
			values.push(title)
		}
		
		if (director !== undefined) {
			updates.push('director = ?')
			values.push(director)
		}
		
		if (year !== undefined) {
			updates.push('year = ?')
			values.push(year)
		}
		
		if (rating !== undefined) {
			updates.push('rating = ?')
			values.push(rating)
		}
		
		updates.push('updated_at = CURRENT_TIMESTAMP')
		
		if (updates.length === 1) {
			return this.findById(id)
		}
		
		values.push(id)
		
		const stmt = db.prepare(`
			UPDATE ${this.tableName} 
			SET ${updates.join(', ')} 
			WHERE id = ?
		`)
		
		stmt.run(...values)
		return this.findById(id)
	}
	
	static delete(id) {
		const stmt = db.prepare(`DELETE FROM ${this.tableName} WHERE id = ?`)
		const result = stmt.run(id)
		return result.changes > 0
	}
	
	static count() {
		const stmt = db.prepare(`SELECT COUNT(*) as count FROM ${this.tableName}`)
		return stmt.get().count
	}
	
	static seed() {
		const count = this.count()
		
		if (count === 0) {
			console.log('Seeding movies table...')
			
			const sampleMovies = [
				{ title: 'Inception', director: 'Christopher Nolan', year: 2010, rating: 8.8 },
				{ title: 'The Matrix', director: 'The Wachowskis', year: 1999, rating: 8.7 },
				{ title: 'Interstellar', director: 'Christopher Nolan', year: 2014, rating: 8.6 },
				{ title: 'The Godfather', director: 'Francis Ford Coppola', year: 1972, rating: 9.2 },
				{ title: 'Pulp Fiction', director: 'Quentin Tarantino', year: 1994, rating: 8.9 }
			]
			
			sampleMovies.forEach(movie => this.create(movie))
			console.log(`Seeded ${sampleMovies.length} movies`)
		}
	}
}

export default Movie
