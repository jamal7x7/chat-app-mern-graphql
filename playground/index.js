var { graphql, buildSchema } = require('graphql')

const db = {
	users: [
		{
			id: '1',
			email: 'abc@xyz.com',
			name: 'Rayane'
		}
	]
}

var schema = buildSchema(`
  type Query {
    users: [User!]!
  }
  type User {
    id: ID!
    email: String!
    name: String
    avatar: String
  }
`)

const root = { users: () => db.users }

graphql(
	schema,
	`
		{
			users {
				email
			}
		}
	`,
	root
)
	.then(res => console.dir(res, { depth: null }))
	.catch(console.error)
