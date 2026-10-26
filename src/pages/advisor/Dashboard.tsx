// ==========================================================================
// APAG Academic Advisor Dashboard Page Component (React + TypeScript)
// Architecture: Widget-based KPI, Cross-Filtering, 500px Master-Detail Drawer
// Tầng 1: 4 Widget KPI (Tổng SV, Cảnh báo Đỏ, Cảnh báo Vàng, Chờ duyệt)
// Tầng 2: 5 cột Trái (Chart.js 3 ngưỡng) + 7 cột Phải (Danh sách Ưu tiên)
// ==========================================================================

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  AlertTriangle, 
  AlertOctagon, 
  GitPullRequest, 
  ChevronRight, 
  Search, 
  Filter, 
  FileSpreadsheet, 
  Send, 
  X, 
  Sparkles, 
  Award, 
  Compass, 
  BookOpen, 
  Calendar,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { Chart } from 'chart.js/auto';
import * as XLSX from 'xlsx';
import { Utils } from '../../utils/utils';

interface StudentAlertItem {
  id: string;
  name: string;
  studentId: string;
  classCode: string;
  avatar: string;
  gpa: number;
  creditsOwed: number;
  completedCredits: number;
  riskLevel: 'red' | 'yellow' | 'green';
  reasonTag: string;
  reasonDetail: string;
  failedCourses: string[];
  recommendedPlan: string;
}

export const AdvisorDashboard: React.FC = () => {
  const chartCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  const [activeRiskFilter, setActiveRiskFilter] = useState<'all' | 'red' | 'yellow' | 'green'>('all');
  const [chartType, setChartType] = useState<'bar' | 'doughnut'>('bar');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<StudentAlertItem | null>(null);
  const [drawerTab, setDrawerTab] = useState<'grades' | 'path' | 'ai'>('ai');
  const [customNoticeText, setCustomNoticeText] = useState('Thầy mời em tới P402, Nhà A1 vào chiều Thứ 3 lúc 14:00 để trao đổi kế hoạch học tập kỳ tới.');
  const [isAiLetterGenerated, setIsAiLetterGenerated] = useState(false);
  const [interventionLetter, setInterventionLetter] = useState('');

  // Student Data (Prioritized urgent list with coordinates for 2D Scatter Radar)
  const studentsList: StudentAlertItem[] = [
    {
      id: 'std-003',
      name: 'Hoàng Quốc Bảo',
      studentId: '2505HTTB003',
      classCode: '25HTTB01',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop&crop=faces',
      gpa: 1.45,
      creditsOwed: 18,
      completedCredits: 42,
      riskLevel: 'red',
      reasonTag: 'GPA 1.45 • Chậm 18 TC',
      reasonDetail: 'Cảnh báo học vụ mức 2. Chưa tích lũy 3 học phần tiên quyết bắt buộc. Giảm 0,65 điểm trung bình tích lũy so với HK trước.',
      failedCourses: ['LIF2004 - Hệ quản trị CSDL (F)', 'LIF1002 - Toán cao cấp 2 (D)', 'LIF2113 - Mạng máy tính (F)'],
      recommendedPlan: 'Đề xuất: Điều chỉnh giảm khối lượng học tập kỳ tới xuống 10 tín chỉ. Ưu tiên học lại 2 học phần LIF2004 và LIF2113 để tránh bị xử lý học vụ mức 3 theo quy định.'
    },
    {
      id: 'std-007',
      name: 'Phạm Thành Long',
      studentId: '2505HTTB007',
      classCode: '25HTTB01',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces',
      gpa: 1.78,
      creditsOwed: 12,
      completedCredits: 48,
      riskLevel: 'red',
      reasonTag: 'GPA 1.78 • Chưa tích lũy 12 TC',
      reasonDetail: 'Cảnh báo học vụ mức 1. Vắng 30% số tiết học phần Chuyên ngành.',
      failedCourses: ['ISF325-2007 - Công nghệ phần mềm (D)', 'LIF2003 - PT&TK HTTT (D+)'],
      recommendedPlan: 'Đề xuất: Đăng ký học cải thiện điểm học phần Công nghệ phần mềm trong kỳ phụ hè.'
    },
    {
      id: 'std-008',
      name: 'Bùi Đức Duy',
      studentId: '2505HTTB008',
      classCode: '25HTTB02',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&h=100&fit=crop&crop=faces',
      gpa: 1.35,
      creditsOwed: 21,
      completedCredits: 38,
      riskLevel: 'red',
      reasonTag: 'GPA 1.35 • Chưa tích lũy 21 TC',
      reasonDetail: 'Cảnh báo học vụ mức 2 liên tiếp. Chưa hoàn thành học phí và vắng thi kết thúc học phần 2 học phần chuyên ngành.',
      failedCourses: ['LIF2003 - PT&TK HTTT (F)', 'LIF2020 - Lập trình Web (F)', 'MAT1001 - Giải tích 1 (F)'],
      recommendedPlan: 'Đề xuất: Họp gia đình cùng CVHT và làm đơn gia hạn thời gian học tập có cam kết tiến độ.'
    },
    {
      id: 'std-012',
      name: 'Trần Mạnh Hà',
      studentId: '2505HTTB012',
      classCode: '25HTTB01',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
      gpa: 3.24,
      creditsOwed: 3,
      completedCredits: 72,
      riskLevel: 'yellow',
      reasonTag: 'Chưa đạt tiên quyết LIF2004',
      reasonDetail: 'Đạt xếp loại Giỏi (GPA 3.24) nhưng chưa hoàn thành học phần tiên quyết LIF2004 (HQT CSDL), chưa đáp ứng điều kiện đăng ký 2 học phần HK6.',
      failedCourses: ['LIF2004 - Chưa tích lũy (Cần học bổ sung)'],
      recommendedPlan: 'Đề xuất: CVHT duyệt cho đăng ký học vượt hoặc học song hành LIF2004 cùng Khai phá dữ liệu ở HK6.'
    },
    {
      id: 'std-002',
      name: 'Lê Thị Mai',
      studentId: '2505HTTB002',
      classCode: '25HTTB01',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces',
      gpa: 2.45,
      creditsOwed: 6,
      completedCredits: 62,
      riskLevel: 'yellow',
      reasonTag: 'GPA 2.45 • Chậm tiến độ',
      reasonDetail: 'GPA giảm 0.35 điểm. Chưa nộp chứng chỉ Ngoại ngữ B1 chuẩn đầu ra.',
      failedCourses: ['LIF1003 - Xác suất thống kê (D)'],
      recommendedPlan: 'Đề xuất: Đăng ký ôn tập và nộp hồ sơ thi chuẩn VSTEP B1 đợt tháng 11/2024.'
    },
    {
      id: 'std-015',
      name: 'Vũ Minh Đức',
      studentId: '2505HTTB015',
      classCode: '25HTTB02',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=faces',
      gpa: 2.15,
      creditsOwed: 9,
      completedCredits: 58,
      riskLevel: 'yellow',
      reasonTag: 'GPA 2.15 • Chưa tích lũy 9 TC',
      reasonDetail: 'Điểm trung bình tiệm cận mức cảnh báo 2.0. Cần cải thiện điểm các học phần cơ sở.',
      failedCourses: ['LIF1002 - Toán rời rạc (D)'],
      recommendedPlan: 'Đề xuất: Đăng ký học cải thiện 1 học phần điểm D để nâng điểm trung bình tích lũy lên trên 2.30.'
    },
    {
      id: 'std-001',
      name: 'Nguyễn Văn An',
      studentId: '2505HTTB001',
      classCode: '25HTTB01',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces',
      gpa: 3.65,
      creditsOwed: 0,
      completedCredits: 82,
      riskLevel: 'green',
      reasonTag: 'GPA 3.65 • Xuất sắc',
      reasonDetail: 'Học lực Xuất sắc. Đủ điều kiện đăng ký Khóa luận tốt nghiệp sớm ở HK7.',
      failedCourses: [],
      recommendedPlan: 'Đề xuất: Hướng dẫn đăng ký đề tài Nghiên cứu khoa học và chuẩn bị hồ sơ Khóa luận.'
    },
    {
      id: 'std-020',
      name: 'Đặng Thùy Linh',
      studentId: '2505HTTB020',
      classCode: '25HTTB02',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
      gpa: 3.42,
      creditsOwed: 0,
      completedCredits: 78,
      riskLevel: 'green',
      reasonTag: 'GPA 3.42 • Giỏi',
      reasonDetail: 'Tiến độ học tập rất tốt, hoàn thành tất cả học phần tiên quyết đúng hạn.',
      failedCourses: [],
      recommendedPlan: 'Đề xuất: Duy trì tiến độ và đăng ký các học phần tự chọn nâng cao ở HK6.'
    }
  ];

  // Initialize Advisor Chart (AI Risk Radar Column Bar or Doughnut)
  const initAdvisorChart = () => {
    if (!chartCanvasRef.current) return;
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
      chartInstanceRef.current = null;
    }

    const textColor = '#64748B';
    const gridColor = 'rgba(0, 0, 0, 0.06)';

    if (chartType === 'bar') {
      // 8 students sorted from high risk/low GPA to safe/high GPA
      const sortedStudents = [...studentsList].sort((a, b) => a.gpa - b.gpa);

      const labels = sortedStudents.map(s => {
        const parts = s.name.split(' ');
        const shortName = parts.length > 2 ? `${parts[parts.length - 2]} ${parts[parts.length - 1]}` : s.name;
        return [shortName, `${s.creditsOwed} TC`];
      });

      const dataValues = sortedStudents.map(s => s.gpa);

      // Colors with active filter support and high-contrast rounded column aesthetic
      const backgroundColors = sortedStudents.map(s => {
        if (activeRiskFilter !== 'all' && s.riskLevel !== activeRiskFilter) {
          return '#E2E8F0';
        }
        if (s.riskLevel === 'red') return '#EF4444';
        if (s.riskLevel === 'yellow') return '#F59E0B';
        return '#10B981';
      });

      const hoverBackgroundColors = sortedStudents.map(s => {
        if (s.riskLevel === 'red') return '#DC2626';
        if (s.riskLevel === 'yellow') return '#D97706';
        return '#059669';
      });

      chartInstanceRef.current = new Chart(chartCanvasRef.current, {
        type: 'bar',
        data: {
          labels,
          datasets: [
            {
              label: 'Điểm GPA tích lũy',
              data: dataValues,
              backgroundColor: backgroundColors,
              hoverBackgroundColor: hoverBackgroundColors,
              borderRadius: 8,
              borderSkipped: false,
              barThickness: 28,
              maxBarThickness: 34
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                boxWidth: 10,
                boxHeight: 10,
                padding: 10,
                color: textColor,
                font: { size: 10.5, family: 'Inter' },
                generateLabels: () => [
                  { text: 'Nguy cơ cao (GPA < 2.0)', fillStyle: '#EF4444', strokeStyle: '#EF4444', lineWidth: 0 },
                  { text: 'Cần chú ý (GPA 2.0 - 2.5)', fillStyle: '#F59E0B', strokeStyle: '#F59E0B', lineWidth: 0 },
                  { text: 'An toàn (GPA >= 2.5)', fillStyle: '#10B981', strokeStyle: '#10B981', lineWidth: 0 }
                ]
              }
            },
            tooltip: {
              callbacks: {
                title: (items) => {
                  const idx = items[0]?.dataIndex ?? 0;
                  const s = sortedStudents[idx];
                  return `${s.name} (${s.studentId})`;
                },
                label: (context) => {
                  const s = sortedStudents[context.dataIndex];
                  const riskText = s.riskLevel === 'red' ? 'Cao' : s.riskLevel === 'yellow' ? 'Theo dõi' : 'Bình thường';
                  return [
                    ` GPA tích lũy: ${s.gpa.toFixed(2)} / 4.00`,
                    ` Tín chỉ chưa tích lũy: ${s.creditsOwed} TC (Đã đạt ${s.completedCredits} TC)`,
                    ` Trạng thái: ${riskText}`
                  ];
                }
              }
            }
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: {
                color: textColor,
                font: { size: 10.5, family: 'Inter', weight: 500 }
              }
            },
            y: {
              min: 0,
              max: 4.0,
              grid: { color: gridColor },
              ticks: {
                color: textColor,
                stepSize: 1.0,
                font: { size: 10, family: 'Inter' }
              },
              title: {
                display: true,
                text: 'Điểm GPA tích lũy',
                color: textColor,
                font: { size: 10.5, weight: 'bold' }
              }
            }
          },
          onClick: (event, elements) => {
            if (elements.length > 0) {
              const el = elements[0];
              const student = sortedStudents[el.index];
              if (student) {
                handleSelectStudent(student);
              }
            }
          }
        }
      });
    } else {
      // Doughnut Mode
      chartInstanceRef.current = new Chart(chartCanvasRef.current, {
        type: 'doughnut',
        data: {
          labels: ['An toàn (>= 2.50)', 'Cần chú ý (2.00 - 2.49)', 'Nguy cơ cao (< 2.00)'],
          datasets: [{
            data: [108, 14, 6],
            backgroundColor: ['#10B981', '#F59E0B', '#EF4444'],
            borderWidth: 2,
            borderColor: '#FFFFFF',
            hoverOffset: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '70%',
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                boxWidth: 10,
                padding: 12,
                color: textColor,
                font: { size: 11, family: 'Inter' }
              }
            },
            tooltip: {
              callbacks: {
                label: (context) => ` ${context.label}: ${context.raw} sinh viên`
              }
            }
          },
          onClick: (event, elements) => {
            if (elements.length > 0) {
              const index = elements[0].index;
              if (index === 0) setActiveRiskFilter('green');
              else if (index === 1) setActiveRiskFilter('yellow');
              else if (index === 2) setActiveRiskFilter('red');
            }
          }
        }
      });
    }
  };

  useEffect(() => {
    initAdvisorChart();
    return () => {
      if (chartInstanceRef.current) chartInstanceRef.current.destroy();
    };
  }, [chartType, activeRiskFilter]);

  const handleSelectStudent = (student: StudentAlertItem) => {
    setSelectedStudent(student);
    setDrawerTab('ai');
    // Pre-generate tailored intervention letter
    const letter = `Kính gửi sinh viên ${student.name} (MSSV: ${student.studentId} - Lớp ${student.classCode}),

Thầy là TS. Nguyễn Năng Thành, Cố vấn học tập phụ trách lớp của em.
Qua phân tích học bạ tự động từ hệ thống APAG tính đến Học kỳ 1 (2024-2025):
- Điểm GPA tích lũy: ${student.gpa.toFixed(2)}/4.00
- Số tín chỉ chưa hoàn thành: ${student.creditsOwed} TC (Đã hoàn thành ${student.completedCredits}/130 TC)
- Các học phần cần lưu ý: ${student.failedCourses.length > 0 ? student.failedCourses.join(', ') : 'Chưa tích lũy đầy đủ học phần tiên quyết'}

${student.recommendedPlan}

Thầy mời em tới gặp Thầy tại P402, Nhà A1 vào chiều Thứ 3 lúc 14:00 để Thầy trò cùng rà soát và tháo gỡ khó khăn cho học kỳ tới nhé.
Chúc em luôn giữ vững niềm tin và nỗ lực bứt phá!`;

    setInterventionLetter(letter);
    setIsAiLetterGenerated(true);
  };

  // Filter students based on cross-filtering and search
  const filteredStudents = studentsList.filter(s => {
    if (activeRiskFilter !== 'all' && s.riskLevel !== activeRiskFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return s.name.toLowerCase().includes(q) || s.studentId.toLowerCase().includes(q);
    }
    return true;
  });

  // Send Notice to Student
  const handleSendNotice = () => {
    if (!selectedStudent) return;
    Utils.showToast(`Đã gửi thông báo nhắc nhở học vụ tới sinh viên ${selectedStudent.name} (${selectedStudent.studentId}).`, 'success');
  };

  // Export List to Excel
  const handleExportExcel = () => {
    const data = studentsList.map((s, idx) => ({
      STT: idx + 1,
      MSSV: s.studentId,
      Họ_Tên: s.name,
      Lớp: s.classCode,
      GPA: s.gpa,
      Tín_chỉ_chưa_tích_lũy: s.creditsOwed,
      Mức_nguy_cơ: s.riskLevel === 'red' ? 'Cao' : s.riskLevel === 'yellow' ? 'Theo dõi' : 'Bình thường',
      Chi_tiết: s.reasonDetail
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Theo_Doi_Sinh_Vien');
    XLSX.writeFile(workbook, `Bao_Cao_Co_Van_APAG_${new Date().toISOString().slice(0, 10)}.xlsx`);
    Utils.showToast('Đã xuất file Excel theo dõi sinh viên.', 'success');
  };

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
      {/* Top Action Toolbar */}
      <div 
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '16px'
        }}
      >
        <button 
          type="button" 
          onClick={handleExportExcel}
          className="btn btn-outline btn-sm"
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <FileSpreadsheet size={14} className="text-success" />
          <span>Xuất Excel (.xlsx)</span>
        </button>
        <Link to="/advisor/students" className="btn btn-primary btn-sm">
          <Users size={14} />
          <span>Danh sách 128 SV</span>
        </Link>
      </div>

      {/* ====================================================================
          TẦNG 1: 4 WIDGET KPI CỠ LỚN (MỖI WIDGET 3 CỘT)
          ==================================================================== */}
      <section 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}
      >
        {/* Widget 1: Tổng Sinh viên phụ trách */}
        <div 
          className="minimal-card"
          style={{
            padding: '18px 20px',
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
              Tổng SV phụ trách
            </span>
            <Users size={16} className="text-primary" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', margin: '4px 0' }}>
            128 <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>sinh viên</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            <strong>116 SV</strong> đang học bình thường (90.6%)
          </div>
        </div>

        {/* Widget 2: Cảnh báo Đỏ (Nguy cơ cao) */}
        <div 
          className="minimal-card"
          onClick={() => setActiveRiskFilter('red')}
          style={{
            padding: '18px 20px',
            borderRadius: '12px',
            backgroundColor: 'var(--danger-bg)',
            border: '1px solid var(--danger-border)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            cursor: 'pointer'
          }}
          title="Nhấp để lọc danh sách sinh viên nguy cơ đỏ"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--danger)', textTransform: 'uppercase' }}>
              Cảnh báo Đỏ (Mức 2-3)
            </span>
            <AlertOctagon size={16} className="text-danger" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--danger)', margin: '4px 0' }}>
            06 <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--danger-text)' }}>sinh viên</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--danger-text)' }}>
            Cần hỗ trợ học tập ưu tiên theo quy định xử lý học vụ
          </div>
        </div>

        {/* Widget 3: Cảnh báo Vàng (Cần theo dõi) */}
        <div 
          className="minimal-card"
          onClick={() => setActiveRiskFilter('yellow')}
          style={{
            padding: '18px 20px',
            borderRadius: '12px',
            backgroundColor: 'var(--warning-bg)',
            border: '1px solid var(--warning-border)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            cursor: 'pointer'
          }}
          title="Nhấp để lọc danh sách sinh viên cần theo dõi"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--warning-text)', textTransform: 'uppercase' }}>
              Cảnh báo Vàng (Theo dõi)
            </span>
            <AlertTriangle size={16} className="text-warning" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--warning-text)', margin: '4px 0' }}>
            14 <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--warning-text)' }}>sinh viên</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Giảm điểm trung bình tích lũy hoặc chưa hoàn thành học phần tiên quyết
          </div>
        </div>

        {/* Widget 4: Yêu cầu Tư vấn / Duyệt lộ trình */}
        <div 
          className="minimal-card"
          style={{
            padding: '18px 20px',
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
            <GitPullRequest size={16} className="text-primary" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', margin: '4px 0' }}>
            08 <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>yêu cầu</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Gồm 5 đề nghị học vụ và 3 lộ trình học kỳ mới
          </div>
        </div>
      </section>

      {/* ====================================================================
          TẦNG 2: BIỂU ĐỒ TÌNH HÌNH LỚP & DANH SÁCH ƯU TIÊN HỖ TRỢ (5 CỘT + 7 CỘT)
          ==================================================================== */}
      <div 
        className="advisor-bento-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 5fr) minmax(0, 7fr)',
          gap: '24px',
          alignItems: 'start'
        }}
      >
        {/* ==================================================================
            KHỐI 5 CỘT TRÁI: BIỂU ĐỒ TỔNG QUAN CÔ ĐỌNG (CROSS-FILTERING)
            ================================================================== */}
        <div 
          className="minimal-card"
          style={{
            padding: '20px',
            borderRadius: '12px',
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div>
              <h2 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>{chartType === 'bar' ? '📊 AI Risk Radar (GPA & Tín chỉ chưa đạt)' : '🍩 Phân bổ Học lực & Nguy cơ'}</span>
              </h2>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                {chartType === 'bar' ? 'Nhấp vào cột bất kỳ để mở bảng hỗ trợ học vụ tức thì' : 'Nhấp vào phân vùng màu để lọc danh sách sinh viên'}
              </span>
            </div>

            {/* Segmented View Switcher */}
            <div style={{ display: 'flex', background: 'var(--surface-subtle)', padding: '2px', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <button
                type="button"
                onClick={() => setChartType('bar')}
                style={{
                  padding: '4px 8px',
                  fontSize: '0.6875rem',
                  fontWeight: chartType === 'bar' ? 700 : 500,
                  color: chartType === 'bar' ? 'var(--text-primary)' : 'var(--text-secondary)',
                  backgroundColor: chartType === 'bar' ? 'var(--surface)' : 'transparent',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Cột GPA
              </button>
              <button
                type="button"
                onClick={() => setChartType('doughnut')}
                style={{
                  padding: '4px 8px',
                  fontSize: '0.6875rem',
                  fontWeight: chartType === 'doughnut' ? 700 : 500,
                  color: chartType === 'doughnut' ? 'var(--text-primary)' : 'var(--text-secondary)',
                  backgroundColor: chartType === 'doughnut' ? 'var(--surface)' : 'transparent',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Tỷ lệ
              </button>
            </div>
          </div>

          {/* Chart Container */}
          <div style={{ height: '240px', position: 'relative', margin: '8px 0' }}>
            <canvas ref={chartCanvasRef}></canvas>
          </div>

          {/* Metric Summary Bar (matching Component style in image 2) */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '12px', 
            padding: '10px 14px', 
            backgroundColor: 'var(--surface-subtle)', 
            borderRadius: '8px', 
            marginTop: '8px',
            border: '1px solid var(--border)' 
          }}>
            <div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>GPA Trung bình lớp</div>
              <div style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)' }}>3.12 <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-secondary)' }}>/ 4.00</span></div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.6875rem', color: 'var(--danger)', textTransform: 'uppercase', fontWeight: 600 }}>Hỗ trợ học tập ưu tiên</div>
              <div style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--danger)' }}>06 <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-secondary)' }}>sinh viên</span></div>
            </div>
          </div>

          {/* Quick Cross-Filtering Buttons */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--border)' }}>
            <button 
              type="button"
              onClick={() => setActiveRiskFilter('all')}
              style={{
                flex: 1,
                padding: '6px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 600,
                border: '1px solid var(--border)',
                backgroundColor: activeRiskFilter === 'all' ? 'var(--primary)' : 'var(--surface-subtle)',
                color: activeRiskFilter === 'all' ? '#FFFFFF' : 'var(--text-secondary)',
                cursor: 'pointer'
              }}
            >
              Tất cả (128)
            </button>
            <button 
              type="button"
              onClick={() => setActiveRiskFilter('red')}
              style={{
                flex: 1,
                padding: '6px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 600,
                border: '1px solid var(--danger-border)',
                backgroundColor: activeRiskFilter === 'red' ? 'var(--danger)' : 'var(--danger-bg)',
                color: activeRiskFilter === 'red' ? '#FFFFFF' : 'var(--danger)',
                cursor: 'pointer'
              }}
            >
              🔴 Cao (6)
            </button>
            <button 
              type="button"
              onClick={() => setActiveRiskFilter('green')}
              style={{
                flex: 1,
                padding: '6px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 600,
                border: '1px solid var(--success-border)',
                backgroundColor: activeRiskFilter === 'green' ? 'var(--success)' : 'var(--success-bg)',
                color: activeRiskFilter === 'green' ? '#FFFFFF' : 'var(--success)',
                cursor: 'pointer'
              }}
            >
              🟢 Bình thường (108)
            </button>
            <button 
              type="button"
              onClick={() => setActiveRiskFilter('yellow')}
              style={{
                flex: 1,
                padding: '6px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 600,
                border: '1px solid var(--warning-border)',
                backgroundColor: activeRiskFilter === 'yellow' ? 'var(--warning)' : 'var(--warning-bg)',
                color: activeRiskFilter === 'yellow' ? '#FFFFFF' : 'var(--warning-text)',
                cursor: 'pointer'
              }}
            >
              🟡 Theo dõi (14)
            </button>
          </div>
        </div>

        {/* ==================================================================
            KHỐI 7 CỘT PHẢI: DANH SÁCH SINH VIÊN ƯU TIÊN HỖ TRỢ KHẨN CẤP
            ================================================================== */}
        <div 
          className="minimal-card"
          style={{
            padding: '20px',
            borderRadius: '12px',
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div>
              <h2 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                Danh sách Sinh viên cần ưu tiên hỗ trợ
              </h2>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Tự động đẩy sinh viên mức Đỏ lên đầu · Click vào dòng để mở Hồ sơ trượt 360°
              </span>
            </div>

            <div style={{ position: 'relative', width: '180px' }}>
              <input 
                type="text" 
                placeholder="Tìm tên hoặc MSSV..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '5px 10px',
                  borderRadius: '6px',
                  border: '1px solid var(--border)',
                  backgroundColor: 'var(--surface-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '0.75rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Compact Student List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {filteredStudents.length === 0 ? (
              <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
                Không tìm thấy sinh viên nào trong diện lọc này.
              </div>
            ) : (
              filteredStudents.map((s) => (
                <div 
                  key={s.id}
                  onClick={() => setSelectedStudent(s)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    backgroundColor: s.riskLevel === 'red' ? 'var(--danger-bg)' : s.riskLevel === 'yellow' ? 'var(--warning-bg)' : 'var(--surface-subtle)',
                    border: `1px solid ${s.riskLevel === 'red' ? 'var(--danger-border)' : s.riskLevel === 'yellow' ? 'var(--warning-border)' : 'var(--border)'}`,
                    cursor: 'pointer',
                    transition: 'all 120ms ease-out'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.06)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img 
                      src={s.avatar || '/assets/images/default-avatar.png'} 
                      alt={s.name} 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/assets/images/default-avatar.png';
                      }}
                      style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {s.name}
                      </div>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>
                        MSSV: <strong>{s.studentId}</strong> · {s.classCode}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.875rem', fontWeight: 800, color: s.gpa < 2.0 ? 'var(--danger)' : s.gpa < 2.5 ? 'var(--warning-text)' : 'var(--text-primary)' }}>
                        GPA {s.gpa.toFixed(2)}
                      </div>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>
                        {s.completedCredits}/120 TC
                      </div>
                    </div>

                    <span 
                      style={{
                        fontSize: '0.6875rem',
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: '4px',
                        backgroundColor: s.riskLevel === 'red' ? '#EF4444' : s.riskLevel === 'yellow' ? '#F59E0B' : '#10B981',
                        color: '#FFFFFF',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {s.reasonTag}
                    </span>

                    <ChevronRight size={16} className="text-muted" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ====================================================================
          MASTER-DETAIL DRAWER (500PX) - HỒ SƠ SINH VIÊN 360 ĐỘ
          ==================================================================== */}
      {selectedStudent && (
        <>
          <div 
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(15, 23, 42, 0.4)',
              backdropFilter: 'blur(3px)',
              zIndex: 9998
            }}
            onClick={() => setSelectedStudent(null)}
          />

          <div 
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              width: '500px',
              maxWidth: '92vw',
              backgroundColor: 'var(--surface)',
              borderLeft: '1px solid var(--border)',
              boxShadow: '-10px 0 40px rgba(0,0,0,0.18)',
              zIndex: 9999,
              display: 'flex',
              flexDirection: 'column',
              animation: 'drawerSlideIn 180ms ease-out'
            }}
          >
            {/* Drawer Header */}
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--surface-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img 
                  src={selectedStudent.avatar || '/assets/images/default-avatar.png'} 
                  alt={selectedStudent.name} 
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/assets/images/default-avatar.png';
                  }}
                  style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {selectedStudent.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    MSSV: {selectedStudent.studentId} · {selectedStudent.classCode}
                  </div>
                </div>
              </div>

              <button 
                type="button" 
                onClick={() => setSelectedStudent(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* 3 Tabs Segmented Control */}
            <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', backgroundColor: 'var(--surface)' }}>
              <button 
                type="button" 
                onClick={() => setDrawerTab('ai')}
                style={{
                  flex: 1,
                  padding: '10px 0',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  border: 'none',
                  borderBottom: drawerTab === 'ai' ? '2px solid var(--primary)' : '2px solid transparent',
                  backgroundColor: 'transparent',
                  color: drawerTab === 'ai' ? 'var(--primary)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <Sparkles size={14} />
                <span>Gợi ý hỗ trợ học tập (AI)</span>
              </button>
              <button 
                type="button" 
                onClick={() => setDrawerTab('grades')}
                style={{
                  flex: 1,
                  padding: '10px 0',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  border: 'none',
                  borderBottom: drawerTab === 'grades' ? '2px solid var(--primary)' : '2px solid transparent',
                  backgroundColor: 'transparent',
                  color: drawerTab === 'grades' ? 'var(--primary)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <Award size={14} />
                <span>Điểm số & CPA</span>
              </button>
              <button 
                type="button" 
                onClick={() => setDrawerTab('path')}
                style={{
                  flex: 1,
                  padding: '10px 0',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  border: 'none',
                  borderBottom: drawerTab === 'path' ? '2px solid var(--primary)' : '2px solid transparent',
                  backgroundColor: 'transparent',
                  color: drawerTab === 'path' ? 'var(--primary)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <Compass size={14} />
                <span>Tiến độ 130 TC</span>
              </button>
            </div>

            {/* Tab Body Content */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {drawerTab === 'ai' && (
                <>
                  <div style={{ padding: '14px', borderRadius: '8px', backgroundColor: 'var(--primary-light)', border: '1px solid var(--primary-border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '6px' }}>
                      <Sparkles size={16} />
                      <span>Phân tích rủi ro học vụ từ AI Advisor</span>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-primary)', lineHeight: 1.5, margin: 0 }}>
                      {selectedStudent.reasonDetail}
                    </p>
                  </div>

                  <div style={{ padding: '14px', borderRadius: '8px', backgroundColor: 'var(--surface-subtle)', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                      Khuyến nghị giải pháp cho Cố vấn:
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                      {selectedStudent.recommendedPlan}
                    </div>
                  </div>

                  {selectedStudent.failedCourses.length > 0 && (
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--danger)', marginBottom: '6px' }}>
                        Các học phần cần ưu tiên hoàn thành:
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {selectedStudent.failedCourses.map((crs, i) => (
                          <div key={i} style={{ padding: '6px 10px', borderRadius: '4px', backgroundColor: 'var(--danger-bg)', border: '1px solid var(--danger-border)', fontSize: '0.75rem', color: 'var(--danger-text)', fontWeight: 600 }}>
                            ✕ {crs}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 1-Click AI Intervention Letter Generator */}
                  <div style={{ padding: '14px', borderRadius: '10px', backgroundColor: 'var(--surface-subtle)', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Sparkles size={14} className="text-primary" />
                        <span>Mẫu thư hỗ trợ & Lộ trình đề xuất (AI)</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(interventionLetter);
                          Utils.showToast('Đã sao chép thư hỗ trợ học tập vào bộ nhớ tạm!', 'success');
                        }}
                        className="btn btn-outline btn-xs"
                        style={{ fontSize: '0.6875rem', padding: '2px 8px' }}
                      >
                        Sao chép thư
                      </button>
                    </div>

                    <textarea
                      rows={6}
                      value={interventionLetter}
                      onChange={(e) => setInterventionLetter(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px',
                        fontSize: '0.75rem',
                        lineHeight: 1.45,
                        borderRadius: '8px',
                        border: '1px solid var(--border)',
                        backgroundColor: 'var(--surface)',
                        color: 'var(--text-primary)',
                        resize: 'vertical',
                        marginBottom: '8px'
                      }}
                    />

                    <button
                      type="button"
                      onClick={() => {
                        Utils.showToast(`🚀 Đã gửi cảnh báo học vụ & lộ trình cứu nguy tới sinh viên ${selectedStudent.name}!`, 'success');
                      }}
                      className="btn btn-primary btn-sm"
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        fontWeight: 700
                      }}
                    >
                      <span>🚀 Gửi cảnh báo & Lộ trình cứu nguy</span>
                    </button>
                  </div>
                </>
              )}

              {drawerTab === 'grades' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', textAlign: 'center' }}>
                    <div style={{ padding: '10px', backgroundColor: 'var(--surface-subtle)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>GPA Hiện tại</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>{selectedStudent.gpa.toFixed(2)}</div>
                    </div>
                    <div style={{ padding: '10px', backgroundColor: 'var(--surface-subtle)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>TC Tích lũy</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>{selectedStudent.completedCredits}</div>
                    </div>
                    <div style={{ padding: '10px', backgroundColor: selectedStudent.creditsOwed > 0 ? 'var(--danger-bg)' : 'var(--success-bg)', borderRadius: '8px', border: `1px solid ${selectedStudent.creditsOwed > 0 ? 'var(--danger-border)' : 'var(--success-border)'}` }}>
                      <div style={{ fontSize: '0.6875rem', color: selectedStudent.creditsOwed > 0 ? 'var(--danger)' : 'var(--success)' }}>TC Chưa tích lũy</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: selectedStudent.creditsOwed > 0 ? 'var(--danger)' : 'var(--success)', marginTop: '2px' }}>{selectedStudent.creditsOwed}</div>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', padding: '10px', borderRadius: '6px', backgroundColor: 'var(--surface-subtle)', border: '1px solid var(--border)' }}>
                    Bảng điểm chi tiết 4 học kỳ đã được lưu trữ trong cơ sở dữ liệu `grades.json`. Nhấn nút bên dưới để mở toàn bộ học bạ điện tử của sinh viên.
                  </div>
                </div>
              )}

              {drawerTab === 'path' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.75rem' }}>
                  <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: 'var(--surface-subtle)', border: '1px solid var(--border)' }}>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>Khung chương trình K25 (HTTT - 120 TC)</div>
                    <div>• Tín chỉ hoàn thành: <strong>{selectedStudent.completedCredits} / 120 TC</strong> ({((selectedStudent.completedCredits / 120) * 100).toFixed(1)}%)</div>
                    <div>• Tín chỉ còn thiếu: <strong>{120 - selectedStudent.completedCredits} TC</strong></div>
                    <div>• Tiến độ dự kiến tốt nghiệp: <strong>Tháng 06/2026</strong></div>
                  </div>
                </div>
              )}

              {/* Action Box: Send Reminder Notification to Student */}
              <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>
                  Gửi thông báo nhắc nhở 1-click tới sinh viên:
                </label>
                <textarea 
                  rows={2}
                  value={customNoticeText}
                  onChange={(e) => setCustomNoticeText(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', fontSize: '0.75rem', borderRadius: '6px', border: '1px solid var(--border)', backgroundColor: 'var(--surface-subtle)', color: 'var(--text-primary)', marginBottom: '8px' }}
                />
                <button 
                  type="button" 
                  onClick={handleSendNotice}
                  className="btn btn-primary btn-sm"
                  style={{ width: '100%', justifyContent: 'center', fontSize: '0.75rem' }}
                >
                  <Send size={14} />
                  <span>Gửi thông báo nhắc nhở tức thì</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdvisorDashboard;
