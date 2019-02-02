import { ApolloServer, gql } from 'apollo-server'
import crypto from 'crypto'

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

const typeDefs = gql`
	type Query {
		users: [User!]!
		user(id: ID!): User
		messages: [Message!]!
		message(id: ID!): Message
	}
	type Mutation {
		addUser(email: String!, name: String): User
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
`

const resolvers = {
	Query: {
		users: () => db.users,
		user: (root, { id }) => db.users.find(u => u.id === id),
		messages: () => db.messages
		// message: (root, { id }) => db.messages.find(m => m.userId === id)
	},
	Mutation: {
		addUser: (root, { email, name }) => {
			const user = {
				id: crypto.randomBytes(10).toString('hex'),
				email,
				name
			}
			// db.users.push(user)
			db.users = [...db.users, user]
			return user
		}
	},
	User: {
		messages: u => db.messages.filter(m => m.userId === u.id)
	}
}

const server = new ApolloServer({ typeDefs, resolvers }) // mocks: true

server.listen().then(({ url }) => console.log(url))
