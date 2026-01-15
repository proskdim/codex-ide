import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Judge0Request } from '@app/core/types/judge0.types';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

/**
 * Service for performing HTTP requests to the Judge0 API.
 */
@Injectable({
  providedIn: 'root',
})
export class Judge0ClientService {
  // Inject the HttpClient service.
  private readonly http = inject(HttpClient);
  // Judge0 API URL.
  private readonly judgeUrl = environment.judge0.url;
  // Judge0 API key.
  private readonly judgeKey = environment.judge0.key;
  // Judge0 API host.
  private readonly judgeHost = environment.judge0.host;
  // Judge0 API headers.
  private readonly httpHeaders = new HttpHeaders({
    'x-rapidapi-key': this.judgeKey,
    'x-rapidapi-host': this.judgeHost,
  });

  constructor() {
    this.validateEnvironment();
  }

  // Validates the Judge0 environment variables.
  private validateEnvironment(): void {
    if (!this.judgeUrl || !this.judgeKey || !this.judgeHost) {
      throw new Error(`
        Judge0 environment variables are not properly configured.
        Please check environment.judge0.url, 
        environment.judge0.key, 
        and environment.judge0.host.
      `);
    }
  }

  // Performs an HTTP GET request to the Judge0 API.
  get<T>(url: string, params?: HttpParams): Observable<T> {
    return this.http.get<T>(`${this.judgeUrl}${url}`, {
      headers: this.httpHeaders,
      params,
    });
  }

  // Performs an HTTP POST request to the Judge0 API.
  post<T>(url: string, data: Judge0Request, params?: HttpParams): Observable<T> {
    return this.http.post<T>(`${this.judgeUrl}${url}`, data, {
      headers: this.httpHeaders,
      params,
    });
  }
}
