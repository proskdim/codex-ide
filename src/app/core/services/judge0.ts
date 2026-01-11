import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import {
  CreateSubmissionData,
  CreateSubmissionResponse,
  SubmissionResult,
} from '@app/core/models/judge0.model';

type JudgeSubmissionData = CreateSubmissionData;

/**
 * Service for interacting with the Judge0 API via RapidAPI.
 */
@Injectable({
  providedIn: 'root',
})
export class Judge0 {
  private readonly http = inject(HttpClient);
  private readonly judgeUrl = environment.judge0.url;
  private readonly judgeKey = environment.judge0.key;
  private readonly judgeHost = environment.judge0.host;

  createSubmission(data: CreateSubmissionData): Observable<CreateSubmissionResponse> {
    const params = new HttpParams({
      fromObject: {
        base64_encoded: 'true',
        wait: 'false',
        fields: '*',
      },
    });
    return this.httpPost<CreateSubmissionResponse>(`${this.judgeUrl}/submissions`, data, params);
  }

  getSubmission(submissionId: string): Observable<SubmissionResult> {
    const params = new HttpParams({
      fromObject: {
        base64_encoded: 'true',
        fields: '*',
      },
    });
    return this.httpGet<SubmissionResult>(`${this.judgeUrl}/submissions/${submissionId}`, params);
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'x-rapidapi-key': this.judgeKey,
      'x-rapidapi-host': this.judgeHost,
    });
  }

  private httpGet<T>(url: string, params?: HttpParams): Observable<T> {
    return this.http.get<T>(url, {
      headers: this.getHeaders(),
      params,
    });
  }

  private httpPost<T>(url: string, data: JudgeSubmissionData, params?: HttpParams): Observable<T> {
    return this.http.post<T>(url, data, {
      headers: this.getHeaders(),
      params,
    });
  }
}
