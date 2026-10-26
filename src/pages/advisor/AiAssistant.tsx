// ==========================================================================
// APAG Advisor AI Assistant Component (React + TypeScript)
// ==========================================================================

import React, { useState } from 'react';
import { Sparkles, Mail, Send, Copy, Check, FileText } from 'lucide-react';
import { Utils } from '../../utils/utils';

export const AdvisorAiAssistant: React.FC = () => {
  const [studentName, setStudentName] = useState('Phạm Minh Đức');
  const [studentGpa, setStudentGpa] = useState('1.85');
  const [topic, setTopic] = useState('warning');
  const [generatedDraft, setGeneratedDraft] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    setTimeout(() => {
      let draft = '';
      if (topic === 'warning') {
        draft = `Kính gửi sinh viên ${studentName},\n\nThầy là TS. Nguyễn Năng Thành - Cố vấn học tập lớp 25HTTB01.\n\nTheo dữ liệu học vụ cập nhật mới nhất, điểm trung bình tích lũy (CPA) hiện tại của em đang ở mức ${studentGpa}/4.00, nằm trong ngưỡng nguy cơ bị cảnh báo học tập mức 2 theo Điều 24 Quy chế Đào tạo tín chỉ (QĐ 458/QĐ-HVHC).\n\nThầy đề nghị em có mặt tại Văn phòng Cố vấn học tập (Phòng 402, Nhà A1) vào 14h30 Thứ Ba tuần này để chúng ta cùng rà soát lại kết quả, tìm nguyên nhân và xây dựng kế hoạch đăng ký học phần lại cho kỳ tới nhằm cải thiện điểm số.\n\nChúc em sức khỏe và quyết tâm!\n\nTrân trọng,\nTS. Nguyễn Năng Thành\nCố vấn học tập Khoa CNTT & Quản trị số`;
      } else {
        draft = `Kính gửi sinh viên ${studentName},\n\nThầy biểu dương nỗ lực học tập của em trong học kỳ vừa qua với kết quả CPA đạt ${studentGpa}/4.00. Với thành tích này, em hoàn toàn đủ điều kiện đăng ký làm Khóa luận tốt nghiệp sớm.\n\nEm vui lòng lên văn phòng vào Thứ Năm để thầy hướng dẫn quy trình chọn đề tài và phân công giảng viên hướng dẫn.\n\nTrân trọng,\nTS. Nguyễn Năng Thành`;
      }
      setGeneratedDraft(draft);
      setIsGenerating(false);
      Utils.showToast('AI đã hoàn thành soạn thảo thư tư vấn!', 'success');
    }, 600);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedDraft);
    setCopied(true);
    Utils.showToast('Đã sao chép nội dung vào bộ nhớ tạm!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="ai-dedicated-page">
      <div className="dashboard-grid" style={{ alignItems: 'stretch' }}>
        {/* Left: Configuration Form */}
        <div className="grid-col-left" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="minimal-card mb-6" style={{ height: '100%', display: 'flex', flexDirection: 'column', marginBottom: 0 }}>
            <div className="card-header">
              <h2 className="card-title">1. Thông tin sinh viên & Mục tiêu tư vấn</h2>
            </div>
            <div className="card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                <div>
                  <div className="form-group mb-3">
                    <label className="form-label text-xs font-semibold">Tên sinh viên:</label>
                    <input 
                      type="text" 
                      className="form-control"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group mb-3">
                    <label className="form-label text-xs font-semibold">CPA hiện tại:</label>
                    <input 
                      type="text" 
                      className="form-control"
                      value={studentGpa}
                      onChange={(e) => setStudentGpa(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group mb-4">
                    <label className="form-label text-xs font-semibold">Mục đích thư:</label>
                    <select 
                      className="form-control"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                    >
                      <option value="warning">Thư nhắc nhở & Triệu tập cảnh báo học tập</option>
                      <option value="praise">Thư biểu dương & Hướng dẫn làm Khóa luận tốt nghiệp</option>
                    </select>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary w-full" disabled={isGenerating} style={{ width: '100%', justifyContent: 'center' }}>
                  <Sparkles size={16} />
                  <span>{isGenerating ? 'AI đang soạn thảo...' : 'Tạo thư tư vấn tự động'}</span>
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Right: Generated Output */}
        <div className="grid-col-right" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="minimal-card mb-6" style={{ height: '100%', display: 'flex', flexDirection: 'column', marginBottom: 0 }}>
            <div className="card-header d-flex justify-between items-center" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <h2 className="card-title">2. Bản thảo thư tư vấn đề xuất</h2>
              {generatedDraft && (
                <button type="button" className="btn btn-secondary btn-xs" onClick={handleCopy}>
                  {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
                  <span>{copied ? 'Đã sao chép' : 'Sao chép thư'}</span>
                </button>
              )}
            </div>
            <div className="card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              {generatedDraft ? (
                <textarea 
                  className="form-control" 
                  rows={14} 
                  value={generatedDraft}
                  onChange={(e) => setGeneratedDraft(e.target.value)}
                  style={{ flex: 1, minHeight: '220px', width: '100%', fontSize: '0.8125rem', lineHeight: '1.6', resize: 'vertical' }}
                />
              ) : (
                <div className="text-center text-muted" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '32px 0' }}>
                  <Mail size={32} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
                  <div>Điền thông tin và bấm "Tạo thư tư vấn tự động" để AI tạo bản thảo chuẩn quy chế.</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
