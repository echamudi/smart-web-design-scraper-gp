import { ApolloClient, InMemoryCache, NormalizedCacheObject, ApolloQueryResult, gql } from '@apollo/client/core';

export function login(client: ApolloClient<NormalizedCacheObject>, username: string, password: string): Promise<ApolloQueryResult<any>> {
    return client
        .query({
            query: gql`query ($username: String!, $password: String!) {
                login(username: $username, password: $password) {
                success,
                user {
                    username,
                    email,
                    roles
                },
                token
                }
            }`,
            variables: {
                username,
                password,
            }
        });
}
