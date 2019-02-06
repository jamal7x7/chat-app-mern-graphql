const { ApolloServer, gql } = require('apollo-server')

const typeDefs = gql`
	type Query {
		hello(name: String = "Rayan"): String!
		hi: String
	}
	input UserInfo {
		username: String!
		password: String
		age: Int
	}
	type RegisterResponse {
		user: User
	}
	type Mutation {
		login(userInfo: UserInfo): User
		register(userInfo: UserInfo): RegisterResponse
	}
	type User {
		id: ID!
		username: String!
		age: Int!
	}
`

const resolvers = {
	Query: {
		hello: (parent, { name }, context, info) => 'Hello ' + name,
		hi: () => 'hi!'
	},
	Mutation: {
		login: (parent, { userInfo: { username, age } }, { req, res }, info) => {
			// console.log(info)
			return {
				id: 22,
				username,
				age
			}
		},
		register: (username, age) => ({
			errors: [
				{
					field: 'username',
					message: 'bad'
				},
				{
					field: 'username',
					message: 'bad'
				}
			],
			user: {
				id: 1,
				username: 'hello',
				age: age
			}
		})
	}
}

const server = new ApolloServer({
	typeDefs,
	resolvers,
	context: ({ req, res }) => ({ req, res })
})
server.listen({ port: 5000 }).then(({ url }) => console.log(url))
