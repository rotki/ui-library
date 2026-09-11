function arraysEqual(value: unknown[], other: unknown): boolean {
  if (!Array.isArray(other) || value.length !== other.length)
    return false;

  return value.every((element, index) => isEqual(element, other[index]));
}

function objectsEqual(value: object, other: object): boolean {
  const valueEntries = Object.entries(value);

  if (valueEntries.length !== Object.keys(other).length)
    return false;

  const otherEntries = Object.fromEntries(Object.entries(other));

  return valueEntries.every(([key, entry]) =>
    Object.hasOwn(otherEntries, key) && isEqual(entry, otherEntries[key]));
}

/**
 * Compares two values structurally: arrays element by element and objects key
 * by key, with everything else compared by identity, which is what a primitive
 * or a function needs.
 *
 * @param value - the first value
 * @param other - the value to compare it with
 * @returns whether the two are equal
 */
export function isEqual(value: unknown, other: unknown): boolean {
  if (value === other)
    return true;

  // A null or undefined only equals itself, which the check above settled
  if (value === null || value === undefined || other === null || other === undefined)
    return false;

  if (typeof value !== typeof other)
    return false;

  if (Array.isArray(value))
    return arraysEqual(value, other);

  if (typeof value === 'object' && typeof other === 'object')
    return objectsEqual(value, other);

  // Neither a primitive that matched, nor an array, nor an object
  return false;
}
