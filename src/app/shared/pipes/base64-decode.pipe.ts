import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe for decoding a base64 encoded string to a regular string.
 */
@Pipe({
  name: 'base64Decode',
})
export class Base64DecodePipe implements PipeTransform {
  // Transforms the base64 encoded string to a regular string.
  transform(value: string | null | undefined): string {
    if (!value) return '';
    try {
      return atob(value);
    } catch (e) {
      console.error('Base64 decoding failed:', e);
      return value;
    }
  }
}