// ==========================================================================
// APAG Advisor Student Detail Controller (React + TypeScript)
// 100% Fidelity with original pages/advisor/student-detail.html & js/advisor/student-detail.js
// ==========================================================================

import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Sparkles, Bell, AlertTriangle, RefreshCw, Check, 
  Save, CheckCircle, Clock, BookOpen, AlertCircle, X, Send
} from 'lucide-react';
import { Utils } from '../../utils/utils';
import { MOCK_ALL_STUDENTS, MOCK_KNOWLEDGE_BLOCKS } from '../../services/mockData';

const STUDENT_TRANSCRIPT_GRADES = [
  { courseCode: 'ISF0009', courseName: 'Giáo dục quốc phòng-an ninh', credits: 8, semester: 'HK1 2022-2023', score10: 8.5, letterGrade: 'A', gradePoint: 4.0 },
  { courseCode: 'CHUANNN', courseName: 'NLNN bậc 3/6 khung năng lực ngoại ngữ của VN', credits: 3, semester: 'HK1 2022-2023', score10: 9.0, letterGrade: 'A', gradePoint: 4.0 },
  { courseCode: 'CHUANTH', courseName: 'Chuẩn kỹ năng sử dụng CNTT cơ bản', credits: 3, semester: 'HK1 2022-2023', score10: 9.5, letterGrade: 'A+', gradePoint: 4.0 },
  { courseCode: 'ISFI25-1005', courseName: 'Khởi nghiệp và đổi mới sáng tạo', credits: 3, semester: 'HK1 2022-2023', score10: 8.2, letterGrade: 'B+', gradePoint: 3.5 },
  { courseCode: 'ISF0010', courseName: 'Giáo dục thể chất', credits: 3, semester: 'HK2 2022-2023', score10: 8.0, letterGrade: 'B+', gradePoint: 3.5 },
  { courseCode: 'EMF25-1013', courseName: 'Marketing căn bản', credits: 3, semester: 'HK2 2022-2023', score10: 7.8, letterGrade: 'B', gradePoint: 3.0 },
  { courseCode: 'ISFI25-1007', courseName: 'Cấu trúc máy tính và hệ điều hành', credits: 3, semester: 'HK2 2022-2023', score10: 8.4, letterGrade: 'B+', gradePoint: 3.5 },
  { courseCode: 'LIF0006', courseName: 'Xác suất và thống kê', credits: 3, semester: 'HK2 2022-2023', score10: 7.5, letterGrade: 'B', gradePoint: 3.0 },
  { courseCode: 'ISF0004', courseName: 'Chủ nghĩa xã hội khoa học', credits: 2, semester: 'HK2 2022-2023', score10: 8.0, letterGrade: 'B+', gradePoint: 3.5 },
  { courseCode: 'ISF0006', courseName: 'Lịch sử Đảng cộng sản Việt Nam', credits: 2, semester: 'HK1 2023-2024', score10: 8.5, letterGrade: 'A', gradePoint: 4.0 },
  { courseCode: 'LIF1009', courseName: 'Phương pháp tính', credits: 3, semester: 'HK1 2023-2024', score10: 8.0, letterGrade: 'B+', gradePoint: 3.5 },
  { courseCode: 'LIF1010', courseName: 'Tối ưu hóa', credits: 3, semester: 'HK1 2023-2024', score10: 8.2, letterGrade: 'B+', gradePoint: 3.5 },
  { courseCode: 'LIF2019', courseName: 'Lập trình hướng đối tượng', credits: 3, semester: 'HK1 2023-2024', score10: 8.8, letterGrade: 'A', gradePoint: 4.0 },
  { courseCode: 'LIF1006', courseName: 'Cấu trúc dữ liệu và giải thuật', credits: 3, semester: 'HK1 2023-2024', score10: 8.5, letterGrade: 'A', gradePoint: 4.0 },
  { courseCode: 'ISFI25-2004', courseName: 'Ngôn ngữ lập trình Java', credits: 3, semester: 'HK1 2023-2024', score10: 8.4, letterGrade: 'B+', gradePoint: 3.5 }
];

export const AdvisorStudentDetail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const studentId = searchParams.get('id') || '2505HTTB001';

  // Find student info or default
  const student: any = MOCK_ALL_STUDENTS.find((s: any) => s.studentId === studentId) || {
    studentId: '2505HTTB001',
    name: 'Trần Mạnh Hà',
    class: 'K25-HTTB',
    gpa: 3.24,
    credits: 72,
    progress: 55.4,
    email: 'hatm_k25@apag.edu.vn',
    riskLevel: 'normal',
    riskScore: 28,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=faces'
  };

  const [activeTab, setActiveTab] = useState<'audit' | 'transcript' | 'roadmap' | 'notes'>('audit');

  // Non-credit certificates
  const [certs] = useState([
    { name: 'Ngoại ngữ B1 (VSTEP / IELTS 4.5+)', status: 'Chưa hoàn thành', badgeClass: 'badge-danger', note: 'Hạn cuối nộp: Tháng 12/2025' },
    { name: 'Giáo dục Quốc phòng & An ninh (3 học phần)', status: 'Đã hoàn thành', badgeClass: 'badge-success', note: 'Điểm tổng kết: 8.5' },
    { name: 'Giáo dục Thể chất (3 học phần)', status: 'Đã hoàn thành', badgeClass: 'badge-success', note: 'Điểm tổng kết: 9.0' },
    { name: 'Kỹ năng mềm & Công nghệ số trong quản lý công', status: 'Đã hoàn thành', badgeClass: 'badge-success', note: 'Đạt yêu cầu năm thứ 2' },
    { name: 'Đạo đức công vụ & Văn hóa công sở', status: 'Đang thực hiện', badgeClass: 'badge-warning', note: 'Dự kiến hoàn thành HK6' }
  ]);

  // Advisor notes state
  const [notesList, setNotesList] = useState([
    {
      id: 1,
      date: '10/09/2024 · 09:30',
      advisor: 'TS. Nguyễn Năng Thành',
      content: 'Đã gặp sinh viên trực tiếp để giải tỏa thắc mắc về điều kiện tiên quyết học phần LIF2004. Sinh viên cam kết sẽ hoàn thành đăng ký học kỳ phụ.'
    },
    {
      id: 2,
      date: '15/05/2024 · 14:15',
      advisor: 'TS. Nguyễn Năng Thành',
      content: 'Nhắc nhở nộp chứng chỉ tiếng Anh B1 đúng thời hạn trước khi vào kỳ 6.'
    }
  ]);
  const [newNote, setNewNote] = useState('Sinh viên đã cam kết đăng ký học phần LIF2004 trong HK6 và nộp chứng chỉ tiếng Anh B1 (CHUANNN) trước tháng 12/2026.');

  // Modals state
  const [showAiModal, setShowAiModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertContent, setAlertContent] = useState('Nhắc nhở học vụ: Em cần bổ sung chứng chỉ ngoại ngữ B1 trước khi đăng ký học phần thực tập.');

  const handleSaveNotes = () => {
    if (!newNote.trim()) return;
    const note = {
      id: Date.now(),
      date: new Date().toLocaleDateString('vi-VN') + ' · ' + new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      advisor: 'TS. Nguyễn Năng Thành',
      content: newNote.trim()
    };
    setNotesList([note, ...notesList]);
    setNewNote('');
    Utils.showToast('Đã lưu biên bản tư vấn học vụ thành công!', 'success');
  };

  const handleSendAlert = () => {
    setShowAlertModal(false);
    Utils.showToast(`Đã gửi nhắc nhở học vụ tới sinh viên ${student.name} thành công!`, 'success');
  };

  const handleApproveRoadmap = () => {
    Utils.showToast('Đã phê duyệt và ban hành lộ trình học tập cá nhân cho sinh viên!', 'success');
  };

  const handleRegenerateRoadmap = () => {
    Utils.showToast('AI Rule Engine đã tính toán lại toàn bộ lộ trình tối ưu cho sinh viên!', 'info');
  };

  return (
    <div>
      {/* Back Navigation */}
      <div className="mb-4">
        <a 
          href="#/advisor/students" 
          onClick={(e) => { e.preventDefault(); navigate('/advisor/students'); }} 
          className="d-inline-flex items-center gap-1 text-sm text-muted"
        >
          <ArrowLeft size={14} />
          <span>Quay lại danh sách sinh viên</span>
        </a>
      </div>

      {/* Student Master Card */}
      <div className="minimal-card mb-6 p-6">
        <div className="d-flex justify-between items-start flex-wrap gap-4">
          <div className="d-flex gap-4 items-center">
            <img 
              src={student.avatar || "/assets/images/default-avatar.png"} 
              id="detailAvatar" 
              alt={student.name || "Avatar"} 
              className="avatar avatar-xl" 
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/assets/images/default-avatar.png';
              }}
              style={{ objectFit: 'cover' }}
            />
            <div>
              <div className="d-flex items-center gap-2 mb-1">
                <h1 className="text-xl font-bold" id="detailName">{student.name}</h1>
                <span 
                  id="detailRiskBadge"
                  className={
                    student.riskLevel === 'high' 
                      ? 'badge badge-danger font-bold' 
                      : student.riskLevel === 'watch' 
                      ? 'badge badge-warning font-semibold' 
                      : 'badge badge-success font-semibold'
                  }
                >
                  {student.riskLevel === 'high' || student.riskLevel === 'critical' ? 'Cao' : student.riskLevel === 'watch' ? 'Theo dõi' : 'Bình thường'}
                </span>
              </div>
              <div className="text-sm text-secondary space-x-2">
                <span>MSSV: <strong id="detailStudentId">{student.studentId}</strong></span>
                <span>·</span>
                <span>Lớp: <strong id="detailClass">{student.class}</strong></span>
                <span>·</span>
                <span>Khóa: <strong>K25 (2022-2026)</strong></span>
              </div>
              <div className="text-xs text-muted mt-1" id="detailEmail">
                {student.email || 'hatm_k25@apag.edu.vn'} · 0912 345 678
              </div>
            </div>
          </div>

          <div className="d-flex gap-2 flex-wrap">
            <button 
              type="button" 
              className="btn btn-primary btn-sm" 
              id="btnAdvisorAiAnalyze"
              onClick={() => setShowAiModal(true)}
            >
              <Sparkles size={14} />
              <span>AI Phân tích hồ sơ</span>
            </button>
            <button 
              type="button" 
              className="btn btn-secondary btn-sm" 
              id="btnSendStudentAlert"
              onClick={() => setShowAlertModal(true)}
            >
              <Bell size={14} />
              <span>Gửi nhắc nhở</span>
            </button>
          </div>
        </div>

        {/* Quick Metrics Bar */}
        <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-top">
          <div>
            <span className="text-xs text-muted block">GPA Tích lũy:</span>
            <span className="text-lg font-bold text-primary" id="detailGpa">
              {Number(student.gpa).toFixed(2)} / 4.0
            </span>
          </div>
          <div>
            <span className="text-xs text-muted block">Tín chỉ tích lũy:</span>
            <span className="text-lg font-bold" id="detailCredits">
              {student.credits || 72} / 130 TC
            </span>
          </div>
          <div>
            <span className="text-xs text-muted block">Tiến độ CTĐT:</span>
            <span className="text-lg font-bold text-success" id="detailProgress">
              {student.progress || 55.4}%
            </span>
          </div>
          <div>
            <span className="text-xs text-muted block">Dự kiến tốt nghiệp:</span>
            <span className="text-lg font-bold">Tháng 06/2026</span>
          </div>
        </div>
      </div>

      {/* Tab Controls */}
      <div className="tabs-header mb-6">
        <button 
          type="button" 
          className={`tab-btn ${activeTab === 'audit' ? 'active' : ''}`}
          onClick={() => setActiveTab('audit')}
        >
          1. Chuẩn tốt nghiệp & Đánh giá
        </button>
        <button 
          type="button" 
          className={`tab-btn ${activeTab === 'transcript' ? 'active' : ''}`}
          onClick={() => setActiveTab('transcript')}
        >
          2. Bảng điểm học kỳ
        </button>
        <button 
          type="button" 
          className={`tab-btn ${activeTab === 'roadmap' ? 'active' : ''}`}
          onClick={() => setActiveTab('roadmap')}
        >
          3. Lộ trình cá nhân hóa (AI)
        </button>
        <button 
          type="button" 
          className={`tab-btn ${activeTab === 'notes' ? 'active' : ''}`}
          onClick={() => setActiveTab('notes')}
        >
          4. Ghi chú của Cố vấn
        </button>
      </div>

      {/* Tab 1: Audit */}
      {activeTab === 'audit' && (
        <div className="tab-pane active" id="tab-audit">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4 items-stretch">
            {/* Card 1: Tiến độ tích lũy theo khối kiến thức */}
            <div className="minimal-card flex flex-col h-full" style={{ marginBottom: 0 }}>
              <div className="card-header d-flex justify-between items-center mb-3">
                <h2 className="card-title text-base font-bold text-main">Tiến độ tích lũy theo khối kiến thức (Khung 130 tín chỉ)</h2>
                <span className="badge badge-primary">QĐ 458/QĐ-HVHC</span>
              </div>
              <div className="card-body space-y-4 flex-1 p-0" id="detailAuditBlocks">
                {MOCK_KNOWLEDGE_BLOCKS.map(b => (
                  <div key={b.id}>
                    <div className="d-flex justify-between items-center text-sm mb-1">
                      <span className="font-medium text-main">{b.title}:</span>
                      <span className={`font-bold ${b.percentage >= 100 ? 'text-success' : 'text-primary'}`}>
                        {b.completed} / {b.required} TC ({b.percentage}%)
                      </span>
                    </div>
                    <div className="progress-bar-container" style={{ height: '7px', background: '#F1F5F9', border: '1px solid #D1D5DB', borderRadius: '999px', overflow: 'hidden' }}>
                      <div 
                        className={`progress-bar-fill ${b.percentage >= 100 ? 'bg-success' : 'bg-primary'}`} 
                        style={{ 
                          width: `${Math.min(100, b.percentage)}%`, 
                          height: '100%',
                          backgroundColor: b.percentage >= 100 ? '#10B981' : '#4F46E5',
                          borderRadius: '999px'
                        }}
                      />
                    </div>
                    <div className="text-xs text-muted mt-1">{b.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 2: Chuẩn đầu ra điều kiện */}
            <div className="minimal-card flex flex-col h-full" style={{ marginBottom: 0 }}>
              <div className="card-header d-flex justify-between items-center mb-3">
                <h2 className="card-title text-base font-bold text-main">Chuẩn đầu ra điều kiện</h2>
                <span className="badge badge-secondary">5/5 Yêu cầu</span>
              </div>
              <div className="card-body space-y-2.5 flex-1 p-0" id="detailNonCreditCerts">
                {certs.map((c, i) => (
                  <div key={i} className="d-flex justify-between items-center p-2.5 rounded border" style={{ background: 'var(--surface)', border: '1px solid #E5E7EB' }}>
                    <div>
                      <div className="text-xs font-semibold text-main">{c.name}</div>
                      <div className="text-xs text-muted">{c.note}</div>
                    </div>
                    <span className={`badge ${c.badgeClass}`}>{c.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottleneck callout */}
          <div className="minimal-card p-4 mb-4" style={{ borderLeft: '4px solid var(--danger)' }}>
            <h3 className="text-sm font-semibold text-danger mb-1.5 d-flex items-center gap-1.5">
              <AlertTriangle size={15} />
              <span>Rào cản điều kiện tiên quyết AI phát hiện</span>
            </h3>
            <p className="text-xs text-main mb-1.5 leading-relaxed">
              Chưa hoàn thành <strong>LIF2004 (Hệ quản trị CSDL - 3 TC)</strong>, chưa đáp ứng điều kiện tiên quyết cho <strong>ISFI25-2010</strong> và các học phần chuyên ngành tiếp theo.
            </p>
            <div className="text-xs text-muted">
              Khuyến nghị: Yêu cầu sinh viên ưu tiên đăng ký học bổ sung trong Học kỳ 6.
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Transcript */}
      {activeTab === 'transcript' && (
        <div className="tab-pane active" id="tab-transcript">
          <div className="minimal-card mb-4">
            <div className="card-header d-flex justify-between items-center">
              <h3 className="card-title">Bảng điểm tổng hợp các học kỳ</h3>
              <span className="text-xs text-muted">Thang điểm 10 & Thang điểm 4</span>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="minimal-table">
                  <thead>
                    <tr>
                      <th>Mã HP</th>
                      <th>Tên học phần</th>
                      <th>TC</th>
                      <th>Học kỳ</th>
                      <th>Điểm 10</th>
                      <th>Điểm chữ</th>
                      <th>Điểm 4</th>
                      <th>Kết quả</th>
                    </tr>
                  </thead>
                  <tbody id="detailTranscriptBody">
                    {STUDENT_TRANSCRIPT_GRADES.map((g, i) => (
                      <tr key={i}>
                        <td><code>{g.courseCode}</code></td>
                        <td className="font-medium text-main">{g.courseName}</td>
                        <td><strong>{g.credits}</strong></td>
                        <td className="text-xs text-muted">{g.semester}</td>
                        <td className="font-bold text-main">{g.score10.toFixed(1)}</td>
                        <td>
                          <span className={`badge ${g.letterGrade.startsWith('A') ? 'badge-success' : g.letterGrade.startsWith('B') ? 'badge-primary' : 'badge-warning'}`}>
                            {g.letterGrade}
                          </span>
                        </td>
                        <td className="font-semibold text-main">{g.gradePoint.toFixed(1)}</td>
                        <td>
                          <span className="badge badge-success">
                            <CheckCircle size={12} />
                            <span>Đạt</span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Roadmap */}
      {activeTab === 'roadmap' && (
        <div className="tab-pane active" id="tab-roadmap">
          <div className="minimal-card p-6 mb-4">
            <div className="d-flex justify-between items-center mb-4 flex-wrap gap-2">
              <div>
                <h2 className="text-base font-bold text-main">Lộ trình học tập cá nhân hóa đề xuất</h2>
              </div>
              <div className="d-flex gap-2">
                <button 
                  type="button" 
                  className="btn btn-outline btn-sm" 
                  id="btnRegenerateRoadmap"
                  onClick={handleRegenerateRoadmap}
                >
                  <RefreshCw size={14} />
                  <span>Sinh lại lộ trình</span>
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary btn-sm" 
                  id="btnApproveRoadmap"
                  onClick={handleApproveRoadmap}
                >
                  <Check size={14} />
                  <span>Chấp thuận & Ban hành</span>
                </button>
              </div>
            </div>

            <div id="roadmapSemestersContainer" className="space-y-4">
              {/* Semester 1 */}
              <div className="p-4 rounded" style={{ border: '1px solid var(--border)', borderRadius: '12px', backgroundColor: 'var(--surface, #FFFFFF)' }}>
                <div className="d-flex justify-between items-center mb-2">
                  <h3 className="font-bold text-sm text-main">Học kỳ 6 (Học kỳ 2 • 2024-2025)</h3>
                  <span className="badge badge-primary font-bold">16 Tín chỉ</span>
                </div>
                <div className="text-xs text-secondary leading-relaxed">
                  Bao gồm: LIF2004 (Hệ QTC CSDL - 3 TC), ISFI25-2010 (Khai phá dữ liệu - 3 TC), CNTT301 (PT&TK HTTT - 3 TC), SMF0003 (Đạo đức công vụ - 3 TC), Tiếng Anh B1 (4 TC).
                </div>
              </div>

              {/* Semester 2 */}
              <div className="p-4 rounded" style={{ border: '1px solid var(--border)', borderRadius: '12px', backgroundColor: 'var(--surface, #FFFFFF)' }}>
                <div className="d-flex justify-between items-center mb-2">
                  <h3 className="font-bold text-sm text-main">Học kỳ 7 (Học kỳ 1 • 2025-2026)</h3>
                  <span className="badge badge-secondary font-bold">15 Tín chỉ</span>
                </div>
                <div className="text-xs text-secondary leading-relaxed">
                  Bao gồm: ISFI25-2014 (Dữ liệu lớn - 3 TC), ISFI25-2001 (An toàn HTTT - 3 TC), ISFI25-3002 (Kiến tập giữa kỳ - 3 TC), 2 Học phần tự chọn chuyên ngành (6 TC).
                </div>
              </div>

              {/* Semester 3 */}
              <div className="p-4 rounded" style={{ border: '1px solid var(--border)', borderRadius: '12px', backgroundColor: 'var(--surface, #FFFFFF)' }}>
                <div className="d-flex justify-between items-center mb-2">
                  <h3 className="font-bold text-sm text-main">Học kỳ 8 (Học kỳ 2 • 2025-2026 • Tốt nghiệp)</h3>
                  <span className="badge badge-success font-bold">15 Tín chỉ</span>
                </div>
                <div className="text-xs text-secondary leading-relaxed">
                  Bao gồm: Thực tập tốt nghiệp (8 TC) và Khóa luận tốt nghiệp cử nhân (7 TC).
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Advisor Notes */}
      {activeTab === 'notes' && (
        <div className="tab-pane active" id="tab-notes">
          <div className="minimal-card p-6 mb-4">
            <h2 className="text-base font-bold mb-3 text-main">Nhật ký hỗ trợ & Biên bản tư vấn học vụ</h2>
            
            {/* Saved Notes History */}
            <div className="space-y-3 mb-4" id="advisorNotesHistory">
              {notesList.map(n => (
                <div key={n.id} className="p-3 rounded border" style={{ background: 'var(--surface-subtle)' }}>
                  <div className="d-flex justify-between items-center mb-1">
                    <span className="font-bold text-xs text-primary">{n.advisor}</span>
                    <span className="text-xs text-muted">{n.date}</span>
                  </div>
                  <p className="text-xs text-secondary leading-relaxed">{n.content}</p>
                </div>
              ))}
            </div>

            <div className="form-group mb-3">
              <label className="form-label text-xs font-semibold">Thêm ghi chú tư vấn/hỗ trợ mới</label>
              <textarea 
                className="form-control" 
                id="advisorNotesInput" 
                rows={3} 
                placeholder="Nhập ghi chú định hướng nghề nghiệp, nhắc nhở học vụ hoặc kết quả trao đổi với sinh viên..."
                value={newNote}
                onChange={e => setNewNote(e.target.value)}
              />
            </div>
            <button 
              type="button" 
              className="btn btn-primary btn-sm" 
              id="btnSaveAdvisorNotes"
              onClick={handleSaveNotes}
            >
              <Save size={14} />
              <span>Lưu biên bản tư vấn/hỗ trợ</span>
            </button>
          </div>
        </div>
      )}

      {/* AI Analyze Modal */}
      {showAiModal && (
        <div className="modal-backdrop" style={{ display: 'flex' }} onClick={() => setShowAiModal(false)}>
          <div className="modal-dialog" onClick={e => e.stopPropagation()} style={{ maxWidth: '580px' }}>
            <div className="modal-header">
              <div className="d-flex items-center gap-2">
                <Sparkles size={18} className="text-primary" />
                <h3 className="modal-title">AI Academic Advisor • Phân tích hồ sơ 360°</h3>
              </div>
              <button type="button" className="modal-close-btn" onClick={() => setShowAiModal(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body space-y-4">
              <div className="p-3 rounded bg-surface border" style={{ borderLeft: '3px solid var(--primary)' }}>
                <div className="font-bold text-sm text-main mb-1">Đánh giá tổng quan tiến độ:</div>
                <p className="text-xs text-secondary leading-relaxed">
                  Sinh viên {student.name} có kết quả học tập tốt (GPA {student.gpa}/4.0), tích lũy 72/130 tín chỉ (55.4%). Dự kiến hoàn thành đúng hạn vào tháng 06/2026.
                </p>
              </div>

              <div className="p-3 rounded bg-surface border" style={{ borderLeft: '3px solid var(--danger)' }}>
                <div className="font-bold text-sm text-danger mb-1">Cảnh báo rủi ro & Rào cản tiên quyết:</div>
                <p className="text-xs text-secondary leading-relaxed">
                  - Chưa tích lũy học phần tiên quyết <strong>LIF2004</strong>.<br />
                  - Chưa nộp chứng chỉ tiếng Anh B1 (CHUANNN). Cần nộp trước HK6 để bảo đảm đủ điều kiện đăng ký học phần thực tập.
                </p>
              </div>

              <div className="p-3 rounded bg-surface border" style={{ borderLeft: '3px solid var(--accent-blue-start)' }}>
                <div className="font-bold text-sm text-primary mb-1">Khuyến nghị kế hoạch hỗ trợ cho CVHT:</div>
                <p className="text-xs text-secondary leading-relaxed">
                  Gợi ý sinh viên đăng ký học bổ sung LIF2004 trong kỳ hè hoặc kỳ phụ; duyệt lộ trình học tập 16 tín chỉ trong HK6 để cân đối khối lượng học tập.
                </p>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" onClick={() => setShowAiModal(false)}>
                Đã hiểu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Send Alert Modal */}
      {showAlertModal && (
        <div className="modal-backdrop" style={{ display: 'flex' }} onClick={() => setShowAlertModal(false)}>
          <div className="modal-dialog" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="d-flex items-center gap-2">
                <Bell size={18} className="text-primary" />
                <h3 className="modal-title">Gửi nhắc nhở học vụ tới sinh viên</h3>
              </div>
              <button type="button" className="modal-close-btn" onClick={() => setShowAlertModal(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body space-y-3">
              <p className="text-sm">
                Gửi thông báo trực tiếp tới cổng sinh viên của <strong>{student.name}</strong> ({student.studentId}):
              </p>
              <div className="form-group">
                <label className="form-label text-xs font-semibold">Nội dung thông báo:</label>
                <textarea 
                  className="form-control"
                  rows={4}
                  value={alertContent}
                  onChange={e => setAlertContent(e.target.value)}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setShowAlertModal(false)}>
                Hủy bỏ
              </button>
              <button type="button" className="btn btn-primary" onClick={handleSendAlert}>
                <Send size={14} />
                <span>Gửi ngay</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
