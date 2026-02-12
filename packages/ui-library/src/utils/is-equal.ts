export function isEqual(value: unknown, other: unknown): boolean {
  // Check if the values are identical (covers primitives and functions)
  if (value === other)
    return true;

  // Check if the values are null or undefined
  if (value == null || other == null)
    return value === other;

  // Check if the values are of different types
  if (typeof value !== typeof other)
    return false;

  // Compare arrays
  if (Array.isArray(value)) {
    if (!Array.isArray(other) || value.length !== other.length)
      return false;

    for (const [i, element] of value.entries()) {
      if (!isEqual(element, other[i]))
        return false;
    }
    return true;
  }

  // Compare objects
  if (typeof value === 'object') {
    const valueRecord = value as Record<string, unknown>;
    const otherRecord = other as Record<string, unknown>;
    const valueKeys = Object.keys(valueRecord);
    const otherKeys = Object.keys(otherRecord);

    if (valueKeys.length !== otherKeys.length)
      return false;

    for (const key of valueKeys) {
      if (!isEqual(valueRecord[key], otherRecord[key]))
        return false;
    }
    return true;
  }

  // If the values are neither primitives, arrays, nor objects, return false
  return false;
}
