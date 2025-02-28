import { Neo4jGraphQL } from "@neo4j/graphql";
import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone';
import neo4j from 'neo4j-driver'
 
const typeDefs = `#graphql
type Post {
    id: ID! @id
    content: String!
    creator: User! @relationship(type: "HAS_POST", direction: IN)
}
 
type User {
    id: ID! @id
    name: String
    posts: [Post!]! @relationship(type: "HAS_POST", direction: OUT)
}
`;
 
const driver = neo4j.driver(
    "bolt://localhost:7687",
    neo4j.auth.basic("", "")
);
 
const neoSchema = new Neo4jGraphQL({ typeDefs, driver });
 
const server = new ApolloServer({
    schema: await neoSchema.getSchema(),
});
 
const { url } = await startStandaloneServer(server, {
    context: async ({ req }) => ({ req, sessionConfig: {database: "memgraph"}}),
    listen: { port: 4000 },
});
 
console.log(`🚀 Server ready at ${url}`);