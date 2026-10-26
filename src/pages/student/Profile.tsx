// ==========================================================================
// APAG Student Profile Page Component (React + TypeScript)
// Full-Width Digital Student ID / Digital Student Pass Refactor
// ==========================================================================

import React, { useState } from 'react';
import { 
  Download, 
  Printer, 
  Copy, 
  Check, 
  IdCard, 
  Calendar, 
  MapPin, 
  BookOpen, 
  Building2, 
  Users, 
  Mail, 
  Award, 
  GraduationCap, 
  Shield, 
  Sparkles, 
  UserCheck 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { MOCK_ALL_STUDENTS, MOCK_USERS } from '../../services/mockData';
import { Utils } from '../../utils/utils';

export const StudentProfile: React.FC = () => {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  // Look up student details from MOCK_ALL_STUDENTS and MOCK_USERS for full fidelity
  const studentDetail = (MOCK_ALL_STUDENTS as any[]).find(s => s.studentId === user?.studentId) 
    || (MOCK_USERS as any[]).find(u => u.studentId === user?.studentId || u.id === user?.id);

  // Required 5 fields
  const fullName = user?.fullName || user?.name || studentDetail?.name || 'Chưa cập nhật';
  const studentId = user?.studentId || studentDetail?.studentId || 'Chưa cập nhật';
  
  // Format Date of Birth helper (DD/MM/YYYY)
  const rawDob = user?.dob || studentDetail?.dob;
  const formatDob = (dobStr?: string): string => {
    if (!dobStr) return 'Chưa cập nhật';
    const trimmed = dobStr.trim();
    if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(trimmed)) {
      const parts = trimmed.split('/');
      return `${parts[0].padStart(2, '0')}/${parts[1].padStart(2, '0')}/${parts[2]}`;
    }
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
      const [y, m, d] = trimmed.split('-');
      return `${d}/${m}/${y}`;
    }
    return trimmed;
  };
  const dob = formatDob(rawDob);

  const major = user?.major || studentDetail?.majorName || studentDetail?.major || 'Chưa cập nhật';
  const hometown = user?.hometown || studentDetail?.hometown || 'Chưa cập nhật';

  // Preserved fields where available
  const faculty = user?.faculty || studentDetail?.faculty || 'Khoa Công nghệ & Quản trị số';
  const className = user?.class || studentDetail?.class || 'Chưa cập nhật';
  const cohort = user?.cohort || studentDetail?.cohort || 'Khóa 25 (2022 - 2026)';
  const trainingType = user?.trainingType || studentDetail?.trainingType || 'Chính quy';
  const email = user?.email || studentDetail?.email || 'Chưa cập nhật';
  const advisorName = user?.advisorName || studentDetail?.advisorName || 'Chưa cập nhật';
  const status = user?.status || studentDetail?.status || 'Đang theo học (Bình thường)';
  const avatarUrl = user?.avatar || studentDetail?.avatar || "/assets/images/default-avatar.png";

  const handleCopyStudentId = (id: string) => {
    if (!id || id === 'Chưa cập nhật') return;
    navigator.clipboard.writeText(id).then(() => {
      setCopied(true);
      Utils.showToast(`Đã sao chép MSSV (${id}) vào bộ nhớ tạm!`, 'success');
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      Utils.showToast('Không thể sao chép MSSV', 'warning');
    });
  };

  const handleExportTranscript = () => {
    Utils.showToast('Đang tạo và tải xuống bản trích lục thẻ sinh viên điện tử (PDF)...', 'info');
    setTimeout(() => {
      Utils.showToast('Đã tải xuống hồ sơ thẻ sinh viên điện tử!', 'success');
    }, 600);
  };

  return (
    <div style={{ paddingBottom: '32px' }}>
      {/* Top Action Utility Buttons */}
      <div className="d-flex justify-end gap-2 mb-4 flex-wrap" style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
        <button type="button" className="btn btn-primary btn-sm" onClick={handleExportTranscript}>
          <Download size={14} />
          <span>Xuất thẻ sinh viên (PDF)</span>
        </button>
        <button type="button" className="btn btn-secondary btn-sm" onClick={() => window.print()}>
          <Printer size={14} />
          <span>In thẻ sinh viên</span>
        </button>
      </div>

      {/* Primary Visual Focus: Full-Width Digital Student Pass / ID Card */}
      <div className="digital-student-pass-card">
        {/* Card Header */}
        <div className="card-top-bar">
          <div className="d-flex items-center gap-2" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <IdCard size={18} className="text-primary" />
            <h2 className="font-bold text-sm uppercase letter-wide" style={{ letterSpacing: '0.06em', color: 'var(--text-primary, #17243A)', margin: 0 }}>
              THẺ SINH VIÊN ĐIỆN TỬ
            </h2>
          </div>
          <div className="badge badge-primary font-mono text-xs font-semibold">
            APAG-VERIFIED
          </div>
        </div>

        {/* Card Body: Two-Row Balanced Grid Layout */}
        <div className="digital-student-pass-grid">
          {/* Row 1, Col 1 — APAG Brand Logo Card (Căn giữa cả ngang và dọc) */}
          <div className="student-logo-card">
            <img 
              src="/assets/images/apag-logo.png" 
              alt="APAG SIS Logo" 
              className="student-pass-apag-logo"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/assets/images/apag-logo.svg';
              }}
            />
          </div>

          {/* Row 1, Col 2 — Top 2 Horizontal Rows (4 Field Items: Họ tên, MSSV, Ngày sinh, Nơi sinh) */}
          <div className="profile-meta-top-grid">
            {/* Field 1: Họ và tên */}
            <div className="profile-field-item">
              <div className="profile-field-label">
                <UserCheck size={14} />
                <span>Họ và tên</span>
              </div>
              <div className="profile-field-value">
                {fullName}
              </div>
            </div>

            {/* Field 2: Mã số sinh viên (MSSV) */}
            <div className="profile-field-item">
              <div className="profile-field-label">
                <IdCard size={14} />
                <span>Mã số sinh viên (MSSV)</span>
              </div>
              <div className="profile-field-value font-mono">
                {studentId}
              </div>
            </div>

            {/* Field 3: Ngày sinh */}
            <div className="profile-field-item">
              <div className="profile-field-label">
                <Calendar size={14} />
                <span>Ngày sinh</span>
              </div>
              <div className="profile-field-value">
                {dob}
              </div>
            </div>

            {/* Field 4: Nơi sinh */}
            <div className="profile-field-item">
              <div className="profile-field-label">
                <MapPin size={14} />
                <span>Nơi sinh</span>
              </div>
              <div className="profile-field-value">
                {hometown}
              </div>
            </div>
          </div>

          {/* Row 2, Col 1 — Thẻ sinh viên Trần Mạnh Hà (Lùi xuống ngang hàng với 4 card ngang dưới) */}
          <div className="student-identity-col">
            <div className="student-avatar-wrapper">
              <img 
                src={avatarUrl} 
                alt={fullName} 
                className="student-avatar-img"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/images/default-avatar.png';
                }}
              />
              <span className="student-avatar-status" title="Tài khoản đang hoạt động"></span>
            </div>

            <h1 className="student-primary-name">
              {fullName}
            </h1>

            <div className="student-id-badge-row">
              <span style={{ color: 'var(--text-secondary, #64748B)', fontWeight: 500 }}>MSSV:</span>
              <span>{studentId}</span>
              <button 
                type="button" 
                className="student-id-copy-btn" 
                onClick={() => handleCopyStudentId(studentId)}
                title="Sao chép MSSV"
                aria-label="Sao chép mã số sinh viên"
              >
                {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
              </button>
            </div>

            <div className="student-identity-badges">
              <span className="badge badge-success badge-xs font-semibold">{trainingType}</span>
              <span className="badge badge-outline badge-xs font-semibold">{cohort}</span>
              <span className="badge badge-primary badge-xs font-semibold">{className}</span>
            </div>

            <div className="student-security-seal">
              <Shield size={13} className="text-primary" />
              <span>APAG SIS · Hệ thống cố vấn thông minh</span>
            </div>
          </div>

          {/* Row 2, Col 2 — Bottom 4 Horizontal Rows (8 Field Items) */}
          <div className="profile-meta-bottom-grid">
            {/* Field 5: Ngành đào tạo */}
            <div className="profile-field-item">
              <div className="profile-field-label">
                <BookOpen size={14} />
                <span>Ngành đào tạo</span>
              </div>
              <div className="profile-field-value highlight-primary">
                {major}
              </div>
            </div>

            {/* Field 6: Khoa chuyên môn */}
            <div className="profile-field-item">
              <div className="profile-field-label">
                <Building2 size={14} />
                <span>Khoa chuyên môn</span>
              </div>
              <div className="profile-field-value">
                {faculty}
              </div>
            </div>

            {/* Field 7: Lớp sinh hoạt */}
            <div className="profile-field-item">
              <div className="profile-field-label">
                <Users size={14} />
                <span>Lớp sinh hoạt</span>
              </div>
              <div className="profile-field-value font-mono">
                {className}
              </div>
            </div>

            {/* Field 8: Email học viên */}
            <div className="profile-field-item">
              <div className="profile-field-label">
                <Mail size={14} />
                <span>Email học viên</span>
              </div>
              <div className="profile-field-value font-mono" style={{ fontSize: '0.875rem' }}>
                {email}
              </div>
            </div>

            {/* Field 9: Khóa học */}
            <div className="profile-field-item">
              <div className="profile-field-label">
                <Award size={14} />
                <span>Khóa tuyển sinh</span>
              </div>
              <div className="profile-field-value">
                {cohort}
              </div>
            </div>

            {/* Field 10: Hình thức đào tạo */}
            <div className="profile-field-item">
              <div className="profile-field-label">
                <GraduationCap size={14} />
                <span>Hình thức đào tạo</span>
              </div>
              <div className="profile-field-value">
                {trainingType}
              </div>
            </div>

            {/* Field 11: Cố vấn học tập */}
            <div className="profile-field-item">
              <div className="profile-field-label">
                <Shield size={14} />
                <span>Cố vấn học tập</span>
              </div>
              <div className="profile-field-value">
                {advisorName}
              </div>
            </div>

            {/* Field 12: Tình trạng học vụ */}
            <div className="profile-field-item">
              <div className="profile-field-label">
                <Sparkles size={14} />
                <span>Tình trạng học vụ</span>
              </div>
              <div className="profile-field-value text-success">
                {status}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default StudentProfile;
