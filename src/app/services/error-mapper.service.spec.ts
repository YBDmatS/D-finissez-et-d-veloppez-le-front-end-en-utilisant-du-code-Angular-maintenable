import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ErrorMapperService } from './error-mapper.service';

describe('ErrorMapperService', () => {
  let service: ErrorMapperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ErrorMapperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a network error message for status 0', () => {
    const error = new HttpErrorResponse({ status: 0 });
    expect(service.toMessage(error)).toBe('Network error: unable to reach the server.');
  });

  it('should return a not found message for status 404', () => {
    const error = new HttpErrorResponse({ status: 404 });
    expect(service.toMessage(error)).toBe('Data source not found.');
  });

  it('should return a server error message for status 500', () => {
    const error = new HttpErrorResponse({ status: 500 });
    expect(service.toMessage(error)).toBe('Server error. Please try again later.');
  });

  it('should return an unexpected error message for unhandled status', () => {
    const error = new HttpErrorResponse({ status: 403 });
    expect(service.toMessage(error)).toBe('Unexpected server error (403).');
  });

  it('should return a fallback message for unknown errors', () => {
    expect(service.toMessage('unknown')).toBe('An unexpected error occurred.');
  });
});
