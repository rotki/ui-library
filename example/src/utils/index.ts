export function capitalizeFirstLetter(text: string): string {
  if (text.length === 0)
    return text;
  const firstChar = text[0];
  return firstChar ? firstChar.toUpperCase() + text.slice(1).toLowerCase() : text;
}
