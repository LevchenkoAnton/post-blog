import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {FbResponse, User} from '../../../shared/interfaces';
import {Observable, Subject, throwError} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {catchError, tap} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class AuthService {
  public error$: Subject<string> = new Subject<string>();

  get token(): string {
    const expDate = new Date(localStorage.getItem('fb-token-exp'));
    if (new Date() > expDate) {
      this.logout();
      return null;
    }
    return localStorage.getItem('fb-token');
  }

  constructor(
    private http: HttpClient
  ) { }

  login(user: User): Observable<any> {
    user.returnSecureToken = true;
    return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKey}`, user)
      .pipe(
        tap(this.setToken),
        catchError(this.handleError.bind(this))
      );
  }

  logout() {
    this.setToken(null);
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  private handleError(err: HttpErrorResponse) {
    const {message} = err.error.error;

    switch (message) {
      case 'EMAIL_NOT_FOUND':
        this.error$.next('There is no user record corresponding to this identifier. The user may have been deleted.');
        break;
      case 'INVALID_PASSWORD':
        this.error$.next('The password is invalid or the user does not have a password.');
        break;
      case 'USER_DISABLED':
        this.error$.next('The user account has been disabled by an administrator.');
        break;
    }

    return throwError(err);
  }

  private setToken(response: FbResponse | null) {
    if (response) {
      const expDate = new Date(Date.now() + +response.expiresIn * 1000);
      const token = response.idToken;
      localStorage.setItem('fb-token-exp', expDate.toString());
      localStorage.setItem('fb-token', token);
    } else {
      localStorage.clear();
    }
  }
}
