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

export function isEqual(value: unknown, other: unknown): boolean {
  // Identical values cover primitives and functions
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
