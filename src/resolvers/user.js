import Joi from 'joi'
import mongoose from 'mongoose'
import * as auth from '../auth'
import { User } from '../models'
import { signIn, signUp } from '../schemas'

export default {
	Query: {
		me: async (root, { email, password }, { req, res }, info) => {
			const user = await auth.checkSignedIn(req, res)
			return await User.findById(req.session.userId)
		},
		users: async (root, { email, password }, { req, res }, info) => {
			req.session.email = email
			req.session.password = password

			const user = await auth.checkSignedIn(req, res)

			if (user) {
				console.log('hhooooooo')
				// return user
				return await User.find()
			}
		},
		user: async (root, { email, password }, { req, res }, info) => {
			// TODO: auth, projection, sanitization

			auth.checkSignedIn(req, res)
			if (!mongoose.Types.ObjectId.isValid(id)) {
				throw new UserInputError(`${id} — is not a valid user id`)
			}
			return User.findById(id)
		}
	},
	Mutation: {
		signUp: async (root, args, { req, res }, info) => {
			// TODO: not auth
			// Validation
			auth.checkSignedOut(req, res)
			await Joi.validate(args, signUp, { abortEarly: false }) // joi validation

			const user = await User.create(args) // mongoose add data
			req.session.userId = user.id
			return user
		},

		signIn: async (root, args, { req, res }, info) => {
			const { userId } = req.session
			if (userId) {
				return User.findById(userId)
			}
			await Joi.validate(args, signIn, { abortEarly: false }) // joi validation

			await User.findOne({
				email: args.email,
				password: args.password
			})

			const user = await auth.attemptSignIn(args.email, args.password)

			req.session.userId = user.id

			return user
		},
		signOut: async (root, args, { req, res }, info) => {
			auth.checkSignedIn(req)
			return auth.signOut(req, res)
		}
	}
}
