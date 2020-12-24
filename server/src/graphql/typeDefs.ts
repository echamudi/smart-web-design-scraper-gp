import { gql } from "apollo-server-express";

export const typeDefs = gql`
    type Query {
        getCurrentUser: User
        login(username: String!, password: String!): LoginResult
        getAnalysis(id: ID!): Analysis
        getAnalyses: [AnalysisLite]
    }

    type AnalysisLite {
        id: ID
        date: String
        url: String
    }

    type Analysis {
        date: String
        data: String
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
        success: Boolean
        user: User
        token: String
    }

    type Mutation {
        signup(username: String!, password: String!, email: String!): SignupResult
        saveAnalysis(data: String!, url: String!): ID
    }

    type SignupResult {
        success: Boolean
        username: String
        email: String
    }
`;
