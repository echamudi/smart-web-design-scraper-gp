import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const AUTH_API = 'http://localhost:4000/graphql/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(credentials): Observable<any> {
    return this.http.post(AUTH_API, {
      query: `query ($username: String!, $password: String!) {
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
        username: credentials.username,
        password: credentials.password
      }
    }, httpOptions);
  }

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
