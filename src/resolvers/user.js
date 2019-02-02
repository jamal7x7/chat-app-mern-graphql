import mongoose from 'mongoose'
import { User } from '../models'

export default {
	Query: {
		users: (root, { id }, context, info) => {
			// TODO: auth, projection, pagination
			return User.find()
		},
		user: (root, { id }, context, info) => {
			// TODO: auth, projection, sanitization
			if (!mongoose.Types.ObjectId.isValid(id)) {
				throw new UserInputError(`${id} — is not a valid user id`)
			}
			return User.findById(id)
		}
	},
	Mutation: {
		signUp: (root, args, context, info) => {
			// TODO: not auth
			// Validation
			return User.create(args)
		}
	}
}
