import { gql } from "apollo-server-express";

// TODO: write schema
export const typeDefs = gql`
    type Query {
        getCurrentUser: User
        login(username: String!, password: String!): LoginResult
    }

    type User {
        username: String!
        email: String!
        roles: [String!]
        isUser: Boolean
        isAdmin: Boolean
    }

    type Role {
        name: String
    }

    type LoginResult {
        message: String
        user: User
        token: String
    }

    type Mutation {
        signup(username: String!, password: String!, email: String!): SignupResult
    }

    type SignupResult {
        success: Boolean
        username: String
        email: String
    }
`;
