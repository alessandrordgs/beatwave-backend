import * as crypto from 'crypto';

export function generateApiSignature(
  params: Record<string, string>,
  secret: string,
): string {
  const sortedKeys = Object.keys(params).sort();
  const stringToSign =
    sortedKeys.map((k) => `${k}${params[k]}`).join('') + secret;
  return crypto.createHash('md5').update(stringToSign).digest('hex');
}
