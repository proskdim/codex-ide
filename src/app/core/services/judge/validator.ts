import { Injectable } from "@angular/core";
import { z } from "zod";

/*
 * Service for validating Judge0 data.
*/
@Injectable({
  providedIn: 'root',
})
export class Judge0ValidatorService {
  public call<T>(schema: z.ZodSchema<T>, data: unknown, context: string): T {
    const result = schema.safeParse(data);
    if (!result.success) {
      const errorMessages = result.error.issues
        .map((e: z.core.$ZodIssue) => `${e.path.join('.')}: ${e.message}`)
        .join(', ');
      throw new Error(`Validation error in ${context}: ${errorMessages}`);
    }
    return result.data;
  }
}