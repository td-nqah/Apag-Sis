// ==========================================================================
// APAG Admin Settings Page Component (React + TypeScript)
// ==========================================================================

import React, { useState } from 'react';
import { ShieldCheck, Eye, EyeOff, RotateCcw, Key, Database, Download } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Utils } from '../../utils/utils';
import { AuthService } from '../../services/authService';

export const AdminSettings: React.FC = () => {
  const { user } = useAuth();

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Password validation & strength
  const getPasswordStrength = () => {
    if (!newPassword) return { label: 'Chưa nhập', percent: 0, color: 'var(--text-muted)' };
    if (newPassword.length < 6) return { label: 'Yếu', percent: 30, color: 'var(--status-danger)' };
    const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);
    const hasNum = /[0-9]/.test(newPassword);
    if (hasSpecial && hasNum && newPassword.length >= 8) {
      return { label: 'Rất mạnh', percent: 100, color: 'var(--status-success)' };
    }
    return { label: 'Trung bình', percent: 65, color: 'var(--status-warning)' };
  };

  const strength = getPasswordStrength();
  const isLengthValid = newPassword.length >= 6;
  const isMatchValid = newPassword.length > 0 && newPassword === confirmPassword;

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      Utils.showToast('Vui lòng nhập đầy đủ các thông tin mật khẩu.', 'warning');
      return;
    }
    if (newPassword.length < 6) {
      Utils.showToast('Mật khẩu mới phải có tối thiểu 6 ký tự.', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      Utils.showToast('Mật khẩu xác nhận không trùng khớp.', 'error');
      return;
    }

    setIsSubmitting(true);
    const res = await AuthService.changePassword(user?.username || 'admin', currentPassword, newPassword);
    setIsSubmitting(false);

    if (res.success) {
      Utils.showToast(res.message, 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      Utils.showToast(res.message, 'error');
    }
  };

  const handleTestBackend = () => {
    Utils.showToast('Đang kiểm tra kết nối tới dịch vụ cơ sở dữ liệu...', 'info');
    setTimeout(() => {
      Utils.showToast('Frontend Demo đang sử dụng Mock Data chuẩn sẵn sàng kết nối API Backend.', 'success');
    }, 500);
  };

  const handleBackupData = () => {
    Utils.showToast('Đang xuất tệp sao lưu dữ liệu toàn hệ thống...', 'info');
    setTimeout(() => {
      Utils.showToast('Đã tạo thành công bản sao lưu apag-backup-latest.json!', 'success');
    }, 500);
  };

  return (
    <div className="admin-settings-page" style={{ maxWidth: '820px', margin: '0 auto' }}>
      <div className="space-y-6">
        {/* Card 1: Bảo mật tài khoản Quản trị & Đổi mật khẩu */}
        <div className="minimal-card settings-card" style={{ marginBottom: '24px' }}>
          <div className="card-header d-flex justify-between items-center mb-4">
            <div className="d-flex items-center gap-3">
              <div className="metric-icon" style={{ color: 'var(--status-success)' }}>
                <ShieldCheck size={20} />
              </div>
              <div>
                <h2 className="card-title text-base font-bold">Bảo mật tài khoản Quản trị & Đổi mật khẩu</h2>
              </div>
            </div>
            <span className="badge badge-outline text-xs">Cập nhật lần cuối: Chưa đổi</span>
          </div>

          <div className="card-body">
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="form-group mb-3">
                <label className="form-label text-sm font-semibold text-main">Mật khẩu hiện tại <span className="text-danger">*</span></label>
                <div className="input-with-icon" style={{ position: 'relative' }}>
                  <input 
                    type={showCurrent ? 'text' : 'password'} 
                    className="form-control" 
                    placeholder="Nhập mật khẩu hiện tại"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    style={{ paddingRight: '40px' }}
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowCurrent(!showCurrent)}
                    style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px', display: 'flex', alignItems: 'center' }}
                  >
                    {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div className="form-group">
                  <label className="form-label text-sm font-semibold text-main">Mật khẩu mới <span className="text-danger">*</span></label>
                  <div className="input-with-icon" style={{ position: 'relative' }}>
                    <input 
                      type={showNew ? 'text' : 'password'} 
                      className="form-control" 
                      placeholder="Tối thiểu 6 ký tự"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      style={{ paddingRight: '40px' }}
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowNew(!showNew)}
                      style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px', display: 'flex', alignItems: 'center' }}
                    >
                      {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label text-sm font-semibold text-main">Xác nhận mật khẩu mới <span className="text-danger">*</span></label>
                  <div className="input-with-icon" style={{ position: 'relative' }}>
                    <input 
                      type={showConfirm ? 'text' : 'password'} 
                      className="form-control" 
                      placeholder="Nhập lại mật khẩu mới"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      style={{ paddingRight: '40px' }}
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowConfirm(!showConfirm)}
                      style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px', display: 'flex', alignItems: 'center' }}
                    >
                      {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Password Strength Indicator */}
              <div className="p-3 rounded border text-xs mb-3" style={{ background: 'var(--surface-subtle)', borderColor: 'var(--border)' }}>
                <div className="d-flex justify-between items-center mb-1">
                  <span className="font-semibold text-main">Độ mạnh mật khẩu:</span>
                  <span className="font-bold" style={{ color: strength.color }}>{strength.label}</span>
                </div>
                <div style={{ height: '4px', background: 'var(--border)', borderRadius: '2px', overflow: 'hidden', marginBottom: '8px' }}>
                  <div style={{ width: `${strength.percent}%`, height: '100%', backgroundColor: strength.color, transition: 'width 0.3s, background-color 0.3s' }}></div>
                </div>
                <div className="d-flex items-center gap-3 text-muted flex-wrap">
                  <span style={{ color: isLengthValid ? 'var(--status-success)' : 'inherit' }}>
                    {isLengthValid ? '✓' : '•'} Tối thiểu 6 ký tự
                  </span>
                  <span style={{ color: isMatchValid ? 'var(--status-success)' : 'inherit' }}>
                    {isMatchValid ? '✓' : '•'} Mật khẩu xác nhận trùng khớp
                  </span>
                </div>
              </div>

              <div className="d-flex justify-end gap-2 pt-2">
                <button 
                  type="button" 
                  className="btn btn-outline btn-sm"
                  onClick={() => {
                    setCurrentPassword('');
                    setNewPassword('');
                    setConfirmPassword('');
                  }}
                >
                  <RotateCcw size={14} />
                  <span>Nhập lại</span>
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary btn-sm"
                  disabled={isSubmitting}
                >
                  <Key size={14} />
                  <span>{isSubmitting ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Card 4: Tích hợp Cơ sở dữ liệu & API Backend */}
        <div className="minimal-card p-6" style={{ marginBottom: '24px' }}>
          <div className="d-flex items-center gap-3 mb-3">
            <div className="metric-icon text-primary">
              <Database size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold">Tích hợp Cơ sở dữ liệu & API Backend</h2>
              <p className="text-xs text-muted">Hệ thống sẵn sàng chuyển đổi linh hoạt giữa Mock Data và REST / GraphQL API.</p>
            </div>
          </div>
          
          <div className="d-flex items-center justify-between p-3 bg-subtle rounded border mb-4">
            <div>
              <div className="font-bold text-sm">Chế độ hoạt động hiện tại:</div>
              <div className="text-xs text-muted">DATA_SOURCE = 'mock' (Sẵn sàng kết nối Backend)</div>
            </div>
            <span className="badge badge-primary">Chế độ Demo / Mock</span>
          </div>

          <div className="d-flex gap-2 flex-wrap">
            <button 
              type="button" 
              className="btn btn-secondary btn-sm"
              onClick={handleTestBackend}
            >
              <Database size={15} />
              <span>Kiểm tra kết nối API Backend</span>
            </button>
            <button 
              type="button" 
              className="btn btn-outline btn-sm"
              onClick={handleBackupData}
            >
              <Download size={15} />
              <span>Tải bản sao lưu JSON toàn hệ thống</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AdminSettings;
