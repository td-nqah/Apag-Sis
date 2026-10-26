// ==========================================================================
// APAG Floating AI Chat Popup Widget (Modern Minimal Anchored Popover)
// Tích hợp tên sinh viên, chat nhanh một chạm và cơ sở tri thức RAG QĐ 458
// ==========================================================================

import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Sparkles, Bot, X, Send, BookOpen, Layers, Lightbulb } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  time: string;
  citations?: Array<{ docCode: string; article: string; content: string }>;
  actionSuggestions?: string[];
}

interface QuickPrompt {
  icon: string;
  label: string;
  query: string;
}

export const AiChatWidget: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [activeContext, setActiveContext] = useState<string | null>(null);

  // Ẩn hoàn toàn widget nổi trên các trang AI chuyên trách để tránh chồng chéo giao diện
  const isDedicatedAiPage = location.pathname.includes('/ai-assistant') || location.pathname.includes('/ai-agent');
  if (isDedicatedAiPage) {
    return null;
  }

  const studentName = user?.fullName || user?.name || 'Trần Mạnh Hà';

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-0',
      sender: 'ai',
      text: `Xin chào ${studentName}! Tôi là Trợ lý học thuật AI APAG SIS.\n\nTôi có thể hỗ trợ bạn kiểm tra tiến độ tích lũy 130 tín chỉ, thẩm định điều kiện tốt nghiệp, gợi ý học phần kỳ tới và giải đáp quy chế đào tạo (QĐ 458/QĐ-HVHC).\n\n*Lưu ý: Mọi thông tin do Trợ lý AI cung cấp chỉ mang tính chất tham khảo học thuật; quyết định học vụ chính thức thuộc thẩm quyền của Cố vấn học tập và Phòng Quản lý Đào tạo.*`,
      time: 'Vừa xong'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Đóng popup khi nhấn phím Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Lắng nghe sự kiện mở từ bên ngoài (e.g. từ Course Card "Hỏi AI cách cải thiện")
  useEffect(() => {
    const handleOpenAi = (e: any) => {
      setIsOpen(true);
      if (e.detail?.courseCode) {
        setActiveContext(`Học phần: ${e.detail.courseCode} - ${e.detail.courseName || ''}`);
        handleSend(`Làm sao để cải thiện điểm học phần ${e.detail.courseCode} (${e.detail.courseName || ''}) và cần chú ý điều kiện tiên quyết nào?`);
      } else if (e.detail?.query) {
        handleSend(e.detail.query);
      }
    };

    window.addEventListener('open-ai-drawer', handleOpenAi as EventListener);
    return () => window.removeEventListener('open-ai-drawer', handleOpenAi as EventListener);
  }, []);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = (queryText?: string) => {
    const query = (queryText || inputVal).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    setTimeout(() => {
      let replyText = '';
      let citations = undefined;
      let actionSuggestions = undefined;

      const q = query.toLowerCase();

      if (q.includes('cải thiện') || q.includes('điểm') || q.includes('gpa') || q.includes('cpa') || q.includes('lif2004')) {
        replyText = `Phân tích hỗ trợ học tập cho ${studentName}:\n1. Điểm quá trình chiếm 40% tổng kết. Để đạt kết quả loại A (>= 8.5), điểm thi kết thúc học phần cần đạt tối thiểu 8.5.\n2. Học phần LIF2004 là điều kiện tiên quyết bắt buộc cho 2 học phần chuyên ngành ở HK6 (ISFI25-2010 và ISFI25-2014). Bạn cần hoàn thành để bảo đảm đủ điều kiện đăng ký học phần tự động.\n3. Khuyến nghị: Đăng ký lịch tư vấn trực tiếp với Cố vấn học tập (TS. Nguyễn Năng Thành - P402, Nhà A1) vào chiều Thứ 3 để được hỗ trợ kế hoạch học tập tối ưu.`;
        citations = [{ docCode: 'QĐ 458/QĐ-HVHC', article: 'Điều 14', content: 'Quy định đăng ký học phần tiên quyết và học phần học trước.' }];
        actionSuggestions = ['Đặt lịch hẹn với Cố vấn học tập', 'Xem sơ đồ Cây học phần tiên quyết'];
      } else if (q.includes('tốt nghiệp') || q.includes('chuẩn') || q.includes('tiến độ') || q.includes('130')) {
        replyText = `Thẩm định điều kiện tốt nghiệp của ${studentName} (K25 - HTTT):\n• Tín chỉ đã tích lũy: 72/130 TC (Đạt 55.4% - Đúng tiến độ chuẩn).\n• CPA tích lũy hiện tại: 3.24/4.00 (Xếp loại Giỏi).\n• Chuẩn Ngoại ngữ B1: Chưa nộp minh chứng (Hạn chốt nộp: Trước khi bắt đầu HK7).\n• GDQP - An ninh: Đã hoàn thành.\n• GD Thể chất: Đã hoàn thành 2/4 học phần.\n• Bạn dự kiến đủ điều kiện nhận Khóa luận tốt nghiệp vào HK8 (Tháng 06/2026).`;
        citations = [{ docCode: 'QĐ 458/QĐ-HVHC', article: 'Điều 28', content: 'Điều kiện xét và công nhận tốt nghiệp đại học chính quy.' }];
        actionSuggestions = ['Xem báo cáo kiểm toán 4 khối kiến thức'];
      } else if (q.includes('kỳ tới') || q.includes('gợi ý') || q.includes('lộ trình')) {
        replyText = `Gợi ý lộ trình Học kỳ 2 (2024 - 2025) phù hợp cho ${studentName}:\n1. LIF2004 - Hệ quản trị cơ sở dữ liệu (3 TC) - Ưu tiên số 1\n2. ISFI25-2010 - Khai phá dữ liệu (3 TC)\n3. ISFI25-2008 - An toàn thông tin doanh nghiệp (3 TC)\n4. GDTC3 - Giáo dục thể chất 3 (1 TC)\n5. Học phần tự chọn chuyên ngành 1 (3 TC)\nKhối lượng học tập đề xuất: 13 tín chỉ (Khối lượng học tập phù hợp giúp duy trì CPA >= 3.20).`;
        citations = [{ docCode: 'CTĐT-2023-HTTT', article: 'Mục 4', content: 'Kế hoạch đào tạo chuẩn 4 năm ngành Hệ thống thông tin.' }];
      } else if (q.includes('quy chế') || q.includes('458')) {
        replyText = `Trích yếu Quy chế Đào tạo Học viện (QĐ 458/QĐ-HVHC):\n• Điều 18: Tích lũy tối thiểu 14 tín chỉ mỗi học kỳ chính để đảm bảo tiến độ chuẩn.\n• Điều 22 & 24: Duy trì CPA >= 2.00 để không rơi vào diện cảnh báo học tập mức 1.\n• Điều 28: Đạt tối thiểu 130 tín chỉ, hoàn tất chuẩn đầu ra Tiếng Anh B1 và chứng chỉ GDQP-AN để được công nhận tốt nghiệp chính quy.`;
        citations = [{ docCode: 'QĐ 458/QĐ-HVHC', article: 'Điều 18, 22 & 28', content: 'Quy chế đào tạo đại học chính quy' }];
      } else {
        replyText = `Theo Quy chế Đào tạo Học viện (QĐ 458/QĐ-HVHC), sinh viên cần duy trì điểm trung bình tích lũy CPA >= 2.00 để đảm bảo điều kiện học vụ. Điểm CPA hiện tại của bạn là 3.24 (Mức độ rủi ro thấp, đạt xếp loại Giỏi).\n\nNếu bạn muốn tra cứu học phần tiên quyết, quy trình phúc khảo hoặc đăng ký lộ trình học tập, tôi luôn sẵn sàng hỗ trợ!`;
        citations = [{ docCode: 'QĐ 458/QĐ-HVHC', article: 'Điều 22', content: 'Cảnh báo kết quả học tập và xử lý học vụ.' }];
      }

      setMessages(prev => [
        ...prev,
        {
          id: `msg-${Date.now() + 1}`,
          sender: 'ai',
          text: replyText,
          time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          citations,
          actionSuggestions
        }
      ]);
      setIsTyping(false);
    }, 600);
  };

  const quickPrompts: QuickPrompt[] = [
    {
      icon: '🎓',
      label: 'Thẩm định 130 TC',
      query: 'Thẩm định điều kiện tốt nghiệp 130 TC của tôi hiện tại như thế nào?'
    },
    {
      icon: '📅',
      label: 'Lộ trình kỳ tới an toàn',
      query: 'Gợi ý học phần đăng ký kỳ tới an toàn để duy trì CPA tốt?'
    },
    {
      icon: '📈',
      label: 'Cải thiện điểm GPA',
      query: 'Làm sao để cải thiện điểm số và nâng CPA lên trên 3.5?'
    },
    {
      icon: '⚠️',
      label: 'Học phần tiên quyết',
      query: 'Kiểm tra điều kiện tiên quyết học phần LIF2004 và các học phần chuyên ngành'
    },
    {
      icon: '📜',
      label: 'Quy chế QĐ 458',
      query: 'Tóm tắt các quy định quan trọng trong Quy chế Đào tạo tín chỉ QĐ 458/QĐ-HVHC'
    }
  ];

  return (
    <>
      {/* Cửa sổ Popup Chat Nhỏ (Nổi ngay trên nút bấm, không có backdrop che màn hình) */}
      {isOpen && (
        <div 
          id="aiChatWindow"
          className="ai-chat-popup"
          role="dialog"
          aria-label="Cửa sổ Trợ lý học thuật AI"
        >
          {/* Header Cửa sổ Chat */}
          <div 
            style={{
              padding: '12px 14px',
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: 'var(--surface-subtle)',
              flexShrink: 0
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
              <div 
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: '0 2px 6px rgba(37, 99, 235, 0.25)'
                }}
              >
                <Bot size={17} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '0.84375rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
                    APAG SIS · AI Advisor
                  </span>
                  <span 
                    style={{
                      fontSize: '0.625rem',
                      padding: '1px 5px',
                      borderRadius: '4px',
                      backgroundColor: 'var(--primary)',
                      color: '#FFFFFF',
                      fontWeight: 600
                    }}
                  >
                    RAG 2.1
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#16A34A', display: 'inline-block', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    Cố vấn cho: <strong style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{studentName}</strong> (K25)
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <button 
                type="button" 
                onClick={() => setIsOpen(false)}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background-color 150ms ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--surface-hover)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                title="Thu nhỏ cửa sổ chat (Esc)"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Banner ngữ cảnh nếu được kích hoạt từ card bên ngoài */}
          {activeContext && (
            <div 
              style={{
                padding: '6px 12px',
                backgroundColor: 'var(--primary-light)',
                borderBottom: '1px solid var(--primary-border)',
                fontSize: '0.75rem',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexShrink: 0
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden' }}>
                <Layers size={13} style={{ flexShrink: 0 }} />
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 600 }}>
                  {activeContext}
                </span>
              </div>
              <button 
                type="button" 
                onClick={() => setActiveContext(null)} 
                style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.6875rem' }}
              >
                ✕
              </button>
            </div>
          )}

          {/* Thanh Chat Nhanh Một Chạm (Gợi ý câu hỏi phổ biến) */}
          <div 
            style={{
              padding: '8px 12px',
              borderBottom: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--surface)',
              flexShrink: 0
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.03em', marginBottom: '6px' }}>
              <Sparkles size={11} color="var(--primary)" />
              <span>Gợi ý chat nhanh:</span>
            </div>
            <div 
              style={{
                display: 'flex',
                gap: '6px',
                overflowX: 'auto',
                scrollbarWidth: 'none',
                paddingBottom: '2px'
              }}
            >
              {quickPrompts.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSend(p.query)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '5px 10px',
                    borderRadius: '999px',
                    backgroundColor: 'var(--surface-subtle)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-primary)',
                    fontSize: '0.6875rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                    transition: 'all 120ms ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--primary-light)';
                    e.currentTarget.style.borderColor = 'var(--primary)';
                    e.currentTarget.style.color = 'var(--primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--surface-subtle)';
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.color = 'var(--text-primary)';
                  }}
                >
                  <span>{p.icon}</span>
                  <span>{p.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Vùng Tin Nhắn Hội Thoại & Watermark Chìm */}
          <div 
            className="ai-conversation-viewport" 
            style={{ 
              flex: 1, 
              position: 'relative', 
              overflow: 'hidden', 
              display: 'flex', 
              flexDirection: 'column', 
              minHeight: 0 
            }}
          >
            {/* Logo APAG Chìm Xoay Chéo Ngay Chính Giữa */}
            <div className="ai-watermark-layer" aria-hidden="true">
              <img 
                src="/assets/images/apag-logo.png" 
                alt="" 
                className="ai-watermark-logo"
                style={{ width: '220px', maxWidth: '65%' }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/images/apag-logo.svg';
                }}
              />
            </div>

            {/* Danh Sách Tin Nhắn */}
            <div 
              className="ai-messages-scroll"
              style={{ 
                flex: 1,
                overflowY: 'auto',
                padding: '12px 14px', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '12px' 
              }}
            >
              {messages.map((m) => (
                <div 
                  key={m.id} 
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: m.sender === 'user' ? 'flex-end' : 'flex-start',
                    width: '100%'
                  }}
                >
                  <div 
                    style={{
                      maxWidth: '88%',
                      padding: '10px 13px',
                      borderRadius: m.sender === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                      backgroundColor: m.sender === 'user' ? '#2563EB' : 'var(--surface-subtle)',
                      color: m.sender === 'user' ? '#FFFFFF' : 'var(--text-primary)',
                      fontSize: '0.8125rem',
                      lineHeight: 1.55,
                      border: m.sender === 'user' ? 'none' : '1px solid var(--border)',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                      whiteSpace: 'pre-line'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                      <div 
                        style={{ 
                          width: '18px', 
                          height: '18px', 
                          borderRadius: '4px', 
                          background: m.sender === 'user' ? 'rgba(255,255,255,0.25)' : 'linear-gradient(135deg, #2563EB, #7C3AED)', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          color: '#fff' 
                        }}
                      >
                        {m.sender === 'user' ? <span style={{ fontSize: '9px', fontWeight: 700 }}>SV</span> : <Bot size={11} />}
                      </div>
                      <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: m.sender === 'user' ? 'rgba(255,255,255,0.9)' : 'var(--text-secondary)' }}>
                        {m.sender === 'user' ? 'Bạn' : 'Trợ lý học thuật AI'}
                      </span>
                    </div>

                    <div>{m.text}</div>

                    {m.citations && (
                      <div 
                        style={{
                          marginTop: '8px',
                          padding: '6px 8px',
                          backgroundColor: 'rgba(37, 99, 235, 0.08)',
                          borderRadius: '6px',
                          fontSize: '0.6875rem',
                          color: 'var(--primary)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          border: '1px solid rgba(37, 99, 235, 0.15)'
                        }}
                      >
                        <BookOpen size={12} style={{ flexShrink: 0 }} />
                        <span><strong>Trích dẫn:</strong> {m.citations[0].docCode} ({m.citations[0].article})</span>
                      </div>
                    )}

                    {m.actionSuggestions && (
                      <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {m.actionSuggestions.map((act, actIdx) => (
                          <button
                            key={actIdx}
                            type="button"
                            onClick={() => handleSend(act)}
                            style={{
                              fontSize: '0.6875rem',
                              padding: '3px 8px',
                              borderRadius: '4px',
                              backgroundColor: 'var(--surface)',
                              border: '1px solid var(--border)',
                              color: 'var(--primary)',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <Lightbulb size={10} />
                            <span>{act}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    <div 
                      style={{
                        fontSize: '0.625rem',
                        marginTop: '4px',
                        color: m.sender === 'user' ? 'rgba(255,255,255,0.7)' : 'var(--text-muted)',
                        textAlign: m.sender === 'user' ? 'right' : 'left'
                      }}
                    >
                      {m.time}
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 10px', color: 'var(--text-muted)', fontSize: '0.75rem', fontStyle: 'italic' }}>
                  <Sparkles size={13} className="text-primary" />
                  <span>AI đang truy hồi tri thức RAG và phân tích dữ liệu...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Thanh Nhập Tin Nhắn Đáy Khung Chat */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            style={{
              padding: '10px 12px',
              borderTop: '1px solid var(--border)',
              backgroundColor: 'var(--surface)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              flexShrink: 0
            }}
          >
            <input 
              type="text" 
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Tra cứu học phần, quy chế đào tạo, điểm số..."
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--surface-subtle)',
                color: 'var(--text-primary)',
                fontSize: '0.8125rem',
                outline: 'none',
                transition: 'border-color 150ms ease'
              }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--primary)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
            />
            <button 
              type="submit" 
              disabled={!inputVal.trim() || isTyping}
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                backgroundColor: '#2563EB',
                color: '#FFFFFF',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: inputVal.trim() && !isTyping ? 'pointer' : 'default',
                opacity: inputVal.trim() && !isTyping ? 1 : 0.5,
                transition: 'opacity 150ms ease, transform 100ms ease',
                flexShrink: 0
              }}
              title="Gửi câu hỏi"
            >
              <Send size={15} />
            </button>
          </form>

          {/* Tuyên bố giới hạn thẩm quyền của AI */}
          <div 
            style={{ 
              padding: '6px 12px 7px', 
              fontSize: '0.625rem', 
              color: 'var(--text-muted)', 
              textAlign: 'center', 
              backgroundColor: 'var(--surface-subtle)', 
              borderTop: '1px solid var(--border-subtle)',
              lineHeight: 1.3
            }}
          >
            *Thông tin AI mang tính chất tham khảo học thuật. Quyết định học vụ chính thức thuộc thẩm quyền Cố vấn học tập & Phòng Quản lý Đào tạo.
          </div>
        </div>
      )}

      {/* Nút Bấm Kích Hoạt Nổi (Anchored ở góc dưới bên phải, click để bật/tắt popup) */}
      <button 
        type="button" 
        id="aiLauncherBtn"
        className="ai-launcher-btn"
        onClick={() => setIsOpen(prev => !prev)}
        title={isOpen ? "Thu nhỏ Trợ lý học thuật AI (Esc)" : "Mở Trợ lý học thuật AI"}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9998,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 18px',
          borderRadius: '999px',
          backgroundColor: isOpen ? '#1E293B' : 'var(--primary, #1D4ED8)',
          color: '#FFFFFF',
          border: 'none',
          boxShadow: isOpen 
            ? '0 4px 12px rgba(15, 23, 42, 0.2)' 
            : '0 4px 12px rgba(29, 78, 216, 0.28)',
          cursor: 'pointer',
          fontWeight: 600,
          fontSize: '0.875rem',
          transition: 'all 150ms ease-out'
        }}
      >
        {isOpen ? (
          <>
            <X size={16} color="#FFFFFF" />
            <span style={{ color: '#FFFFFF', fontWeight: 600 }}>Đóng trợ lý</span>
          </>
        ) : (
          <>
            <Sparkles size={16} color="#FFFFFF" />
            <span style={{ color: '#FFFFFF', fontWeight: 600 }}>Trợ lý học thuật AI</span>
          </>
        )}
      </button>
    </>
  );
};
