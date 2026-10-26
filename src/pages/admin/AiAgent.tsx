// ==========================================================================
// APAG Admin AI Agent Controller (React + TypeScript)
// 100% Fidelity with original pages/admin/ai-agent.html & js/admin/ai-agent.js
// ==========================================================================

import React, { useState } from 'react';
import { Save, Loader2 } from 'lucide-react';
import { Utils } from '../../utils/utils';

export const AdminAiAgent: React.FC = () => {
  const [model, setModel] = useState('gemini-1.5-pro');
  const [topK, setTopK] = useState(5);
  const [temperature, setTemperature] = useState(0.2);
  const [systemPrompt, setSystemPrompt] = useState(
`Bạn là "APAG SIS Advisor" - Trợ lý ảo thuộc hệ thống APAG SIS (Hệ thống cố vấn thông minh) của Học viện Hành chính và Quản trị công.
Nguyên tắc hoạt động bắt buộc:
1. Mọi câu trả lời về quy chế, cảnh báo, tốt nghiệp PHẢI trích dẫn chính xác điều khoản trong Quyết định 458/QĐ-HVHC hoặc CTĐT liên quan.
2. Kiểm tra chặt chẽ điều kiện tiên quyết và tiến độ tích lũy tín chỉ của sinh viên trước khi đưa ra gợi ý lộ trình.
3. Khi thông tin không chắc chắn hoặc sinh viên yêu cầu ngoại lệ học vụ, BẮT BUỘC hiển thị gợi ý chuyển tiếp câu hỏi tới Cố vấn học tập trực tiếp.
4. Tuyệt đối không thay thế quyết định hành chính chính thức của Cố vấn học tập hoặc Phòng Quản lý Đào tạo.`
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      localStorage.setItem('apag_ai_config', JSON.stringify({
        model,
        topK,
        temperature,
        systemPrompt
      }));
      Utils.showToast('Đã lưu cấu hình AI Academic Agent thành công!', 'success');
    }, 600);
  };

  return (
    <div className="ai-dedicated-page">
      {/* Top Action Button */}
      <div className="d-flex justify-end mb-4" style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button 
          type="button" 
          className="btn btn-primary btn-sm" 
          id="btnSaveAiConfig"
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? <Loader2 size={14} className="spin" /> : <Save size={14} />}
          <span>{isSaving ? 'Đang lưu...' : 'Lưu cấu hình AI'}</span>
        </button>
      </div>

      <div className="space-y-6">
        {/* Card 1: Model & Inference Parameters */}
        <div className="minimal-card p-6">
          <h2 className="text-base font-bold mb-4">1. Mô hình & Thông số suy luận</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="form-group">
              <label className="form-label text-xs font-semibold">Mô hình AI</label>
              <select 
                className="form-control" 
                id="modelSelect"
                value={model}
                onChange={e => setModel(e.target.value)}
              >
                <option value="gemini-1.5-pro">Google Gemini 1.5 Pro (Khuyến nghị)</option>
                <option value="gemini-1.5-flash">Google Gemini 1.5 Flash (Tốc độ cao)</option>
                <option value="gpt-4o">OpenAI GPT-4o</option>
                <option value="local-rag">Mô hình AI RAG cục bộ APAG</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label text-xs font-semibold">Số phân đoạn truy xuất</label>
              <input 
                type="number" 
                className="form-control" 
                value={topK} 
                onChange={e => setTopK(parseInt(e.target.value) || 5)}
                min="1" 
                max="10" 
              />
            </div>
          </div>

          <div className="form-group mb-0">
            <label className="form-label d-flex justify-between text-xs font-semibold">
              <span>Độ sáng tạo (Temperature: {temperature.toFixed(2)} - Độ chính xác quy chế cao)</span>
              <span className="text-muted">{temperature.toFixed(1)}</span>
            </label>
            <input 
              type="range" 
              className="form-range w-full" 
              min="0" 
              max="1" 
              step="0.05" 
              value={temperature}
              onChange={e => setTemperature(parseFloat(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>
        </div>

        {/* Card 2: System Prompt - Elongated and spacious for readability */}
        <div className="minimal-card p-6">
          <div className="d-flex justify-between items-center mb-3 flex-wrap gap-2">
            <div>
              <h2 className="text-base font-bold">2. Cấu hình chỉ thị hệ thống cho AI Agent</h2>
            </div>
            <span className="badge badge-primary font-mono text-xs">Chỉ thị cốt lõi</span>
          </div>

          <div className="form-group mb-2">
            <textarea 
              className="form-control font-mono text-xs" 
              rows={12} 
              id="systemPromptInput"
              value={systemPrompt}
              onChange={e => setSystemPrompt(e.target.value)}
              style={{ 
                minHeight: '260px', 
                width: '100%',
                lineHeight: '1.7', 
                padding: '14px 16px',
                fontSize: '0.84rem',
                resize: 'vertical'
              }}
              placeholder="Nhập chỉ thị hệ thống chi tiết cho AI Agent..."
            />
          </div>
          <div className="d-flex justify-between items-center text-xs text-muted pt-1">
            <span>Độ dài: {systemPrompt.length} ký tự (khoảng {Math.round(systemPrompt.length / 4)} tokens)</span>
            <span>Tự động chèn vào ngữ cảnh khi gọi AI</span>
          </div>
        </div>
      </div>
    </div>
  );
};
