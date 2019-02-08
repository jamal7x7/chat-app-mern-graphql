import Joi from 'joi'

const email = Joi.string()
	.email({ minDomainAtoms: 2 })
	.required()
	.label('Email')

const name = Joi.string()
	.alphanum()
	.min(3)
	.max(30)
	.required()
	.label('Name')

const username = Joi.string()
	.alphanum()
	.min(3)
	.max(30)
	.required()
	.label('Username')

const password = Joi.string()
	.regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,30}$/)
	.label('Password')
	.options({
		language: {
			string: {
				regex: {
					base:
						'must have: At least one upper case English letter, At least one lower case English letter, At least one digit, At least one special character, Minimum eight and maximum 30 in length .'
				}
			}
		}
	})

export const signUp = Joi.object().keys({
	email,
	username,
	name,
	password
})

export const signIn = Joi.object().keys({
	email,
	password
})

export const signOut = Joi.object().keys({
	email,
	password
})
