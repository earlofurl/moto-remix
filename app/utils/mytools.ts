export function toCommonCase(str: string): string {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

export function parseJwt(token): string {
  return JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
}
