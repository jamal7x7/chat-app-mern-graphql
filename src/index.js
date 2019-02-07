require('dotenv').config()
import { ApolloServer } from 'apollo-server-express'
import connectRedis from 'connect-redis'
import express from 'express'
import session from 'express-session'
import mongoose from 'mongoose'
import resolvers from './resolvers'
import typeDefs from './typeDefs'

const {
	APP_PORT,
	NODE_ENV,

	DB_NAME,
	DB_PASSWORD,
	DB_PORT,
	DB_USERNAME,

	SESS_NAME,
	SESS_SECRET,
	SESS_LIFETIME,
	// IN_PROD,

	REDIS_HOST,
	REDIS_PORT,
	REDIS_PASS
} = process.env

const IN_PROD = NODE_ENV === 'production'

const uri0 = 'mongodb://localhost:' + DB_PORT + '/' + DB_NAME

const uri =
	'mongodb+srv://' +
	DB_USERNAME +
	':' +
	DB_PASSWORD +
	'@jamalcluster-vebwi.mongodb.net/' +
	DB_NAME +
	'?retryWrites=true/'

// console.log(uri, uri0)
// console.log(process.env)
;(async () => {
	try {
		await mongoose.connect(uri0, { useNewUrlParser: true })

		const db = mongoose.connection
		db.on('error', console.error.bind(console, 'connection error:'))
		db.once('open', () => {
			console.log("we're connected to MongoDB!")
		})

		const app = express()
		app.disable('x-powered-by')

		// REDIS STORE

		const RedisStore = connectRedis(session)

		let store = new RedisStore({
			host: 'redis-15137.c8.us-east-1-4.ec2.cloud.redislabs.com',
			port: 15137,
			pass: 'secret'
		})

		console.log(REDIS_HOST, REDIS_PORT, REDIS_PASS)

		app.use(
			session({
				store,
				name: SESS_NAME,
				secret: SESS_SECRET,
				resave: false,
				saveUninitialized: false,
				cookie: {
					httpOnly: true,
					maxAge: parseInt(SESS_LIFETIME),
					sameSite: true,
					secure: IN_PROD
				}
			})
		)

		const server = new ApolloServer({
			typeDefs,
			resolvers,
			context: ({ req, res }) => ({ req, res }),
			playground: IN_PROD
				? false
				: {
						setting: {
							'request.credentials': 'include'
						}
				  }
		})

		server.applyMiddleware({ app, cors: false }) // app is from an existing express app

		app.listen({ port: APP_PORT }, () =>
			console.log(
				`🚀 Server ready at http://localhost:${APP_PORT}${server.graphqlPath}`
			)
		)
	} catch (e) {
		console.error(e)
	}
})()
