import { ApolloClient, InMemoryCache, NormalizedCacheObject, ApolloQueryResult } from '@apollo/client';
import { gql } from '@apollo/client';

export function login(client: any, username: string, password: string): Promise<ApolloQueryResult<any>> {
    return client
        .query({
            query: gql`query ($username: String!, $password: String!) {
                login(username: $username, password: $password) {
                    token
                }
            }`,
            variables: {
                username,
                password,
            }
        })
}
