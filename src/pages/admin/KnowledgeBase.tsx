// ==========================================================================
// APAG Admin Knowledge Base (RAG) Controller (React + TypeScript)
// 100% Fidelity with original pages/admin/knowledge-base.html & js/admin/knowledge-base.js
// ==========================================================================

import React, { useState } from 'react';
import { RefreshCw, Search, Loader2, Check } from 'lucide-react';
import { Utils } from '../../utils/utils';

interface RagChunk {
  docCode: string;
  article: string;
  score: number;
  content: string;
}

export const AdminKnowledgeBase: React.FC = () => {
  const [query, setQuery] = useState('Điều kiện công nhận tốt nghiệp đại học chính quy là gì?');
  const [isSearching, setIsSearching] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const [results, setResults] = useState<RagChunk[]>([
    {
      docCode: 'QĐ 458/QĐ-HVHC',
      article: 'Điều 18: Điều kiện xét và công nhận tốt nghiệp',
      score: 0.94,
      content: 'Sinh viên được công nhận tốt nghiệp khi đáp ứng các điều kiện: (1) Tích lũy tối thiểu 130 tín chỉ theo đúng khung CTĐT; (2) Điểm trung bình tích lũy (CPA) toàn khóa đạt từ 2.00 trở lên; (3) Hoàn thành đầy đủ chuẩn đầu ra ngoại ngữ B1, GDQP-AN, GDTC; (4) Không bị kỷ luật ở mức đình chỉ học tập tại thời điểm xét tốt nghiệp.'
    },
    {
      docCode: 'QĐ 458/QĐ-HVHC',
      article: 'Điều 19: Xếp loại tốt nghiệp',
      score: 0.88,
      content: 'Hạng tốt nghiệp được xác định theo điểm trung bình chung tích lũy toàn khóa: Xuất sắc: CPA từ 3.60 - 4.00; Giỏi: CPA từ 3.20 - 3.59; Khá: CPA từ 2.50 - 3.19; Trung bình: CPA từ 2.00 - 2.49. Hạng tốt nghiệp của sinh viên có điểm thi lại hoặc học lại vượt quá 5% tổng số tín chỉ sẽ bị hạ một bậc.'
    },
    {
      docCode: 'QĐ 120/QĐ-HVHC',
      article: 'Quy định chuẩn đầu ra Ngoại ngữ & Tin học',
      score: 0.81,
      content: 'Sinh viên chính quy ngành Hệ thống thông tin và Quản trị công phải đạt chứng chỉ ngoại ngữ tương đương bậc 3/6 theo Khung năng lực ngoại ngữ Việt Nam (VSTEP B1 hoặc TOEIC 450, IELTS 4.5) trước khi đăng ký học phần Khóa luận hoặc Thực tập tốt nghiệp.'
    }
  ]);

  const handleSearch = () => {
    if (!query.trim()) return;
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      // Filter or generate dummy matches based on query
      setResults([
        {
          docCode: 'QĐ 458/QĐ-HVHC',
          article: 'Điều 18: Điều kiện xét và công nhận tốt nghiệp',
          score: 0.95,
          content: 'Sinh viên được công nhận tốt nghiệp khi đáp ứng các điều kiện: (1) Tích lũy tối thiểu 130 tín chỉ theo đúng khung CTĐT; (2) Điểm trung bình tích lũy (CPA) toàn khóa đạt từ 2.00 trở lên; (3) Hoàn thành đầy đủ chuẩn đầu ra ngoại ngữ B1, GDQP-AN, GDTC; (4) Không bị kỷ luật ở mức đình chỉ học tập tại thời điểm xét tốt nghiệp.'
        },
        {
          docCode: 'QĐ 458/QĐ-HVHC',
          article: 'Điều 14: Cảnh báo kết quả học tập & Xử lý học vụ theo quy định',
          score: 0.84,
          content: 'Cảnh báo học vụ được xử lý theo từng học kỳ nếu ĐTBCHK < 0.8 (kỳ đầu), < 1.0 (kỳ tiếp theo); hoặc ĐTBCTL < 1.20 (năm 1), < 1.40 (năm 2), < 1.60 (năm 3)...'
        },
        {
          docCode: 'QĐ 458/QĐ-HVHC',
          article: 'Điều 10: Đăng ký học phần và Điều kiện tiên quyết',
          score: 0.79,
          content: 'Sinh viên chỉ được đăng ký học phần B khi đã tích lũy (điểm >= 2.0) học phần A tiên quyết. Khối lượng đăng ký tối thiểu 14 TC/kỳ, tối đa 24 TC/kỳ đối với sinh viên khá/giỏi.'
        }
      ]);
    }, 600);
  };

  const handleSyncRag = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      Utils.showToast('Cơ sở tri thức RAG đã được cập nhật thành công (28 chunks)!', 'success');
    }, 1000);
  };

  return (
    <div>
      {/* Top Action Button */}
      <div className="d-flex justify-end mb-4" style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button 
          type="button" 
          className="btn btn-primary btn-sm" 
          id="btnSyncRag"
          onClick={handleSyncRag}
          disabled={isSyncing}
        >
          {isSyncing ? <Loader2 size={14} className="spin" /> : <RefreshCw size={14} />}
          <span>{isSyncing ? 'Đang xử lý vector...' : 'Đồng bộ hóa & Vector hóa lại'}</span>
        </button>
      </div>

      {/* 3 Metric Cards - Equal width and height on 1 row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div className="minimal-card p-4" style={{ height: '100%', minHeight: '96px', display: 'flex', flexDirection: 'column', justifyContent: 'center', marginBottom: 0 }}>
          <div className="text-xs text-muted mb-1">Văn bản đã nạp</div>
          <div className="text-xl font-bold">3 văn bản</div>
          <div className="text-xs text-success mt-1">100% đã lập chỉ mục</div>
        </div>
        <div className="minimal-card p-4" style={{ height: '100%', minHeight: '96px', display: 'flex', flexDirection: 'column', justifyContent: 'center', marginBottom: 0 }}>
          <div className="text-xs text-muted mb-1">Tổng số phân đoạn</div>
          <div className="text-xl font-bold text-primary">28 phân đoạn</div>
          <div className="text-xs text-muted mt-1">Kích thước phân đoạn: ~300 tokens</div>
        </div>
        <div className="minimal-card p-4" style={{ height: '100%', minHeight: '96px', display: 'flex', flexDirection: 'column', justifyContent: 'center', marginBottom: 0 }}>
          <div className="text-xs text-muted mb-1">Chiều vector</div>
          <div className="text-xl font-bold text-success">1536 chiều</div>
          <div className="text-xs text-muted mt-1">Tương thích cơ sở dữ liệu vector</div>
        </div>
      </div>

      {/* RAG Sandbox Test */}
      <div className="minimal-card mb-6 p-6">
        <h2 className="text-base font-bold mb-4">Thử nghiệm truy xuất ngữ nghĩa</h2>
        
        <div className="d-flex gap-2 mb-4 flex-wrap">
          <input 
            type="text" 
            id="ragTestQuery" 
            className="form-control flex-1" 
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Nhập câu truy vấn thử nghiệm..."
            style={{ minWidth: '280px' }}
          />
          <button 
            type="button" 
            className="btn btn-primary" 
            id="btnRunRagTest"
            onClick={handleSearch}
            disabled={isSearching}
          >
            {isSearching ? <Loader2 size={15} className="spin" /> : <Search size={15} />}
            <span>{isSearching ? 'Đang truy xuất...' : 'Thử nghiệm truy xuất'}</span>
          </button>
        </div>

        <div id="ragTestResults" className="space-y-3">
          {isSearching ? (
            <div className="text-xs text-muted py-2 d-flex items-center gap-2">
              <Loader2 size={14} className="spin" />
              <span>Đang truy xuất ngữ nghĩa...</span>
            </div>
          ) : results.length === 0 ? (
            <div className="p-4 border rounded text-xs text-muted">
              Không tìm thấy phân đoạn khớp. Thử từ khóa khác.
            </div>
          ) : (
            results.map((c, i) => (
              <div key={i} className="p-3 bg-subtle rounded border">
                <div className="d-flex justify-between items-center mb-1 flex-wrap gap-2">
                  <span className="font-bold text-xs text-main">
                    #{i + 1}. [{c.docCode}] {c.article}
                  </span>
                  <span className="badge badge-success font-mono">
                    Độ tương đồng: {c.score.toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-secondary mt-1 leading-relaxed">
                  {c.content}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
