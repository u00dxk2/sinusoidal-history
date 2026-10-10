/**
 * Serialize JSON for the body of an inline JSON-LD script element.
 *
 * Never inline `JSON.stringify` there: it leaves `<` alone, so a string in the
 * payload containing `</script>` would close the tag. Every payload on this site
 * is built from committed data files, never user input; the helper exists so the
 * escaping does not depend on that staying true at every call site.
 *
 * The escaped forms are valid JSON unicode escapes, so the parsed data is
 * identical; only the bytes for `<`, `>`, `&`, U+2028 and U+2029 change.
 */
const LINE_SEP = new RegExp(String.fromCharCode(0x2028), "g");
const PARA_SEP = new RegExp(String.fromCharCode(0x2029), "g");

export function jsonLdHtml(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(LINE_SEP, "\\u2028")
    .replace(PARA_SEP, "\\u2029");
}
