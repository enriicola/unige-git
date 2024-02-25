const hasOwnProperty = Object.prototype.hasOwnProperty;
/*
Really simple clone utility. Only copies plain arrays, objects, and Dates. Transfers everything else as-is.
Wanted to use a third-party lib, but none did exactly this.
*/
export function deepCopy(input) {
    if (Array.isArray(input)) {
        return input.map(deepCopy);
    }
    else if (input instanceof Date) {
        return new Date(input.valueOf());
    }
    else if (typeof input === 'object' && input) { // non-null object
        return mapHash(input, deepCopy);
    }
    else { // everything else (null, function, etc)
        return input;
    }
}
export function mapHash(input, func) {
    const output = {};
    for (const key in input) {
        if (hasOwnProperty.call(input, key)) {
            output[key] = func(input[key], key);
        }
    }
    return output;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2JqLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vbGliL3NyYy91dGlscy9vYmoudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsTUFBTSxjQUFjLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUM7QUFFdkQ7OztFQUdFO0FBQ0YsTUFBTSxVQUFVLFFBQVEsQ0FBQyxLQUFVO0lBRWpDLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRTtRQUN4QixPQUFPLEtBQUssQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7S0FFNUI7U0FBTSxJQUFJLEtBQUssWUFBWSxJQUFJLEVBQUU7UUFDaEMsT0FBTyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztLQUVsQztTQUFNLElBQUksT0FBTyxLQUFLLEtBQUssUUFBUSxJQUFJLEtBQUssRUFBRSxFQUFFLGtCQUFrQjtRQUNqRSxPQUFPLE9BQU8sQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7S0FFakM7U0FBTSxFQUFFLHdDQUF3QztRQUMvQyxPQUFPLEtBQUssQ0FBQztLQUNkO0FBQ0gsQ0FBQztBQUdELE1BQU0sVUFBVSxPQUFPLENBQUMsS0FBVSxFQUFFLElBQVM7SUFDM0MsTUFBTSxNQUFNLEdBQTJCLEVBQUUsQ0FBQztJQUUxQyxLQUFLLE1BQU0sR0FBRyxJQUFJLEtBQUssRUFBRTtRQUN2QixJQUFJLGNBQWMsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxFQUFFO1lBQ25DLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1NBQ3JDO0tBQ0Y7SUFFRCxPQUFPLE1BQU0sQ0FBQztBQUNoQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiXG5jb25zdCBoYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG5cbi8qXG5SZWFsbHkgc2ltcGxlIGNsb25lIHV0aWxpdHkuIE9ubHkgY29waWVzIHBsYWluIGFycmF5cywgb2JqZWN0cywgYW5kIERhdGVzLiBUcmFuc2ZlcnMgZXZlcnl0aGluZyBlbHNlIGFzLWlzLlxuV2FudGVkIHRvIHVzZSBhIHRoaXJkLXBhcnR5IGxpYiwgYnV0IG5vbmUgZGlkIGV4YWN0bHkgdGhpcy5cbiovXG5leHBvcnQgZnVuY3Rpb24gZGVlcENvcHkoaW5wdXQ6IGFueSk6IGFueSB7XG5cbiAgaWYgKEFycmF5LmlzQXJyYXkoaW5wdXQpKSB7XG4gICAgcmV0dXJuIGlucHV0Lm1hcChkZWVwQ29weSk7XG5cbiAgfSBlbHNlIGlmIChpbnB1dCBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICByZXR1cm4gbmV3IERhdGUoaW5wdXQudmFsdWVPZigpKTtcblxuICB9IGVsc2UgaWYgKHR5cGVvZiBpbnB1dCA9PT0gJ29iamVjdCcgJiYgaW5wdXQpIHsgLy8gbm9uLW51bGwgb2JqZWN0XG4gICAgcmV0dXJuIG1hcEhhc2goaW5wdXQsIGRlZXBDb3B5KTtcblxuICB9IGVsc2UgeyAvLyBldmVyeXRoaW5nIGVsc2UgKG51bGwsIGZ1bmN0aW9uLCBldGMpXG4gICAgcmV0dXJuIGlucHV0O1xuICB9XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIG1hcEhhc2goaW5wdXQ6IGFueSwgZnVuYzogYW55KTogYW55IHtcbiAgY29uc3Qgb3V0cHV0OiB7IFtrZXk6IHN0cmluZ106IGFueSB9ID0ge307XG5cbiAgZm9yIChjb25zdCBrZXkgaW4gaW5wdXQpIHtcbiAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChpbnB1dCwga2V5KSkge1xuICAgICAgb3V0cHV0W2tleV0gPSBmdW5jKGlucHV0W2tleV0sIGtleSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG91dHB1dDtcbn1cbiJdfQ==