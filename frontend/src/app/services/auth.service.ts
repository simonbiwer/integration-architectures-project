import { inject, Injectable } from '@angular/core';
import { Credentials } from '../models/Credentials';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, Observer } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { UserService } from './user.service';
import { Role } from '../models/User';

/**
 * Services specify logic, which is instantiated singularly -> it is shared between components
 * This service handles authorization with the backend
 */
@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private userService = inject(UserService);
    private http = inject(HttpClient);
    loggedIn = false;
    currentLoggedInUserRole: Role;
    authPreCheck = false;
    listeners: ((param: boolean) => void)[] = [];


    setUpCurrentUserRole() {
        this.userService.getOwnUser().subscribe(
            user => {this.currentLoggedInUserRole = user.role
            }
        );
    }
    /**
     * returns the current login state
     */
    isLoggedIn(): Observable<boolean> {
        if (!this.authPreCheck) {
            return this.checkLogin().pipe(
                map(
                    (
                        response: HttpResponse<{ loggedIn: boolean }>,
                    ): boolean => {
                        this.emitLoginChange(response.body.loggedIn);
                        return response.body.loggedIn;
                    },
                ),
            );
        }
        return new Observable((observer: Observer<boolean>): void => {
            observer.next(this.loggedIn);
            observer.complete();
        });
    }

    /**
     * subscribe to changes of the login state
     *
     * @param callback
     */
    subscribeLoginChange(callback: (param: boolean) => void): void {
        this.listeners.push(callback);
    }

    /**
     * notifies all listeners with a new login state
     *
     * @param newState
     */
    emitLoginChange(newState: boolean): void {
        this.listeners.forEach((callback): void => {
            callback(newState);
        });
    }

    /**
     * retrieves the login state from backend
     */
    checkLogin(): Observable<HttpResponse<{ loggedIn: boolean }>> {
        return this.http.get<{ loggedIn: boolean }>(
            environment.apiEndpoint + '/api/login',
            {
                withCredentials: true,
                observe: 'response',
            },
        );
    }

    /**
     * authenticates a user with credentials against backend
     *
     * @param credentials consisting of username and password
     */
    login(credentials: Credentials): Observable<HttpResponse<any>> {
        return this.http
            .post(environment.apiEndpoint + '/api/login', credentials, {
                withCredentials: true,
                observe: 'response',
                responseType: 'text',
            })
            .pipe(
                tap((response): void => {
                    if (response.status === 200) {
                        this.loggedIn = true;
                        this.emitLoginChange(true);
                    }
                }),
            );
    }

    /**
     *
     */
    logout(): Observable<HttpResponse<any>> {
        return this.http
            .delete(environment.apiEndpoint + '/api/login', {
                withCredentials: true,
                observe: 'response',
                responseType: 'text',
            })
            .pipe(
                tap((response): void => {
                    if (response.status === 200) {
                        this.loggedIn = false;
                        this.emitLoginChange(false);
                    }
                }),
            );
    }
}
