import Joi from 'joi'
import mongoose from 'mongoose'
import * as Auth from '../auth'
import { User } from '../models'
import { signIn, signUp } from '../schemas'

export default {
	Query: {
		me: async (root, args, { req, res }, info) => {
			const user = await Auth.checkSignedIn(req, res)
			return await User.findById(req.session.userId)
		},
		users: async (root, { email, password }, { req, res }, info) => {
			req.session.email = email
			req.session.password = password

			const user = await Auth.checkSignedIn(req, res)

			if (user) {
				console.log('hhooooooo')
				// return user
				return await User.find()
			}
		},
		user: async (root, { email, password }, { req, res }, info) => {
			// TODO: Auth, projection, sanitization

			Auth.checkSignedIn(req, res)
			if (!mongoose.Types.ObjectId.isValid(id)) {
				throw new UserInputError(`${id} — is not a valid user id`)
			}
			return User.findById(id)
		}
	},
	Mutation: {
		////////////////////////////  SIGNUP  ////////////////////////////////////
		signUp: async (root, args, { req, res }, info) => {
			// TODO: not Auth
			// Validation
			Auth.checkSignedOut(req, res)
			await Joi.validate(args, signUp, { abortEarly: false }) // joi validation

			const user = await User.create(args) // mongoose add data
			req.session.userId = user.id
			return user
		},

		////////////////////////////  SIGNIN  ////////////////////////////////////
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

			const user = await Auth.attemptSignIn(args.email, args.password)

			req.session.userId = user.id

			return user
		},

		////////////////////////////  SIGNOUT  ////////////////////////////////////
		signOut: async (root, args, { req, res }, info) => {
			Auth.checkSignedIn(req)
			return Auth.signOut(req, res)
		}
	}
}
