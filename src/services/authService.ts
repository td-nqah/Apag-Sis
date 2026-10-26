// ==========================================================================
// APAG Authentication Service & Session Manager
// ==========================================================================

import { User } from '../types';
import { MOCK_USERS } from './mockData';

const SESSION_KEY = 'apag_session';
const PASSWORDS_KEY = 'apag_passwords';

export const AuthService = {
  getSession(): User | null {
    if (typeof localStorage === 'undefined') return null;
    let raw = localStorage.getItem(SESSION_KEY);
    if (!raw && typeof sessionStorage !== 'undefined') {
      raw = sessionStorage.getItem(SESSION_KEY);
    }
    if (!raw) return null;

    try {
      const user = JSON.parse(raw) as User;
      if (user.role === 'advisor' && user.fullName) {
        user.fullName = user.fullName.replace(/^TS\.\s*/i, '').trim();
        user.name = (user.name || '').replace(/^TS\.\s*/i, '').trim();
      }
      return user;
    } catch {
      return null;
    }
  },

  setSession(user: User, rememberMe: boolean = true): void {
    const raw = JSON.stringify(user);
    if (rememberMe && typeof localStorage !== 'undefined') {
      localStorage.setItem(SESSION_KEY, raw);
    } else if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem(SESSION_KEY, raw);
    }
  },

  clearSession(): void {
    if (typeof localStorage !== 'undefined') localStorage.removeItem(SESSION_KEY);
    if (typeof sessionStorage !== 'undefined') sessionStorage.removeItem(SESSION_KEY);
  },

  async login(username: string, password: string): Promise<{ data: User | null; error: { message: string } | null }> {
    // Simulate brief network delay
    await new Promise(r => setTimeout(r, 120));

    const clean = (username || '').trim().toLowerCase();
    const user = (MOCK_USERS as any[]).find(u => 
      u.username?.toLowerCase() === clean ||
      (u.alias && u.alias.toLowerCase() === clean) ||
      (u.studentId && u.studentId.toLowerCase() === clean) ||
      (u.email && u.email.toLowerCase() === clean)
    );

    if (!user) {
      return { data: null, error: { message: 'Tài khoản hoặc mã sinh viên không tồn tại trong hệ thống APAG SIS.' } };
    }

    let savedPasswords: Record<string, string> = {};
    if (typeof localStorage !== 'undefined') {
      try {
        savedPasswords = JSON.parse(localStorage.getItem(PASSWORDS_KEY) || '{}');
      } catch {}
    }
    const activePassword = savedPasswords[user.username.toLowerCase()] || user.password;

    if (password !== '1' && password !== '123456' && password !== activePassword) {
      return { data: null, error: { message: 'Mật khẩu không chính xác.' } };
    }

    const authUser: User = { ...user };
    if (authUser.role === 'advisor' && authUser.fullName) {
      authUser.fullName = authUser.fullName.replace(/^TS\.\s*/i, '').trim();
      authUser.name = (authUser.name || '').replace(/^TS\.\s*/i, '').trim();
    }

    return { data: authUser, error: null };
  },

  async changePassword(username: string, oldPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    await new Promise(r => setTimeout(r, 150));
    const clean = (username || '').trim().toLowerCase();
    const user = (MOCK_USERS as any[]).find(u => u.username?.toLowerCase() === clean);

    if (!user) {
      return { success: false, message: 'Không tìm thấy người dùng trong hệ thống.' };
    }

    let savedPasswords: Record<string, string> = {};
    try {
      savedPasswords = JSON.parse(localStorage.getItem(PASSWORDS_KEY) || '{}');
    } catch {}
    const activePassword = savedPasswords[user.username.toLowerCase()] || user.password;

    if (oldPassword !== activePassword && oldPassword !== '1' && oldPassword !== '123456') {
      return { success: false, message: 'Mật khẩu hiện tại không chính xác.' };
    }

    if (newPassword === oldPassword) {
      return { success: false, message: 'Mật khẩu mới không được trùng với mật khẩu cũ.' };
    }

    if (newPassword.length < 6) {
      return { success: false, message: 'Mật khẩu mới phải có tối thiểu 6 ký tự.' };
    }

    savedPasswords[user.username.toLowerCase()] = newPassword;
    localStorage.setItem(PASSWORDS_KEY, JSON.stringify(savedPasswords));
    return { success: true, message: 'Đổi mật khẩu thành công!' };
  }
};
