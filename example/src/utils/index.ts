export function capitalizeFirstLetter(text: string): string {
  if (text.length === 0)
    return text;
  return text[0].toUpperCase() + text.slice(1).toLowerCase();
}
