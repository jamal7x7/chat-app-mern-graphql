import { hash } from 'bcryptjs'
import mongoose from 'mongoose'
let userSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			validate: {
				validator: email => User.doesntExist({ email }),
				message: ({ value }) => `Email ${value} -> Already taken!` // TODO: security
			}
		},
		username: {
			type: String,
			validate: {
				validator: username => User.doesntExist({ username }),
				message: ({ value }) => `Usernam ${value} -> Already taken!` // TODO: security
			}
		},
		name: String,
		password: String
	},
	{
		timestamps: true
	}
)

userSchema.pre('save', async function(next) {
	if (this.isModified('password')) {
		this.password = await hash(this.password, 10)
	}
})

userSchema.statics.doesntExist = async function(options) {
	return (await this.where(options).countDocuments()) === 0
}

const User = mongoose.model('User', userSchema)
export default User
