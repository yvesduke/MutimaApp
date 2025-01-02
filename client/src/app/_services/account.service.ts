import {
  HttpClient,
  HttpRequest,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, throwError } from 'rxjs';
import { User } from '../_models/user';
import { environment } from 'src/environments/environment';
import { PresenceService } from './presence.service';
import { ForgotPassword } from '../_models/ForgotPassword';
import { ResetPassword } from '../_models/resetPassword';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  baseUrl = environment.apiUrl;
  private currentUserSource = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(
    private http: HttpClient,
    private presenceService: PresenceService
  ) {}

  login(model: any): Observable<any> {
    // return this.http.post<any>(`${this.baseUrl}account/login`, model);
    return this.http.post<User>(this.baseUrl + 'account/login', model).pipe(
      map((response: User) => {
        const user = response;
        if (user) {
          this.setCurrentUser(user);
        }
      }),
      catchError((error) => {
        if (error.status === 401) {
          return throwError(() => new Error('Email not confirmed.'));
        }
        return throwError(() => error);
      })
    );
  }

  register(model: any): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.baseUrl}account/register`,
      model
    );
  }

  setCurrentUser(user: User) {
    user.roles = [];
    const roles = this.getDecodedToken(user.token).role;
    Array.isArray(roles) ? (user.roles = roles) : user.roles.push(roles);
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSource.next(user);
    this.presenceService.createHubConnection(user);
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
    this.presenceService.stopHubConnection();
  }

  getDecodedToken(token: string) {
    return JSON.parse(atob(token.split('.')[1]));
  }

  confirmEmail(userId: string, token: string): Observable<any> {
    let params = new HttpParams();
    params = params.append('userId', userId);
    params = params.append('token', token);
    return this.http.get<any>(`${this.baseUrl}account/confirm-email`, {
      params,
    });
  }

  forgotPassword(email: string) {
    const forgotPasswordDto: ForgotPassword = { email };
    return this.http
      .post(`${this.baseUrl}account/forgot-password`, forgotPasswordDto)
      .pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

  resendConfirmationEmail(model: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}resend-confirmation-email`,
      model
    );
  }

  resetPassword(resetPasswordDto: ResetPassword) {
    return this.http
      .post(`${this.baseUrl}account/reset-password`, resetPasswordDto)
      .pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }
}
