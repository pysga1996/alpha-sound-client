import {Injectable, Injector} from '@angular/core';

import {AuthService} from '../service/auth.service';
import {UserToken} from '../model/userToken';
import {catchError, mergeMap} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {
  HttpClient,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpParams,
  HttpRequest
} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {Router} from '@angular/router';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router, private injector: Injector) {
    this.authService.currentUserToken.subscribe(
      currentUser => {
        this.currentUserToken = currentUser;
      }
    );
  }
  currentUserToken: UserToken;

  private static modifyRequest(req: HttpRequest<any>) {
    if (req.serializeBody() == null || !req.serializeBody().toString().includes('refresh_token')) {
      let accessToken;
      if (localStorage.getItem('userToken')) {
        accessToken = (JSON.parse(localStorage.getItem('userToken')) as UserToken).access_token;
        return req.clone({setHeaders: {authorization: `Bearer ${accessToken}`}});
      } else if (sessionStorage.getItem('userToken')) {
        accessToken = (JSON.parse(sessionStorage.getItem('userToken')) as UserToken).access_token;
        return req.clone({setHeaders: {authorization: `Bearer ${accessToken}`}});
      } else { return req.clone(); }
    } else {
      return req.clone();
    }
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (localStorage.getItem('userToken') || sessionStorage.getItem('userToken')) {
      return next.handle(TokenInterceptor.modifyRequest(request)).pipe(
        catchError(error => {
          if (error instanceof HttpErrorResponse) {
            if (error.status === 400 && request.url.includes('/oauth/token')) {
              this.authService.logout();
              if (error.error.error_description.includes('Invalid refresh token')) {
                this.authService.sessionTimeout.emit();
                const returnToHome = setTimeout(() => {
                  location.reload();
                  clearTimeout(returnToHome);
                }, 3000);
              }
              this.router.navigate(['/home'])
                .finally(() => {location.reload(); });
            } else if (error.status === 401) {
              let refreshToken: string;
              if (localStorage.getItem('userToken')) {
                refreshToken = ( JSON.parse(localStorage.getItem('userToken')) as UserToken).refresh_token;
              }
              if (sessionStorage.getItem('userToken')) {
                refreshToken = ( JSON.parse(sessionStorage.getItem('userToken')) as UserToken).refresh_token;
              }
              const params = new HttpParams()
                .set('grant_type', 'refresh_token')
                .set('refresh_token', refreshToken);
              const headers = new HttpHeaders({'Content-type': 'application/x-www-form-urlencoded; charset=utf-8',
                Authorization : 'Basic ' + btoa(`${environment.clientId}:${environment.clientSecret}`)});
              return this.injector.get(HttpClient)
                .post(`${environment.authUrl}/oauth/token`, params.toString(), {headers})
                .pipe(mergeMap(
                  res => {
                    if (localStorage.getItem('rememberMe')) {
                      localStorage.setItem('userToken', JSON.stringify(res));
                    } else {
                      localStorage.setItem('sessionToken', JSON.stringify(res));
                      sessionStorage.setItem('userToken', JSON.stringify(res));
                    }
                    return next.handle(TokenInterceptor.modifyRequest(request)).pipe(catchError((err) => {
                      if (err.status === 500 && request.url.includes('/oauth/token')) {
                        location.reload();
                      }
                      return next.handle(TokenInterceptor.modifyRequest(request));
                    }));
                  }
                ));
            }
          } else {
            return throwError(new Error(error));
          }
        })
      );
    } else {
      return next.handle(request);
    }
  }
}