// ==========================================================================
// APAG Admin Regulations Component (React + TypeScript)
// Standard Table Architecture matching system guidelines:
// - Header background #D9E1F2, bold, centered
// - Cells border 1px solid #000000, Serif font (Times New Roman / Georgia)
// - Cards border 1.5pt solid #000000
// ==========================================================================

import React, { useState } from 'react';
import { Upload, X, CheckCircle2, FileText, Download, Search } from 'lucide-react';
import { Utils } from '../../utils/utils';

interface RegulationItem {
  id: string;
  docCode: string;
  title: string;
  authority: string;
  effectiveFrom: string;
  keyArticles: string;
  ragChunks: number;
  type: string;
}

export const AdminRegulations: React.FC = () => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFileName, setUploadFileName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReg, setSelectedReg] = useState<RegulationItem | null>(null);

  const [regulations] = useState<RegulationItem[]>([
    {
      id: 'reg-1',
      docCode: 'QĐ 458/QĐ-HVHC',
      title: 'Quy chế đào tạo đại học chính quy theo hệ thống tín chỉ',
      authority: 'Giám đốc Học viện',
      effectiveFrom: 'Từ năm học 2022-2023',
      keyArticles: 'Điều 14 (Cảnh báo kết quả), Điều 18 (Điều kiện tốt nghiệp), Điều 10 (Học phần tiên quyết)',
      ragChunks: 14,
      type: 'Văn bản cốt lõi'
    },
    {
      id: 'reg-2',
      docCode: 'QĐ 120/QĐ-HVHC',
      title: 'Quy định chuẩn đầu ra Năng lực ngoại ngữ và Tin học K25',
      authority: 'Giám đốc Học viện',
      effectiveFrom: 'Khóa K23 trở về sau',
      keyArticles: 'Điều 4 (Chuẩn Ngoại ngữ VSTEP B1), Điều 6 (Chuẩn kỹ năng CNTT cơ bản)',
      ragChunks: 8,
      type: 'Chuẩn đầu ra'
    },
    {
      id: 'reg-3',
      docCode: 'HD 89/HD-HVHC',
      title: 'Hướng dẫn tổ chức thực tập và xét khóa luận tốt nghiệp cử nhân',
      authority: 'Phòng Quản lý Đào tạo',
      effectiveFrom: 'Khóa K22 - K26',
      keyArticles: 'Điều 3 (Điều kiện làm khóa luận CPA >= 3.0), Điều 5 (Đánh giá học phần thực tập 15 TC)',
      ragChunks: 6,
      type: 'Hướng dẫn thực hiện'
    }
  ]);

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFileName) return;
    setShowUploadModal(false);
    Utils.showToast(`Đã tải lên và bắt đầu phân đoạn văn bản "${uploadFileName}" vào hệ thống RAG!`, 'success');
    setUploadFileName('');
  };

  const filtered = regulations.filter(r => 
    r.docCode.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
    r.title.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
    r.type.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
      {/* Top Action Toolbar */}
      <div 
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '16px'
        }}
      >
          <div style={{ position: 'relative', width: '260px' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              className="form-control"
              placeholder="Tìm theo số hiệu, tên văn bản..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '30px', fontSize: '0.75rem', height: '32px' }}
            />
          </div>

          <button 
            type="button" 
            className="btn btn-primary btn-sm" 
            id="btnUploadRegulation"
            onClick={() => setShowUploadModal(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Upload size={14} />
            <span>Tải lên văn bản mới</span>
          </button>
        </div>

      {/* Table Card with 1.5pt solid black border */}
      <div 
        className="minimal-card"
        style={{
          border: '1px solid var(--border)',
          borderRadius: '10px',
          backgroundColor: 'var(--surface)',
          overflow: 'hidden',
          marginBottom: '24px'
        }}
      >
        <div className="table-responsive">
          <table className="minimal-table">
            <thead>
              <tr>
                <th style={{ width: '140px' }}>SỐ HIỆU VĂN BẢN</th>
                <th style={{ width: '280px' }}>TÊN VĂN BẢN QUY CHẾ & PHÁP QUY</th>
                <th style={{ width: '140px' }}>PHÂN LOẠI</th>
                <th style={{ width: '150px' }}>CƠ QUAN BAN HÀNH</th>
                <th style={{ width: '130px' }}>HIỆU LỰC</th>
                <th>CÁC ĐIỀU KHOẢN TRỌNG YẾU</th>
                <th style={{ width: '120px', textAlign: 'center' }}>CHỈ MỤC RAG</th>
                <th style={{ width: '120px', textAlign: 'center' }}>THAO TÁC</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                    Không tìm thấy văn bản quy chế nào phù hợp.
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.id}>
                    <td style={{ fontWeight: 600 }}>
                      <code>{r.docCode}</code>
                    </td>
                    <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                      {r.title}
                    </td>
                    <td>
                      <span>{r.type}</span>
                    </td>
                    <td>{r.authority}</td>
                    <td>{r.effectiveFrom}</td>
                    <td style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      {r.keyArticles}
                    </td>
                    <td style={{ textAlign: 'center', fontWeight: 600 }}>
                      {r.ragChunks} phân đoạn
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        type="button"
                        className="btn btn-outline btn-xs"
                        onClick={() => setSelectedReg(r)}
                        style={{ fontSize: '0.75rem', padding: '4px 10px', whiteSpace: 'nowrap' }}
                      >
                        Xem chi tiết
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div 
          className="modal-backdrop active" 
          style={{ 
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.45)',
            backdropFilter: 'blur(3px)',
            zIndex: 12000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowUploadModal(false);
          }}
        >
          <div 
            style={{ 
              maxWidth: '520px',
              width: '100%',
              backgroundColor: 'var(--surface)',
              borderRadius: '12px',
              border: '1px solid var(--border)',
              padding: '24px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                Tải lên văn bản quy chế đào tạo mới
              </h3>
              <button 
                type="button" 
                onClick={() => setShowUploadModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                    Tên văn bản / Số hiệu văn bản *
                  </label>
                  <input 
                    type="text" 
                    className="form-control"
                    placeholder="VD: Quyết định 520/QĐ-HVHC về học phí và học bổng"
                    value={uploadFileName}
                    onChange={e => setUploadFileName(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                    Tập tin đính kèm (PDF, DOCX) *
                  </label>
                  <input 
                    type="file" 
                    className="form-control"
                    accept=".pdf,.docx,.doc"
                    required
                  />
                </div>

                <div style={{ padding: '10px 12px', borderRadius: '8px', backgroundColor: 'var(--surface-subtle)', border: '1px solid var(--border)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  Văn bản sau khi tải lên sẽ tự động được phân đoạn và lập chỉ mục vào cơ sở dữ liệu vector của AI.
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setShowUploadModal(false)}>
                  Hủy bỏ
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Tải lên & Lập chỉ mục AI
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Regulation Detail Modal */}
      {selectedReg && (
        <div 
          className="modal-backdrop active" 
          style={{ 
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.45)',
            backdropFilter: 'blur(3px)',
            zIndex: 12000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedReg(null);
          }}
        >
          <div 
            style={{ 
              maxWidth: '620px',
              width: '100%',
              backgroundColor: 'var(--surface)',
              borderRadius: '12px',
              border: '1px solid var(--border)',
              padding: '24px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  {selectedReg.docCode}: {selectedReg.title}
                </h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  Cơ quan: {selectedReg.authority} • {selectedReg.effectiveFrom}
                </span>
              </div>
              <button 
                type="button" 
                onClick={() => setSelectedReg(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
              <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: 'var(--surface-subtle)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  Các điều khoản trọng yếu được trích xuất:
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {selectedReg.keyArticles}
                </div>
              </div>

              <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: 'var(--surface-subtle)', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Cơ sở tri thức RAG AI
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    Đã lập chỉ mục {selectedReg.ragChunks} phân đoạn vector hóa
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-secondary btn-xs"
                  onClick={() => Utils.showToast(`Đang tải file văn bản ${selectedReg.docCode}...`, 'info')}
                  style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <Download size={12} />
                  <span>Tải văn bản gốc</span>
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => setSelectedReg(null)}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRegulations;
