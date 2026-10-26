// ==========================================================================
// APAG SIS - Student RPG Skill Tree / Metro Map Component
// Interactive Visual Curriculum Map with Prerequisite Node Tracking & AI Chips
// ==========================================================================

import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Lock, 
  Sparkles, 
  Compass, 
  Info, 
  X, 
  ArrowRight,
  BookOpen,
  Award,
  Zap
} from 'lucide-react';
import { Utils } from '../../utils/utils';

export interface SkillNode {
  id: string;
  code: string;
  name: string;
  credits: number;
  phase: number; // 1: Foundation, 2: Core, 3: Advanced/Web, 4: Capstone
  phaseName: string;
  status: 'passed' | 'enrolled' | 'locked' | 'recommended';
  grade?: string;
  score?: number;
  prerequisites: string[];
  description: string;
  aiAdvice: string;
}

export const SkillTree: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<SkillNode | null>(null);

  const skillNodes: SkillNode[] = [
    // Phase 1: CS Foundation (Passed)
    {
      id: 'node-1',
      code: 'LIF1001',
      name: 'Nhập môn lập trình & C/C++',
      credits: 3,
      phase: 1,
      phaseName: 'Nền tảng CNTT',
      status: 'passed',
      grade: 'A',
      score: 9.0,
      prerequisites: [],
      description: 'Cú pháp cơ bản, biến, mảng, con trỏ và thuật toán lập trình cơ bản.',
      aiAdvice: 'Bạn đã hoàn thành xuất sắc học phần này với điểm A (9.0), tạo nền tảng vững chắc cho Cấu trúc dữ liệu.'
    },
    {
      id: 'node-2',
      code: 'MAT1001',
      name: 'Toán cao cấp & Đại số tuyến tính',
      credits: 3,
      phase: 1,
      phaseName: 'Nền tảng CNTT',
      status: 'passed',
      grade: 'B+',
      score: 8.2,
      prerequisites: [],
      description: 'Ma trận, không gian véc tơ, tích phân và ứng dụng trong khoa học máy tính.',
      aiAdvice: 'Điểm B+ đạt chuẩn yêu cầu cho học phần Học máy & Trí tuệ nhân tạo sau này.'
    },
    {
      id: 'node-3',
      code: 'LIF1002',
      name: 'Cấu trúc dữ liệu & Giải thuật',
      credits: 3,
      phase: 1,
      phaseName: 'Nền tảng CNTT',
      status: 'passed',
      grade: 'A',
      score: 8.8,
      prerequisites: ['LIF1001'],
      description: 'Danh sách liên kết, cây nhị phân, đồ thị và các giải thuật tìm kiếm, sắp xếp.',
      aiAdvice: 'Nắm vững cây nhị phân và đồ thị sẽ giúp bạn làm quen rất nhanh với cấu trúc dữ liệu đồ thị của RAG.'
    },

    // Phase 2: Core Systems & Data (Enrolled / Prereqs)
    {
      id: 'node-4',
      code: 'LIF2004',
      name: 'Hệ quản trị Cơ sở dữ liệu',
      credits: 3,
      phase: 2,
      phaseName: 'Cơ sở ngành & CSDL',
      status: 'recommended',
      grade: undefined,
      prerequisites: ['LIF1002'],
      description: 'Mô hình quan hệ, SQL nâng cao, chỉ mục, tối ưu hóa truy vấn và giao dịch ACID.',
      aiAdvice: '⭐ Đề xuất học ngay: Đây là học phần then chốt làm điều kiện tiên quyết cho 4 học phần chuyên sâu HK6-HK7!'
    },
    {
      id: 'node-5',
      code: 'LIF2003',
      name: 'Phân tích & Thiết kế HTTT',
      credits: 3,
      phase: 2,
      phaseName: 'Cơ sở ngành & CSDL',
      status: 'enrolled',
      grade: '8.5 (GK)',
      prerequisites: ['LIF1002'],
      description: 'Quy trình UML, sơ đồ use-case, ERD và phân tích yêu cầu nghiệp vụ doanh nghiệp.',
      aiAdvice: 'Tiến độ 70%, điểm giữa kỳ 8.5. Cần tập trung ôn tập phần đặc tả ca sử dụng và kiến trúc phần mềm cho kỳ thi kết thúc.'
    },
    {
      id: 'node-6',
      code: 'LIF2113',
      name: 'Mạng máy tính & Truyền thông',
      credits: 3,
      phase: 2,
      phaseName: 'Cơ sở ngành & CSDL',
      status: 'enrolled',
      grade: '8.0 (GK)',
      prerequisites: ['LIF1001'],
      description: 'Mô hình OSI, TCP/IP, phân dải địa chỉ IP, định tuyến và bảo mật mạng cơ bản.',
      aiAdvice: 'Điểm thực hành Lab 9.5/10. Chú ý ôn kỹ lý thuyết giao thức TCP bắt tay 3 bước.'
    },

    // Phase 3: SWE & Web Applications (Enrolled / Advanced)
    {
      id: 'node-7',
      code: 'LIF2020',
      name: 'Lập trình Web Doanh nghiệp',
      credits: 3,
      phase: 3,
      phaseName: 'Ứng dụng & Phát triển',
      status: 'enrolled',
      grade: '8.2 (GK)',
      prerequisites: ['LIF2003'],
      description: 'Kiến trúc Fullstack, RESTful API, React, Node.js và tích hợp cơ sở dữ liệu đám mây.',
      aiAdvice: 'Đang bảo vệ đồ án tốt. Bạn có thể tận dụng kiến thức này để ứng dụng trong Khóa luận tốt nghiệp.'
    },
    {
      id: 'node-8',
      code: 'ISF325',
      name: 'Công nghệ phần mềm ứng dụng',
      credits: 3,
      phase: 3,
      phaseName: 'Ứng dụng & Phát triển',
      status: 'enrolled',
      grade: '8.8 (GK)',
      prerequisites: ['LIF2003'],
      description: 'Mô hình Agile/Scrum, CI/CD, kiểm thử phần mềm tự động (Unit Test, Integration Test).',
      aiAdvice: 'Nắm rất tốt quy trình kiểm thử. Tỷ lệ chuyên cần 10/10.'
    },
    {
      id: 'node-9',
      code: 'LIF3010',
      name: 'Kiến trúc Microservices & Cloud',
      credits: 3,
      phase: 3,
      phaseName: 'Ứng dụng & Phát triển',
      status: 'recommended',
      prerequisites: ['LIF2020', 'LIF2113'],
      description: 'Docker, Kubernetes, Message Broker (RabbitMQ/Kafka) và kiến trúc phân tán.',
      aiAdvice: 'Học phần tự chọn phù hợp cho học kỳ tới để nâng cao năng lực kỹ sư phần mềm chuyên nghiệp.'
    },

    // Phase 4: Capstone & AI (Locked)
    {
      id: 'node-10',
      code: 'LIF4001',
      name: 'Trí tuệ nhân tạo & RAG Enterprise',
      credits: 3,
      phase: 4,
      phaseName: 'Chuyên sâu & Khóa luận',
      status: 'locked',
      prerequisites: ['LIF2004', 'LIF1002'],
      description: 'Mô hình ngôn ngữ lớn (LLM), vector database (Chroma/Pinecone), RAG pipeline.',
      aiAdvice: '🔒 Chưa đủ điều kiện đăng ký: Cần hoàn thành học phần tiên quyết LIF2004 (Hệ quản trị CSDL) để đủ điều kiện đăng ký.'
    },
    {
      id: 'node-11',
      code: 'LIF4002',
      name: 'Khai phá dữ liệu & Big Data',
      credits: 3,
      phase: 4,
      phaseName: 'Chuyên sâu & Khóa luận',
      status: 'locked',
      prerequisites: ['LIF2004', 'MAT1001'],
      description: 'Xử lý dữ liệu lớn bằng Spark, mô hình hồi quy, phân cụm và học máy có giám sát.',
      aiAdvice: '🔒 Đang khóa: Cần hoàn thành LIF2004 ở HK6.'
    },
    {
      id: 'node-12',
      code: 'LIF4999',
      name: 'Khóa luận Tốt nghiệp Đại học',
      credits: 10,
      phase: 4,
      phaseName: 'Chuyên sâu & Khóa luận',
      status: 'locked',
      prerequisites: ['Tích lũy >= 105 tín chỉ', 'GPA >= 2.50'],
      description: 'Nghiên cứu và phát triển sản phẩm công nghệ hoàn chỉnh bảo vệ trước Hội đồng Chuyên môn.',
      aiAdvice: '🔒 Đang khóa: Dự kiến mở ở HK8 khi bạn tích lũy đủ 105/130 tín chỉ.'
    }
  ];

  const handleAskAiAboutNode = (node: SkillNode) => {
    window.dispatchEvent(
      new CustomEvent('open-ai-drawer', {
        detail: {
          initialPrompt: `Tôi muốn hỏi về học phần "${node.code} - ${node.name}". Tư vấn cho tôi kế hoạch ôn tập và tài liệu tham khảo tốt nhất?`
        }
      })
    );
    setSelectedNode(null);
  };

  const getNodeColor = (status: SkillNode['status']) => {
    switch (status) {
      case 'passed': return '#10B981';
      case 'enrolled': return '#3B82F6';
      case 'recommended': return '#8B5CF6';
      case 'locked': return '#64748B';
    }
  };

  const phases = [
    { id: 1, title: 'Giai đoạn 1: Nền tảng CNTT', sub: 'HK1 - HK2 (Hoàn thành)' },
    { id: 2, title: 'Giai đoạn 2: Cốt lõi & CSDL', sub: 'HK3 - HK4 (Đang theo dõi)' },
    { id: 3, title: 'Giai đoạn 3: Web & Phần mềm', sub: 'HK5 - HK6 (Đang học)' },
    { id: 4, title: 'Giai đoạn 4: Chuyên sâu & Tốt nghiệp', sub: 'HK7 - HK8 (Đích đến)' }
  ];

  return (
    <div 
      className="bento-card"
      style={{
        padding: '22px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '10px', marginBottom: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div 
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              backgroundColor: 'rgba(139, 92, 246, 0.15)',
              color: '#8B5CF6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Compass size={16} />
          </div>
          <div>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Sơ đồ Lộ trình Học phần (Cây học phần & Tiên quyết)
            </h3>
            <span style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>
              Mạng lưới quan hệ tiên quyết & Tiến độ tích lũy học phần
            </span>
          </div>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.6875rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }} />
            <span style={{ color: 'var(--text-secondary)' }}>Đã tích lũy</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#3B82F6' }} />
            <span style={{ color: 'var(--text-secondary)' }}>Đang học</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#8B5CF6' }} />
            <span style={{ color: 'var(--text-secondary)' }}>AI Gợi ý</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#64748B' }} />
            <span style={{ color: 'var(--text-secondary)' }}>Chưa đủ ĐK</span>
          </div>
        </div>
      </div>

      {/* Metro Map Tracks Layout */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '14px',
          position: 'relative'
        }}
      >
        {phases.map(phase => {
          const phaseNodes = skillNodes.filter(n => n.phase === phase.id);

          return (
            <div 
              key={phase.id}
              style={{
                backgroundColor: 'var(--surface-subtle)',
                borderRadius: '12px',
                padding: '12px',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              {/* Phase Header */}
              <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '6px', marginBottom: '2px' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block' }}>
                  {phase.title}
                </span>
                <span style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>
                  {phase.sub}
                </span>
              </div>

              {/* Node Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {phaseNodes.map(node => {
                  const nodeColor = getNodeColor(node.status);
                  const isEnrolled = node.status === 'enrolled';
                  const isRec = node.status === 'recommended';

                  return (
                    <div 
                      key={node.id}
                      onClick={() => setSelectedNode(node)}
                      style={{
                        padding: '8px 10px',
                        backgroundColor: 'var(--surface)',
                        borderRadius: '8px',
                        border: `1px solid ${isRec ? 'rgba(139, 92, 246, 0.4)' : 'var(--border)'}`,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'all 0.15s ease',
                        boxShadow: isRec ? '0 0 10px rgba(139, 92, 246, 0.15)' : 'none',
                        position: 'relative'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                        {/* Status Icon Indicator */}
                        <div 
                          className={isEnrolled ? 'skill-node-pulse' : ''}
                          style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            backgroundColor: `${nodeColor}22`,
                            color: nodeColor,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}
                        >
                          {node.status === 'passed' && <CheckCircle2 size={12} />}
                          {node.status === 'enrolled' && <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: nodeColor }} />}
                          {node.status === 'recommended' && <Zap size={11} />}
                          {node.status === 'locked' && <Lock size={11} />}
                        </div>

                        <div style={{ overflow: 'hidden' }}>
                          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                            {node.code}
                          </div>
                          <div style={{ fontSize: '0.625rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                            {node.name}
                          </div>
                        </div>
                      </div>

                      {/* Right Tag */}
                      <div style={{ flexShrink: 0, textAlign: 'right' }}>
                        {node.status === 'passed' ? (
                          <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: 'var(--success)' }}>
                            {node.grade}
                          </span>
                        ) : node.status === 'enrolled' ? (
                          <span style={{ fontSize: '0.625rem', fontWeight: 700, color: 'var(--primary)' }}>
                            3 TC
                          </span>
                        ) : node.status === 'recommended' ? (
                          <span style={{ fontSize: '0.625rem', fontWeight: 700, color: '#8B5CF6' }}>
                            Gợi ý
                          </span>
                        ) : (
                          <span style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>
                            Chưa đủ ĐK
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Node Detail Modal / Flyout */}
      {selectedNode && (
        <div 
          className="modal-backdrop active"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.45)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedNode(null);
          }}
        >
          <div 
            style={{
              width: '100%',
              maxWidth: '480px',
              backgroundColor: 'var(--surface)',
              borderRadius: '16px',
              border: '1px solid var(--border)',
              boxShadow: '0 20px 40px -8px rgba(0,0,0,0.3)',
              overflow: 'hidden',
              padding: '20px'
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span 
                  className="badge"
                  style={{
                    backgroundColor: `${getNodeColor(selectedNode.status)}22`,
                    color: getNodeColor(selectedNode.status),
                    fontWeight: 700
                  }}
                >
                  {selectedNode.status === 'passed' ? 'Đã hoàn thành' :
                   selectedNode.status === 'enrolled' ? 'Đang học HK này' :
                   selectedNode.status === 'recommended' ? 'AI Gợi ý ưu tiên' : 'Chưa đủ điều kiện đăng ký'}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  {selectedNode.phaseName}
                </span>
              </div>
              <button 
                type="button" 
                onClick={() => setSelectedNode(null)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Course Code & Name */}
            <div style={{ marginBottom: '14px' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 4px' }}>
                {selectedNode.code} - {selectedNode.name}
              </h3>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Số tín chỉ: <strong>{selectedNode.credits} TC</strong> • Trọng số học vụ: <strong>Lý thuyết + Thực hành</strong>
              </div>
            </div>

            {/* Prerequisites */}
            <div style={{ marginBottom: '14px', background: 'var(--surface-subtle)', padding: '10px 12px', borderRadius: '10px' }}>
              <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                ĐIỀU KIỆN TIÊN QUYẾT:
              </span>
              {selectedNode.prerequisites.length > 0 ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {selectedNode.prerequisites.map((pre, idx) => (
                    <span key={idx} className="badge badge-info" style={{ fontSize: '0.6875rem' }}>
                      {pre}
                    </span>
                  ))}
                </div>
              ) : (
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Không có học phần tiên quyết (Học phần cơ sở).</span>
              )}
            </div>

            {/* Description */}
            <div style={{ marginBottom: '16px' }}>
              <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                NỘI DUNG TÓM TẮT:
              </span>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-primary)', margin: 0, lineHeight: 1.5 }}>
                {selectedNode.description}
              </p>
            </div>

            {/* AI Insight Box */}
            <div 
              style={{
                backgroundColor: 'rgba(139, 92, 246, 0.08)',
                border: '1px solid rgba(139, 92, 246, 0.25)',
                borderRadius: '10px',
                padding: '12px',
                marginBottom: '18px',
                display: 'flex',
                gap: '10px'
              }}
            >
              <Sparkles size={16} style={{ color: '#8B5CF6', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#8B5CF6', display: 'block', marginBottom: '2px' }}>
                  GỢI Ý TỪ TRỢ LÝ AI:
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-primary)', lineHeight: 1.4 }}>
                  {selectedNode.aiAdvice}
                </span>
              </div>
            </div>

            {/* 1-Click Action Buttons */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => handleAskAiAboutNode(selectedNode)}
                className="btn btn-primary btn-sm"
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                <Sparkles size={14} />
                <span>Tra cứu thông tin học phần bằng Trợ lý học thuật AI</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedNode(null)}
                className="btn btn-outline btn-sm"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
