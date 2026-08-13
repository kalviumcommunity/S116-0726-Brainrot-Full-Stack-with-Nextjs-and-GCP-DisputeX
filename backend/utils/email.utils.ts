import dns from 'dns';
import { promisify } from 'util';

const resolveMx = promisify(dns.resolveMx);
const resolve4 = promisify(dns.resolve4);

const COMMON_PROVIDERS = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com'];

function levenshteinDistance(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          Math.min(
            matrix[i][j - 1] + 1, // insertion
            matrix[i - 1][j] + 1  // deletion
          )
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

/**
 * Checks if a domain is an obvious typo of a common provider.
 * Returns the correct provider name if a typo is found, else null.
 */
export const checkEmailTypo = (email: string): string | null => {
  const parts = email.split('@');
  if (parts.length !== 2) return null;
  const domain = parts[1].toLowerCase();

  if (COMMON_PROVIDERS.includes(domain)) return null;

  const domainParts = domain.split('.');
  if (domainParts.length < 2) return null;
  
  const name = domainParts[0];
  const tld = domainParts.slice(1).join('.');

  for (const provider of COMMON_PROVIDERS) {
    const providerParts = provider.split('.');
    const pName = providerParts[0];
    const pTld = providerParts.slice(1).join('.');

    const nameDistance = levenshteinDistance(name, pName);
    const tldDistance = levenshteinDistance(tld, pTld);
    
    // If the provider name is very close (distance 1 or 2) and starts with the same character
    if (nameDistance > 0 && nameDistance <= 2 && name[0] === pName[0]) {
      // And the TLD is either a match or a minor 1-character typo (e.g., 'co' instead of 'com')
      if (tldDistance <= 1) {
        return provider;
      }
    }
  }

  return null;
};

/**
 * Validates whether an email domain exists by checking its MX records.
 * Falls back to checking A records if MX records are not found.
 * 
 * @param email - The email address to validate.
 * @param isLogin - If true, the validation is more lenient on transient DNS errors to avoid locking out existing users.
 * @returns boolean indicating if the domain is considered valid.
 */
export const validateEmailDomain = async (email: string, isLogin: boolean = false): Promise<boolean> => {
  try {
    const parts = email.split('@');
    if (parts.length !== 2) return false;
    
    const domain = parts[1].toLowerCase();
    if (!domain) return false;

    // Check MX records
    try {
      const mxRecords = await resolveMx(domain);
      if (mxRecords && mxRecords.length > 0) {
        return true;
      }
    } catch (mxError: any) {
      // ENOTFOUND/ENODATA means the record definitely doesn't exist.
      // Other errors might be transient DNS failures.
      if (mxError.code !== 'ENOTFOUND' && mxError.code !== 'ENODATA') {
        if (isLogin) return true; // Be lenient for login on network failures
      }
    }

    // Fallback: Check A records (some domains receive mail on their A record IP)
    try {
      const aRecords = await resolve4(domain);
      if (aRecords && aRecords.length > 0) {
        return true;
      }
    } catch (aError: any) {
      if (aError.code !== 'ENOTFOUND' && aError.code !== 'ENODATA') {
        if (isLogin) return true; // Be lenient for login on network failures
      }
      return false; // Domain really doesn't exist
    }

    return false;
  } catch (error) {
    return isLogin ? true : false;
  }
};
