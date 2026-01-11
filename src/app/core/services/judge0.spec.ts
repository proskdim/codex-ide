import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { Judge0 } from './judge0';
import { Judge0Language, Judge0SubmissionResponse, Judge0SubmissionDetails } from './judge0.types';

describe('Judge0', () => {
  let service: Judge0;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(Judge0);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get languages', () => {
    const mockLanguages: Judge0Language[] = [
      { id: 63, name: 'JavaScript (Node.js 12.14.0)' },
    ];

    service.getLanguages().subscribe((languages) => {
      expect(languages).toEqual(mockLanguages);
    });

    const req = httpMock.expectOne('https://judge029.p.rapidapi.com/languages');
    expect(req.request.method).toBe('GET');
    req.flush(mockLanguages);
  });

  it('should create submission', () => {
    const mockResponse: Judge0SubmissionResponse = { token: 'test-token' };
    const sourceCode = 'console.log("test")';
    const languageId = '63';
    const stdin = '';
    const expectedOutput = '';

    service.createSubmission(sourceCode, languageId, stdin, expectedOutput).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne((r) => r.url === 'https://judge029.p.rapidapi.com/submissions');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      source_code: sourceCode,
      language_id: languageId,
      stdin: stdin,
      expected_output: expectedOutput,
    });
    req.flush(mockResponse);
  });

  it('should get submission details', () => {
    const submissionId = 'test-token';
    const mockDetails: Judge0SubmissionDetails = {
      stdout: 'test\n',
      time: '0.001',
      memory: 100,
      stderr: null,
      token: submissionId,
      compile_output: null,
      message: null,
      status: { id: 3, description: 'Accepted' },
    };

    service.getSubmission(submissionId).subscribe((details) => {
      expect(details).toEqual(mockDetails);
    });

    const req = httpMock.expectOne((r) => r.url === `https://judge029.p.rapidapi.com/submissions/${submissionId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockDetails);
  });
});
