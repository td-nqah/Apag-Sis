// ==========================================================================
// APAG Admin / Lecturer Dashboard Page Component (React + TypeScript)
// Architecture: Z-Shape Scan, Minimalist Data Table, Progressive Disclosure
// Tầng 1: 4 Thẻ Tác vụ Cần xử lý (Ca dạy, Chờ duyệt, Chờ vào điểm, SV nguy cơ)
// Tầng 2: 4 cột Trái (Lịch dạy hôm nay) + 8 cột Phải (Minimalist Table + Hover Actions)
// ==========================================================================

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  FileCheck, 
  Clock, 
  AlertOctagon, 
  Check, 
  X, 
  Edit3, 
  FileSpreadsheet, 
  Users, 
  BookOpen, 
  Filter, 
  Search,
  ExternalLink,
  ChevronRight,
  BarChart3,
  Save,
  RotateCcw,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { Chart } from 'chart.js/auto';
import * as XLSX from 'xlsx';
import { Utils } from '../../utils/utils';

interface TaskItem {
  id: string;
  category: 'request' | 'grade' | 'alert';
  target: string;
  targetSub: string;
  summary: string;
  deadline: string;
  deadlineBadgeClass: string;
  status: string;
}

interface GradebookEntry {
  id: string;
  studentId: string;
  fullName: string;
  classCode: string;
  attendance: number;  // 10%
  assignment: number;  // 20%
  midterm: number;     // 30%
  finalExam: number;   // 40%
  status: 'approved' | 'draft';
}

export const AdminDashboard: React.FC = () => {
  const [viewTab, setViewTab] = useState<'tasks' | 'gradebook'>('tasks');
  const [filterMode, setFilterMode] = useState<'all' | 'request' | 'grade' | 'alert'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredRowId, setHoveredRowId] = useState<string | null>(null);

  const bellCurveCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const bellCurveChartRef = useRef<Chart | null>(null);

  // Gradebook Students List (Class LIF2003 - Phân tích & Thiết kế HTTT)
  const [gradebookStudents, setGradebookStudents] = useState<GradebookEntry[]>([
    { id: 'gb-1', studentId: '2505HTTB012', fullName: 'Trần Mạnh Hà', classCode: '25HTTB01', attendance: 9.5, assignment: 8.5, midterm: 8.5, finalExam: 9.0, status: 'approved' },
    { id: 'gb-2', studentId: '2505HTTB001', fullName: 'Nguyễn Văn An', classCode: '25HTTB01', attendance: 10.0, assignment: 9.5, midterm: 9.5, finalExam: 9.5, status: 'approved' },
    { id: 'gb-3', studentId: '2505HTTB002', fullName: 'Lê Thị Mai', classCode: '25HTTB01', attendance: 8.0, assignment: 7.5, midterm: 7.0, finalExam: 6.5, status: 'draft' },
    { id: 'gb-4', studentId: '2505HTTB020', fullName: 'Đặng Thùy Linh', classCode: '25HTTB01', attendance: 9.5, assignment: 9.0, midterm: 8.5, finalExam: 8.5, status: 'approved' },
    { id: 'gb-5', studentId: '2505HTTB015', fullName: 'Vũ Minh Đức', classCode: '25HTTB01', attendance: 7.5, assignment: 7.0, midterm: 6.5, finalExam: 6.0, status: 'draft' },
    { id: 'gb-6', studentId: '2505HTTB007', fullName: 'Phạm Thành Long', classCode: '25HTTB01', attendance: 7.0, assignment: 6.0, midterm: 5.5, finalExam: 5.0, status: 'draft' },
    { id: 'gb-7', studentId: '2505HTTB003', fullName: 'Hoàng Quốc Bảo', classCode: '25HTTB01', attendance: 6.0, assignment: 5.0, midterm: 4.5, finalExam: 4.0, status: 'draft' },
    { id: 'gb-8', studentId: '2505HTTB008', fullName: 'Bùi Đức Duy', classCode: '25HTTB01', attendance: 5.0, assignment: 4.0, midterm: 3.5, finalExam: 3.0, status: 'draft' }
  ]);

  const calcTotalScore = (s: GradebookEntry) => {
    return Number(((s.attendance * 0.1) + (s.assignment * 0.2) + (s.midterm * 0.3) + (s.finalExam * 0.4)).toFixed(2));
  };

  const getLetterGrade = (total: number) => {
    if (total >= 8.5) return 'A';
    if (total >= 8.0) return 'B+';
    if (total >= 7.0) return 'B';
    if (total >= 6.5) return 'C+';
    if (total >= 5.5) return 'C';
    if (total >= 5.0) return 'D+';
    if (total >= 4.0) return 'D';
    return 'F';
  };

  const getHeatmapClass = (score: number) => {
    if (score >= 8.5) return 'grade-cell-heatmap score-a';
    if (score >= 7.0) return 'grade-cell-heatmap score-b';
    if (score >= 5.0) return 'grade-cell-heatmap score-c';
    return 'grade-cell-heatmap score-d';
  };

  const handleScoreChange = (id: string, field: 'attendance' | 'assignment' | 'midterm' | 'finalExam', val: number) => {
    const clamped = Math.max(0, Math.min(10, isNaN(val) ? 0 : val));
    setGradebookStudents(prev => prev.map(s => s.id === id ? { ...s, [field]: clamped } : s));
  };

  const handleBatchApprove = () => {
    setGradebookStudents(prev => prev.map(s => ({ ...s, status: 'approved' })));
    Utils.showToast('✅ Đã phê duyệt và khóa sổ toàn bộ điểm lớp LIF2003 thành công!', 'success');
  };

  const handleExportGradebookExcel = () => {
    const data = gradebookStudents.map((s, idx) => {
      const total = calcTotalScore(s);
      const letter = getLetterGrade(total);
      return {
        STT: idx + 1,
        MSSV: s.studentId,
        Họ_Và_Tên: s.fullName,
        Lớp: s.classCode,
        Chuyên_cần_10: s.attendance,
        Bài_tập_20: s.assignment,
        Giữa_kỳ_30: s.midterm,
        Cuối_kỳ_40: s.finalExam,
        Tổng_kết_10: total,
        Điểm_chữ: letter,
        Trạng_thái: s.status === 'approved' ? 'Đã duyệt' : 'Bản nháp'
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Bang_Diem_LIF2003');
    XLSX.writeFile(workbook, `Bang_Diem_LIF2003_APAG_${new Date().toISOString().slice(0, 10)}.xlsx`);
    Utils.showToast('Đã xuất sổ điểm lớp LIF2003 (.xlsx) thành công!', 'success');
  };

  // Live Bell Curve Chart (Phổ điểm)
  const initBellCurveChart = () => {
    if (!bellCurveCanvasRef.current || viewTab !== 'gradebook') return;
    if (bellCurveChartRef.current) {
      bellCurveChartRef.current.destroy();
      bellCurveChartRef.current = null;
    }

    const textColor = '#64748B';
    const gridColor = 'rgba(0, 0, 0, 0.06)';

    let countA = 0, countB = 0, countC = 0, countD = 0, countF = 0;
    gradebookStudents.forEach(s => {
      const tot = calcTotalScore(s);
      if (tot >= 8.5) countA++;
      else if (tot >= 7.0) countB++;
      else if (tot >= 5.5) countC++;
      else if (tot >= 4.0) countD++;
      else countF++;
    });

    bellCurveChartRef.current = new Chart(bellCurveCanvasRef.current, {
      type: 'bar',
      data: {
        labels: ['Loại A (≥ 8.5)', 'Loại B (7.0 - 8.4)', 'Loại C (5.5 - 6.9)', 'Loại D (4.0 - 5.4)', 'Loại F (< 4.0)'],
        datasets: [{
          label: 'Số lượng sinh viên',
          data: [countA, countB, countC, countD, countF],
          backgroundColor: ['#10B981', '#3B82F6', '#F59E0B', '#F97316', '#EF4444'],
          borderRadius: 6,
          barPercentage: 0.65
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => ` ${context.raw} sinh viên (${(((context.raw as number) / gradebookStudents.length) * 100).toFixed(1)}%)`
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: textColor, font: { size: 10 } }
          },
          y: {
            beginAtZero: true,
            ticks: { stepSize: 1, color: textColor, font: { size: 10 } },
            grid: { color: gridColor }
          }
        }
      }
    });
  };

  useEffect(() => {
    initBellCurveChart();
    return () => {
      if (bellCurveChartRef.current) bellCurveChartRef.current.destroy();
    };
  }, [gradebookStudents, viewTab]);

  // Core Tasks Data for Minimalist Table (Right 8 cols)
  const [tasks, setTasks] = useState<TaskItem[]>([
    {
      id: 'task-1',
      category: 'request',
      target: 'Trần Mạnh Hà (2505HTTB012)',
      targetSub: 'Lớp 25HTTB01',
      summary: 'Xin mở lớp bổ sung học phần tiên quyết LIF2004 (HQT CSDL) ở HK6',
      deadline: 'Hạn: Hôm nay',
      deadlineBadgeClass: 'badge-danger',
      status: 'Chờ duyệt'
    },
    {
      id: 'task-2',
      category: 'request',
      target: 'Lê Thị Mai (2505HTTB002)',
      targetSub: 'Lớp 25HTTB01',
      summary: 'Đơn xin hoãn thi kết thúc học phần do lý do sức khỏe có xác nhận BV',
      deadline: 'Hạn: 16/10',
      deadlineBadgeClass: 'badge-warning',
      status: 'Chờ duyệt'
    },
    {
      id: 'task-3',
      category: 'grade',
      target: 'Lớp LIF2003 (45 SV)',
      targetSub: 'Phân tích & Thiết kế HTTT',
      summary: 'Khóa sổ điểm thành phần giữa kỳ (Điểm quá trình 40%)',
      deadline: 'Hạn: 20/10',
      deadlineBadgeClass: 'badge-warning',
      status: 'Chờ vào điểm'
    },
    {
      id: 'task-4',
      category: 'grade',
      target: 'Lớp LIF2113 (42 SV)',
      targetSub: 'Mạng máy tính',
      summary: 'Nhập điểm thực hành Lab bài tập lớn số 2',
      deadline: 'Hạn: 22/10',
      deadlineBadgeClass: 'badge-info',
      status: 'Chờ vào điểm'
    },
    {
      id: 'task-5',
      category: 'alert',
      target: 'Hoàng Quốc Bảo (2505HTTB003)',
      targetSub: 'Lớp 25HTTB01',
      summary: 'Vắng 4/10 buổi học phần LIF2003, nguy cơ bị cấm thi theo Điều 18 QĐ 458',
      deadline: 'Khẩn cấp',
      deadlineBadgeClass: 'badge-danger',
      status: 'Cảnh báo đỏ'
    },
    {
      id: 'task-6',
      category: 'request',
      target: 'Nguyễn Văn An (2505HTTB001)',
      targetSub: 'Lớp 25HTTB01',
      summary: 'Đề nghị công nhận chứng chỉ IELTS 6.5 miễn học Ngoại ngữ B1',
      deadline: 'Hạn: 25/10',
      deadlineBadgeClass: 'badge-info',
      status: 'Chờ duyệt'
    }
  ]);

  // Handle Quick Approve
  const handleApprove = (id: string, target: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    Utils.showToast(`Đã duyệt thành công yêu cầu của: ${target}`, 'success');
  };

  // Handle Reject
  const handleReject = (id: string, target: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    Utils.showToast(`Đã từ chối yêu cầu của: ${target}`, 'warning');
  };

  // Filter Tasks
  const filteredTasks = tasks.filter(t => {
    if (filterMode !== 'all' && t.category !== filterMode) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return t.target.toLowerCase().includes(q) || t.summary.toLowerCase().includes(q);
    }
    return true;
  });

  // Export to Excel using XLSX
  const handleExportExcel = () => {
    const exportData = tasks.map((t, idx) => ({
      STT: idx + 1,
      Đối_tượng: t.target,
      Lớp: t.targetSub,
      Nội_dung: t.summary,
      Thời_hạn: t.deadline,
      Trạng_thái: t.status
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Tac_Vu_Dao_Tao');
    XLSX.writeFile(workbook, `Danh_Sach_Tac_Vu_APAG_${new Date().toISOString().slice(0, 10)}.xlsx`);
    Utils.showToast('Đã xuất file Excel tác vụ thành công.', 'success');
  };

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
      {/* Top Action Toolbar */}
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          marginBottom: '16px',
          gap: '8px'
        }}
      >
          {/* View Tab Switcher: Tasks vs Smart Gradebook */}
          <div style={{ display: 'flex', background: 'var(--surface-subtle)', padding: '2px', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <button
              type="button"
              onClick={() => setViewTab('tasks')}
              style={{
                padding: '6px 12px',
                fontSize: '0.75rem',
                fontWeight: viewTab === 'tasks' ? 700 : 500,
                color: viewTab === 'tasks' ? 'var(--text-primary)' : 'var(--text-secondary)',
                backgroundColor: viewTab === 'tasks' ? 'var(--surface)' : 'transparent',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              📋 Điều hành Tác vụ
            </button>
            <button
              type="button"
              onClick={() => setViewTab('gradebook')}
              style={{
                padding: '6px 12px',
                fontSize: '0.75rem',
                fontWeight: viewTab === 'gradebook' ? 700 : 500,
                color: viewTab === 'gradebook' ? 'var(--text-primary)' : 'var(--text-secondary)',
                backgroundColor: viewTab === 'gradebook' ? 'var(--surface)' : 'transparent',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              📊 Sổ điểm thông minh & Phổ điểm
            </button>
          </div>

          <button 
            type="button" 
            onClick={viewTab === 'gradebook' ? handleExportGradebookExcel : handleExportExcel}
            className="btn btn-outline btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <FileSpreadsheet size={14} className="text-success" />
            <span>Xuất Excel (.xlsx)</span>
          </button>
        </div>

      {viewTab === 'gradebook' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Top Control Bar */}
          <div 
            style={{
              padding: '16px 20px',
              borderRadius: '12px',
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '14px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div 
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800
                }}
              >
                <BookOpen size={20} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                    LIF2003 - Phân tích & Thiết kế HTTT
                  </h2>
                  <span className="badge badge-primary">Lớp 25HTTB01</span>
                  <span className="badge badge-success">45 Sinh viên</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Quy định trọng số: Chuyên cần (10%) • Bài tập (20%) • Giữa kỳ (30%) • Cuối kỳ (40%)
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                type="button"
                onClick={handleBatchApprove}
                className="btn btn-primary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <CheckCircle2 size={14} />
                <span>Duyệt toàn bộ điểm</span>
              </button>

              <button
                type="button"
                onClick={handleExportGradebookExcel}
                className="btn btn-outline btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <FileSpreadsheet size={14} className="text-success" />
                <span>Xuất Excel (.xlsx)</span>
              </button>
            </div>
          </div>

          {/* Bento Split: 8 cols Notion Gradebook Table + 4 cols Live Bell Curve */}
          <div 
            className="admin-bento-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 8fr) minmax(0, 4fr)',
              gap: '20px',
              alignItems: 'stretch'
            }}
          >
            {/* Left 8 cols: Smart Airtable/Notion Gradebook Table */}
            <div 
              className="minimal-card"
              style={{
                padding: '20px',
                borderRadius: '12px',
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border)',
                overflowX: 'auto',
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div>
                  <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                    Sổ điểm điện tử (Inline Editing Table)
                  </h3>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                    Nhập điểm trực tiếp vào từng ô · Điểm tổng kết và phổ điểm tự động tính toán tức thì
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.6875rem' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                    <span style={{ color: 'var(--text-secondary)' }}>A (≥ 8.5)</span>
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#3B82F6' }} />
                    <span style={{ color: 'var(--text-secondary)' }}>B (7.0-8.4)</span>
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#F59E0B' }} />
                    <span style={{ color: 'var(--text-secondary)' }}>C (5.5-6.9)</span>
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#EF4444' }} />
                    <span style={{ color: 'var(--text-secondary)' }}>D/F (&lt; 5.5)</span>
                  </span>
                </div>
              </div>

              {/* Table */}
              <div className="table-responsive">
                <table className="minimal-table">
                  <thead>
                    <tr>
                      <th style={{ width: '100px' }}>MSSV</th>
                      <th>HỌ VÀ TÊN</th>
                      <th style={{ width: '80px' }}>CC (10%)</th>
                      <th style={{ width: '80px' }}>BT (20%)</th>
                      <th style={{ width: '80px' }}>GK (30%)</th>
                      <th style={{ width: '80px' }}>CK (40%)</th>
                      <th style={{ width: '90px' }}>TỔNG KẾT</th>
                      <th style={{ width: '70px' }}>CHỮ</th>
                      <th style={{ width: '120px' }}>TRẠNG THÁI</th>
                    </tr>
                  </thead>
                <tbody>
                  {gradebookStudents.map(student => {
                    const total = calcTotalScore(student);
                    const letter = getLetterGrade(total);

                    return (
                      <tr 
                        key={student.id}
                        style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background-color 0.1s ease' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-subtle)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <td style={{ padding: '10px', fontWeight: 600, fontFamily: 'monospace', color: 'var(--primary)' }}>
                          {student.studentId}
                        </td>
                        <td style={{ padding: '10px', fontWeight: 600, color: 'var(--text-primary)' }}>
                          {student.fullName}
                        </td>

                        {/* Inline Edit Attendance */}
                        <td style={{ padding: '6px', textAlign: 'center' }}>
                          <input 
                            type="number"
                            min="0"
                            max="10"
                            step="0.5"
                            value={student.attendance}
                            onChange={(e) => handleScoreChange(student.id, 'attendance', parseFloat(e.target.value))}
                            style={{
                              width: '44px',
                              textAlign: 'center',
                              padding: '3px 0',
                              borderRadius: '6px',
                              border: '1px solid var(--border)',
                              backgroundColor: 'var(--surface)',
                              color: 'var(--text-primary)',
                              fontWeight: 700,
                              fontSize: '0.75rem'
                            }}
                          />
                        </td>

                        {/* Inline Edit Assignment */}
                        <td style={{ padding: '6px', textAlign: 'center' }}>
                          <input 
                            type="number"
                            min="0"
                            max="10"
                            step="0.5"
                            value={student.assignment}
                            onChange={(e) => handleScoreChange(student.id, 'assignment', parseFloat(e.target.value))}
                            style={{
                              width: '44px',
                              textAlign: 'center',
                              padding: '3px 0',
                              borderRadius: '6px',
                              border: '1px solid var(--border)',
                              backgroundColor: 'var(--surface)',
                              color: 'var(--text-primary)',
                              fontWeight: 700,
                              fontSize: '0.75rem'
                            }}
                          />
                        </td>

                        {/* Inline Edit Midterm */}
                        <td style={{ padding: '6px', textAlign: 'center' }}>
                          <input 
                            type="number"
                            min="0"
                            max="10"
                            step="0.5"
                            value={student.midterm}
                            onChange={(e) => handleScoreChange(student.id, 'midterm', parseFloat(e.target.value))}
                            style={{
                              width: '44px',
                              textAlign: 'center',
                              padding: '3px 0',
                              borderRadius: '6px',
                              border: '1px solid var(--border)',
                              backgroundColor: 'var(--surface)',
                              color: 'var(--text-primary)',
                              fontWeight: 700,
                              fontSize: '0.75rem'
                            }}
                          />
                        </td>

                        {/* Inline Edit Final Exam */}
                        <td style={{ padding: '6px', textAlign: 'center' }}>
                          <input 
                            type="number"
                            min="0"
                            max="10"
                            step="0.5"
                            value={student.finalExam}
                            onChange={(e) => handleScoreChange(student.id, 'finalExam', parseFloat(e.target.value))}
                            style={{
                              width: '44px',
                              textAlign: 'center',
                              padding: '3px 0',
                              borderRadius: '6px',
                              border: '1px solid var(--border)',
                              backgroundColor: 'var(--surface)',
                              color: 'var(--text-primary)',
                              fontWeight: 700,
                              fontSize: '0.75rem'
                            }}
                          />
                        </td>

                        {/* Total Score with Dynamic Heatmap */}
                        <td style={{ padding: '6px', textAlign: 'center' }}>
                          <span className={getHeatmapClass(total)}>
                            {total.toFixed(2)}
                          </span>
                        </td>

                        {/* Letter Grade */}
                        <td style={{ padding: '6px', textAlign: 'center', fontWeight: 800 }}>
                          <span className={`badge ${letter === 'A' ? 'badge-success' : letter.startsWith('B') ? 'badge-primary' : letter.startsWith('C') ? 'badge-warning' : 'badge-danger'}`} style={{ fontSize: '0.6875rem', padding: '2px 6px' }}>
                            {letter}
                          </span>
                        </td>

                        {/* Status */}
                        <td style={{ padding: '10px', textAlign: 'right' }}>
                          <span 
                            style={{
                              fontSize: '0.6875rem',
                              fontWeight: 600,
                              color: student.status === 'approved' ? 'var(--success)' : 'var(--text-muted)'
                            }}
                          >
                            {student.status === 'approved' ? '✓ Đã khóa' : '○ Bản nháp'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

            {/* Right 4 cols: Live Bell Curve (Phổ điểm) Chart.js */}
            <div 
              className="minimal-card"
              style={{
                padding: '20px',
                borderRadius: '12px',
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '100%',
                gap: '16px'
              }}
            >
              <div>
                <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <BarChart3 size={16} className="text-primary" />
                  <span>Phổ điểm trực tiếp</span>
                </h3>
              </div>

              {/* Chart canvas */}
              <div style={{ flex: 1, minHeight: '260px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <canvas ref={bellCurveCanvasRef}></canvas>
              </div>

              {/* Class KPI Summary */}
              <div 
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '8px',
                  background: 'var(--surface-subtle)',
                  padding: '12px',
                  borderRadius: '10px',
                  textAlign: 'center'
                }}
              >
                <div>
                  <span style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>Điểm TB Lớp</span>
                  <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
                    {(gradebookStudents.reduce((acc, s) => acc + calcTotalScore(s), 0) / gradebookStudents.length).toFixed(2)}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>Tỷ lệ Đạt</span>
                  <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--success)', marginTop: '2px' }}>
                    {((gradebookStudents.filter(s => calcTotalScore(s) >= 4.0).length / gradebookStudents.length) * 100).toFixed(0)}%
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>Tỷ lệ Giỏi (A/B+)</span>
                  <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--primary)', marginTop: '2px' }}>
                    {((gradebookStudents.filter(s => calcTotalScore(s) >= 8.0).length / gradebookStudents.length) * 100).toFixed(0)}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* ====================================================================
              TẦNG 1: DẢI TÁC VỤ CẦN XỬ LÝ (4 THẺ X 3 CỘT / Z-SHAPE RULE)
              ==================================================================== */}
          <section 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}
      >
        {/* Card 1: Lớp học phần đang mở */}
        <div 
          className="minimal-card"
          style={{
            padding: '16px 18px',
            borderRadius: '12px',
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              Lớp học phần đang mở
            </span>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#2563EB' }}></span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', margin: '4px 0' }}>
            48 <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>lớp học phần</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Học kỳ 1 • Năm học 2024-2025
          </div>
        </div>

        {/* Card 2: Yêu cầu chờ duyệt */}
        <div 
          className="minimal-card"
          style={{
            padding: '16px 18px',
            borderRadius: '12px',
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              Yêu cầu chờ duyệt
            </span>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#F59E0B' }}></span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#F59E0B', margin: '4px 0' }}>
            05 <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>đơn học vụ</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Có <strong>02 đơn</strong> cần phản hồi trong ngày
          </div>
        </div>

        {/* Card 3: Lớp chờ vào điểm */}
        <div 
          className="minimal-card"
          style={{
            padding: '16px 18px',
            borderRadius: '12px',
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              Lớp chờ vào điểm
            </span>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#2563EB' }}></span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', margin: '4px 0' }}>
            03 <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>lớp</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Hạn khóa sổ điểm giữa kỳ: <strong>20/10/2024</strong>
          </div>
        </div>

        {/* Card 4: Sinh viên vắng/nguy cơ */}
        <div 
          className="minimal-card"
          style={{
            padding: '16px 18px',
            borderRadius: '12px',
            backgroundColor: 'var(--danger-bg)',
            border: '1px solid var(--danger-border)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--danger)', textTransform: 'uppercase' }}>
              SV vắng / Nguy cơ
            </span>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#EF4444' }}></span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--danger)', margin: '4px 0' }}>
            08 <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--danger-text)' }}>sinh viên</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--danger-text)' }}>
            Nguy cơ cấm thi hoặc học lực yếu
          </div>
        </div>
      </section>

      {/* ====================================================================
          TẦNG 2: BẢNG XỬ LÝ TÁC VỤ & PHÊ DUYỆT HỌC VỤ (FULL-WIDTH 12 CỘT)
          ==================================================================== */}
      <div 
        className="minimal-card"
        style={{
          padding: '20px',
          borderRadius: '12px',
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--border)',
          marginBottom: '24px'
        }}
      >
        {/* Table Header & Quick Filters (Pills/Chips 1-click) */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Trung tâm xử lý tác vụ & phê duyệt học vụ
            </h2>
          </div>

            {/* Quick Filter Chips */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button 
                type="button" 
                onClick={() => setFilterMode('all')}
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  padding: '4px 10px',
                  borderRadius: '999px',
                  border: '1px solid var(--border)',
                  backgroundColor: filterMode === 'all' ? 'var(--primary)' : 'var(--surface-subtle)',
                  color: filterMode === 'all' ? '#FFFFFF' : 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
              >
                Tất cả ({tasks.length})
              </button>
              <button 
                type="button" 
                onClick={() => setFilterMode('request')}
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  padding: '4px 10px',
                  borderRadius: '999px',
                  border: '1px solid var(--border)',
                  backgroundColor: filterMode === 'request' ? 'var(--primary)' : 'var(--surface-subtle)',
                  color: filterMode === 'request' ? '#FFFFFF' : 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
              >
                Đơn học vụ ({tasks.filter(t => t.category === 'request').length})
              </button>
              <button 
                type="button" 
                onClick={() => setFilterMode('grade')}
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  padding: '4px 10px',
                  borderRadius: '999px',
                  border: '1px solid var(--border)',
                  backgroundColor: filterMode === 'grade' ? 'var(--primary)' : 'var(--surface-subtle)',
                  color: filterMode === 'grade' ? '#FFFFFF' : 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
              >
                Chờ chấm điểm ({tasks.filter(t => t.category === 'grade').length})
              </button>
              <button 
                type="button" 
                onClick={() => setFilterMode('alert')}
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  padding: '4px 10px',
                  borderRadius: '999px',
                  border: '1px solid var(--border)',
                  backgroundColor: filterMode === 'alert' ? 'var(--primary)' : 'var(--surface-subtle)',
                  color: filterMode === 'alert' ? '#FFFFFF' : 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
              >
                Cảnh báo ({tasks.filter(t => t.category === 'alert').length})
              </button>
            </div>
          </div>

          {/* Minimalist Data Table (4 Cột cốt lõi: Đối tượng, Nội dung, Thời hạn, Trạng thái/Thao tác) */}
          <div className="table-responsive">
            <table className="minimal-table">
              <thead>
                <tr>
                  <th style={{ width: '25%' }}>ĐỐI TƯỢNG</th>
                  <th style={{ width: '42%' }}>NỘI DUNG TÓM TẮT</th>
                  <th style={{ width: '13%' }}>THỜI HẠN</th>
                  <th style={{ width: '20%' }}>THAO TÁC</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ padding: '32px 12px', textAlign: 'center', color: 'var(--text-muted)' }}>
                      Không có tác vụ nào thuộc nhóm này cần xử lý.
                    </td>
                  </tr>
                ) : (
                  filteredTasks.map((t) => {
                    const isHovered = hoveredRowId === t.id;
                    return (
                      <tr 
                        key={t.id}
                        onMouseEnter={() => setHoveredRowId(t.id)}
                        onMouseLeave={() => setHoveredRowId(null)}
                        style={{
                          borderBottom: '1px solid var(--border-subtle)',
                          backgroundColor: isHovered ? 'var(--surface-subtle)' : 'transparent',
                          transition: 'background-color 100ms ease'
                        }}
                      >
                        {/* Col 1: Đối tượng */}
                        <td style={{ padding: '12px' }}>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{t.target}</div>
                          <div style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{t.targetSub}</div>
                        </td>

                        {/* Col 2: Nội dung tóm tắt */}
                        <td style={{ padding: '12px', color: 'var(--text-primary)', lineHeight: 1.4 }}>
                          {t.summary}
                        </td>

                        {/* Col 3: Thời hạn */}
                        <td style={{ padding: '12px' }}>
                          <span 
                            style={{
                              fontSize: '0.6875rem',
                              fontWeight: 700,
                              padding: '2px 8px',
                              borderRadius: '999px',
                              backgroundColor: t.deadlineBadgeClass === 'badge-danger' ? 'var(--danger-bg)' : t.deadlineBadgeClass === 'badge-warning' ? 'var(--warning-bg)' : 'var(--primary-light)',
                              color: t.deadlineBadgeClass === 'badge-danger' ? 'var(--danger)' : t.deadlineBadgeClass === 'badge-warning' ? 'var(--warning)' : 'var(--primary)',
                              border: `1px solid ${t.deadlineBadgeClass === 'badge-danger' ? 'var(--danger-border)' : t.deadlineBadgeClass === 'badge-warning' ? 'var(--warning-border)' : 'var(--primary-border)'}`
                            }}
                          >
                            {t.deadline}
                          </span>
                        </td>

                        {/* Col 4: Trạng thái & Hover Actions */}
                        <td style={{ padding: '12px', textAlign: 'right' }}>
                          {isHovered ? (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                              {t.category === 'request' && (
                                <>
                                  <button 
                                    type="button" 
                                    onClick={() => handleApprove(t.id, t.target)}
                                    title="Duyệt nhanh yêu cầu"
                                    style={{
                                      backgroundColor: 'var(--success-bg)',
                                      color: 'var(--success)',
                                      border: '1px solid var(--success-border)',
                                      borderRadius: '6px',
                                      padding: '4px 8px',
                                      cursor: 'pointer',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '4px',
                                      fontSize: '0.6875rem',
                                      fontWeight: 600
                                    }}
                                  >
                                    <Check size={12} />
                                    <span>Duyệt</span>
                                  </button>
                                  <button 
                                    type="button" 
                                    onClick={() => handleReject(t.id, t.target)}
                                    title="Từ chối yêu cầu"
                                    style={{
                                      backgroundColor: 'var(--danger-bg)',
                                      color: 'var(--danger)',
                                      border: '1px solid var(--danger-border)',
                                      borderRadius: '6px',
                                      padding: '4px 8px',
                                      cursor: 'pointer',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '4px',
                                      fontSize: '0.6875rem',
                                      fontWeight: 600
                                    }}
                                  >
                                    <X size={12} />
                                    <span>Từ chối</span>
                                  </button>
                                </>
                              )}

                              {t.category === 'grade' && (
                                <Link 
                                  to="/admin/courses"
                                  title="Nhập điểm trực tiếp"
                                  style={{
                                    backgroundColor: 'var(--primary)',
                                    color: '#FFFFFF',
                                    borderRadius: '6px',
                                    padding: '4px 10px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    fontSize: '0.6875rem',
                                    fontWeight: 600,
                                    textDecoration: 'none'
                                  }}
                                >
                                  <Edit3 size={12} />
                                  <span>Vào điểm</span>
                                </Link>
                              )}

                              {t.category === 'alert' && (
                                <button 
                                  type="button" 
                                  onClick={() => Utils.showToast(`Đã gửi giấy báo mời phụ huynh và sinh viên ${t.target}.`, 'warning')}
                                  title="Xử lý cảnh báo"
                                  style={{
                                    backgroundColor: 'var(--danger)',
                                    color: '#FFFFFF',
                                    borderRadius: '6px',
                                    padding: '4px 8px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    fontSize: '0.6875rem',
                                    fontWeight: 600,
                                    border: 'none'
                                  }}
                                >
                                  <span>Gửi giấy báo</span>
                                </button>
                              )}
                            </div>
                          ) : (
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                              {t.status}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
    </>
  )}
</div>
);
};

export default AdminDashboard;
