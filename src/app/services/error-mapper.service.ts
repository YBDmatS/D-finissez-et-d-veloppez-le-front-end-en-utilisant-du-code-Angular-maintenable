import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ErrorMapperService {
  toMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      switch (error.status) {
        case 0:
          return 'Network error: unable to reach the server.';
        case 404:
          return 'Data source not found.';
        case 500:
          return 'Server error. Please try again later.';
        default:
          return `Unexpected server error (${error.status}).`;
      }
    }

    return 'An unexpected error occurred.';
  }
}
