import User from '../models/User.js'

export const getAllUsers = () => {
	return User.findAll()
}

export const getUserById = (id) => {
	return User.findById(id)
}

export const createUser = (userData) => {
	const { name, email } = userData
	
	if (email && User.emailExists(email)) {
		throw new Error('Email already exists')
	}
	
	return User.create({ name, email })
}

export const updateUser = (id, userData) => {
	const { name, email } = userData
	
	const existingUser = User.findById(id)
	if (!existingUser) {
		return null
	}
	
	if (email && email !== existingUser.email && User.emailExists(email, id)) {
		throw new Error('Email already exists')
	}
	
	return User.update(id, { name, email })
}

export const deleteUser = (id) => {
	return User.delete(id)
}

export const getUserByEmail = (email) => {
	return User.findByEmail(email)
}

export const getUserCount = () => {
	return User.count()
}