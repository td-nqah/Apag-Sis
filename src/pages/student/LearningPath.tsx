// ==========================================================================
// APAG Student Learning Path (React + TypeScript)
// Feature 4: Interactive study plan Kanban board across semesters
// ==========================================================================

import React, { useState } from 'react';
import { 
  Send, 
  Sparkles, 
  Download, 
  Loader2, 
  X, 
  AlertTriangle, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Info, 
  Plus, 
  ChevronRight,
  Layers,
  GitBranch
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { Utils } from '../../utils/utils';
import { SkillTree } from '../../components/student/SkillTree';

interface PathCourse {
  code: string;
  name: string;
  credits: number;
  category: string;
  prerequisite: string;
  rationale?: string;
}

interface PathSemester {
  id: string;
  semester: string;
  status: 'current' | 'future';
  courses: PathCourse[];
}

export const StudentLearningPath: React.FC = () => {

  // Kanban Semesters State
  const [semesters, setSemesters] = useState<PathSemester[]>([
    {
      id: 'sem_hk5',
      semester: 'Học kỳ 1 (2024-2025) • HK5 Hiện tại',
      status: 'current',
      courses: [
        { code: 'LIF2003', name: 'Phân tích và thiết kế HTTT', credits: 3, category: 'Chuyên ngành', prerequisite: 'LIF1006', rationale: 'Học phần bắt buộc cơ sở ngành' },
        { code: 'LIF2113', name: 'Mạng máy tính và truyền thông', credits: 3, category: 'Cơ sở ngành', prerequisite: 'LIF1001', rationale: 'Cốt lõi hạ tầng mạng' },
        { code: 'LIF2020', name: 'Lập trình Web doanh nghiệp', credits: 3, category: 'Chuyên ngành', prerequisite: 'LIF1006', rationale: 'Kỹ năng phát triển ứng dụng' },
        { code: 'ISFI25-2007', name: 'Công nghệ phần mềm ứng dụng', credits: 3, category: 'Chuyên ngành', prerequisite: '', rationale: 'Phương pháp luận quy trình phát triển' },
        { code: 'GDTC3', name: 'Giáo dục thể chất 3 (Bóng bàn)', credits: 2, category: 'Đại cương', prerequisite: '', rationale: 'Chuẩn điều kiện tốt nghiệp' }
      ]
    },
    {
      id: 'sem_hk6',
      semester: 'Học kỳ 2 (2024-2025) • HK6 Dự kiến',
      status: 'future',
      courses: [
        { code: 'LIF2004', name: 'Hệ quản trị cơ sở dữ liệu', credits: 3, category: 'Cơ sở ngành', prerequisite: 'LIF1006', rationale: 'Hoàn thành học phần tiên quyết' },
        { code: 'ISFI25-2010', name: 'Khai phá dữ liệu & BI', credits: 3, category: 'Chuyên ngành', prerequisite: 'LIF2004', rationale: 'Phân tích dữ liệu kinh doanh' },
        { code: 'ISFI25-2005', name: 'Quản trị dự án CNTT', credits: 3, category: 'Chuyên ngành', prerequisite: '', rationale: 'Kỹ năng quản trị dự án' },
        { code: 'LIF2005', name: 'Trí tuệ nhân tạo căn bản', credits: 3, category: 'Chuyên ngành', prerequisite: 'LIF1006', rationale: 'Xu hướng công nghệ số' },
        { code: 'CHUANNN', name: 'Chuẩn tiếng Anh B1 (VSTEP)', credits: 3, category: 'Đại cương', prerequisite: '', rationale: 'Chuẩn đầu ra B1 trước năm 4' }
      ]
    },
    {
      id: 'sem_hk7',
      semester: 'Học kỳ 1 (2025-2026) • HK7 Chuyên sâu',
      status: 'future',
      courses: [
        { code: 'ISFI25-2011', name: 'HTTT trong quản lý hành chính', credits: 3, category: 'Chuyên ngành', prerequisite: '', rationale: 'Ứng dụng chuyển đổi số công vụ' },
        { code: 'ISFI25-2014', name: 'Dữ liệu lớn trong quản lý công', credits: 3, category: 'Chuyên ngành', prerequisite: 'LIF2004', rationale: 'Phân tích dữ liệu lớn' },
        { code: 'ISFI25-2001', name: 'An toàn hệ thống thông tin', credits: 3, category: 'Chuyên ngành', prerequisite: 'LIF2113', rationale: 'An toàn bảo mật dữ liệu' },
        { code: 'ISFI25-3002', name: 'Kiến tập nghề nghiệp thực tế', credits: 3, category: 'Thực tập', prerequisite: '', rationale: 'Thực tế tại cơ quan quản lý nhà nước' }
      ]
    },
    {
      id: 'sem_hk8',
      semester: 'Học kỳ 2 (2025-2026) • HK8 Tốt nghiệp',
      status: 'future',
      courses: [
        { code: 'ISFI25-3004', name: 'Khóa luận tốt nghiệp cử nhân', credits: 6, category: 'Tốt nghiệp', prerequisite: 'Tích lũy >= 114 TC & GPA >= 2.5', rationale: 'Bảo vệ khóa luận tốt nghiệp cử nhân' },
        { code: 'ISFI25-3003', name: 'Thực tập tốt nghiệp HTTT', credits: 6, category: 'Thực tập', prerequisite: 'Tích lũy >= 100 TC', rationale: 'Thực tập chuyên môn 3 tháng' },
        { code: 'SMF0003', name: 'Đạo đức và trách nhiệm xã hội', credits: 3, category: 'Đại cương', prerequisite: '', rationale: 'Chuẩn mực văn hóa công vụ' }
      ]
    }
  ]);

  // Modals & UI States
  const [activeView, setActiveView] = useState<'kanban' | 'skillTree'>('kanban');
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [advisorNotes, setAdvisorNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Move course between semesters in Kanban
  const handleMoveCourse = (courseCode: string, fromSemIdx: number, direction: 'prev' | 'next') => {
    const targetSemIdx = direction === 'next' ? fromSemIdx + 1 : fromSemIdx - 1;
    if (targetSemIdx < 0 || targetSemIdx >= semesters.length) return;

    setSemesters(prev => {
      const nextSemesters = [...prev];
      const sourceList = [...nextSemesters[fromSemIdx].courses];
      const targetList = [...nextSemesters[targetSemIdx].courses];

      const courseIdx = sourceList.findIndex(c => c.code === courseCode);
      if (courseIdx === -1) return prev;

      const [movedCourse] = sourceList.splice(courseIdx, 1);
      targetList.push(movedCourse);

      nextSemesters[fromSemIdx] = { ...nextSemesters[fromSemIdx], courses: sourceList };
      nextSemesters[targetSemIdx] = { ...nextSemesters[targetSemIdx], courses: targetList };

      return nextSemesters;
    });

    Utils.showToast(`Đã chuyển học phần ${courseCode} sang ${semesters[targetSemIdx].semester.split('•')[0]}!`, 'info');
  };

  // Export Excel
  const handleExportExcel = () => {
    const flatList: any[] = [];
    semesters.forEach(s => {
      s.courses.forEach(c => {
        flatList.push({
          'Học kỳ': s.semester,
          'Mã HP': c.code,
          'Tên học phần': c.name,
          'Số TC': c.credits,
          'Khối kiến thức': c.category,
          'Tiên quyết': c.prerequisite || 'Không',
          'Lý do gợi ý từ AI': c.rationale || ''
        });
      });
    });

    const ws = XLSX.utils.json_to_sheet(flatList);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'LoTrinh_CaNhan_TranManhHa');
    XLSX.writeFile(wb, 'Lo_Trinh_Dao_Tao_APAG_TranManhHa.xlsx');
    Utils.showToast('Đã tải xuống file Excel lộ trình cá nhân!', 'success');
  };

  // Regenerate with AI
  const handleRegenerate = () => {
    setIsRegenerating(true);
    setTimeout(() => {
      setIsRegenerating(false);
      Utils.showToast('AI Rule Engine đã phân tích lại toàn bộ 35 tín chỉ còn lại và cập nhật lộ trình tối ưu!', 'success');
    }, 900);
  };

  // Submit to Advisor
  const handleConfirmSubmit = async () => {
    setIsSubmitting(true);
    try {
      const newReq = {
        id: `REQ-${Date.now().toString().slice(-4)}`,
        studentId: '2505HTTB012',
        studentName: 'Trần Mạnh Hà',
        advisorId: 'adv_01',
        advisorName: 'TS. Nguyễn Năng Thành',
        title: 'Đề xuất phê duyệt Lộ trình đào tạo cá nhân hóa K25',
        content: advisorNotes || 'Sinh viên đề xuất duyệt lộ trình 4 kỳ.',
        aiSummary: 'Lộ trình tối ưu hóa 35 TC, đã thỏa mãn toàn bộ tiên quyết và chuẩn tốt nghiệp tháng 6/2026.',
        createdAt: new Date().toISOString()
      };
      const existing = JSON.parse(localStorage.getItem('apag_requests') || '[]');
      existing.unshift(newReq);
      localStorage.setItem('apag_requests', JSON.stringify(existing));

      setShowSubmitModal(false);
      setAdvisorNotes('');
      Utils.showToast('Đã gửi đề xuất lộ trình tới Cố vấn học tập (Mã REQ-1026).', 'success');
    } catch {
      Utils.showToast('Gửi đề xuất thất bại. Vui lòng thử lại!', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
      {/* Top Action Toolbar & View Switcher */}
      <div 
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '18px',
          flexWrap: 'wrap'
        }}
      >
        {/* View Switcher: Kanban vs Skill Tree */}
        <div 
          style={{
            display: 'inline-flex',
            padding: '3px',
            backgroundColor: 'var(--surface-subtle)',
            borderRadius: '8px',
            border: '1px solid var(--border)'
          }}
        >
          <button
            type="button"
            onClick={() => setActiveView('kanban')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              fontSize: '0.8125rem',
              fontWeight: 600,
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: activeView === 'kanban' ? 'var(--surface)' : 'transparent',
              color: activeView === 'kanban' ? 'var(--primary)' : 'var(--text-secondary)',
              boxShadow: activeView === 'kanban' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <Layers size={14} />
            <span>Kế hoạch 4 kỳ (Kanban)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveView('skillTree')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              fontSize: '0.8125rem',
              fontWeight: 600,
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: activeView === 'skillTree' ? 'var(--surface)' : 'transparent',
              color: activeView === 'skillTree' ? 'var(--primary)' : 'var(--text-secondary)',
              boxShadow: activeView === 'skillTree' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <GitBranch size={14} />
            <span>Sơ đồ Cây học phần & Tiên quyết</span>
          </button>
        </div>

        {/* Action Buttons for Kanban */}
        {activeView === 'kanban' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button 
              type="button" 
              className="btn btn-outline btn-sm"
              onClick={handleExportExcel}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Download size={14} />
              <span>Xuất Excel</span>
            </button>

            <button 
              type="button" 
              className="btn btn-secondary btn-sm"
              onClick={handleRegenerate}
              disabled={isRegenerating}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              {isRegenerating ? <Loader2 size={14} className="spin" /> : <Sparkles size={14} />}
              <span>Tối ưu AI</span>
            </button>

            <button 
              type="button" 
              className="btn btn-primary btn-sm"
              onClick={() => setShowSubmitModal(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Send size={14} />
              <span>Gửi CVHT duyệt</span>
            </button>
          </div>
        )}
      </div>

      {activeView === 'kanban' ? (
        /* Kanban Study Plan Across Semesters */
        <div>
          {/* Strategy Callout */}
          <div 
            className="minimal-card"
            style={{
              padding: '14px 18px',
              borderRadius: '10px',
              backgroundColor: 'var(--primary-light)',
              border: '1px solid var(--primary-border)',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary)', flexShrink: 0 }} />
              <div>
                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Chiến lược tối ưu hóa: 
                </span>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginLeft: '6px' }}>
                  Đã bảo đảm điều kiện đăng ký học phần LIF2004 ở HK6 để sẵn sàng cho Khóa luận tốt nghiệp ở HK8. Chuẩn tốt nghiệp 130 tín chỉ đúng hạn Tháng 6/2026.
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', fontSize: '0.75rem' }}>
              <span style={{ padding: '3px 10px', borderRadius: '4px', backgroundColor: 'var(--surface)', color: 'var(--primary)', fontWeight: 600, border: '1px solid var(--primary-border)' }}>
                Cần tích lũy: 35 TC
              </span>
              <span style={{ padding: '2px 8px', borderRadius: '4px', backgroundColor: 'var(--success-bg)', color: 'var(--success)', fontWeight: 600 }}>
                Đúng hạn 100%
              </span>
            </div>
          </div>

          {/* Kanban Board 4 Columns */}
          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '16px',
              alignItems: 'start'
            }}
          >
            {semesters.map((sem, semIdx) => {
              const semCredits = sem.courses.reduce((sum, c) => sum + c.credits, 0);
              const isOverload = semCredits > 22;
              const isUnderload = semCredits < 12;

              return (
                <div 
                  key={sem.id}
                  style={{
                    backgroundColor: 'var(--surface-subtle)',
                    borderRadius: '10px',
                    border: '1px solid var(--border)',
                    padding: '14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}
                >
                  {/* Column Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {sem.semester.split('•')[0]}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {sem.semester.split('•')[1] || ''}
                      </div>
                    </div>

                    <span 
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '999px',
                        backgroundColor: isOverload ? 'var(--danger-bg)' : isUnderload ? 'var(--warning-bg)' : 'var(--primary-light)',
                        color: isOverload ? 'var(--danger)' : isUnderload ? 'var(--warning-text)' : 'var(--primary)',
                        border: `1px solid ${isOverload ? 'var(--danger-border)' : isUnderload ? 'var(--warning-border)' : 'var(--primary-border)'}`
                      }}
                    >
                      {semCredits} TC
                    </span>
                  </div>

                  {/* Course Cards */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {sem.courses.map((course) => (
                      <div 
                        key={course.code}
                        className="minimal-card"
                        style={{
                          padding: '12px',
                          borderRadius: '8px',
                          backgroundColor: 'var(--surface)',
                          border: '1px solid var(--border)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '6px'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, fontFamily: 'monospace', color: 'var(--primary)' }}>
                            {course.code}
                          </span>
                          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                            {course.credits} TC
                          </span>
                        </div>

                        <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.3 }}>
                          {course.name}
                        </div>

                        {course.prerequisite && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                            <AlertTriangle size={11} /> Tiên quyết: {course.prerequisite}
                          </div>
                        )}

                        {course.rationale && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            💡 {course.rationale}
                          </div>
                        )}

                        {/* Move Course Controls */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '6px', borderTop: '1px solid var(--border-subtle)', marginTop: '4px' }}>
                          <button
                            type="button"
                            disabled={semIdx === 0}
                            onClick={() => handleMoveCourse(course.code, semIdx, 'prev')}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: semIdx === 0 ? 'var(--text-muted)' : 'var(--primary)',
                              cursor: semIdx === 0 ? 'not-allowed' : 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '2px',
                              fontSize: '0.75rem',
                              padding: '2px 4px'
                            }}
                          >
                            <ArrowLeft size={12} /> Kỳ trước
                          </button>

                          <button
                            type="button"
                            disabled={semIdx === semesters.length - 1}
                            onClick={() => handleMoveCourse(course.code, semIdx, 'next')}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: semIdx === semesters.length - 1 ? 'var(--text-muted)' : 'var(--primary)',
                              cursor: semIdx === semesters.length - 1 ? 'not-allowed' : 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '2px',
                              fontSize: '0.75rem',
                              padding: '2px 4px'
                            }}
                          >
                            Kỳ sau <ArrowRight size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <SkillTree />
      )}

      {/* ====================================================================
          SUBMIT TO ADVISOR MODAL
          ==================================================================== */}
      {showSubmitModal && (
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
            if (e.target === e.currentTarget) setShowSubmitModal(false);
          }}
        >
          <div 
            style={{
              backgroundColor: 'var(--surface)',
              borderRadius: '12px',
              border: '1px solid var(--border)',
              maxWidth: '500px',
              width: '100%',
              padding: '24px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                Gửi đề xuất phê duyệt Lộ trình tới Cố vấn học tập
              </h3>
              <button 
                type="button" 
                onClick={() => setShowSubmitModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ marginBottom: '16px', fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Lộ trình 4 học kỳ của bạn sẽ được gửi tới <strong>TS. Nguyễn Năng Thành</strong> (Cố vấn học tập lớp 25HTTB01) xem xét và ghi nhận phê duyệt vào hồ sơ học vụ APAG.
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>
                Lời nhắn kèm theo:
              </label>
              <textarea 
                className="form-control"
                rows={3}
                placeholder="Em chào Thầy, em xin gửi Thầy kế hoạch học tập kỳ 6 và lộ trình hoàn thành 35 tín chỉ tốt nghiệp..."
                value={advisorNotes}
                onChange={(e) => setAdvisorNotes(e.target.value)}
                style={{ width: '100%', fontSize: '0.8125rem', borderRadius: '6px' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button 
                type="button" 
                className="btn btn-outline btn-sm"
                onClick={() => setShowSubmitModal(false)}
              >
                Hủy
              </button>
              <button 
                type="button" 
                className="btn btn-primary btn-sm"
                disabled={isSubmitting}
                onClick={handleConfirmSubmit}
              >
                {isSubmitting ? <Loader2 size={13} className="spin" /> : <Send size={13} />}
                <span>Xác nhận gửi duyệt</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentLearningPath;
