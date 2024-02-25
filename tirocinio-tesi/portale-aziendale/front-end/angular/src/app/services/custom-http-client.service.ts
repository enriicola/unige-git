import { Injectable, NgZone } from '@angular/core';
import { HttpClient as AngularHttpClient, HttpHeaders, HttpParams, HttpContext, HttpErrorResponse } from '@angular/common/http';
import { combineLatest, Observable, of, throwError, timer } from 'rxjs';
import { filter, retryWhen, finalize, mergeMap, map } from 'rxjs/operators';
import * as _ from "lodash";
import { Store } from '@ngrx/store';
import { AppState } from '../redux/state';
import { AwaitAndGetStopper } from '../components/awaiter/awaiter.utils';
import { environment } from '../../environments/environment';
import { OAuthService } from "angular-oauth2-oidc";

export function ensureLastSlash(url: string) {
    return url.endsWith("/") ? url : url + "/";
}

export interface ApiInfo {
    route: string;
    method: string;
    params?: string[];
}

function isHttpHeaders(h: HttpHeaders | {[header: string]: string | string[]}): h is HttpHeaders {
    return h && h.append !== undefined;
}

type ResponseTypes = 'json' | 'blob' | 'arraybuffer' | 'text';
interface IOptions<T extends ResponseTypes> {
    headers?: HttpHeaders | {
        [header: string]: string | string[];
    };
    context?: HttpContext;
    observe?: 'body';
    params?: HttpParams | {
        [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
    };
    reportProgress?: boolean;
    responseType: T;
    withCredentials?: boolean;
};

interface IRawOptions {customParams?: string[]}

type Options<T extends ResponseTypes> = IOptions<T> & IRawOptions & {context?: HttpContext};

function setAuthHttpHeaders<T extends ResponseTypes>(token: string, options: Options<T>) : Options<T> {
    return {
        ...options,
        headers: isHttpHeaders(options.headers) ?
        options.headers.set('Authorization', `Bearer ${token}`).set('client_id', environment.authConfig.clientId) :
        {...options.headers, 'Authorization': `Bearer ${token}`, 'client_id': environment.authConfig.clientId}
    };
}

@Injectable({providedIn: 'root'})
export class CustomHttpClient {
    constructor(
        private httpClient: AngularHttpClient,
        private oauthService: OAuthService,
        private store: Store<AppState>,
        private zone: NgZone
    ) { }

    public handler: any;

    private _customParams: string[] = [];
    public set customParams(params: string[]) {
        this._customParams = params;
    }

    public get innerClient(): AngularHttpClient {
        return this.httpClient;
    }

    private combineWithPolicies$<T>(_: ApiInfo, ob: (token: string) => Observable<T | null>): Observable<T | null> {
        const stopWaiting = AwaitAndGetStopper(this.store);
        return combineLatest([
            of(this.oauthService.hasValidAccessToken()),
            of(this.oauthService.getAccessToken())
        ]).pipe(
            filter(([isAuth, _]) => isAuth),
            filter(([_, token]) => token && token !== ''),
            map(([_, token]) => token),
            mergeMap(token => ob(token)
            .pipe(
               retryWhen(err$ => err$.pipe(
                    mergeMap((err: HttpErrorResponse, i) => {
                        if (i >= 3) {
                            return throwError(err);
                        } else {
                            console.warn(`Retry number ${i+1} because of error: ${(err.message)}`);
                            return timer(1000);
                        }
                    }),
                )),
                finalize(() => stopWaiting())
            ))
        );
    }

    public patch<T>(url: string, body: any | null, options?: Options<'json'>): Observable<T | null> {
        return this.combineWithPolicies$<T>(
            {route: url, method: "PATCH", params: options && options.customParams ? options.customParams : this._customParams },
            (token) => this.zone.runOutsideAngular(() => this.httpClient.patch<T>(url, body, setAuthHttpHeaders(token, options))));
    }

    public put<T>(url: string, body: any | null, options?: Options<'json'>): Observable<T | null> {
        return this.combineWithPolicies$<T>(
            {route: url, method: "PUT", params: options && options.customParams ? options.customParams : this._customParams },
            (token) => this.zone.runOutsideAngular(() => this.httpClient.put<T>(url, body, setAuthHttpHeaders(token, options))));
    }

    public delete<T>(url: string, options?: Options<'json'>): Observable<T | null> {
        return this.combineWithPolicies$<T>(
            {route: url, method: "DELETE", params: options && options.customParams ? options.customParams : this._customParams },
            (token) => this.zone.runOutsideAngular(() => this.httpClient.delete<T>(url, setAuthHttpHeaders(token, options))));
    }

    public options<T>(url: string, options?: Options<'json'>): Observable<T | null> {
        return this.combineWithPolicies$<T>(
            {route: url, method: "OPTIONS", params: options && options.customParams ? options.customParams : this._customParams },
            (token) => this.zone.runOutsideAngular(() => this.httpClient.options<T>(url, setAuthHttpHeaders(token, options))));
    }

    public getBlob(url: string, options: Options<'blob'>): Observable<Blob> {
        return this.combineWithPolicies$<Blob>(
            {route: url, method: "GET", params: options && options.customParams ? options.customParams : this._customParams },
            (token) => {
                const usedOptions = setAuthHttpHeaders<'blob'>(token, options);
                return this.zone.runOutsideAngular(() => this.httpClient.get(url, usedOptions));
            });
    }

    public postBlob(url: string, body: any | null, options: Options<'blob'>): Observable<Blob> {
        return this.combineWithPolicies$<Blob>(
            {route: url, method: "POST", params: options && options.customParams ? options.customParams : this._customParams },
            (token) => this.zone.runOutsideAngular(() => this.httpClient.post(url, body, setAuthHttpHeaders(token, options))));
    }

    public get<T>(url: string, options?: Options<'json'>): Observable<T | null> {
        return this.combineWithPolicies$<T>(
            {route: url, method: "GET", params: options && options.customParams ? options.customParams : this._customParams },
            (token) => {
                const usedParam = setAuthHttpHeaders<'json'>(token, options);
                return this.zone.runOutsideAngular(() => this.httpClient.get<T>(url, usedParam));
            });
    }

    public postText(url: string, body: any | null, options: Options<'text'>): Observable<string> {
        return this.combineWithPolicies$<string>(
            {route: url, method: "POST", params: options && options.customParams ? options.customParams : this._customParams },
            (token) => {
                const usedParam = setAuthHttpHeaders<'text'>(token, options);
                return this.zone.runOutsideAngular(() => this.httpClient.post(url, body, usedParam));
            });
    }

    public post<T>(url: string, body: any | null, options?: Options<'json'>): Observable<T | null> {
        return this.combineWithPolicies$<T>(
            {route: url, method: "POST", params: options && options.customParams ? options.customParams : this._customParams },
            (token) => this.zone.runOutsideAngular(() => this.httpClient.post<T>(url, body, setAuthHttpHeaders(token, options))));
    }
}
