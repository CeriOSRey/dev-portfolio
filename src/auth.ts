export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

export function isTokenExpired(token: string | null): boolean {
  if (!token) return true;
  try {
    const [, payloadB64] = token.split('.');
    const json = JSON.parse(atob(payloadB64));
    const exp = json.exp as number | undefined;
    if (!exp) return false; // no exp => treat as not expired
    const now = Math.floor(Date.now() / 1000);
    return now >= exp;
  } catch {
    return true;
  }
}

export function logout(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('token');
}
