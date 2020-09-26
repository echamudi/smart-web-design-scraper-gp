import { gql } from "apollo-server-express";

// TODO: write schema
export const typeDefs = gql`
    type Role {
        name: String
    }

    type User {
        username: String!
        email: String!
        roles: [String!]
        isUser: Boolean
        isAdmin: Boolean
    }

    type Mutation {
        signup(username: String!, password: String!, email: String!): User
    }

    type LoginResult {
        message: String
        user: User
        token: String
    }

    type Query {
        getCurrentUser: User
        login(username: String!, password: String!): LoginResult
    }
`;
