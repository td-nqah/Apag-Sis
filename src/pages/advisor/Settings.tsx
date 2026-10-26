// ==========================================================================
// APAG Advisor Settings Page Component (React + TypeScript)
// 100% Fidelity with original pages/advisor/settings.html & js/advisor/settings.js
// ==========================================================================

import React, { useState, useEffect } from 'react';
import { 
  CalendarClock, ShieldCheck, 
  Eye, EyeOff, RotateCcw, Key, Check, Save 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Utils } from '../../utils/utils';
import { AuthService } from '../../services/authService';

export const AdvisorSettings: React.FC = () => {
  const { user } = useAuth();

  // Schedule state
  const [officeHours, setOfficeHours] = useState('Thứ Ba (08:30 - 11:30) & Thứ Năm (14:00 - 17:00)');
  const [officeLocation, setOfficeLocation] = useState('Phòng 402, Nhà A1, Học viện Hành chính và Quản trị công');

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPwd, setShowCurrentPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [pwdLastUpdated, setPwdLastUpdated] = useState('Chưa đổi');

  const handleSaveSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    Utils.showToast('Đã lưu lịch tiếp nhận tư vấn sinh viên thành công!', 'success');
  };

  // Password strength
  const getPasswordStrength = () => {
    if (!newPassword) return { label: 'Chưa nhập', percent: 0, color: 'var(--text-muted)' };
    if (newPassword.length < 6) return { label: 'Yếu', percent: 25, color: 'var(--danger)' };
    let score = 50;
    if (/[A-Z]/.test(newPassword)) score += 20;
    if (/[0-9]/.test(newPassword)) score += 15;
    if (/[^A-Za-z0-9]/.test(newPassword)) score += 15;
    if (score >= 80) return { label: 'Rất mạnh', percent: 100, color: 'var(--success)' };
    if (score >= 60) return { label: 'Khá mạnh', percent: 70, color: 'var(--primary)' };
    return { label: 'Trung bình', percent: 50, color: 'var(--warning)' };
  };

  const strength = getPasswordStrength();
  const isMatch = newPassword.length > 0 && newPassword === confirmPassword;

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      Utils.showToast('Vui lòng nhập đầy đủ các trường mật khẩu.', 'warning');
      return;
    }
    if (newPassword.length < 6) {
      Utils.showToast('Mật khẩu mới phải có tối thiểu 6 ký tự.', 'warning');
      return;
    }
    if (newPassword !== confirmPassword) {
      Utils.showToast('Mật khẩu xác nhận không khớp.', 'error');
      return;
    }

    const res = await AuthService.changePassword(user?.username || 'advisor', currentPassword, newPassword);
    if (res.success) {
      Utils.showToast(res.message, 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPwdLastUpdated(new Date().toLocaleDateString('vi-VN'));
    } else {
      Utils.showToast(res.message, 'error');
    }
  };

  const handleResetForm = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div>
      <div className="settings-grid space-y-6" style={{ maxWidth: '820px' }}>
        {/* Card 1: Lịch tiếp nhận tư vấn sinh viên */}
        <div className="minimal-card p-6" style={{ marginBottom: '32px' }}>
          <div className="card-header d-flex justify-between items-center mb-4">
            <div className="d-flex items-center gap-3">
              <div className="metric-icon text-primary">
                <CalendarClock size={20} />
              </div>
              <div>
                <h2 className="card-title text-base font-bold">Lịch tiếp nhận tư vấn sinh viên</h2>
                <p className="card-subtitle text-xs text-muted">Thiết lập giờ trực tiếp sinh viên và địa điểm văn phòng</p>
              </div>
            </div>
          </div>
          <form onSubmit={handleSaveSchedule} className="space-y-4">
            <div className="form-group">
              <label className="form-label text-xs font-semibold">Thời gian tiếp sinh viên định kỳ trong tuần</label>
              <input 
                type="text" 
                className="form-control" 
                value={officeHours}
                onChange={e => setOfficeHours(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label text-xs font-semibold">Địa điểm phòng làm việc</label>
              <input 
                type="text" 
                className="form-control" 
                value={officeLocation}
                onChange={e => setOfficeLocation(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary btn-sm" id="btnSaveSchedule">
              <Save size={14} />
              <span>Lưu lịch tiếp sinh viên</span>
            </button>
          </form>
        </div>

        {/* Card 4: Bảo mật & Đổi mật khẩu */}
        <div className="minimal-card settings-card" style={{ marginBottom: '32px' }}>
          <div className="card-header d-flex justify-between items-center">
            <div className="d-flex items-center gap-3">
              <div className="metric-icon" style={{ color: 'var(--status-success)' }}>
                <ShieldCheck size={20} />
              </div>
              <div>
                <h2 className="card-title text-base font-bold">Bảo mật tài khoản & Đổi mật khẩu</h2>
                <p className="card-subtitle text-xs text-muted">Cập nhật mật khẩu định kỳ để bảo vệ dữ liệu hồ sơ Cố vấn học tập</p>
              </div>
            </div>
            <span className="badge badge-outline text-xs" id="pwdLastUpdatedBadge">
              Cập nhật lần cuối: {pwdLastUpdated}
            </span>
          </div>
          <div className="card-body">
            <form id="changePasswordForm" onSubmit={handleChangePassword} className="space-y-4">
              <div className="form-group">
                <label className="form-label text-sm font-semibold text-main">
                  Mật khẩu hiện tại <span className="text-danger">*</span>
                </label>
                <div className="input-with-icon" style={{ position: 'relative' }}>
                  <input 
                    type={showCurrentPwd ? 'text' : 'password'} 
                    className="form-control" 
                    placeholder="Nhập mật khẩu hiện tại" 
                    required 
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    style={{ paddingRight: '40px' }}
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowCurrentPwd(!showCurrentPwd)}
                    title="Hiển thị/Ẩn mật khẩu" 
                    style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                  >
                    {showCurrentPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label text-sm font-semibold text-main">
                    Mật khẩu mới <span className="text-danger">*</span>
                  </label>
                  <div className="input-with-icon" style={{ position: 'relative' }}>
                    <input 
                      type={showNewPwd ? 'text' : 'password'} 
                      className="form-control" 
                      placeholder="Tối thiểu 6 ký tự" 
                      required 
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      style={{ paddingRight: '40px' }}
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowNewPwd(!showNewPwd)}
                      title="Hiển thị/Ẩn mật khẩu" 
                      style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                    >
                      {showNewPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label text-sm font-semibold text-main">
                    Xác nhận mật khẩu mới <span className="text-danger">*</span>
                  </label>
                  <div className="input-with-icon" style={{ position: 'relative' }}>
                    <input 
                      type={showConfirmPwd ? 'text' : 'password'} 
                      className="form-control" 
                      placeholder="Nhập lại mật khẩu mới" 
                      required 
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      style={{ paddingRight: '40px' }}
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowConfirmPwd(!showConfirmPwd)}
                      title="Hiển thị/Ẩn mật khẩu" 
                      style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                    >
                      {showConfirmPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Password Strength & Criteria Hint */}
              <div className="p-3 rounded border text-xs" style={{ background: 'var(--surface-subtle)', borderColor: 'var(--border)' }}>
                <div className="d-flex justify-between items-center mb-1.5">
                  <span className="font-semibold text-main">Độ mạnh mật khẩu:</span>
                  <span className="font-bold" style={{ color: strength.color }}>{strength.label}</span>
                </div>
                <div className="progress-bar-flat mb-2" style={{ height: '4px', background: 'var(--border)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div 
                    className="progress-bar-fill" 
                    style={{ width: `${strength.percent}%`, height: '100%', transition: 'width 0.3s, background-color 0.3s', backgroundColor: strength.color }}
                  />
                </div>
                <div className="d-flex items-center gap-3 text-muted flex-wrap">
                  <span style={{ color: newPassword.length >= 6 ? 'var(--success)' : 'var(--text-muted)' }}>
                    <Check size={12} style={{ display: 'inline', marginRight: '4px' }} />
                    Tối thiểu 6 ký tự
                  </span>
                  <span style={{ color: isMatch ? 'var(--success)' : 'var(--text-muted)' }}>
                    <Check size={12} style={{ display: 'inline', marginRight: '4px' }} />
                    Mật khẩu xác nhận trùng khớp
                  </span>
                </div>
              </div>

              <div className="d-flex justify-end gap-2 pt-2">
                <button type="button" className="btn btn-outline btn-sm" onClick={handleResetForm}>
                  <RotateCcw size={14} />
                  <span>Nhập lại</span>
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  <Key size={14} />
                  <span>Cập nhật mật khẩu</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
