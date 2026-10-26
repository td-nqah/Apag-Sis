// ==========================================================================
// APAG Student AI Assistant Page Component (React + TypeScript)
// Full-Screen Academic Advisor RAG Interface
// ==========================================================================

import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Bot, Send, Info } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const StudentAiAssistant: React.FC = () => {
  const { user } = useAuth();
  const [inputVal, setInputVal] = useState('');
  const [messages, setMessages] = useState<any[]>([
    {
      id: '1',
      sender: 'ai',
      text: `Xin chào ${user?.fullName || user?.name || 'sinh viên'}! Tôi là Trợ lý học thuật AI APAG SIS (Hệ thống cố vấn thông minh) được tích hợp cơ chế Retrieval-Augmented Generation (RAG) dựa trên Hệ thống Quy chế Đào tạo Học viện (QĐ 458/QĐ-HVHC).\n\nTôi có thể hỗ trợ bạn:\n• Kiểm tra chuẩn tốt nghiệp và điều kiện nhận Khóa luận tốt nghiệp.\n• Tư vấn lựa chọn học phần tự chọn phù hợp với định hướng nghề nghiệp.\n• Giải đáp thắc mắc về học phí, miễn giảm, kế hoạch học tập và lịch thi.\n\n*Lưu ý: Trợ lý học thuật AI cung cấp thông tin tham khảo và khuyến nghị dựa trên quy chế đào tạo; quyết định học vụ cuối cùng thuộc thẩm quyền Cố vấn học tập, Khoa và Phòng Quản lý Đào tạo. Sinh viên nên trao đổi với Cố vấn học tập để xác nhận kế hoạch học tập.*`,
      time: '08:00'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length > 1 || isTyping) {
      scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSend = (textToSend?: string) => {
    const q = (textToSend || inputVal).trim();
    if (!q) return;

    const userMsg = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: q,
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    setTimeout(() => {
      let ans = `Căn cứ theo Điều 18 và Điều 24 Quy chế Đào tạo tín chỉ Học viện (QĐ 458/QĐ-HVHC), sinh viên cần lưu ý:\n1. Tích lũy tối thiểu 14 tín chỉ mỗi học kỳ chính để đảm bảo tiến độ chuẩn.\n2. Duy trì điểm trung bình tích lũy CPA >= 2.00 để không rơi vào diện cảnh báo học tập mức 1.\n3. Hoàn thành toàn bộ học phần điều kiện (GDQP-AN, GDTC, Chuẩn Tiếng Anh B1) trước thời điểm xét tốt nghiệp.`;
      let citations = [{ docCode: 'QĐ 458/QĐ-HVHC', article: 'Điều 18 & 24', content: 'Quy chế đào tạo đại học chính quy' }];

      if (q.includes('tốt nghiệp') || q.includes('chuẩn')) {
        ans = `Theo kết quả thẩm định hồ sơ của bạn:\n• Tổng tín chỉ đã đạt: 72 / 130 TC (Đạt 55.4%).\n• CPA hiện tại: 3.24 (Xếp loại Giỏi).\n• Điều kiện phi tín chỉ: Đã hoàn thành Tiếng Anh B1 và GDQP-AN.\n• Bạn dự kiến sẽ đủ điều kiện làm Khóa luận tốt nghiệp vào Học kỳ 8 (Tháng 06/2026).`;
      }

      setMessages(prev => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: ans,
          citations,
          time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsTyping(false);
    }, 600);
  };

  const samplePrompts = [
    'Điều kiện nhận Khóa luận tốt nghiệp K25 là gì?',
    'Học phần CNTT201 là điều kiện tiên quyết cho những học phần nào?',
    'Quy định về việc rút bớt học phần đã đăng ký',
    'Chuẩn đầu ra Tiếng Anh B1 có thời hạn bao lâu?'
  ];

  return (
    <div className="ai-dedicated-page" style={{ height: 'calc(100vh - 90px)', display: 'flex', flexDirection: 'column' }}>
      <div className="minimal-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
        {/* Sample chips */}
        <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--surface-subtle)', display: 'flex', gap: '8px', overflowX: 'auto', flexShrink: 0 }}>
          {samplePrompts.map((p, idx) => (
            <button 
              key={idx} 
              type="button" 
              className="quick-chip"
              onClick={() => handleSend(p)}
              style={{ whiteSpace: 'nowrap' }}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Messages Stream Viewport with Diagonal Watermark */}
        <div className="ai-conversation-viewport" style={{ flex: 1, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          {/* Subtle Diagonal APAG Logo Watermark */}
          <div className="ai-watermark-layer" aria-hidden="true">
            <img 
              src="/assets/images/apag-logo.png" 
              alt="" 
              className="ai-watermark-logo"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/assets/images/apag-logo.svg';
              }}
            />
          </div>

          {/* Messages Stream */}
          <div 
            className="ai-messages-scroll"
            style={{ 
              flex: 1,
              overflowY: 'auto',
              padding: '24px 28px', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '16px' 
            }}
          >
            {messages.map(m => (
              <div 
                key={m.id} 
                style={{ 
                  display: 'flex', 
                  justifyContent: m.sender === 'user' ? 'flex-end' : 'flex-start',
                  width: '100%'
                }}
              >
                <div 
                  style={{ 
                    maxWidth: '82%', 
                    padding: '14px 18px', 
                    borderRadius: m.sender === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                    background: m.sender === 'user' ? '#2563EB' : 'var(--surface-subtle)',
                    color: m.sender === 'user' ? '#FFFFFF' : 'var(--text-primary)',
                    border: m.sender === 'user' ? 'none' : '1px solid var(--border)',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    whiteSpace: 'pre-line',
                    fontSize: '0.875rem',
                    lineHeight: 1.6
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <div style={{ width: '22px', height: '22px', borderRadius: '6px', background: m.sender === 'user' ? 'rgba(255,255,255,0.25)' : 'linear-gradient(135deg, #2563EB, #7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                      {m.sender === 'user' ? <span style={{ fontSize: '11px', fontWeight: 700 }}>SV</span> : <Bot size={13} />}
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: m.sender === 'user' ? 'rgba(255,255,255,0.9)' : 'var(--text-secondary)' }}>
                      {m.sender === 'user' ? 'Bạn' : 'APAG SIS · Trợ lý Cố vấn Học vụ'}
                    </span>
                  </div>
                  <div>{m.text}</div>
                  {m.citations && (
                    <div style={{ marginTop: '10px', padding: '8px 10px', background: 'rgba(37,99,235,0.08)', borderRadius: '6px', fontSize: '0.75rem', color: '#1D4ED8', border: '1px solid rgba(37,99,235,0.15)' }}>
                      <strong>Trích dẫn quy chế:</strong> {m.citations[0].docCode} ({m.citations[0].article})
                    </div>
                  )}
                  <div style={{ fontSize: '0.6875rem', marginTop: '8px', textAlign: m.sender === 'user' ? 'right' : 'left', opacity: 0.65 }}>
                    {m.time}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{ padding: '10px 14px', borderRadius: '12px', background: 'var(--surface-subtle)', border: '1px solid var(--border)', fontSize: '0.8125rem', color: 'var(--text-muted)', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={14} className="text-primary" />
                  <span>AI đang truy hồi tri thức RAG và phân tích dữ liệu...</span>
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>
        </div>

        {/* Input Bar */}
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          style={{ padding: '14px 18px', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: '10px', background: 'var(--surface)', flexShrink: 0 }}
        >
          <input 
            type="text" 
            className="form-control"
            placeholder="Đặt câu hỏi về quy chế, chương trình đào tạo, chuẩn đầu ra..." 
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            style={{ flex: 1 }}
          />
          <button type="submit" className="btn btn-primary" disabled={!inputVal.trim() || isTyping}>
            <Send size={16} />
            <span>Gửi</span>
          </button>
        </form>
        <div style={{ padding: '6px 18px 10px', fontSize: '0.6875rem', color: 'var(--text-muted)', textAlign: 'center', background: 'var(--surface)' }}>
          Trợ lý học thuật AI cung cấp thông tin tham khảo; quyết định học vụ cuối cùng thuộc thẩm quyền Cố vấn học tập, Khoa và Phòng Quản lý Đào tạo.
        </div>
      </div>
    </div>
  );
};
