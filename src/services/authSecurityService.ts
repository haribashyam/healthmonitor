import crypto from "crypto";

// ============================================================================
// VITALOS SENIOR SECURITY ARCHITECTURE: AUTHENTICATION & DEFENSE ENGINE
// 1. PBKDF2 Password Hashing (100,000 iterations, 32-byte Salt, Constant-Time Compare)
// 2. Cryptographic Session Token Issuance & Revocation (HMAC-SHA256, 24h Expiry)
// 3. Email Verification System (Single-Use, 24h Token Expiration)
// 4. Password Reset Engine (Single-Use, 1h Expiration, Complexity Enforcement)
// 5. Account Lockout & Brute-Force Rate Limiting (5 Attempts -> 15m Lockout)
// 6. Security Event Audit Logging (Auth Attempts, IDOR Blocks, Threat Telemetry)
// 7. Input Sanitization & Anti-Injection Guard (XSS, SQLi, Command Injection)
// ============================================================================

const AUTH_PEPPER = process.env.AUTH_PEPPER || "vitalos_security_pepper_2026_x89a";
const JWT_SECRET = process.env.JWT_SECRET || "vitalos_production_session_secret_99f2b8a1e3c4d5";
const DEFAULT_SESSION_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 Hours
const MAX_FAILED_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 Minutes
const PASSWORD_RESET_EXPIRY_MS = 60 * 60 * 1000; // 1 Hour
const EMAIL_VERIFICATION_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 Hours

export interface UserRecord {
  id: string;
  email: string;
  displayName: string;
  passwordHash: string;
  passwordSalt: string;
  passwordIterations: number;
  role: 'user' | 'clinician' | 'admin';
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface UserSession {
  sessionId: string;
  userId: string;
  email: string;
  role: 'user' | 'clinician' | 'admin';
  issuedAt: number;
  expiresAt: number;
  ip: string;
  userAgent?: string;
}

export interface SecurityEvent {
  id: string;
  timestamp: string;
  eventType: 
    | 'AUTH_LOGIN_SUCCESS'
    | 'AUTH_LOGIN_FAILURE'
    | 'AUTH_ACCOUNT_LOCKED'
    | 'AUTH_REGISTER'
    | 'AUTH_EMAIL_VERIFIED'
    | 'AUTH_PASSWORD_RESET_REQUEST'
    | 'AUTH_PASSWORD_RESET_SUCCESS'
    | 'AUTH_SESSION_REVOKED'
    | 'AUTH_SESSION_EXPIRED'
    | 'AUTH_UNAUTHORIZED_ACCESS'
    | 'IDOR_ATTEMPT_BLOCKED'
    | 'RATE_LIMIT_TRIGGERED'
    | 'MALICIOUS_INPUT_BLOCKED'
    | 'SECURITY_HEADER_VIOLATION';
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  userId?: string;
  email?: string;
  ip: string;
  userAgent?: string;
  details: Record<string, any>;
}

// In-Memory Storage Stores (Production Database Proxy)
export class AuthSecurityStore {
  private static instance: AuthSecurityStore;

  public users: Map<string, UserRecord> = new Map(); // key: userId
  public userByEmail: Map<string, string> = new Map(); // key: email.toLowerCase() -> userId
  public activeSessions: Map<string, UserSession> = new Map(); // key: sessionId
  public emailVerificationTokens: Map<string, { userId: string; email: string; expiresAt: number }> = new Map();
  public passwordResetTokens: Map<string, { userId: string; email: string; expiresAt: number; used: boolean }> = new Map();
  public failedAttempts: Map<string, { count: number; lockedUntil?: number; lastAttempt: number }> = new Map(); // key: email or IP
  public securityAuditLogs: SecurityEvent[] = [];

  private constructor() {
    this.seedDefaultUsers();
  }

  public static getInstance(): AuthSecurityStore {
    if (!AuthSecurityStore.instance) {
      AuthSecurityStore.instance = new AuthSecurityStore();
    }
    return AuthSecurityStore.instance;
  }

  private seedDefaultUsers() {
    // Seed default administrative and standard accounts with securely hashed passwords
    const adminSalt = crypto.randomBytes(32).toString('hex');
    const adminHash = crypto.pbkdf2Sync('Admin!VitalOS2026', adminSalt + AUTH_PEPPER, 100000, 64, 'sha512').toString('hex');

    const userSalt = crypto.randomBytes(32).toString('hex');
    const userHash = crypto.pbkdf2Sync('AlexVance#2026', userSalt + AUTH_PEPPER, 100000, 64, 'sha512').toString('hex');

    const adminUser: UserRecord = {
      id: 'usr_admin_001',
      email: 'haribashyam.11@gmail.com',
      displayName: 'Hari Bashyam (Security Admin)',
      passwordHash: adminHash,
      passwordSalt: adminSalt,
      passwordIterations: 100000,
      role: 'admin',
      emailVerified: true,
      twoFactorEnabled: true,
      createdAt: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    };

    const standardUser: UserRecord = {
      id: 'usr_patient_001',
      email: 'alex.vance@vitalos.health',
      displayName: 'Alex Vance',
      passwordHash: userHash,
      passwordSalt: userSalt,
      passwordIterations: 100000,
      role: 'user',
      emailVerified: true,
      twoFactorEnabled: false,
      createdAt: new Date(Date.now() - 60 * 24 * 3600 * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.users.set(adminUser.id, adminUser);
    this.userByEmail.set(adminUser.email.toLowerCase(), adminUser.id);

    this.users.set(standardUser.id, standardUser);
    this.userByEmail.set(standardUser.email.toLowerCase(), standardUser.id);
  }
}

// ----------------------------------------------------------------------------
// 1. Password Hashing & Complexity Validation
// ----------------------------------------------------------------------------

export interface PasswordValidationResult {
  isValid: boolean;
  score: number; // 0-4
  feedback: string[];
}

export function validatePasswordStrength(password: string): PasswordValidationResult {
  const feedback: string[] = [];
  let score = 0;

  if (password.length < 8) {
    feedback.push("Password must be at least 8 characters long.");
  } else if (password.length >= 12) {
    score += 1;
  }

  if (password.length > 128) {
    feedback.push("Password exceeds maximum allowed length of 128 characters.");
  }

  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    feedback.push("Must contain at least one lowercase letter.");
  }

  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push("Must contain at least one uppercase letter.");
  }

  if (/[0-9]/.test(password)) {
    score += 1;
  } else {
    feedback.push("Must contain at least one numeric digit.");
  }

  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password)) {
    score += 1;
  } else {
    feedback.push("Must contain at least one special character.");
  }

  const isValid = feedback.length === 0 && password.length >= 8;
  return { isValid, score: Math.min(score, 4), feedback };
}

export function hashPassword(password: string): { salt: string; hash: string; iterations: number } {
  const salt = crypto.randomBytes(32).toString('hex');
  const iterations = 100000;
  const hash = crypto.pbkdf2Sync(password + AUTH_PEPPER, salt, iterations, 64, 'sha512').toString('hex');
  return { salt, hash, iterations };
}

export function verifyPassword(password: string, salt: string, storedHash: string, iterations = 100000): boolean {
  try {
    const computedHash = crypto.pbkdf2Sync(password + AUTH_PEPPER, salt, iterations, 64, 'sha512').toString('hex');
    const computedBuffer = Buffer.from(computedHash, 'hex');
    const storedBuffer = Buffer.from(storedHash, 'hex');

    if (computedBuffer.length !== storedBuffer.length) {
      return false;
    }
    return crypto.timingSafeEqual(computedBuffer, storedBuffer);
  } catch (err) {
    console.error('[VITALOS Security] Password verification error:', err);
    return false;
  }
}

// ----------------------------------------------------------------------------
// 2. Session Management & Cryptographic Token Generation
// ----------------------------------------------------------------------------

export function createSessionToken(user: UserRecord, ip: string, userAgent?: string): { token: string; expiresAt: number; session: UserSession } {
  const store = AuthSecurityStore.getInstance();
  const sessionId = `sess_${crypto.randomBytes(24).toString('hex')}`;
  const now = Date.now();
  const expiresAt = now + DEFAULT_SESSION_EXPIRY_MS;

  const session: UserSession = {
    sessionId,
    userId: user.id,
    email: user.email,
    role: user.role,
    issuedAt: now,
    expiresAt,
    ip,
    userAgent
  };

  store.activeSessions.set(sessionId, session);

  // Generate cryptographically signed token string: base64url(payload) + '.' + HMAC
  const payloadJson = JSON.stringify({
    sid: sessionId,
    uid: user.id,
    email: user.email,
    role: user.role,
    iat: now,
    exp: expiresAt
  });
  const payloadBase64 = Buffer.from(payloadJson).toString('base64url');
  const signature = crypto.createHmac('sha256', JWT_SECRET).update(payloadBase64).digest('base64url');

  const token = `${payloadBase64}.${signature}`;
  return { token, expiresAt, session };
}

export function verifySessionToken(tokenString: string): { valid: boolean; user?: UserSession; error?: string; code?: string } {
  const store = AuthSecurityStore.getInstance();
  if (!tokenString || !tokenString.includes('.')) {
    return { valid: false, error: 'Malformed token structure', code: 'INVALID_TOKEN' };
  }

  const [payloadBase64, providedSignature] = tokenString.split('.');
  if (!payloadBase64 || !providedSignature) {
    return { valid: false, error: 'Invalid token format', code: 'INVALID_TOKEN' };
  }

  // Verify HMAC signature in constant time
  const expectedSignature = crypto.createHmac('sha256', JWT_SECRET).update(payloadBase64).digest('base64url');
  const expectedBuf = Buffer.from(expectedSignature);
  const providedBuf = Buffer.from(providedSignature);

  if (expectedBuf.length !== providedBuf.length || !crypto.timingSafeEqual(expectedBuf, providedBuf)) {
    return { valid: false, error: 'Cryptographic signature verification failed', code: 'TAMPERED_TOKEN' };
  }

  try {
    const payload = JSON.parse(Buffer.from(payloadBase64, 'base64url').toString('utf-8'));
    const now = Date.now();

    if (payload.exp && now > payload.exp) {
      // Remove expired session
      store.activeSessions.delete(payload.sid);
      return { valid: false, error: 'Session token has expired', code: 'TOKEN_EXPIRED' };
    }

    // Verify session is active in server registry (supports instant revocation)
    const activeSession = store.activeSessions.get(payload.sid);
    if (!activeSession) {
      return { valid: false, error: 'Session has been revoked or logged out', code: 'SESSION_REVOKED' };
    }

    return { valid: true, user: activeSession };
  } catch {
    return { valid: false, error: 'Failed to decode token payload', code: 'DECODE_ERROR' };
  }
}

export function revokeSession(sessionId: string): boolean {
  const store = AuthSecurityStore.getInstance();
  return store.activeSessions.delete(sessionId);
}

export function revokeAllUserSessions(userId: string): number {
  const store = AuthSecurityStore.getInstance();
  let count = 0;
  for (const [sid, sess] of store.activeSessions.entries()) {
    if (sess.userId === userId) {
      store.activeSessions.delete(sid);
      count++;
    }
  }
  return count;
}

// ----------------------------------------------------------------------------
// 3. Brute-Force Rate Limiting & Account Lockout Guard
// ----------------------------------------------------------------------------

export function checkAccountLockout(identifier: string): { isLocked: boolean; remainingLockoutSeconds: number } {
  const store = AuthSecurityStore.getInstance();
  const record = store.failedAttempts.get(identifier.toLowerCase());
  if (!record || !record.lockedUntil) {
    return { isLocked: false, remainingLockoutSeconds: 0 };
  }

  const now = Date.now();
  if (now < record.lockedUntil) {
    const remainingSec = Math.ceil((record.lockedUntil - now) / 1000);
    return { isLocked: true, remainingLockoutSeconds: remainingSec };
  }

  // Lockout expired
  store.failedAttempts.delete(identifier.toLowerCase());
  return { isLocked: false, remainingLockoutSeconds: 0 };
}

export function recordFailedLogin(identifier: string, ip: string): { attempts: number; isLocked: boolean; remainingLockoutSeconds: number } {
  const store = AuthSecurityStore.getInstance();
  const key = identifier.toLowerCase();
  const now = Date.now();
  const record = store.failedAttempts.get(key) || { count: 0, lastAttempt: now };

  // Reset count if last attempt was older than the window
  if (now - record.lastAttempt > LOCKOUT_DURATION_MS) {
    record.count = 1;
  } else {
    record.count++;
  }
  record.lastAttempt = now;

  let isLocked = false;
  let remainingLockoutSeconds = 0;

  if (record.count >= MAX_FAILED_LOGIN_ATTEMPTS) {
    record.lockedUntil = now + LOCKOUT_DURATION_MS;
    isLocked = true;
    remainingLockoutSeconds = Math.ceil(LOCKOUT_DURATION_MS / 1000);

    logSecurityEvent({
      eventType: 'AUTH_ACCOUNT_LOCKED',
      severity: 'WARNING',
      email: identifier,
      ip,
      details: {
        attempts: record.count,
        lockoutDurationSeconds: remainingLockoutSeconds,
        reason: 'Consecutive failed login threshold exceeded'
      }
    });
  }

  store.failedAttempts.set(key, record);
  return { attempts: record.count, isLocked, remainingLockoutSeconds };
}

export function recordSuccessfulLogin(identifier: string): void {
  const store = AuthSecurityStore.getInstance();
  store.failedAttempts.delete(identifier.toLowerCase());
}

// ----------------------------------------------------------------------------
// 4. Email Verification Engine
// ----------------------------------------------------------------------------

export function generateEmailVerificationToken(userId: string, email: string): { token: string; expiresAt: number } {
  const store = AuthSecurityStore.getInstance();
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = Date.now() + EMAIL_VERIFICATION_EXPIRY_MS;

  store.emailVerificationTokens.set(token, {
    userId,
    email: email.toLowerCase(),
    expiresAt
  });

  return { token, expiresAt };
}

export function verifyEmailWithToken(token: string): { success: boolean; error?: string; user?: UserRecord } {
  const store = AuthSecurityStore.getInstance();
  const entry = store.emailVerificationTokens.get(token);

  if (!entry) {
    return { success: false, error: 'Invalid or expired email verification token' };
  }

  if (Date.now() > entry.expiresAt) {
    store.emailVerificationTokens.delete(token);
    return { success: false, error: 'Email verification token has expired. Please request a new one.' };
  }

  const user = store.users.get(entry.userId);
  if (!user) {
    return { success: false, error: 'User associated with token not found' };
  }

  user.emailVerified = true;
  user.updatedAt = new Date().toISOString();
  store.users.set(user.id, user);
  store.emailVerificationTokens.delete(token);

  logSecurityEvent({
    eventType: 'AUTH_EMAIL_VERIFIED',
    severity: 'INFO',
    userId: user.id,
    email: user.email,
    ip: 'server-verified',
    details: { verifiedAt: user.updatedAt }
  });

  return { success: true, user };
}

// ----------------------------------------------------------------------------
// 5. Password Reset Engine
// ----------------------------------------------------------------------------

export function generatePasswordResetToken(email: string): { success: boolean; token?: string; expiresAt?: number; error?: string } {
  const store = AuthSecurityStore.getInstance();
  const userId = store.userByEmail.get(email.toLowerCase());

  if (!userId) {
    // Note: Always return simulated success to prevent email enumeration timing attacks
    return { success: true };
  }

  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = Date.now() + PASSWORD_RESET_EXPIRY_MS;

  store.passwordResetTokens.set(token, {
    userId,
    email: email.toLowerCase(),
    expiresAt,
    used: false
  });

  logSecurityEvent({
    eventType: 'AUTH_PASSWORD_RESET_REQUEST',
    severity: 'INFO',
    userId,
    email,
    ip: 'server-reset-engine',
    details: { expiresAt: new Date(expiresAt).toISOString() }
  });

  return { success: true, token, expiresAt };
}

export function executePasswordReset(token: string, newPassword: string, ip: string): { success: boolean; error?: string } {
  const store = AuthSecurityStore.getInstance();
  const entry = store.passwordResetTokens.get(token);

  if (!entry || entry.used) {
    return { success: false, error: 'Password reset token is invalid or has already been used.' };
  }

  if (Date.now() > entry.expiresAt) {
    store.passwordResetTokens.delete(token);
    return { success: false, error: 'Password reset token has expired. Please submit a new request.' };
  }

  const strength = validatePasswordStrength(newPassword);
  if (!strength.isValid) {
    return { success: false, error: strength.feedback.join(' ') };
  }

  const user = store.users.get(entry.userId);
  if (!user) {
    return { success: false, error: 'User record not found.' };
  }

  const { salt, hash, iterations } = hashPassword(newPassword);
  user.passwordHash = hash;
  user.passwordSalt = salt;
  user.passwordIterations = iterations;
  user.updatedAt = new Date().toISOString();
  store.users.set(user.id, user);

  // Invalidate reset token & revoke all existing sessions to enforce security
  entry.used = true;
  store.passwordResetTokens.delete(token);
  revokeAllUserSessions(user.id);

  logSecurityEvent({
    eventType: 'AUTH_PASSWORD_RESET_SUCCESS',
    severity: 'WARNING',
    userId: user.id,
    email: user.email,
    ip,
    details: { timestamp: user.updatedAt, revokedSessions: true }
  });

  return { success: true };
}

// ----------------------------------------------------------------------------
// 6. Security Event Audit Logger
// ----------------------------------------------------------------------------

export function logSecurityEvent(event: Omit<SecurityEvent, 'id' | 'timestamp'>): SecurityEvent {
  const store = AuthSecurityStore.getInstance();
  const fullEvent: SecurityEvent = {
    id: `sec_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
    timestamp: new Date().toISOString(),
    ...event
  };

  store.securityAuditLogs.unshift(fullEvent);
  // Cap at 1000 events in memory
  if (store.securityAuditLogs.length > 1000) {
    store.securityAuditLogs.pop();
  }

  // Print high-severity events to server log
  if (event.severity === 'WARNING' || event.severity === 'CRITICAL') {
    console.warn(`[SECURITY ${event.severity}] [${event.eventType}]`, JSON.stringify({
      email: event.email,
      ip: event.ip,
      details: event.details
    }));
  }

  return fullEvent;
}

export function getSecurityLogs(limit = 100): SecurityEvent[] {
  const store = AuthSecurityStore.getInstance();
  return store.securityAuditLogs.slice(0, limit);
}

// ----------------------------------------------------------------------------
// 7. Input Sanitization & Anti-Injection Defense
// ----------------------------------------------------------------------------

const SUSPICIOUS_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /javascript:/gi,
  /on\w+\s*=/gi, // onerror=, onclick=, onload=
  /(\b(union(\s+all)?|select|insert|update|delete|drop|alter|truncate|exec|execute)\b.*\b(from|into|table|database|where)\b)/gi,
  /\b(exec\s*\(|system\s*\(|passthru\s*\(|cmd\.exe|\/bin\/sh|\/bin\/bash)\b/gi,
  /(\.\.[\/\\])/g // directory traversal
];

export function detectMaliciousInjection(input: string): boolean {
  if (!input || typeof input !== 'string') return false;
  return SUSPICIOUS_PATTERNS.some(regex => regex.test(input));
}

export function sanitizeInput(input: any): any {
  if (typeof input === 'string') {
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<[^>]+>/g, '')
      .replace(/javascript:/gi, '')
      .trim();
  }
  if (Array.isArray(input)) {
    return input.map(sanitizeInput);
  }
  if (input !== null && typeof input === 'object') {
    const cleaned: Record<string, any> = {};
    for (const [k, v] of Object.entries(input)) {
      cleaned[k] = sanitizeInput(v);
    }
    return cleaned;
  }
  return input;
}

// ----------------------------------------------------------------------------
// 8. User Management Helpers
// ----------------------------------------------------------------------------

export function findUserByEmail(email: string): UserRecord | undefined {
  const store = AuthSecurityStore.getInstance();
  const userId = store.userByEmail.get(email.toLowerCase().trim());
  if (!userId) return undefined;
  return store.users.get(userId);
}

export function findUserById(id: string): UserRecord | undefined {
  const store = AuthSecurityStore.getInstance();
  return store.users.get(id);
}

export function sanitizeUserOutput(user: UserRecord): Omit<UserRecord, 'passwordHash' | 'passwordSalt' | 'passwordIterations'> {
  const { passwordHash, passwordSalt, passwordIterations, ...safeUser } = user;
  return safeUser;
}
