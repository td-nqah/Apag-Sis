// ==========================================================================
// APAG Advisor Learning Paths Review Component (React + TypeScript)
// Exact 1:1 Restoration matching pages/advisor/learning-paths.html & js/advisor/learning-paths.js
// ==========================================================================

import React, { useState } from 'react';
import { Check, CheckCheck } from 'lucide-react';
import { Utils } from '../../utils/utils';

export const AdvisorLearningPaths: React.FC = () => {
  const [approvedHa, setApprovedHa] = useState(false);
  const [approvedBao, setApprovedBao] = useState(false);

  const handleApproveHa = () => {
    setApprovedHa(true);
    Utils.showToast('Đã phê duyệt lộ trình của sinh viên Trần Mạnh Hà (2505HTTB001).', 'success');
  };

  const handleReviseHa = () => {
    Utils.showToast('Đã gửi phản hồi yêu cầu sinh viên điều chỉnh lại học phần.', 'info');
  };

  const handleApproveBao = () => {
    setApprovedBao(true);
    Utils.showToast('Đã duyệt lộ trình có điều kiện cho sinh viên Lê Quốc Bảo.', 'info');
  };

  return (
    <div>
      <div className="space-y-6">
        {/* Pending Approval Card 1: Trần Mạnh Hà */}
        <div className="minimal-card p-5" id="approvalCardHa">
          <div className="d-flex justify-between items-start flex-wrap gap-4 mb-4" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="d-flex items-center gap-2 mb-1" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 className="text-base font-bold">Trần Mạnh Hà (2505HTTB001)</h2>
                <span className={`badge ${approvedHa ? 'badge-success' : 'badge-warning'}`}>
                  {approvedHa ? 'Đã phê duyệt' : 'Đang chờ duyệt'}
                </span>
              </div>
              <p className="text-xs text-muted">
                Đã tích lũy: 72/130 TC · GPA: 3.24 · Đề xuất lộ trình HK2: 16 tín chỉ
              </p>
            </div>
            <div className="d-flex gap-2" style={{ display: 'flex', gap: '8px' }}>
              {!approvedHa ? (
                <>
                  <button type="button" className="btn btn-outline btn-sm" onClick={handleReviseHa}>
                    Yêu cầu sửa đổi
                  </button>
                  <button type="button" className="btn btn-primary btn-sm" onClick={handleApproveHa}>
                    <Check size={14} />
                    <span>Phê duyệt lộ trình</span>
                  </button>
                </>
              ) : (
                <button type="button" className="btn btn-secondary btn-sm" disabled>
                  <CheckCheck size={14} />
                  <span>Đã phê duyệt</span>
                </button>
              )}
            </div>
          </div>

          <div className="p-4 rounded bg-subtle text-sm space-y-2">
            <div className="font-semibold text-main mb-2">Các học phần đề xuất cho HK2 (2024-2025):</div>
            <ul className="list-disc pl-5 text-secondary text-xs space-y-1" style={{ paddingLeft: '20px', lineHeight: '1.6' }}>
              <li><code>CNTT304</code> - Hệ thống thông tin quản lý hành chính (3 TC) · <span className="text-success font-medium">Tiên quyết hợp lệ</span></li>
              <li><code>CNTT305</code> - Phân tích và Thiết kế hệ thống (3 TC) · <span className="text-success font-medium">Tiên quyết hợp lệ</span></li>
              <li><code>CNTT306</code> - Trí tuệ nhân tạo căn bản (3 TC) · <span className="text-info font-medium">Bổ sung khối tự chọn thiếu hụt</span></li>
              <li><code>ENG202</code> - Tiếng Anh chuyên ngành 2 (3 TC) · <span className="text-success font-medium">Chuẩn đầu ra B2</span></li>
              <li><code>QLNN301</code> - Cải cách hành chính nhà nước (2 TC)</li>
              <li><code>PE202</code> - Giáo dục thể chất 4 (2 TC)</li>
            </ul>
            <div className="pt-2 text-xs text-muted" style={{ paddingTop: '8px' }}>
              🤖 <strong>AI Verifier:</strong> Không vi phạm điều kiện tiên quyết, tổng tải 16 TC phù hợp với sinh viên GPA 3.24 (tối đa 24 TC). Đạt chuẩn tốt nghiệp tháng 06/2026.
            </div>
          </div>
        </div>

        {/* Pending Approval Card 2: Lê Quốc Bảo */}
        <div className="minimal-card p-5" id="approvalCardBao">
          <div className="d-flex justify-between items-start flex-wrap gap-4 mb-4" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="d-flex items-center gap-2 mb-1" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 className="text-base font-bold">Lê Quốc Bảo (2505HTTB012)</h2>
                <span className={`badge ${approvedBao ? 'badge-success' : 'badge-warning'}`}>
                  {approvedBao ? 'Đã duyệt có điều kiện' : 'Đang chờ duyệt'}
                </span>
              </div>
              <p className="text-xs text-muted">
                Đã tích lũy: 58/130 TC · GPA: 2.18 · Đề xuất học cải thiện: 18 tín chỉ
              </p>
            </div>
            <div className="d-flex gap-2" style={{ display: 'flex', gap: '8px' }}>
              {!approvedBao ? (
                <button type="button" className="btn btn-primary btn-sm" onClick={handleApproveBao}>
                  <Check size={14} />
                  <span>Phê duyệt</span>
                </button>
              ) : (
                <button type="button" className="btn btn-secondary btn-sm" disabled>
                  Đã duyệt có điều kiện
                </button>
              )}
            </div>
          </div>

          <div className="p-3 bg-subtle rounded text-xs text-secondary">
            ⚠️ <strong>Cảnh báo từ AI:</strong> Sinh viên đang có GPA 2.18, đề xuất tích lũy 18 TC là mức tải cao. AI khuyến nghị chỉ nên học tối đa 14 TC để tập trung nâng điểm CPA lên trên 2.50.
          </div>
        </div>
      </div>
    </div>
  );
};
