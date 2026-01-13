import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { Judge0Service } from './judge/judge0';
import { SubmissionResult, CreateSubmission, JUDGE0_STATUS } from '@app/core/types/judge0.model';

describe('Judge0Service', () => {
  let service: Judge0Service;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(Judge0Service);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create submission', () => {
    const mockResponse: CreateSubmission = { token: 'test-token' };
    const submissionData = {
      source_code: 'console.log("test")',
      language_id: 63,
    };

    service.createSubmission(submissionData).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne((r) => r.url.endsWith('/submissions'));
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should get submission details', () => {
    const submissionId = 'test-token';
    const mockDetails: SubmissionResult = {
      stdout: 'test\n',
      time: '0.001',
      memory: 100,
      stderr: null,
      token: submissionId,
      compile_output: null,
      message: null,
      status: { id: JUDGE0_STATUS.ACCEPTED, description: 'Accepted' },
    };

    service.getSubmission(submissionId).subscribe((details) => {
      expect(details).toEqual(mockDetails);
    });

    const req = httpMock.expectOne((r) => r.url.endsWith(`/submissions/${submissionId}`));
    expect(req.request.method).toBe('GET');
    req.flush(mockDetails);
  });
});
