import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AppConfig, APP_CONFIG } from './config';


@Injectable({ providedIn: 'root' })
export class AuthenticationOdooService {

  private http = inject(HttpClient);
  private config = inject<AppConfig>(APP_CONFIG);

  private url = this.config.apiEndpoint;

  private isAuthenticatedSubject$ = new BehaviorSubject<boolean>(false);
  readonly isAuthenticated$ = this.isAuthenticatedSubject$.asObservable();

  /**
   * ============================
   * LOGIN (Odoo session auth)
   * ============================
   */
  login(login: string, password: string, db: string): Observable<boolean> {
    return this.http
      .post<{ result: any }>(
        `${this.url}/api/login`,
        {
          params: { login, password, db },
        },
        { withCredentials: true }
      )
      .pipe(
        map(({ result }) => {
          const isValid = !!result?.uid;

          this.isAuthenticatedSubject$.next(isValid);


          return isValid;
        }),
        catchError(() => {
          this.isAuthenticatedSubject$.next(false);
          return of(false);
        })
      );
  }

  /**
   * ============================
   * CHECK CURRENT SESSION
   * ============================
   */
  checkSession(): Observable<boolean> {
    return this.http
      .post<{ result: any }>(
        `${this.url}/web/session/get_session_info`,
        {},
        { withCredentials: true }
      )
      .pipe(
        map(({ result }) => {
          const isValid = !!result?.uid;

          this.isAuthenticatedSubject$.next(isValid);

          return isValid;
        }),
        catchError(() => {
          this.isAuthenticatedSubject$.next(false);
          return of(false);
        })
      );
  }

  /**
   * ============================
   * LOGOUT (Odoo native)
   * ============================
   */
  logout(): Observable<boolean> {
    return this.http
      .post(
        `${this.url}/web/session/destroy`,
        {},
        { withCredentials: true }
      )
      .pipe(
        map(() => {
          this.isAuthenticatedSubject$.next(false);
          return true;
        }),
        catchError(() => {
          this.isAuthenticatedSubject$.next(false);
          return of(false);
        })
      );
  }

  /**
   * ============================
   * RAW SESSION INFO (optional)
   * ============================
   */
  getSessionInfo(): Observable<any | null> {
    return this.http
      .post<{ result: any }>(
        `${this.url}/web/session/get_session_info`,
        {},
        { withCredentials: true }
      )
      .pipe(
        map(res => res?.result ?? null),
        catchError(() => of(null))
      );
  }
}