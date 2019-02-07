import { AuthenticationError } from 'apollo-server-express'
import { User } from './models'
const { SESS_NAME } = process.env

export const attemptSignIn = async (email, password) => {
	const message = 'Incorrect email or password, try again!'

	const user = await User.findOne({ email })

	if (!user) {
		throw new AuthenticationError(message)
	}

	if (!(await user.matchesPassword(password))) {
		throw new AuthenticationError(message)
	}

	return user
}

const signedIn = req => req.session.userId

export const checkSignedIn = (req, res) => {
	if (!signedIn(req)) {
		throw new AuthenticationError('You must be signed in!')
	}
}

export const checkSignedOut = (req, res) => {
	if (signedIn(req)) {
		throw new AuthenticationError('You are already signed in!')
	}
}

export const signOut = (req, res) =>
	new Promise((resolve, reject) => {
		req.session.destroy(err => {
			if (err) reject(err)
			res.clearCookie('kid')
			resolve(true)
		})
	})
