// ==========================================================================
// APAG Student Grades Page Component (React + TypeScript)
// Exact 1:1 Restoration matching pages/student/grades.html & js/student/grades.js
// ==========================================================================

import React, { useState, useMemo } from 'react';
import { FileSpreadsheet, Printer } from 'lucide-react';
import * as XLSX from 'xlsx';
import { Utils } from '../../utils/utils';

interface GradeRecord {
  courseCode: string;
  courseName: string;
  credits: number;
  semester: string;
  attendanceScore: number;
  midtermScore: number;
  finalScore: number;
  score10: number;
  letterGrade: string;
  gradePoint: number;
}

const APAG_STUDENT_GRADES: GradeRecord[] = [
  // HK1 (2022-2023)
  { courseCode: 'ISF0009', courseName: 'Giáo dục quốc phòng-an ninh', credits: 8, semester: 'HK1 2022-2023', attendanceScore: 9.0, midtermScore: 8.5, finalScore: 8.5, score10: 8.5, letterGrade: 'A', gradePoint: 4.0 },
  { courseCode: 'CHUANNN', courseName: 'NLNN bậc 3/6 khung năng lực ngoại ngữ của VN', credits: 3, semester: 'HK1 2022-2023', attendanceScore: 9.5, midtermScore: 9.0, finalScore: 9.0, score10: 9.0, letterGrade: 'A', gradePoint: 4.0 },
  { courseCode: 'CHUANTH', courseName: 'Chuẩn kỹ năng sử dụng CNTT cơ bản', credits: 3, semester: 'HK1 2022-2023', attendanceScore: 10.0, midtermScore: 9.5, finalScore: 9.5, score10: 9.5, letterGrade: 'A+', gradePoint: 4.0 },
  { courseCode: 'ISFI25-1005', courseName: 'Khởi nghiệp và đổi mới sáng tạo', credits: 3, semester: 'HK1 2022-2023', attendanceScore: 8.5, midtermScore: 8.0, finalScore: 8.2, score10: 8.2, letterGrade: 'B+', gradePoint: 3.5 },

  // HK2 (2022-2023)
  { courseCode: 'ISF0010', courseName: 'Giáo dục thể chất', credits: 3, semester: 'HK2 2022-2023', attendanceScore: 9.0, midtermScore: 8.0, finalScore: 8.0, score10: 8.0, letterGrade: 'B+', gradePoint: 3.5 },
  { courseCode: 'EMF25-1013', courseName: 'Marketing căn bản', credits: 3, semester: 'HK2 2022-2023', attendanceScore: 8.5, midtermScore: 7.5, finalScore: 7.8, score10: 7.8, letterGrade: 'B', gradePoint: 3.0 },
  { courseCode: 'ISFI25-1007', courseName: 'Cấu trúc máy tính và hệ điều hành', credits: 3, semester: 'HK2 2022-2023', attendanceScore: 9.0, midtermScore: 8.0, finalScore: 8.5, score10: 8.4, letterGrade: 'B+', gradePoint: 3.5 },
  { courseCode: 'LIF0006', courseName: 'Xác suất và thống kê', credits: 3, semester: 'HK2 2022-2023', attendanceScore: 8.0, midtermScore: 7.0, finalScore: 7.6, score10: 7.5, letterGrade: 'B', gradePoint: 3.0 },
  { courseCode: 'ISF0004', courseName: 'Chủ nghĩa xã hội khoa học', credits: 2, semester: 'HK2 2022-2023', attendanceScore: 8.5, midtermScore: 8.0, finalScore: 8.0, score10: 8.0, letterGrade: 'B+', gradePoint: 3.5 },

  // HK1 (2023-2024)
  { courseCode: 'ISF0006', courseName: 'Lịch sử Đảng cộng sản Việt Nam', credits: 2, semester: 'HK1 2023-2024', attendanceScore: 9.0, midtermScore: 8.5, finalScore: 8.5, score10: 8.5, letterGrade: 'A', gradePoint: 4.0 },
  { courseCode: 'LIF1009', courseName: 'Phương pháp tính', credits: 3, semester: 'HK1 2023-2024', attendanceScore: 8.5, midtermScore: 8.0, finalScore: 8.0, score10: 8.0, letterGrade: 'B+', gradePoint: 3.5 },
  { courseCode: 'LIF1010', courseName: 'Tối ưu hóa', credits: 3, semester: 'HK1 2023-2024', attendanceScore: 8.5, midtermScore: 8.0, finalScore: 8.3, score10: 8.2, letterGrade: 'B+', gradePoint: 3.5 },
  { courseCode: 'LIF2019', courseName: 'Lập trình hướng đối tượng', credits: 3, semester: 'HK1 2023-2024', attendanceScore: 9.5, midtermScore: 8.5, finalScore: 8.8, score10: 8.8, letterGrade: 'A', gradePoint: 4.0 },
  { courseCode: 'LIF1006', courseName: 'Cấu trúc dữ liệu và giải thuật', credits: 3, semester: 'HK1 2023-2024', attendanceScore: 9.0, midtermScore: 8.5, finalScore: 8.5, score10: 8.5, letterGrade: 'A', gradePoint: 4.0 },
  { courseCode: 'ISFI25-2004', courseName: 'Ngôn ngữ lập trình Java', credits: 3, semester: 'HK1 2023-2024', attendanceScore: 9.0, midtermScore: 8.0, finalScore: 8.5, score10: 8.4, letterGrade: 'B+', gradePoint: 3.5 },

  // HK2 (2023-2024)
  { courseCode: 'LIF2023', courseName: 'Ngôn ngữ lập trình C#', credits: 3, semester: 'HK2 2023-2024', attendanceScore: 8.5, midtermScore: 8.0, finalScore: 8.0, score10: 8.0, letterGrade: 'B+', gradePoint: 3.5 },
  { courseCode: 'LIF2115', courseName: 'Lập trình Python', credits: 3, semester: 'HK2 2023-2024', attendanceScore: 9.5, midtermScore: 8.5, finalScore: 8.7, score10: 8.7, letterGrade: 'A', gradePoint: 4.0 },
  { courseCode: 'ISFI25-1006', courseName: 'Data-Driven Decision Making', credits: 3, semester: 'HK2 2023-2024', attendanceScore: 9.0, midtermScore: 8.5, finalScore: 8.5, score10: 8.5, letterGrade: 'A', gradePoint: 4.0 },
  { courseCode: 'SMF0003', courseName: 'Đạo đức và trách nhiệm xã hội', credits: 3, semester: 'HK2 2023-2024', attendanceScore: 9.0, midtermScore: 8.5, finalScore: 8.5, score10: 8.5, letterGrade: 'A', gradePoint: 4.0 },
  { courseCode: 'LIF2004', courseName: 'Hệ quản trị cơ sở dữ liệu', credits: 3, semester: 'HK2 2023-2024', attendanceScore: 8.5, midtermScore: 8.0, finalScore: 8.0, score10: 8.0, letterGrade: 'B+', gradePoint: 3.5 }
];

export const StudentGrades: React.FC = () => {
  const [selectedSemester, setSelectedSemester] = useState<string>('all');

  const filteredGrades = useMemo(() => {
    if (selectedSemester === 'all') return APAG_STUDENT_GRADES;
    return APAG_STUDENT_GRADES.filter(g => g.semester === selectedSemester);
  }, [selectedSemester]);

  const handleExportExcel = () => {
    try {
      const exportData = APAG_STUDENT_GRADES.map(g => ({
        'Mã HP': g.courseCode,
        'Tên học phần': g.courseName,
        'Số tín chỉ': g.credits,
        'Học kỳ': g.semester,
        'Điểm CC (10%)': g.attendanceScore,
        'Điểm GK (30%)': g.midtermScore,
        'Điểm CK (60%)': g.finalScore,
        'Điểm TB (Hệ 10)': g.score10,
        'Điểm chữ': g.letterGrade,
        'Điểm số (Hệ 4)': g.gradePoint,
        'Kết quả': g.gradePoint >= 2.0 ? 'Đạt' : 'Chưa đạt'
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'BangDiem_TranManhHa');

      XLSX.writeFile(workbook, 'Bang_Diem_APAG_TranManhHa_2505HTTB001.xlsx');
      Utils.showToast('Đã xuất file bảng điểm Excel thành công!', 'success');
    } catch (err) {
      console.error(err);
      Utils.showToast('Lỗi khi xuất tệp Excel', 'danger');
    }
  };

  return (
    <div>
      {/* Top Action Buttons */}
      <div className="d-flex justify-end gap-2 mb-4" style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
        <button type="button" className="btn btn-secondary btn-sm" onClick={handleExportExcel}>
          <FileSpreadsheet size={14} />
          <span>Xuất Excel (.xlsx)</span>
        </button>
        <button type="button" className="btn btn-outline btn-sm" onClick={() => window.print()}>
          <Printer size={14} />
          <span>In bảng điểm</span>
        </button>
      </div>

      {/* Standing Overview Cards */}
      <div className="metrics-grid mb-6">
        <div className="metric-card">
          <span className="metric-label">GPA Tích lũy (Hệ 4.0)</span>
          <div className="metric-value text-primary">3.24 <span className="metric-sub">/ 4.00</span></div>
          <div className="metric-footer text-muted" style={{ fontSize: '0.75rem' }}>Quy đổi hệ 10: ~8.12</div>
        </div>
        <div className="metric-card">
          <span className="metric-label">Xếp loại học lực</span>
          <div className="metric-value" style={{ color: 'var(--success-text, #064E3B)' }}>GIỎI</div>
          <div className="metric-footer" style={{ color: 'var(--success, #047857)', fontSize: '0.75rem' }}>Đạt chuẩn khen thưởng học vụ</div>
        </div>
        <div className="metric-card">
          <span className="metric-label">Tổng tín chỉ tích lũy</span>
          <div className="metric-value">72 <span className="metric-sub">/ 130 TC</span></div>
          <div className="metric-footer text-muted" style={{ fontSize: '0.75rem' }}>Đạt 55.4% tổng khối lượng CTĐT</div>
        </div>
        <div className="metric-card">
          <span className="metric-label">Tín chỉ chưa đạt</span>
          <div className="metric-value" style={{ color: 'var(--success-text, #064E3B)' }}>0 <span className="metric-sub">TC</span></div>
          <div className="metric-footer" style={{ color: 'var(--success, #047857)', fontSize: '0.75rem' }}>Không có học phần chưa đạt</div>
        </div>
      </div>

      {/* Semester Filter Toolbar */}
      <div className="minimal-card mb-6 p-4">
        <div className="d-flex justify-between items-center flex-wrap gap-4" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="d-flex gap-2 flex-wrap items-center" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span className="text-xs font-semibold text-muted uppercase">Chọn học kỳ:</span>
            <button 
              type="button" 
              className={`btn btn-sm ${selectedSemester === 'all' ? 'btn-primary active' : 'btn-secondary'}`}
              onClick={() => setSelectedSemester('all')}
            >
              Toàn khóa
            </button>
            <button 
              type="button" 
              className={`btn btn-sm ${selectedSemester === 'HK1 2022-2023' ? 'btn-primary active' : 'btn-secondary'}`}
              onClick={() => setSelectedSemester('HK1 2022-2023')}
            >
              HK1 (22-23)
            </button>
            <button 
              type="button" 
              className={`btn btn-sm ${selectedSemester === 'HK2 2022-2023' ? 'btn-primary active' : 'btn-secondary'}`}
              onClick={() => setSelectedSemester('HK2 2022-2023')}
            >
              HK2 (22-23)
            </button>
            <button 
              type="button" 
              className={`btn btn-sm ${selectedSemester === 'HK1 2023-2024' ? 'btn-primary active' : 'btn-secondary'}`}
              onClick={() => setSelectedSemester('HK1 2023-2024')}
            >
              HK1 (23-24)
            </button>
            <button 
              type="button" 
              className={`btn btn-sm ${selectedSemester === 'HK2 2023-2024' ? 'btn-primary active' : 'btn-secondary'}`}
              onClick={() => setSelectedSemester('HK2 2023-2024')}
            >
              HK2 (23-24)
            </button>
          </div>
          <div className="text-xs text-muted">Hiển thị {filteredGrades.length} học phần</div>
        </div>
      </div>

      {/* Grade Detail Table (Single Card without nested frames, 24px padding) */}
      <div className="minimal-card" style={{ padding: '24px', overflowX: 'auto' }}>
        <table className="minimal-table" style={{ width: '100%', borderCollapse: 'collapse', border: 'none', boxShadow: 'none' }}>
          <thead>
            <tr>
              <th style={{ width: '100px', padding: '12px 16px', fontSize: '0.8125rem' }}>Mã HP</th>
              <th style={{ padding: '12px 16px', fontSize: '0.8125rem' }}>Tên học phần</th>
              <th style={{ width: '70px', padding: '12px 16px', fontSize: '0.8125rem' }}>Số TC</th>
              <th style={{ width: '130px', padding: '12px 16px', fontSize: '0.8125rem' }}>Học kỳ</th>
              <th style={{ width: '90px', padding: '12px 16px', fontSize: '0.8125rem' }}>CC (10%)</th>
              <th style={{ width: '90px', padding: '12px 16px', fontSize: '0.8125rem' }}>GK (30%)</th>
              <th style={{ width: '90px', padding: '12px 16px', fontSize: '0.8125rem' }}>CK (60%)</th>
              <th style={{ width: '130px', padding: '12px 16px', fontSize: '0.8125rem' }}>Điểm TK (Hệ 10)</th>
              <th style={{ width: '90px', padding: '12px 16px', fontSize: '0.8125rem' }}>Điểm chữ</th>
              <th style={{ width: '110px', padding: '12px 16px', fontSize: '0.8125rem' }}>Điểm số (Hệ 4)</th>
              <th style={{ width: '90px', padding: '12px 16px', fontSize: '0.8125rem' }}>Kết quả</th>
            </tr>
          </thead>
          <tbody>
            {filteredGrades.length === 0 ? (
              <tr>
                <td colSpan={11} className="text-center py-6 text-muted" style={{ textAlign: 'center', padding: '24px', fontSize: '0.875rem' }}>
                  Không có dữ liệu điểm cho học kỳ này.
                </td>
              </tr>
            ) : (
              filteredGrades.map((g, idx) => {
                const isPassed = g.gradePoint >= 2.0;
                const badgeClass = isPassed ? 'badge-success' : 'badge-danger';
                const statusText = isPassed ? 'Đạt' : 'Chưa đạt';

                return (
                  <tr key={idx}>
                    <td style={{ textAlign: 'center', padding: '12px 16px', fontSize: '0.875rem' }}>{g.courseCode}</td>
                    <td style={{ textAlign: 'left', padding: '12px 16px', fontSize: '0.875rem' }} className="font-medium text-main">{g.courseName}</td>
                    <td style={{ textAlign: 'center', padding: '12px 16px', fontSize: '0.875rem' }}><strong>{g.credits}</strong></td>
                    <td style={{ textAlign: 'center', padding: '12px 16px', fontSize: '0.875rem' }}>{g.semester}</td>
                    <td style={{ textAlign: 'center', padding: '12px 16px', fontSize: '0.875rem' }}>{g.attendanceScore.toFixed(1)}</td>
                    <td style={{ textAlign: 'center', padding: '12px 16px', fontSize: '0.875rem' }}>{g.midtermScore.toFixed(1)}</td>
                    <td style={{ textAlign: 'center', padding: '12px 16px', fontSize: '0.875rem' }}>{g.finalScore.toFixed(1)}</td>
                    <td style={{ textAlign: 'center', fontWeight: 'bold', padding: '12px 16px', fontSize: '0.875rem' }}>{g.score10.toFixed(1)}</td>
                    <td style={{ textAlign: 'center', padding: '12px 16px' }}><span className={`badge ${badgeClass}`} style={{ fontSize: '0.75rem' }}>{g.letterGrade}</span></td>
                    <td style={{ textAlign: 'center', fontWeight: 'bold', padding: '12px 16px', fontSize: '0.875rem' }}>{g.gradePoint.toFixed(1)}</td>
                    <td style={{ textAlign: 'center', padding: '12px 16px' }}><span className={`badge ${badgeClass}`} style={{ fontSize: '0.75rem' }}>{statusText}</span></td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
