const { ApolloServer } = require('apollo-server'); 
const gql = require('graphql-tag');
const mongoose = require('mongoose');

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const { MONGODB } = require('./config.js');
// const { getOperationAST } = require('graphql');


const server = new ApolloServer({
    typeDefs,
    resolvers
});


mongoose.connect(MONGODB, { useNewUrlParser: true, useUnifiedTopology: true, }) 
    .then(() => {
        console.log('Connected to database with MongoDB')
        return server.listen({port: 5000});
    })
    .then(res => {
        console.log(`Server running at ${res.url}`);
    })
    .catch(err => {
        console.log('Error?');
    })