// ==========================================================================
// APAG SIS - Login Page Component (React + TypeScript)
// ==========================================================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User as UserIcon, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRightCircle,
  GraduationCap,
  UserCheck,
  ShieldCheck,
  Shield
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Utils } from '../utils/utils';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('student');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDemoRole, setSelectedDemoRole] = useState<'student' | 'advisor' | 'admin'>('student');

  const executeLogin = async (u: string, p: string) => {
    if (!u.trim() || !p) {
      Utils.showToast('Vui lòng nhập đầy đủ tài khoản và mật khẩu.', 'warning');
      return;
    }

    setIsSubmitting(true);
    const res = await login(u, p, rememberMe);
    setIsSubmitting(false);

    if (res.success) {
      Utils.showToast('Đăng nhập thành công!', 'success');
      // Redirect based on role
      const session = JSON.parse(localStorage.getItem('apag_session') || sessionStorage.getItem('apag_session') || '{}');
      if (session.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (session.role === 'advisor') {
        navigate('/advisor/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } else {
      Utils.showToast(res.error || 'Tài khoản hoặc mật khẩu không chính xác', 'error');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeLogin(username, password);
  };

  const handleDemoLogin = (role: 'student' | 'advisor' | 'admin', demoUser: string, demoPass: string, autoLogin: boolean = true) => {
    setSelectedDemoRole(role);
    setUsername(demoUser);
    setPassword(demoPass);
    if (autoLogin) {
      executeLogin(demoUser, demoPass);
    }
  };

  return (
    <div className="login-viewport">
      {/* Bottom Left Academy Branding */}
      <div className="login-bottom-branding">
        <div className="login-bottom-branding-title">
          APAG SIS · HỆ THỐNG CỐ VẤN THÔNG MINH
        </div>
      </div>

      {/* Central Login Card */}
      <main className="login-card-container">
        <div className="login-card">
          {/* Header */}
          <div className="login-header">
            <a href="#" className="login-logo-link" title="APAG SIS | Hệ thống cố vấn thông minh">
              <img 
                src="/assets/images/apag-logo.png" 
                alt="APAG SIS Logo" 
                className="login-logo-img apag-logo" 
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/images/apag-logo.svg';
                }}
              />
            </a>
            <h1 className="login-title">APAG SIS</h1>
            <p className="login-subtitle">Hệ thống cố vấn thông minh</p>
          </div>

          {/* Form */}
          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <div className="login-input-group">
              <label className="login-label" htmlFor="usernameInput">Tài khoản</label>
              <div className="login-input-wrapper">
                <UserIcon size={16} className="login-input-icon" />
                <input 
                  type="text" 
                  id="usernameInput" 
                  className="login-input" 
                  placeholder="Nhập mã sinh viên hoặc email..." 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required 
                  autoComplete="username" 
                />
              </div>
            </div>

            <div className="login-input-group">
              <label className="login-label" htmlFor="passwordInput">Mật khẩu</label>
              <div className="login-input-wrapper">
                <Lock size={16} className="login-input-icon" />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  id="passwordInput" 
                  className="login-input has-toggle" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                  autoComplete="current-password" 
                />
                <button 
                  type="button" 
                  className="login-password-toggle" 
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  aria-label="Hiện mật khẩu"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="login-options-row">
              <label className="login-checkbox-label">
                <input 
                  type="checkbox" 
                  className="login-checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Duy trì đăng nhập</span>
              </label>
              <a 
                href="#" 
                className="login-forgot-link" 
                onClick={(e) => {
                  e.preventDefault();
                  Utils.showToast('Vui lòng liên hệ Phòng Đào tạo (daotao@apag.edu.vn) để cấp lại mật khẩu.', 'info');
                }}
              >
                Quên mật khẩu?
              </a>
            </div>

            <button 
              type="submit" 
              className="login-submit-btn" 
              disabled={isSubmitting}
            >
              <span>{isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}</span>
              <ArrowRightCircle size={18} className="btn-icon-right" />
            </button>
          </form>

          {/* Quick Demo Role Switcher */}
          <div className="demo-role-switcher">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Tài khoản trải nghiệm demo:
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Click để chọn & đăng nhập
              </span>
            </div>
            
            <div className="demo-role-grid">
              <div 
                className={`demo-role-card ${selectedDemoRole === 'student' ? 'active' : ''}`}
                onClick={() => handleDemoLogin('student', 'student', '123456')}
                title="Sinh viên: Trần Mạnh Hà • GPA 3.24"
              >
                <div className="demo-role-card-icon">
                  <GraduationCap size={16} />
                </div>
                <div className="demo-role-card-title">Sinh viên</div>
                <div className="demo-role-card-desc">Trần Mạnh Hà</div>
              </div>

              <div 
                className={`demo-role-card ${selectedDemoRole === 'advisor' ? 'active' : ''}`}
                onClick={() => handleDemoLogin('advisor', 'advisor', '123456')}
                title="Cố vấn học tập: TS. Nguyễn Năng Thành"
              >
                <div className="demo-role-card-icon">
                  <UserCheck size={16} />
                </div>
                <div className="demo-role-card-title">Cố vấn HT</div>
                <div className="demo-role-card-desc">TS. Nguyễn N.Thành</div>
              </div>

              <div 
                className={`demo-role-card ${selectedDemoRole === 'admin' ? 'active' : ''}`}
                onClick={() => handleDemoLogin('admin', 'admin', '123456')}
                title="Quản trị đào tạo: Phòng Quản lý Đào tạo"
              >
                <div className="demo-role-card-icon">
                  <ShieldCheck size={16} />
                </div>
                <div className="demo-role-card-title">Quản lý ĐT</div>
                <div className="demo-role-card-desc">Phòng Đào tạo</div>
              </div>
            </div>

            <div className="login-trust-footer">
              <Shield size={12} className="text-muted" />
              <span>Chuẩn hóa theo QĐ 458/QĐ-HVHC & TT 08/2021/TT-BGDĐT</span>
            </div>
          </div>
        </div>
      </main>

      <div id="toast-root" className="toast-container"></div>
    </div>
  );
};
