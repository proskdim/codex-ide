import { Injectable } from '@angular/core';
import {
  Judge0Request,
  Judge0RequestSchema,
  Judge0Response,
  Judge0ResponseSchema,
} from '@app/core/types/judge0.types';
import { z } from 'zod';

/*
 * Service for validating Judge0 data.
 */
@Injectable({
  providedIn: 'root',
})
export class Judge0ValidatorService {
  // Validates the request data.
  validateRequest(data: unknown): Judge0Request {
    return this.validate(Judge0RequestSchema, data);
  }

  // Validates the response data.
  validateResponse(data: unknown): Judge0Response {
    return this.validate(Judge0ResponseSchema, data);
  }

  // Validates the data against the schema.
  private validate<T>(schema: z.ZodType<T>, data: unknown): T {
    const result = schema.safeParse(data);
    if (!result.success) {
      const errorMessages = result.error.issues
        .map((e: z.core.$ZodIssue) => `${e.path.join('.')}: ${e.message}`)
        .join(', ');
      throw new Error(`Validation error: ${errorMessages}`);
    }
    return result.data;
  }
}
