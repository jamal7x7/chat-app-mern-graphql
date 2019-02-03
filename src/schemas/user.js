const Joi = require('joi')

export default Joi.object().keys({
	email: Joi.string()
		.email({ minDomainAtoms: 2 })
		.required()
		.label('Email'),
	username: Joi.string()
		.alphanum()
		.min(3)
		.max(30)
		.required()
		.label('Username'),
	name: Joi.string()
		.alphanum()
		.min(3)
		.max(30)
		.required()
		.label('Name'),
	password: Joi.string()
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
})
// .with('username')
// .without('password')

// // Return result.
// const result = Joi.validate({ username: 'abc', birthyear: 1994 }, schema)
// // result.error === null -> valid

// // You can also pass a callback which will be called synchronously with the validation result.
// Joi.validate({ username: 'abc', birthyear: 1994 }, schema, function(
// 	err,
// 	value
// ) {}) // err === null -> valid
