// ==========================================================================
// APAG Student Curriculum Page Component (React + TypeScript)
// Exact 1:1 Restoration matching pages/student/curriculum.html & js/student/curriculum.js
// ==========================================================================

import React, { useState, useMemo } from 'react';
import { Download, Search, X } from 'lucide-react';
import { Utils } from '../../utils/utils';

interface CourseItem {
  id: string;
  code: string;
  name: string;
  credits: number;
  theoryCredits?: number;
  practicalCredits?: number;
  proposedSemester?: number;
  group: string;
  category: 'Đại cương' | 'Cơ sở ngành' | 'Chuyên ngành' | 'Tốt nghiệp';
  type: string;
  prerequisites: string[];
  description?: string;
  department?: string;
}

const APAG_CURRICULUM_COURSES: CourseItem[] = [
  { id: "c1", code: "LIF2003", name: "Phân tích và thiết kế hệ thống thông tin", credits: 3, theoryCredits: 2, practicalCredits: 1, proposedSemester: 3, group: "Khối kiến thức chuyên ngành", category: "Chuyên ngành", type: "Bắt buộc", prerequisites: ["LIF1006", "LIF2004"] },
  { id: "c2", code: "LIF2019", name: "Lập trình hướng đối tượng", credits: 3, theoryCredits: 2, practicalCredits: 1, proposedSemester: 3, group: "Khối kiến thức chuyên ngành", category: "Chuyên ngành", type: "Bắt buộc", prerequisites: [] },
  { id: "c3", code: "LIF1006", name: "Cấu trúc dữ liệu và giải thuật", credits: 3, theoryCredits: 2, practicalCredits: 1, proposedSemester: 3, group: "Khối kiến thức chuyên ngành", category: "Chuyên ngành", type: "Bắt buộc", prerequisites: [] },
  { id: "c4", code: "LIF2004", name: "Hệ quản trị cơ sở dữ liệu", credits: 3, theoryCredits: 2, practicalCredits: 1, proposedSemester: 4, group: "Khối kiến thức chuyên ngành", category: "Chuyên ngành", type: "Bắt buộc", prerequisites: [] },
  { id: "c5", code: "LIF2115", name: "Lập trình Python", credits: 3, theoryCredits: 2, practicalCredits: 1, proposedSemester: 4, group: "Khối kiến thức chuyên ngành", category: "Chuyên ngành", type: "Bắt buộc", prerequisites: [] },
  { id: "c6", code: "LIF2023", name: "Ngôn ngữ lập trình C#", credits: 3, theoryCredits: 2, practicalCredits: 1, proposedSemester: 4, group: "Khối kiến thức chuyên ngành", category: "Chuyên ngành", type: "Tự chọn", prerequisites: ["LIF2019"] },
  { id: "c7", code: "ISFI25-2004", name: "Ngôn ngữ lập trình Java", credits: 3, theoryCredits: 2, practicalCredits: 1, proposedSemester: 4, group: "Khối kiến thức chuyên ngành", category: "Chuyên ngành", type: "Bắt buộc", prerequisites: ["LIF2019"] },
  { id: "c8", code: "LIF2024", name: "Ngôn ngữ lập trình PHP", credits: 3, theoryCredits: 2, practicalCredits: 1, proposedSemester: 4, group: "Khối kiến thức chuyên ngành", category: "Chuyên ngành", type: "Tự chọn", prerequisites: [] },
  { id: "c9", code: "LIF2113", name: "Mạng máy tính", credits: 3, theoryCredits: 2, practicalCredits: 1, proposedSemester: 5, group: "Khối kiến thức chuyên ngành", category: "Chuyên ngành", type: "Bắt buộc", prerequisites: ["ISFI25-1007"] },
  { id: "c10", code: "LIF2020", name: "Lập trình Web", credits: 3, theoryCredits: 2, practicalCredits: 1, proposedSemester: 5, group: "Khối kiến thức chuyên ngành", category: "Chuyên ngành", type: "Bắt buộc", prerequisites: ["LIF2019"] },
  { id: "c11", code: "ISFI25-2007", name: "Công nghệ phần mềm", credits: 3, theoryCredits: 2, practicalCredits: 1, proposedSemester: 5, group: "Khối kiến thức chuyên ngành", category: "Chuyên ngành", type: "Bắt buộc", prerequisites: ["LIF2003"] },
  { id: "c12", code: "ISFI25-2010", name: "Khai phá dữ liệu", credits: 3, theoryCredits: 2, practicalCredits: 1, proposedSemester: 5, group: "Khối kiến thức chuyên ngành", category: "Chuyên ngành", type: "Bắt buộc", prerequisites: ["LIF2004", "LIF2115"] },
  { id: "c13", code: "ISFI25-2001", name: "An toàn hệ thống thông tin", credits: 3, theoryCredits: 2, practicalCredits: 1, proposedSemester: 6, group: "Khối kiến thức chuyên ngành", category: "Chuyên ngành", type: "Bắt buộc", prerequisites: ["LIF2113"] },
  { id: "c14", code: "ISFI25-2002", name: "Quản trị hệ thống thông tin", credits: 3, theoryCredits: 2, practicalCredits: 1, proposedSemester: 6, group: "Khối kiến thức chuyên ngành", category: "Chuyên ngành", type: "Bắt buộc", prerequisites: ["LIF2003"] },
  { id: "c15", code: "ISFI25-2003", name: "Quản trị mạng", credits: 3, theoryCredits: 2, practicalCredits: 1, proposedSemester: 6, group: "Khối kiến thức chuyên ngành", category: "Chuyên ngành", type: "Bắt buộc", prerequisites: ["LIF2113"] },
  { id: "c16", code: "LIF2005", name: "Trí tuệ nhân tạo", credits: 3, theoryCredits: 2, practicalCredits: 1, proposedSemester: 6, group: "Khối kiến thức chuyên ngành", category: "Chuyên ngành", type: "Bắt buộc", prerequisites: ["LIF2115", "LIF1010"] },
  { id: "c17", code: "ISFI25-2005", name: "Quản trị dự án công nghệ thông tin", credits: 3, theoryCredits: 2, practicalCredits: 1, proposedSemester: 6, group: "Khối kiến thức chuyên ngành", category: "Chuyên ngành", type: "Bắt buộc", prerequisites: ["ISFI25-2007"] },
  { id: "c18", code: "ISFI25-2006", name: "Hệ thống thông tin tác nghiệp", credits: 3, theoryCredits: 2, practicalCredits: 1, proposedSemester: 6, group: "Khối kiến thức chuyên ngành", category: "Chuyên ngành", type: "Bắt buộc", prerequisites: ["LIF2003"] },
  { id: "c19", code: "ISFI25-2009", name: "Tích hợp hệ thống", credits: 3, theoryCredits: 2, practicalCredits: 1, proposedSemester: 6, group: "Khối kiến thức chuyên ngành", category: "Chuyên ngành", type: "Bắt buộc", prerequisites: ["ISFI25-2002"] },
  { id: "c20", code: "ISFI25-2008", name: "Bảo trì hệ thống", credits: 3, theoryCredits: 2, practicalCredits: 1, proposedSemester: 6, group: "Khối kiến thức chuyên ngành", category: "Chuyên ngành", type: "Bắt buộc", prerequisites: ["ISFI25-2002"] },
  { id: "c21", code: "ISFI25-2011", name: "Hệ thống thông tin quản lý hành chính", credits: 3, theoryCredits: 2, practicalCredits: 1, proposedSemester: 6, group: "Khối kiến thức chuyên ngành", category: "Chuyên ngành", type: "Bắt buộc", prerequisites: ["LIF2003"] },
  { id: "c22", code: "ISFI25-2012", name: "Hệ thống thông tin văn thư lưu trữ", credits: 3, theoryCredits: 2, practicalCredits: 1, proposedSemester: 6, group: "Khối kiến thức chuyên ngành", category: "Chuyên ngành", type: "Bắt buộc", prerequisites: ["LIF2003"] },
  { id: "c23", code: "ISFI25-2013", name: "Hệ thống thông tin quản trị nhân lực", credits: 3, theoryCredits: 2, practicalCredits: 1, proposedSemester: 6, group: "Khối kiến thức chuyên ngành", category: "Chuyên ngành", type: "Bắt buộc", prerequisites: ["LIF2003"] },
  { id: "c24", code: "ISFI25-2014", name: "Dữ liệu lớn và công nghệ xử lý", credits: 3, theoryCredits: 2, practicalCredits: 1, proposedSemester: 7, group: "Khối kiến thức chuyên ngành", category: "Chuyên ngành", type: "Bắt buộc", prerequisites: ["ISFI25-2010"] },
  { id: "c25", code: "ISFI25-2015", name: "Phát triển ứng dụng web", credits: 3, theoryCredits: 2, practicalCredits: 1, proposedSemester: 7, group: "Khối kiến thức chuyên ngành", category: "Chuyên ngành", type: "Bắt buộc", prerequisites: ["LIF2020"] },

  { id: "c26", code: "ISFI25-1005", name: "Khởi nghiệp và đổi mới sáng tạo", credits: 3, theoryCredits: 2, practicalCredits: 1, proposedSemester: 2, group: "Khối kiến thức cơ sở ngành", category: "Cơ sở ngành", type: "Bắt buộc", prerequisites: [] },
  { id: "c27", code: "EMF25-1013", name: "Marketing căn bản", credits: 3, theoryCredits: 3, practicalCredits: 0, proposedSemester: 2, group: "Khối kiến thức cơ sở ngành", category: "Cơ sở ngành", type: "Bắt buộc", prerequisites: [] },
  { id: "c28", code: "ISFI25-1007", name: "Cấu trúc máy tính và hệ điều hành", credits: 3, theoryCredits: 2, practicalCredits: 1, proposedSemester: 3, group: "Khối kiến thức cơ sở ngành", category: "Cơ sở ngành", type: "Bắt buộc", prerequisites: [] },
  { id: "c29", code: "LIF0006", name: "Xác suất và thống kê", credits: 3, theoryCredits: 2, practicalCredits: 1, proposedSemester: 3, group: "Khối kiến thức cơ sở ngành", category: "Cơ sở ngành", type: "Bắt buộc", prerequisites: [] },
  { id: "c30", code: "LIF1009", name: "Phương pháp tính", credits: 3, theoryCredits: 2, practicalCredits: 1, proposedSemester: 3, group: "Khối kiến thức cơ sở ngành", category: "Cơ sở ngành", type: "Bắt buộc", prerequisites: [] },
  { id: "c31", code: "LIF1010", name: "Tối ưu hóa", credits: 3, theoryCredits: 2, practicalCredits: 1, proposedSemester: 3, group: "Khối kiến thức cơ sở ngành", category: "Cơ sở ngành", type: "Bắt buộc", prerequisites: ["LIF1009"] },
  { id: "c32", code: "ISFI25-1006", name: "Data-Driven Decision Making", credits: 3, theoryCredits: 2, practicalCredits: 1, proposedSemester: 4, group: "Khối kiến thức cơ sở ngành", category: "Cơ sở ngành", type: "Bắt buộc", prerequisites: ["LIF0006"] },
  { id: "c33", code: "AMF25-1009", name: "Kỹ năng giao tiếp", credits: 3, theoryCredits: 3, practicalCredits: 0, proposedSemester: 5, group: "Khối kiến thức cơ sở ngành", category: "Cơ sở ngành", type: "Bắt buộc", prerequisites: [] },
  { id: "c34", code: "AMF25-1005", name: "Kỹ năng soạn thảo văn bản", credits: 3, theoryCredits: 3, practicalCredits: 0, proposedSemester: 5, group: "Khối kiến thức cơ sở ngành", category: "Cơ sở ngành", type: "Bắt buộc", prerequisites: [] },

  { id: "c35", code: "ISF0009", name: "Giáo dục quốc phòng-an ninh", credits: 8, theoryCredits: 3, practicalCredits: 5, proposedSemester: 1, group: "Khối kiến thức đại cương", category: "Đại cương", type: "Bắt buộc", prerequisites: [] },
  { id: "c36", code: "CHUANNN", name: "NLNN bậc 3/6 khung năng lực ngoại ngữ của VN", credits: 3, theoryCredits: 3, practicalCredits: 0, proposedSemester: 1, group: "Khối kiến thức đại cương", category: "Đại cương", type: "Bắt buộc", prerequisites: [] },
  { id: "c37", code: "CHUANTH", name: "Chuẩn kỹ năng sử dụng CNTT cơ bản", credits: 3, theoryCredits: 3, practicalCredits: 0, proposedSemester: 1, group: "Khối kiến thức đại cương", category: "Đại cương", type: "Bắt buộc", prerequisites: [] },
  { id: "c38", code: "ISF0010", name: "Giáo dục thể chất", credits: 3, theoryCredits: 1, practicalCredits: 2, proposedSemester: 2, group: "Khối kiến thức đại cương", category: "Đại cương", type: "Bắt buộc", prerequisites: [] },
  { id: "c39", code: "ISF0004", name: "Chủ nghĩa xã hội khoa học", credits: 2, theoryCredits: 2, practicalCredits: 0, proposedSemester: 3, group: "Khối kiến thức đại cương", category: "Đại cương", type: "Bắt buộc", prerequisites: [] },
  { id: "c40", code: "ISF0006", name: "Lịch sử Đảng cộng sản Việt Nam", credits: 2, theoryCredits: 2, practicalCredits: 0, proposedSemester: 3, group: "Khối kiến thức đại cương", category: "Đại cương", type: "Bắt buộc", prerequisites: [] },
  { id: "c41", code: "SMF0003", name: "Đạo đức và trách nhiệm xã hội", credits: 3, theoryCredits: 3, practicalCredits: 0, proposedSemester: 5, group: "Khối kiến thức đại cương", category: "Đại cương", type: "Bắt buộc", prerequisites: [] },

  { id: "c42", code: "ISFI25-3002", name: "Kiến tập giữa kỳ-Hệ thống thông tin", credits: 3, theoryCredits: 0, practicalCredits: 3, proposedSemester: 5, group: "Thực tập tốt nghiệp", category: "Tốt nghiệp", type: "Bắt buộc", prerequisites: [] },
  { id: "c43", code: "ISFI25-3001", name: "Trải nghiệm thực tế-Hệ thống thông tin", credits: 3, theoryCredits: 0, practicalCredits: 3, proposedSemester: 6, group: "Thực tập tốt nghiệp", category: "Tốt nghiệp", type: "Bắt buộc", prerequisites: ["ISFI25-3002"] },
  { id: "c44", code: "ISFI25-3003", name: "Thực tập-Hệ thống thông tin", credits: 8, theoryCredits: 0, practicalCredits: 8, proposedSemester: 7, group: "Thực tập tốt nghiệp", category: "Tốt nghiệp", type: "Bắt buộc", prerequisites: ["ISFI25-3001"] },
  { id: "c45", code: "ISFI25-3004", name: "Khóa luận tốt nghiệp-Hệ thống thông tin", credits: 6, theoryCredits: 0, practicalCredits: 6, proposedSemester: 7, group: "Thực tập tốt nghiệp", category: "Tốt nghiệp", type: "Bắt buộc", prerequisites: ["ISFI25-3003"] }
];

const COMPLETED_CODES = new Set([
  'ISF0009', 'CHUANNN', 'CHUANTH', 'ISF0010', 'ISF0004', 'ISF0006',
  'ISFI25-1005', 'EMF25-1013', 'ISFI25-1007', 'LIF0006', 'LIF1009', 'LIF1010', 'ISFI25-1006',
  'LIF2019', 'LIF1006', 'LIF2004', 'LIF2115'
]);

const IN_PROGRESS_CODES = new Set([
  'LIF2003', 'LIF2113', 'LIF2020', 'ISFI25-2007'
]);

export const StudentCurriculum: React.FC = () => {
  const [currentCategory, setCurrentCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCourse, setSelectedCourse] = useState<CourseItem | null>(null);

  const filteredCourses = useMemo(() => {
    let list = APAG_CURRICULUM_COURSES;
    if (currentCategory !== 'all') {
      list = list.filter(c => c.category === currentCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(c => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q));
    }
    return list;
  }, [currentCategory, searchQuery]);

  const handleExportPDF = () => {
    Utils.showToast('Đang tải khung chương trình đào tạo chuẩn (PDF)...', 'info');
    setTimeout(() => {
      Utils.showToast('Đã tải xuống Khung_CTDT_APAG_K25.pdf!', 'success');
    }, 600);
  };

  const handleAskAI = (course: CourseItem) => {
    setSelectedCourse(null);
    const chatInput = document.getElementById('aiChatInput') as HTMLInputElement | null;
    const chatWindow = document.getElementById('aiChatWindow');
    if (chatInput && chatWindow) {
      chatWindow.style.display = 'flex';
      chatInput.value = `Tư vấn cho tôi về học phần ${course.code} - ${course.name}, điều kiện tiên quyết và cách học đạt điểm cao?`;
      chatInput.focus();
    } else {
      Utils.showToast(`Đã lưu câu hỏi tư vấn AI về học phần ${course.code}!`, 'info');
    }
  };

  return (
    <div>
      {/* Top Action Button */}
      <div className="d-flex justify-end mb-4" style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button type="button" className="btn btn-secondary btn-sm" onClick={handleExportPDF}>
          <Download size={14} />
          <span>Tải khung CTĐT (PDF)</span>
        </button>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="minimal-card mb-6 p-4">
        <div className="d-flex gap-4 flex-wrap items-center justify-between" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
          <div className="d-flex gap-2 flex-wrap items-center" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span className="text-xs font-semibold text-muted uppercase">Khối kiến thức:</span>
            <button 
              type="button" 
              className={`btn btn-sm ${currentCategory === 'all' ? 'btn-primary active' : 'btn-secondary'}`}
              onClick={() => setCurrentCategory('all')}
            >
              Tất cả
            </button>
            <button 
              type="button" 
              className={`btn btn-sm ${currentCategory === 'Đại cương' ? 'btn-primary active' : 'btn-secondary'}`}
              onClick={() => setCurrentCategory('Đại cương')}
            >
              Đại cương (24 TC)
            </button>
            <button 
              type="button" 
              className={`btn btn-sm ${currentCategory === 'Cơ sở ngành' ? 'btn-primary active' : 'btn-secondary'}`}
              onClick={() => setCurrentCategory('Cơ sở ngành')}
            >
              Cơ sở ngành (30 TC)
            </button>
            <button 
              type="button" 
              className={`btn btn-sm ${currentCategory === 'Chuyên ngành' ? 'btn-primary active' : 'btn-secondary'}`}
              onClick={() => setCurrentCategory('Chuyên ngành')}
            >
              Chuyên ngành (46 TC)
            </button>
            <button 
              type="button" 
              className={`btn btn-sm ${currentCategory === 'Tốt nghiệp' ? 'btn-primary active' : 'btn-secondary'}`}
              onClick={() => setCurrentCategory('Tốt nghiệp')}
            >
              Tốt nghiệp (15 TC)
            </button>
          </div>

          <div className="d-flex gap-2 items-center">
            <div className="input-with-icon" style={{ width: '260px', position: 'relative' }}>
              <Search size={14} className="text-muted" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="text" 
                className="form-control" 
                placeholder="Tìm theo mã hoặc tên HP..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '34px' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Curriculum Table */}
      <div className="minimal-card">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="minimal-table">
              <thead>
                <tr>
                  <th>Mã HP</th>
                  <th>Tên học phần</th>
                  <th>Số TC</th>
                  <th>LT / TH</th>
                  <th>Học phần tiên quyết</th>
                  <th>Học kỳ gợi ý</th>
                  <th>Tình trạng của bạn</th>
                  <th style={{ textAlign: 'center' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredCourses.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-6 text-muted">
                      Không tìm thấy học phần phù hợp
                    </td>
                  </tr>
                ) : (
                  filteredCourses.map(c => {
                    let statusBadge = <span className="badge badge-outline">Chưa học</span>;
                    if (COMPLETED_CODES.has(c.code)) {
                      statusBadge = <span className="badge badge-success">Đã tích lũy</span>;
                    } else if (IN_PROGRESS_CODES.has(c.code)) {
                      statusBadge = <span className="badge badge-info">Đang học</span>;
                    }

                    return (
                      <tr key={c.id}>
                        <td><code>{c.code}</code></td>
                        <td className="font-medium text-main">{c.name}</td>
                        <td><strong>{c.credits}</strong></td>
                        <td>{c.theoryCredits || c.credits} / {c.practicalCredits || 0}</td>
                        <td>
                          {c.prerequisites && c.prerequisites.length > 0 ? (
                            <div className="d-flex gap-1 flex-wrap">
                              {c.prerequisites.map(p => (
                                <span key={p} className="badge badge-outline" style={{ fontSize: '0.75rem' }}>{p}</span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-muted text-xs">Không</span>
                          )}
                        </td>
                        <td>Kỳ {c.proposedSemester || '--'}</td>
                        <td>{statusBadge}</td>
                        <td style={{ textAlign: 'center' }}>
                          <button 
                            type="button" 
                            className="btn btn-outline btn-xs"
                            onClick={() => setSelectedCourse(c)}
                          >
                            Chi tiết
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Course Detail Modal */}
      {selectedCourse && (
        <div 
          className="modal-backdrop" 
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
          onClick={(e) => { if (e.target === e.currentTarget) setSelectedCourse(null); }}
        >
          <div className="minimal-card" style={{ width: '100%', maxWidth: '520px', margin: '20px', padding: '24px' }}>
            <div className="d-flex justify-between items-center mb-3" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 className="text-base font-bold text-main">
                Học phần: {selectedCourse.code} - {selectedCourse.name}
              </h3>
              <button type="button" className="btn-close" onClick={() => setSelectedCourse(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div className="d-flex justify-between py-2 border-bottom" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-muted text-xs">Khối kiến thức:</span>
                <span className="font-medium text-xs text-main">{selectedCourse.category} ({selectedCourse.group})</span>
              </div>
              <div className="d-flex justify-between py-2 border-bottom" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-muted text-xs">Số tín chỉ:</span>
                <span className="font-medium text-xs text-main">{selectedCourse.credits} TC ({selectedCourse.theoryCredits || selectedCourse.credits} LT + {selectedCourse.practicalCredits || 0} TH)</span>
              </div>
              <div className="d-flex justify-between py-2 border-bottom" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-muted text-xs">Bộ môn phụ trách:</span>
                <span className="font-medium text-xs text-main">{selectedCourse.department || 'Khoa Công nghệ thông tin APAG'}</span>
              </div>
              <div className="d-flex justify-between py-2 border-bottom" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-muted text-xs">Điều kiện tiên quyết:</span>
                <span className="font-medium text-xs text-main">{selectedCourse.prerequisites?.join(', ') || 'Không có'}</span>
              </div>
              <div className="pt-2">
                <div className="text-muted mb-1 text-xs uppercase font-semibold">Mô tả học phần & Mục tiêu:</div>
                <p className="text-xs text-secondary leading-relaxed">
                  {selectedCourse.description || 'Học phần cung cấp kiến thức nền tảng và chuyên sâu về ứng dụng quản lý hành chính trong môi trường công vụ số hóa.'}
                </p>
              </div>
            </div>

            <div className="d-flex justify-end gap-2 pt-4 mt-2 border-top" style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button type="button" className="btn btn-outline btn-sm" onClick={() => setSelectedCourse(null)}>
                Đóng
              </button>
              <button type="button" className="btn btn-primary btn-sm" onClick={() => handleAskAI(selectedCourse)}>
                Tra cứu thông tin học phần bằng Trợ lý học thuật AI
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
