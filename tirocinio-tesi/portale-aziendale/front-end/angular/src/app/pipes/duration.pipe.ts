import { Pipe, PipeTransform } from '@angular/core';
/*
 * Raise the value exponentially
 * Takes an exponent argument that defaults to 1.
 * Usage:
 *   value | exponentialStrength:exponent
 * Example:
 *   {{ 2 | exponentialStrength:10 }}
 *   formats to: 1024
*/
@Pipe({name: 'dur'})
export class DurationPipe implements PipeTransform {
  transform(value: number | string | null | undefined, exponent = 1): string {
    const numberOfSecondsPerHour: number = 3600;
    const numericValue = value === null || value === undefined ? 0 : typeof value === 'number' ? value : Number.parseInt(value);
    if(numericValue > numberOfSecondsPerHour ) {
        return new Date(numericValue * 1000).toISOString().substr(11, 8);
    } else {
        return new Date(numericValue * 1000).toISOString().substr(14, 5);
    }
  }
}
