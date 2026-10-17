/**
 * Text folding for search boxes, so "Lodz" finds "Łódź" and "krakow" finds
 * "Kraków". Strips combining marks after NFD decomposition, then maps the
 * letters NFD leaves whole (Polish ł, plus a few European ones).
 */

const STANDALONE_LETTERS: Record<string, string> = {
  ł: "l",
  đ: "d",
  ø: "o",
  ß: "ss",
  æ: "ae",
  œ: "oe",
};

export const foldForSearch = (text: string): string =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[łđøßæœ]/g, (letter) => STANDALONE_LETTERS[letter] ?? letter)
    .trim();

/** True when `query` appears in `text`, ignoring case and diacritics. */
export const matchesSearch = (text: string, query: string): boolean =>
  foldForSearch(text).includes(foldForSearch(query));
