export function normalizeEmail(email: string): string {
    const [localPart, domain] = email.toLowerCase().split('@');
  
    if (domain === 'gmail.com' || domain === 'googlemail.com') {
      const normalizedLocalPart = localPart.split('+')[0].replace(/\./g, '');
      return `${normalizedLocalPart}@gmail.com`;
    }
  
    return email.toLowerCase();
  }