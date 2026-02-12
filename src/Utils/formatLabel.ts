export function formatLabel(input: string): string {
  const result = input
    // underscores → spaces
    .replace(/_/g, " ")

    // hyphen → space unless followed by a digit
    .replace(/-(?!\d)/g, " ")

    // capitalize each word
    .replace(/\b\w+/g, (word) => word[0].toUpperCase() + word.slice(1));

  // split into words
  const parts = result.split(" ");

  // if last word is a single character, add hyphen
  const last = parts[parts.length - 1];
  if (last.length === 1) {
    parts[parts.length - 1] = `-${last}`;
  }

  return parts.join(" ");
}
