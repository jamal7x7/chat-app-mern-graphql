import { ApolloServer } from 'apollo-server-express'
import express from 'express'
import mongoose from 'mongoose'
import {
	APP_PORT,
	DB_NAME,
	DB_PASSWORD,
	DB_PORT,
	DB_USERNAME,
	IN_PROD
} from './config'
import resolvers from './resolvers'
import typeDefs from './typeDefs'

const uri0 = 'mongodb://localhost:' + DB_PORT + '/' + DB_NAME

const uri =
	'mongodb+srv://' +
	DB_USERNAME +
	':' +
	DB_PASSWORD +
	'@jamalcluster-vebwi.mongodb.net/' +
	DB_NAME +
	'?retryWrites=true/'

console.log(uri, uri0)
;(async () => {
	try {
		await mongoose.connect(uri, { useNewUrlParser: true })

		const db = mongoose.connection
		db.on('error', console.error.bind(console, 'connection error:'))
		db.once('open', () => {
			console.log("we're connected to MongoDB!")
		})

		const app = express()
		app.disable('x-powered-by')

		const server = new ApolloServer({
			typeDefs,
			resolvers,
			playground: !IN_PROD
		})

		server.applyMiddleware({ app }) // app is from an existing express app

		app.listen({ port: APP_PORT }, () =>
			console.log(
				`🚀 Server ready at http://localhost:${APP_PORT}${server.graphqlPath}`
			)
		)
	} catch (e) {
		console.error(e)
	}
})()
