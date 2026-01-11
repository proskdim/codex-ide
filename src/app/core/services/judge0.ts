import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';

interface CreateSubmissionData {
  code: string;
  langId: string;
  input: string;
  output: string;
}

interface HttpOptions {
  headers?: HttpHeaders;
  params?: HttpParams;
}

type HttpData = CreateSubmissionData;

type HttpUrl = string;

/**
 * Service for interacting with the Judge0 API via RapidAPI.
 */
@Injectable({
  providedIn: 'root',
})
export class Judge0 {
  private readonly http = inject(HttpClient);

  private readonly judgeUrl = environment.judge0.url;
  // private readonly judgeKey = environment.judge0.key;
  // private readonly judgeHost = environment.judge0.host;

  getLanguages(options: HttpOptions) {
    return this.httpGet(`${this.judgeUrl}/languages`, options);
  }

  createSubmission(data: CreateSubmissionData, options: HttpOptions) {
    return this.httpPost(`${this.judgeUrl}/submissions`, data, options);
  }

  getSubmission(submissionId: string, options: HttpOptions) {
    return this.httpGet(`${this.judgeUrl}/submissions/${submissionId}`, options);
  }

  private httpGet(url: HttpUrl, options: HttpOptions) {
    return this.http.get(url, options);
  }

  private httpPost(url: HttpUrl, data: HttpData, options: HttpOptions) {
    return this.http.post(url, data, options);
  }
}
