import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApolloClient, InMemoryCache, NormalizedCacheObject } from '@apollo/client/core';

const AUTH_API = 'http://localhost:3001/graphql/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  client: ApolloClient<NormalizedCacheObject>;

  constructor(private http: HttpClient) {
    this.client = new ApolloClient({
      uri: 'http://localhost:3001/graphql',
      cache: new InMemoryCache()
    });
  }

  // login(credentials): Observable<any> {
  //   return this.http.post(AUTH_API, {
  //     query: `query ($username: String!, $password: String!) {
  //         login(username: $username, password: $password) {
  //             success,
  //             user {
  //                 username,
  //                 email,
  //                 roles
  //             },
  //             token
  //         }
  //     }`,
  //     variables: {
  //       username: credentials.username,
  //       password: credentials.password
  //     }
  //   }, httpOptions);
  // }

  register(user): Observable<any> {
    return this.http.post(AUTH_API, {
      query: `
        mutation ($username: String!, $password: String!, $email: String!) {
          signup(username: $username, password: $password, email: $email) {
            success,
            username,
            email
          }
        }
      `,
      variables: {
        username: user.username,
        password: user.password,
        email: user.email
      }
    }, httpOptions);
  }
}
