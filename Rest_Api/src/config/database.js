import Database from 'better-sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'
import config from './config.js'  

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let dbPath

if (path.isAbsolute(config.databaseUrl)) {
	dbPath = config.databaseUrl
} 
else {
	dbPath = path.join(__dirname, '../../', config.databaseUrl)
}

console.log(`📊 Database path: ${dbPath}`)

const db = new Database(dbPath)

db.pragma('foreign_keys = ON')

export const initializeDatabase = async () => {
	console.log('🔧 Initializing database...')
	
	const User = (await import('../models/User.js')).default
	const Movie = (await import('../models/Movie.js')).default
	
	User.createTable()
	Movie.createTable()
	
	if (config.isDevelopment()) {
		User.seed()
		Movie.seed()
	}
	
	console.log('Database initialization complete')
}

export default db