import { ApolloServer} from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { gql } from 'graphql-tag';

import {getTasks, getTask} from '@/prisma/operations.js';

// status: 0 - pending, 1 - done

const typeDefs = gql`
    type Task{
        id: String!
        title: String!
        description: String!
        deadline: String!
        userMail: Int!
        status: Int!
        tomatoes: Int!
    }

    type Query{
        getTasks(userMail: String!): [Task!]
        get: String!
        getTask(id: String!): Task!
    }
`;

const resolvers = {
    Query: {
        getTasks: (_,{userMail}) => getTasks(userMail),
        get: () => "Hello World",
        getTask: async (_, {id}) => {
            const task = await getTask(id);
            return task;
        }
    }
} 

const apolloServer = new ApolloServer({ typeDefs, resolvers });
export default startServerAndCreateNextHandler(apolloServer);