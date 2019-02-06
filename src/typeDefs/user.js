import { gql } from 'apollo-server-express'

export default gql`
	extend type Query {
		me(id: ID!): User
		user(id: ID!): User
		users(email: String, password: String): [User!]!
	}
	extend type Mutation {
		signUp(
			email: String!
			username: String!
			name: String!
			password: String!
		): User
		signIn(email: String!, password: String!): User
		signOut: Boolean
		# login(email: String!, password: String!): User
	}
	type User {
		id: ID!
		email: String!
		username: String!
		name: String!
		createdAt: String!
	}
`
