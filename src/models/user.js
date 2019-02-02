import { hash } from 'bcryptjs'
import mongoose from 'mongoose'
let userSchema = new mongoose.Schema(
	{
		email: String,
		username: String,
		name: String,
		password: String
	},
	{
		timestamps: true
	}
)

userSchema.pre('save', async function(next) {
	if (this.isModified('password'))
		try {
			this.password = await hash(this.password, 10)
		} catch (error) {
			next(error)
		}
	next()
})

export default mongoose.model('User', userSchema)
