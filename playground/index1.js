const express = require('express')
const graphqlHTTP = require('express-graphql')
const { buildSchema } = require('graphql')
const crypto = require('crypto')

const db = {
	users: [
		{
			id: '1',
			email: 'abc@xyz.com',
			name: 'Rayane'
		},
		{
			id: '2',
			email: 'hopla@xyz.com',
			name: 'Nermine'
		},
		{
			id: '3',
			email: 'jamal@xyz.com',
			name: 'Jamal'
		}
	],
	messages: [
		{ id: '1', userId: '1', body: 'Hello!', createdAt: Date.now() },
		{ id: '2', userId: '2', body: 'Hola!', createdAt: Date.now() },
		{ id: '3', userId: '1', body: 'HI!', createdAt: Date.now() }
	]
}

class User {
	constructor(u) {
		Object.assign(this, u)
	}
	messages() {
		return db.messages.filter(m => m.userId === this.id)
	}
}

const schema = buildSchema(`
  type Query {
		users: [User!]!
		user(id: ID!): User
		messages: [Message!]!
		message(id: ID!): Message
	}
	type Mutation {
		addUser (email: String!, name: String): User
	}
  type User {
    id: ID!
    email: String!
    name: String
		avatar: String
		messages: [Message!]!
  }
  type Message {
		id: ID!
    userId: ID!
		body: String!
		createdAt: String
  }
`)

const root = {
	users: () => db.users.map(u => new User(u)),
	user: args => db.users.find(u => u.id === args.id),
	messages: () => db.messages,
	message: args => db.messages.find(m => m.userId === args.id),
	addUser: ({ email, name }) => {
		const user = {
			id: crypto.randomBytes(10).toString('hex'),
			email,
			name
		}
		// db.users.push(user)
		db.users = [...db.users, user]
		return user
	}
}

const app = express()
app.use(
	'/graphql',
	graphqlHTTP({
		schema: schema,
		rootValue: root,
		graphiql: true
	})
)
app.listen(4000, () => console.log('localhost:4000/graphql'))
