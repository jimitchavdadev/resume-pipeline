export class LatexEscaper {
  static escape(text: string): string {
    if (!text) return "";
    let sanitized = text
      .replace(/(?<!\\)&/g, "\\&")
      .replace(/(?<!\\)%/g, "\\%")
      .replace(/(?<!\\)#/g, "\\#")
      .replace(/(?<!\\)_/g, "\\_");

    // Ensure \times is wrapped in math mode $...$
    sanitized = sanitized.replace(/(?<!\$)\\times(?!\$)/g, "$\\times$");

    return sanitized;
  }
}
