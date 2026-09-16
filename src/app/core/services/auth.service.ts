import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, of, throwError } from 'rxjs';
import { environment } from '../config/environment';
import { 
  User, 
  UserLoginRequest, 
  UserLoginResponse, 
  UserRegisterRequest, 
  PasswordUpdateRequest, 
  ForgotPasswordRequest 
} from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'si2_access_token';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.checkInitialSession();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  public getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  public isLoggedIn(): boolean {
    return !!this.getToken();
  }

  private checkInitialSession(): void {
    const token = this.getToken();
    if (token) {
      this.loadUserProfile().subscribe({
        error: () => this.logout()
      });
    }
  }

  public login(credentials: UserLoginRequest): Observable<UserLoginResponse> {
    return this.http.post<UserLoginResponse>(`${environment.apiBaseUrl}/login`, credentials).pipe(
      tap(res => {
        if (res.access_token) {
          localStorage.setItem(this.TOKEN_KEY, res.access_token);
          this.loadUserProfile().subscribe();
        }
      })
    );
  }

  public register(userData: UserRegisterRequest): Observable<User> {
    return this.http.post<User>(`${environment.apiBaseUrl}/register`, userData);
  }

  public forgotPassword(data: ForgotPasswordRequest): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${environment.apiBaseUrl}/forgot-password`, data);
  }

  public changePassword(data: PasswordUpdateRequest): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${environment.apiBaseUrl}/users/me/password`, data);
  }

  public loadUserProfile(): Observable<User> {
    return this.http.get<User>(`${environment.apiBaseUrl}/users/me`).pipe(
      tap(user => {
        this.currentUserSubject.next(user);
      })
    );
  }

  public logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.currentUserSubject.next(null);
  }
}
