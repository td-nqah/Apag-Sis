// ==========================================================================
// APAG Advisor Reports Page Component (React + TypeScript)
// Exact 1:1 Restoration matching pages/advisor/reports.html & js/advisor/reports.js
// ==========================================================================

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileSpreadsheet, 
  Printer, 
  Filter, 
  Search, 
  RotateCcw, 
  Users, 
  Award, 
  BookOpen, 
  AlertTriangle, 
  CheckCircle, 
  LifeBuoy, 
  ArrowUpDown, 
  UserCheck, 
  CheckCircle2, 
  TrendingUp, 
  AlertOctagon, 
  ArrowRightCircle, 
  SearchX,
  Eye
} from 'lucide-react';
import { Chart } from 'chart.js/auto';
import * as XLSX from 'xlsx';
import { Utils } from '../../utils/utils';
import { MOCK_ADVISOR_CLASS_REPORTS, MOCK_ALL_STUDENTS } from '../../services/mockData';

export const AdvisorReports: React.FC = () => {
  const navigate = useNavigate();

  // Filters state
  const [academicYear, setAcademicYear] = useState('2024 - 2025');
  const [semester, setSemester] = useState('HK1');
  const [major, setMajor] = useState('all');
  const [cohort, setCohort] = useState('all');
  const [className, setClassName] = useState('all');
  const [riskLevel, setRiskLevel] = useState('all');

  // Sorting for Table 1
  const [sortField, setSortField] = useState<'totalStudents' | 'avgGpa' | 'warningCount' | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  // Table 3 Filter & Pagination
  const [interventionSearch, setInterventionSearch] = useState('');
  const [interventionStatus, setInterventionStatus] = useState('all');
  const [interventionPage, setInterventionPage] = useState(1);
  const pageSize = 5;

  // Chart refs
  const classesChartRef = useRef<HTMLCanvasElement | null>(null);
  const riskChartRef = useRef<HTMLCanvasElement | null>(null);
  const classesChartInstance = useRef<Chart | null>(null);
  const riskChartInstance = useRef<Chart | null>(null);

  // Filtered class reports
  const filteredClasses = useMemo(() => {
    let list = [...MOCK_ADVISOR_CLASS_REPORTS];
    if (cohort !== 'all') {
      list = list.filter(c => c.cohort === cohort);
    }
    if (major !== 'all') {
      list = list.filter(c => c.major === major);
    }
    if (className !== 'all') {
      list = list.filter(c => c.classCode === className);
    }

    if (sortField) {
      list.sort((a, b) => {
        const valA = a[sortField];
        const valB = b[sortField];
        return sortAsc ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
      });
    }

    return list;
  }, [cohort, major, className, sortField, sortAsc]);

  // Filtered students
  const filteredStudents = useMemo(() => {
    let list = [...MOCK_ALL_STUDENTS];
    if (cohort !== 'all') {
      list = list.filter(s => s.cohort === cohort);
    }
    if (major !== 'all') {
      list = list.filter(s => s.major === major);
    }
    if (className !== 'all') {
      list = list.filter(s => s.class === className);
    }
    if (riskLevel !== 'all') {
      if (riskLevel === 'critical_high') {
        list = list.filter(s => s.riskLevel === 'critical' || s.riskLevel === 'high');
      } else if (riskLevel === 'watch') {
        list = list.filter(s => s.riskLevel === 'watch');
      } else if (riskLevel === 'normal') {
        list = list.filter(s => s.riskLevel === 'normal');
      }
    }
    return list;
  }, [cohort, major, className, riskLevel]);

  // KPIs
  const kpi = useMemo(() => {
    const totalStudents = filteredClasses.reduce((acc, c) => acc + c.totalStudents, 0);
    const totalPassed = filteredClasses.reduce((acc, c) => acc + c.passedCount, 0);
    const totalWarning = filteredClasses.reduce((acc, c) => acc + c.warningCount, 0);
    const avgGpa = totalStudents > 0 
      ? (filteredClasses.reduce((acc, c) => acc + (c.avgGpa * c.totalStudents), 0) / totalStudents).toFixed(2) 
      : '0.00';
    const avgCredits = totalStudents > 0 
      ? (filteredClasses.reduce((acc, c) => acc + (c.avgCredits * c.totalStudents), 0) / totalStudents).toFixed(1) 
      : '0';
    const onTrackRate = totalStudents > 0 
      ? ((totalPassed / totalStudents) * 100).toFixed(1) 
      : '0.0';
    const needIntervention = filteredClasses.reduce((acc, c) => acc + c.needIntervention, 0);

    return {
      totalStudents,
      avgGpa,
      avgCredits,
      warningCount: totalWarning,
      warningRate: totalStudents > 0 ? ((totalWarning / totalStudents) * 100).toFixed(1) : '0.0',
      onTrackRate,
      needIntervention
    };
  }, [filteredClasses]);

  // Risk Distribution Data
  const riskDistribution = useMemo(() => {
    const highCount = filteredStudents.filter(s => s.riskLevel === 'critical' || s.riskLevel === 'high').length;
    const watchCount = filteredStudents.filter(s => s.riskLevel === 'watch').length;
    const normalCount = filteredStudents.filter(s => s.riskLevel === 'normal').length;
    const studentTotal = filteredStudents.length || 1;

    return [
      {
        riskLevel: 'critical_high',
        label: 'Cao',
        badgeClass: 'badge-danger',
        count: highCount,
        percentage: ((highCount / studentTotal) * 100).toFixed(1),
        commonCauses: 'Chưa tích lũy học phần tiên quyết (LIF2004, LIF1006); GPA tích lũy < 2.0; thiếu > 10 tín chỉ',
        handledCount: filteredStudents.filter(s => (s.riskLevel === 'critical' || s.riskLevel === 'high') && s.interventionStatus === 'resolved').length,
        pendingCount: filteredStudents.filter(s => (s.riskLevel === 'critical' || s.riskLevel === 'high') && s.interventionStatus !== 'resolved').length
      },
      {
        riskLevel: 'normal',
        label: 'Bình thường',
        badgeClass: 'badge-success',
        count: normalCount,
        percentage: ((normalCount / studentTotal) * 100).toFixed(1),
        commonCauses: 'Tiến độ tích lũy đúng hạn hoặc vượt chuẩn; GPA tích lũy >= 2.50; không có học phần chưa đạt',
        handledCount: normalCount,
        pendingCount: 0
      },
      {
        riskLevel: 'watch',
        label: 'Theo dõi',
        badgeClass: 'badge-warning',
        count: watchCount,
        percentage: ((watchCount / studentTotal) * 100).toFixed(1),
        commonCauses: 'Tiến độ tích lũy chậm 6-12 TC; chưa nộp minh chứng chuẩn Ngoại ngữ B1 (CHUANNN) / GDTC (ISF0010)',
        handledCount: filteredStudents.filter(s => s.riskLevel === 'watch' && s.interventionStatus === 'resolved').length,
        pendingCount: filteredStudents.filter(s => s.riskLevel === 'watch' && s.interventionStatus !== 'resolved').length
      }
    ];
  }, [filteredStudents]);

  // Filtered Intervention students for Table 3
  const interventionList = useMemo(() => {
    let list = filteredStudents.filter(s => s.riskLevel === 'critical' || s.riskLevel === 'high' || s.riskLevel === 'watch');
    if (interventionSearch.trim()) {
      const q = interventionSearch.toLowerCase().trim();
      list = list.filter(s => (s.name || (s as any).fullName || '').toLowerCase().includes(q) || s.studentId.toLowerCase().includes(q));
    }
    if (interventionStatus !== 'all') {
      list = list.filter(s => s.interventionStatus === interventionStatus);
    }
    return list;
  }, [filteredStudents, interventionSearch, interventionStatus]);

  const totalInterventionPages = Math.ceil(interventionList.length / pageSize) || 1;
  const paginatedInterventions = useMemo(() => {
    const start = (interventionPage - 1) * pageSize;
    return interventionList.slice(start, start + pageSize);
  }, [interventionList, interventionPage]);

  // Render Charts
  const renderCharts = () => {
    const labelColor = '#6B7280';
    const gridColor = '#F1F5F9';
    const tooltipBg = '#111827';
    const tooltipText = '#FFFFFF';

    // 1. Classes Chart
    if (classesChartRef.current) {
      if (classesChartInstance.current) {
        classesChartInstance.current.destroy();
        classesChartInstance.current = null;
      }

      classesChartInstance.current = new Chart(classesChartRef.current, {
        type: 'bar',
        data: {
          labels: filteredClasses.map(c => c.classCode),
          datasets: [
            {
              label: 'GPA trung bình',
              data: filteredClasses.map(c => c.avgGpa),
              backgroundColor: '#1D4ED8',
              borderRadius: 4,
              yAxisID: 'y'
            },
            {
              label: 'Số ca cảnh báo',
              data: filteredClasses.map(c => c.warningCount),
              backgroundColor: '#EF4444',
              borderRadius: 4,
              yAxisID: 'y1'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: { color: labelColor }
            },
            tooltip: {
              backgroundColor: tooltipBg,
              titleColor: tooltipText,
              bodyColor: tooltipText
            }
          },
          scales: {
            x: {
              ticks: { color: labelColor },
              grid: { display: false }
            },
            y: {
              type: 'linear',
              display: true,
              position: 'left',
              min: 0,
              max: 4.0,
              ticks: { color: labelColor },
              grid: { color: gridColor }
            },
            y1: {
              type: 'linear',
              display: true,
              position: 'right',
              min: 0,
              grid: { drawOnChartArea: false },
              ticks: { color: labelColor, stepSize: 1 }
            }
          }
        }
      });
    }

    // 2. Risk Donut Chart
    if (riskChartRef.current) {
      if (riskChartInstance.current) {
        riskChartInstance.current.destroy();
        riskChartInstance.current = null;
      }

      const highCount = filteredStudents.filter(s => s.riskLevel === 'critical' || s.riskLevel === 'high').length;
      const watchCount = filteredStudents.filter(s => s.riskLevel === 'watch').length;
      const normalCount = filteredStudents.filter(s => s.riskLevel === 'normal').length;

      riskChartInstance.current = new Chart(riskChartRef.current, {
        type: 'doughnut',
        data: {
          labels: ['Cao', 'Bình thường', 'Theo dõi'],
          datasets: [
            {
              data: [highCount, normalCount, watchCount],
              backgroundColor: ['#EF4444', '#10B981', '#F59E0B'],
              borderWidth: 2,
              borderColor: '#FFFFFF'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '70%',
          plugins: {
            legend: {
              position: 'bottom',
              labels: { color: labelColor, boxWidth: 12 }
            },
            tooltip: {
              backgroundColor: tooltipBg,
              titleColor: tooltipText,
              bodyColor: tooltipText
            }
          }
        }
      });
    }
  };

  useEffect(() => {
    renderCharts();
    return () => {
      if (classesChartInstance.current) classesChartInstance.current.destroy();
      if (riskChartInstance.current) riskChartInstance.current.destroy();
    };
  }, [filteredClasses, filteredStudents]);

  const handleResetFilters = () => {
    setAcademicYear('2024 - 2025');
    setSemester('HK1');
    setMajor('all');
    setCohort('all');
    setClassName('all');
    setRiskLevel('all');
    setInterventionSearch('');
    setInterventionStatus('all');
    setInterventionPage(1);
    Utils.showToast('Đã đặt lại bộ lọc về mặc định', 'info');
  };

  const handleSort = (field: 'totalStudents' | 'avgGpa' | 'warningCount') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false); // Default descending for quick scan
    }
  };

  // Export Excel
  const handleExportExcel = () => {
    try {
      const wb = XLSX.utils.book_new();

      // Sheet 1: KPIs
      const kpiRows = [
        ['CHỈ SỐ BÁO CÁO HỌC VỤ', 'GIÁ TRỊ', 'GHI CHÚ'],
        ['Tổng số sinh viên', kpi.totalStudents, 'Thuộc diện quản lý của Cố vấn'],
        ['GPA trung bình', `${kpi.avgGpa} / 4.0`, 'Thang điểm 4 tín chỉ APAG'],
        ['Tín chỉ tích lũy TB', `${kpi.avgCredits} TC`, 'Đạt 59.6% khung đào tạo'],
        ['Số SV có cảnh báo', `${kpi.warningCount} (${kpi.warningRate}%)`, 'Bao gồm cảnh báo Cấp 1 & 2'],
        ['Tốt nghiệp đúng hạn', `${kpi.onTrackRate}%`, 'Dựa trên tiến độ tích lũy thực tế'],
        ['Cần hỗ trợ học tập', kpi.needIntervention, 'Cần tư vấn & lập kế hoạch học tập bù']
      ];
      const wsKpi = XLSX.utils.aoa_to_sheet(kpiRows);
      XLSX.utils.book_append_sheet(wb, wsKpi, '1_ChiSo_TongQuan');

      // Sheet 2: Class results
      const classRows = [
        ['STT', 'Lớp sinh hoạt', 'Số sinh viên', 'GPA trung bình', 'Đạt yêu cầu (SV)', 'Đạt yêu cầu (%)', 'Cảnh báo (SV)', 'Cảnh báo (%)', 'TC hoàn thành TB']
      ];
      filteredClasses.forEach((c: any, idx) => {
        const passedPct = ((c.passedCount / (c.totalStudents || 1)) * 100).toFixed(1);
        const warningPct = ((c.warningCount / (c.totalStudents || 1)) * 100).toFixed(1);
        classRows.push([
          idx + 1,
          c.classCode,
          c.totalStudents,
          c.avgGpa,
          c.passedCount,
          `${passedPct}%`,
          c.warningCount,
          `${warningPct}%`,
          `${c.avgCredits} TC`
        ]);
      });
      const wsClass = XLSX.utils.aoa_to_sheet(classRows);
      XLSX.utils.book_append_sheet(wb, wsClass, '2_KetQua_TheoLop');

      // Sheet 3: Risk distribution
      const riskRows = [
        ['Mức độ rủi ro', 'Số sinh viên', 'Tỷ lệ %', 'Nguyên nhân phổ biến', 'Đã xử lý', 'Chờ xử lý']
      ];
      riskDistribution.forEach((r: any) => {
        riskRows.push([
          r.label,
          r.count,
          `${r.percentage}%`,
          r.commonCauses,
          r.handledCount,
          r.pendingCount
        ]);
      });
      const wsRisk = XLSX.utils.aoa_to_sheet(riskRows);
      XLSX.utils.book_append_sheet(wb, wsRisk, '3_PhanBo_RuiRo');

      // Sheet 4: Intervention students
      const intvRows = [
        ['Mã SV', 'Họ và tên', 'Lớp', 'GPA', 'TC chưa tích lũy', 'Mức độ rủi ro', 'Nguyên nhân cảnh báo', 'Cố vấn phụ trách', 'Trạng thái xử lý']
      ];
      interventionList.forEach((s: any) => {
        intvRows.push([
          s.studentId,
          s.name || s.fullName || '',
          s.class,
          s.gpa,
          s.missingCredits || s.creditsBehind || 0,
          (s.riskLevel === 'critical' || s.riskLevel === 'high') ? 'Cao' : (s.riskLevel === 'watch' ? 'Theo dõi' : 'Bình thường'),
          s.riskReason || s.alertReason || '',
          s.advisorName || 'TS. Nguyễn Năng Thành',
          s.interventionStatus === 'resolved' ? 'Đã xử lý' : (s.interventionStatus === 'in_progress' ? 'Đang xử lý' : 'Chờ xử lý')
        ]);
      });
      const wsIntv = XLSX.utils.aoa_to_sheet(intvRows);
      XLSX.utils.book_append_sheet(wb, wsIntv, '4_DanhSach_CanThiep');

      const dateStr = new Date().toISOString().split('T')[0];
      XLSX.writeFile(wb, `APAG_BaoCao_ThongKeHocVu_${dateStr}.xlsx`);
      Utils.showToast('Đã xuất thành công tệp Excel báo cáo học vụ!', 'success');
    } catch (err) {
      console.error('Excel Export Error:', err);
      Utils.showToast('Lỗi khi xuất tệp Excel', 'danger');
    }
  };

  const semLabel = semester === 'all' ? 'Cả năm' : (semester === 'HK1' ? 'Học kỳ 1' : 'Học kỳ 2');
  const yearText = academicYear === 'all' ? 'Tất cả năm' : `Năm ${academicYear}`;
  const scopeLabel = className !== 'all' 
    ? `Lớp ${className}` 
    : (major !== 'all' ? `Ngành ${major}` : (cohort !== 'all' ? `Khóa ${cohort}` : 'Tất cả các lớp'));
  const riskMap: Record<string, string> = {
    'all': 'Tất cả mức độ',
    'critical_high': 'Cao',
    'normal': 'Bình thường',
    'watch': 'Theo dõi'
  };

  const isEmpty = filteredClasses.length === 0 && filteredStudents.length === 0;

  return (
    <div>
      {/* Print-only Official Header */}
      <div className="print-only-header">
        <div style={{ fontSize: '13pt', fontWeight: 700, textTransform: 'uppercase' }}>HỌC VIỆN HÀNH CHÍNH QUỐC GIA</div>
        <div style={{ fontSize: '11pt', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>KHOA CÔNG NGHỆ VÀ QUẢN TRỊ SỐ</div>
        <div style={{ fontSize: '14pt', fontWeight: 700, color: '#1e3a8a', marginTop: '10px' }}>BÁO CÁO & THỐNG KÊ TÌNH HÌNH HỌC VỤ</div>
        <div style={{ fontSize: '10pt', color: '#4b5563', marginTop: '4px' }}>
          {yearText} • {semLabel} • Cố vấn học tập: TS. Nguyễn Năng Thành
        </div>
      </div>

      {/* Top Action Buttons (no-print) */}
      <div className="d-flex justify-end gap-2 mb-4 flex-wrap no-print" style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
        <button type="button" className="btn btn-secondary btn-sm" onClick={handleExportExcel} title="Tải xuống toàn bộ bảng dữ liệu định dạng Excel (.xlsx)">
          <FileSpreadsheet size={14} />
          <span>Xuất Excel</span>
        </button>
        <button type="button" className="btn btn-outline btn-sm" onClick={() => window.print()} title="In trực tiếp hoặc xuất tệp PDF báo cáo học vụ">
          <Printer size={14} />
          <span>In báo cáo</span>
        </button>
      </div>

      {/* 1. Bộ lọc báo cáo đa chiều */}
      <div className="report-filter-bar no-print mb-6">
        <div className="d-flex items-center justify-between mb-3">
          <div className="d-flex items-center gap-2">
            <Filter size={18} className="text-primary" />
            <span className="text-sm font-bold text-primary">BỘ LỌC DỮ LIỆU BÁO CÁO</span>
          </div>
          <span className="text-xs text-muted">Dữ liệu mô phỏng theo chuẩn phân cấp đào tạo tín chỉ APAG</span>
        </div>

        <form className="report-filter-grid" onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label className="form-label text-xs">Năm học</label>
            <select className="form-control form-control-sm" value={academicYear} onChange={(e) => setAcademicYear(e.target.value)}>
              <option value="2024 - 2025">2024 - 2025</option>
              <option value="2023 - 2024">2023 - 2024</option>
              <option value="2022 - 2023">2022 - 2023</option>
              <option value="all">Tất cả năm học</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label text-xs">Học kỳ</label>
            <select className="form-control form-control-sm" value={semester} onChange={(e) => setSemester(e.target.value)}>
              <option value="HK1">Học kỳ 1</option>
              <option value="HK2">Học kỳ 2</option>
              <option value="all">Cả năm học</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label text-xs">Khoa / Ngành</label>
            <select className="form-control form-control-sm" value={major} onChange={(e) => setMajor(e.target.value)}>
              <option value="all">Tất cả các ngành</option>
              <option value="HTTT">Hệ thống thông tin</option>
              <option value="KHDL">Khoa học dữ liệu</option>
              <option value="ATTT">An toàn thông tin</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label text-xs">Khóa tuyển sinh</label>
            <select className="form-control form-control-sm" value={cohort} onChange={(e) => setCohort(e.target.value)}>
              <option value="all">Tất cả các khóa</option>
              <option value="K25">Khóa 25 (2025)</option>
              <option value="K24">Khóa 24 (2024)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label text-xs">Lớp sinh hoạt</label>
            <select className="form-control form-control-sm" value={className} onChange={(e) => setClassName(e.target.value)}>
              <option value="all">Tất cả các lớp</option>
              <option value="25HTTB01">25HTTB01 (K25)</option>
              <option value="25HTTB02">25HTTB02 (K25)</option>
              <option value="24HTTB01">24HTTB01 (K24)</option>
              <option value="25KHDL01">25KHDL01 (K25)</option>
              <option value="25ATTT01">25ATTT01 (K25)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label text-xs">Mức độ rủi ro</label>
            <select className="form-control form-control-sm" value={riskLevel} onChange={(e) => setRiskLevel(e.target.value)}>
              <option value="all">Tất cả mức độ</option>
              <option value="critical_high">Cao</option>
              <option value="normal">Bình thường</option>
              <option value="watch">Theo dõi</option>
            </select>
          </div>

          <div className="d-flex gap-2">
            <button 
              type="button" 
              className="btn btn-primary btn-sm flex-1"
              onClick={() => Utils.showToast('Đã áp dụng bộ lọc báo cáo!', 'success')}
            >
              <Search size={14} />
              <span>Áp dụng</span>
            </button>
            <button 
              type="button" 
              className="btn btn-secondary btn-sm" 
              onClick={handleResetFilters}
              title="Đặt lại bộ lọc về mặc định"
            >
              <RotateCcw size={14} />
              <span>Đặt lại</span>
            </button>
          </div>
        </form>

        {/* Filter Status Pill Bar */}
        <div className="mt-3 pt-3 border-top d-flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="d-flex items-center gap-2 text-secondary">
            <span className="font-medium">Đang áp dụng:</span>
            <span className="badge badge-primary">{yearText} • {semLabel}</span>
            <span className="badge badge-secondary">{scopeLabel}</span>
            <span className="badge badge-secondary">{riskMap[riskLevel]}</span>
          </div>
          <div className="text-muted">
            Đang hiển thị: <strong>{filteredClasses.length}</strong> lớp • <strong>{kpi.totalStudents}</strong> sinh viên
          </div>
        </div>
      </div>

      {/* 2. Khu vực 6 KPI Cards Tổng quan */}
      <div className="report-kpi-grid mb-6">
        <div className="report-kpi-card">
          <div className="report-kpi-header">
            <span className="report-kpi-title">Tổng số sinh viên</span>
            <div className="report-kpi-icon bg-subtle text-primary">
              <Users size={18} />
            </div>
          </div>
          <div className="report-kpi-value">{kpi.totalStudents}</div>
          <div className="report-kpi-subtitle">Thuộc diện quản lý của Cố vấn</div>
        </div>

        <div className="report-kpi-card">
          <div className="report-kpi-header">
            <span className="report-kpi-title">GPA trung bình</span>
            <div className="report-kpi-icon bg-subtle text-info">
              <Award size={18} />
            </div>
          </div>
          <div className="report-kpi-value text-primary">{kpi.avgGpa} <span className="text-xs text-muted font-normal">/ 4.0</span></div>
          <div className="report-kpi-subtitle">Thang điểm 4 tín chỉ APAG</div>
        </div>

        <div className="report-kpi-card">
          <div className="report-kpi-header">
            <span className="report-kpi-title">Tín chỉ tích lũy TB</span>
            <div className="report-kpi-icon bg-subtle text-secondary">
              <BookOpen size={18} />
            </div>
          </div>
          <div className="report-kpi-value">{kpi.avgCredits} <span className="text-xs text-muted font-normal">TC</span></div>
          <div className="report-kpi-subtitle">Đạt 59.6% khung đào tạo</div>
        </div>

        <div className="report-kpi-card">
          <div className="report-kpi-header">
            <span className="report-kpi-title">Số SV có cảnh báo</span>
            <div className="report-kpi-icon bg-subtle text-danger">
              <AlertTriangle size={18} />
            </div>
          </div>
          <div className="report-kpi-value text-danger">{kpi.warningCount} <span className="text-xs text-muted font-normal">({kpi.warningRate}%)</span></div>
          <div className="report-kpi-subtitle">Bao gồm cảnh báo Cấp 1 & 2</div>
        </div>

        <div className="report-kpi-card">
          <div className="report-kpi-header">
            <span className="report-kpi-title">Tốt nghiệp đúng hạn</span>
            <div className="report-kpi-icon bg-subtle text-success">
              <CheckCircle size={18} />
            </div>
          </div>
          <div className="report-kpi-value text-success">{kpi.onTrackRate}%</div>
          <div className="report-kpi-subtitle">Dựa trên tiến độ tích lũy thực tế</div>
        </div>

        <div className="report-kpi-card">
          <div className="report-kpi-header">
            <span className="report-kpi-title">Cần hỗ trợ học tập</span>
            <div className="report-kpi-icon bg-subtle text-warning">
              <LifeBuoy size={18} />
            </div>
          </div>
          <div className="report-kpi-value text-warning">{kpi.needIntervention}</div>
          <div className="report-kpi-subtitle">Cần tư vấn & lập kế hoạch bù</div>
        </div>
      </div>

      {/* Empty State */}
      {isEmpty && (
        <div className="minimal-card p-8 text-center mb-6">
          <div className="mb-3 text-muted">
            <SearchX size={48} style={{ margin: '0 auto' }} />
          </div>
          <h3 className="text-base font-bold text-primary mb-1">Không tìm thấy dữ liệu phù hợp</h3>
          <p className="text-sm text-secondary mb-4">Không có lớp hoặc sinh viên nào khớp với các tiêu chí bộ lọc đã chọn.</p>
          <button type="button" className="btn btn-secondary btn-sm" onClick={handleResetFilters}>
            <RotateCcw size={14} />
            <span>Đặt lại toàn bộ bộ lọc</span>
          </button>
        </div>
      )}

      {/* 3. Khu vực Biểu đồ trực quan */}
      {!isEmpty && (
        <div className="report-charts-grid mb-6">
          {/* Biểu đồ 1 */}
          <div className="minimal-card p-5">
            <div className="d-flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-primary">SO SÁNH GPA & CẢNH BÁO THEO LỚP</h3>
                <p className="text-xs text-muted">Biểu đồ cột thể hiện tương quan GPA trung bình và số lượng sinh viên cảnh báo</p>
              </div>
              <span className="badge badge-secondary text-xs">Cập nhật theo bộ lọc</span>
            </div>
            <div style={{ height: '250px', position: 'relative' }}>
              <canvas ref={classesChartRef}></canvas>
            </div>
          </div>

          {/* Biểu đồ 2 */}
          <div className="minimal-card p-5">
            <div className="d-flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-primary">PHÂN BỐ MỨC ĐỘ RỦI RO HỌC TẬP</h3>
              </div>
              <span className="badge badge-secondary text-xs">Chỉ số AI</span>
            </div>
            <div style={{ height: '250px', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <canvas ref={riskChartRef}></canvas>
            </div>
          </div>
        </div>
      )}

      {/* 4. Bảng 1: Thống kê kết quả học tập theo lớp */}
      {!isEmpty && (
        <div className="minimal-card mb-6">
          <div className="card-header pb-2">
            <div>
              <h2 className="card-title text-base font-bold">1. Kết quả học tập theo lớp</h2>
              <p className="card-subtitle text-xs text-muted">Bấm vào tiêu đề cột để sắp xếp tăng/giảm theo GPA, Số sinh viên hoặc Số ca cảnh báo</p>
            </div>
            <span className="badge badge-primary text-xs">{filteredClasses.length} Lớp</span>
          </div>
          <div className="card-body p-0">
            <div className="table-container">
              <table className="minimal-table">
                <thead>
                  <tr>
                    <th style={{ width: '50px', textAlign: 'center' }}>STT</th>
                    <th>Lớp sinh hoạt</th>
                    <th 
                      className="sortable-th" 
                      onClick={() => handleSort('totalStudents')}
                      style={{ textAlign: 'right', cursor: 'pointer' }}
                    >
                      <div className="d-flex items-center justify-end gap-1">
                        <span>Số sinh viên</span>
                        <ArrowUpDown size={12} />
                      </div>
                    </th>
                    <th 
                      className="sortable-th" 
                      onClick={() => handleSort('avgGpa')}
                      style={{ textAlign: 'right', cursor: 'pointer' }}
                    >
                      <div className="d-flex items-center justify-end gap-1">
                        <span>GPA trung bình</span>
                        <ArrowUpDown size={12} />
                      </div>
                    </th>
                    <th style={{ textAlign: 'right' }}>Đạt yêu cầu</th>
                    <th 
                      className="sortable-th text-danger" 
                      onClick={() => handleSort('warningCount')}
                      style={{ textAlign: 'right', cursor: 'pointer' }}
                    >
                      <div className="d-flex items-center justify-end gap-1 text-danger">
                        <span>Cảnh báo học tập</span>
                        <ArrowUpDown size={12} />
                      </div>
                    </th>
                    <th style={{ textAlign: 'right' }}>Hoàn thành tín chỉ TB</th>
                    <th className="no-print" style={{ textAlign: 'center' }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClasses.map((item, index) => (
                    <tr key={item.classCode}>
                      <td style={{ textAlign: 'center' }} className="text-muted font-medium">{index + 1}</td>
                      <td className="font-semibold text-primary">{item.classCode}</td>
                      <td style={{ textAlign: 'right', fontWeight: 500 }}>{item.totalStudents}</td>
                      <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--text-primary)' }}>{item.avgGpa.toFixed(2)}</td>
                      <td style={{ textAlign: 'right' }}>
                        {item.passedCount} <span className="text-xs text-muted">({((item.passedCount / (item.totalStudents || 1)) * 100).toFixed(1)}%)</span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        {item.warningCount > 0 ? (
                          <span className="text-danger font-semibold">{item.warningCount} ({((item.warningCount / (item.totalStudents || 1)) * 100).toFixed(1)}%)</span>
                        ) : (
                          <span className="text-muted">0 (0.0%)</span>
                        )}
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 500 }}>{item.avgCredits} TC</td>
                      <td className="no-print" style={{ textAlign: 'center' }}>
                        <button 
                          type="button" 
                          className="btn btn-secondary btn-xs"
                          onClick={() => navigate(`/advisor/students?class=${encodeURIComponent(item.classCode)}`)}
                        >
                          <Eye size={12} />
                          <span>Chi tiết</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 5. Bảng 2: Phân bố mức độ rủi ro học tập */}
      {!isEmpty && (
        <div className="minimal-card mb-6">
          <div className="card-header pb-2">
            <div>
              <h2 className="card-title text-base font-bold">2. Phân bố sinh viên theo mức độ rủi ro</h2>
            </div>
            <span className="badge badge-secondary text-xs">Mô hình AI</span>
          </div>
          <div className="card-body p-0">
            <div className="table-container">
              <table className="minimal-table">
                <thead>
                  <tr>
                    <th>Mức độ rủi ro</th>
                    <th style={{ textAlign: 'right' }}>Số sinh viên</th>
                    <th style={{ textAlign: 'right' }}>Tỷ lệ trên tổng SV</th>
                    <th>Nguyên nhân phổ biến</th>
                    <th style={{ textAlign: 'right' }}>Đã được cố vấn xử lý</th>
                    <th style={{ textAlign: 'right' }}>Đang chờ xử lý</th>
                  </tr>
                </thead>
                <tbody>
                  {riskDistribution.map(r => (
                    <tr key={r.riskLevel}>
                      <td>
                        <span className={`badge ${r.badgeClass}`}>{r.label}</span>
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 700 }}>{r.count}</td>
                      <td style={{ textAlign: 'right', fontWeight: 500 }}>{r.percentage}%</td>
                      <td className="text-xs text-secondary" style={{ maxWidth: '340px' }}>{r.commonCauses}</td>
                      <td style={{ textAlign: 'right', color: 'var(--success-color, #10B981)', fontWeight: 600 }}>{r.handledCount}</td>
                      <td style={{ textAlign: 'right', color: 'var(--danger-color, #EF4444)', fontWeight: 600 }}>{r.pendingCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 6. Bảng 3: Danh sách trường hợp cần hỗ trợ học vụ */}
      {!isEmpty && (
        <div className="minimal-card mb-6">
          <div className="card-header pb-2 flex-wrap gap-3">
            <div>
              <h2 className="card-title text-base font-bold">3. Danh sách trường hợp cần hỗ trợ học vụ</h2>
            </div>
            
            <div className="d-flex items-center gap-2 flex-wrap no-print">
              <div className="input-wrapper" style={{ width: '220px' }}>
                <input 
                  type="text" 
                  className="form-control form-control-sm" 
                  placeholder="Tìm tên hoặc MSSV..." 
                  value={interventionSearch}
                  onChange={(e) => { setInterventionSearch(e.target.value); setInterventionPage(1); }}
                  autoComplete="off"
                />
              </div>
              <select 
                className="form-control form-control-sm" 
                value={interventionStatus}
                onChange={(e) => { setInterventionStatus(e.target.value); setInterventionPage(1); }}
                style={{ width: '140px' }}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="pending">Chờ xử lý</option>
                <option value="in_progress">Đang xử lý</option>
                <option value="resolved">Đã xử lý</option>
              </select>
            </div>
          </div>

          <div className="card-body p-0">
            <div className="table-container">
              <table className="minimal-table">
                <thead>
                  <tr>
                    <th>Mã SV</th>
                    <th>Họ và tên</th>
                    <th>Lớp</th>
                    <th style={{ textAlign: 'right' }}>GPA</th>
                    <th style={{ textAlign: 'right' }}>TC chưa tích lũy</th>
                    <th>Mức độ rủi ro</th>
                    <th style={{ maxWidth: '280px' }}>Nguyên nhân cảnh báo</th>
                    <th>Cố vấn phụ trách</th>
                    <th>Trạng thái xử lý</th>
                    <th className="no-print" style={{ textAlign: 'center' }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedInterventions.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="text-center py-6 text-muted">
                        Không có sinh viên cần hỗ trợ khớp với điều kiện lọc
                      </td>
                    </tr>
                  ) : (
                    paginatedInterventions.map(s => {
                      const isHigh = s.riskLevel === 'critical' || s.riskLevel === 'high';
                      const isWatch = s.riskLevel === 'watch';
                      const riskBadge = isHigh 
                        ? 'badge-danger' 
                        : (isWatch ? 'badge-warning' : 'badge-success');
                      const riskText = isHigh ? 'Cao' : (isWatch ? 'Theo dõi' : 'Bình thường');

                      const statusBadge = s.interventionStatus === 'resolved' 
                        ? 'badge-success' 
                        : (s.interventionStatus === 'in_progress' ? 'badge-info' : 'badge-warning');
                      const statusText = s.interventionStatus === 'resolved' 
                        ? 'Đã xử lý' 
                        : (s.interventionStatus === 'in_progress' ? 'Đang xử lý' : 'Chờ xử lý');

                      return (
                        <tr key={s.id || s.studentId}>
                          <td className="font-mono text-xs">{s.studentId}</td>
                          <td className="font-medium">{s.name || (s as any).fullName}</td>
                          <td>{s.class}</td>
                          <td style={{ textAlign: 'right', fontWeight: 700 }}>{s.gpa.toFixed(2)}</td>
                          <td style={{ textAlign: 'right', color: ((s as any).missingCredits || (s as any).creditsBehind) ? 'var(--danger-color, #EF4444)' : 'inherit' }}>
                            {((s as any).missingCredits || (s as any).creditsBehind) ? `${(s as any).missingCredits || (s as any).creditsBehind} TC` : '0 TC'}
                          </td>
                          <td><span className={`badge ${riskBadge}`}>{riskText}</span></td>
                          <td className="text-xs text-secondary" style={{ maxWidth: '280px' }}>{(s as any).riskReason || (s as any).alertReason || 'Thiếu tín chỉ / chưa đạt học phần'}</td>
                          <td className="text-xs text-muted">{s.advisorName || 'TS. Nguyễn Năng Thành'}</td>
                          <td><span className={`badge ${statusBadge}`}>{statusText}</span></td>
                          <td className="no-print" style={{ textAlign: 'center' }}>
                            <button 
                              type="button" 
                              className="btn btn-secondary btn-xs"
                              onClick={() => navigate(`/advisor/student-detail?id=${s.id || s.studentId}`)}
                            >
                              <Eye size={12} />
                              <span>Hồ sơ</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Phân trang danh sách hỗ trợ học vụ */}
            <div className="d-flex items-center justify-between p-3 border-top flex-wrap gap-2 no-print pagination-container">
              <span className="text-xs text-muted">
                Hiển thị {Math.min((interventionPage - 1) * pageSize + 1, interventionList.length)} - {Math.min(interventionPage * pageSize, interventionList.length)} trong tổng số {interventionList.length} sinh viên
              </span>
              <div className="d-flex gap-1">
                <button 
                  type="button" 
                  className="pagination-btn"
                  disabled={interventionPage <= 1}
                  onClick={() => setInterventionPage(p => Math.max(1, p - 1))}
                >
                  Trước
                </button>
                {Array.from({ length: totalInterventionPages }, (_, i) => i + 1).map(p => (
                  <button 
                    key={p} 
                    type="button" 
                    className={`pagination-btn ${p === interventionPage ? 'active' : ''}`}
                    onClick={() => setInterventionPage(p)}
                  >
                    {p}
                  </button>
                ))}
                <button 
                  type="button" 
                  className="pagination-btn"
                  disabled={interventionPage >= totalInterventionPages}
                  onClick={() => setInterventionPage(p => Math.min(totalInterventionPages, p + 1))}
                >
                  Sau
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. Card Nhận xét chuyên môn của Cố vấn học tập */}
      <div className="minimal-card p-6 mb-6 card--emphasized">
        <div className="d-flex items-center gap-3 mb-4">
          <div className="stat-icon-box bg-subtle text-primary" style={{ width: '42px', height: '42px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <UserCheck size={22} />
          </div>
          <div>
            <h3 className="text-base font-bold text-primary">Nhận xét chuyên môn của Cố vấn học tập</h3>
            <p className="text-xs text-muted">TS. Nguyễn Năng Thành • Phó Trưởng Khoa, Cố vấn học tập chuyên trách Khóa 25</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-secondary" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
          <div className="nested-card p-4 rounded border">
            <div className="d-flex items-center gap-2 mb-2 font-bold text-primary">
              <CheckCircle2 size={16} />
              <span>1. Tóm tắt tổng quan kỳ học</span>
            </div>
            <p className="text-xs leading-relaxed">
              Đa số sinh viên lớp K25-HTTB thích ứng tốt với chương trình đào tạo tín chỉ, điểm thi các học phần chuyên ngành cơ sở (CSDL, Kiến trúc máy tính) đạt phổ điểm khá và giỏi. Tỷ lệ hoàn thành khối kiến thức đại cương đạt 100%, tỷ lệ sinh viên duy trì đúng lộ trình đạt trên 92%.
            </p>
          </div>

          <div className="nested-card p-4 rounded border">
            <div className="d-flex items-center gap-2 mb-2 font-bold text-info">
              <TrendingUp size={16} />
              <span>2. Xu hướng học tập & Tiến độ</span>
            </div>
            <p className="text-xs leading-relaxed">
              Điểm GPA trung bình toàn khóa đạt 3.18/4.0, tăng nhẹ 0.06 điểm so với học kỳ trước. Các học phần định hướng ứng dụng thực tiễn trong Chuyển đổi số cơ quan nhà nước có tỷ lệ sinh viên đạt loại Giỏi và Xuất sắc cao (trên 35%).
            </p>
          </div>

          <div className="nested-card p-4 rounded border">
            <div className="d-flex items-center gap-2 mb-2 font-bold text-danger">
              <AlertOctagon size={16} />
              <span>3. Nhóm sinh viên cần hỗ trợ học tập ưu tiên</span>
            </div>
            <p className="text-xs leading-relaxed">
              Có 5 trường hợp chưa tích lũy học phần tiên quyết LIF2004 (Hệ quản trị cơ sở dữ liệu) và Cấu trúc dữ liệu & giải thuật (LIF1006). Cần đặc biệt lưu ý trường hợp SV Ngô Thị Quỳnh Anh (GPA 1.95) thuộc diện Cảnh báo cấp 2, đã được lập kế hoạch hỗ trợ học tập, điều chỉnh khối lượng học tập xuống 12 tín chỉ ở HK tiếp theo.
            </p>
          </div>

          <div className="nested-card p-4 rounded border">
            <div className="d-flex items-center gap-2 mb-2 font-bold text-warning">
              <ArrowRightCircle size={16} />
              <span>4. Đề xuất hành động học vụ</span>
            </div>
            <p className="text-xs leading-relaxed">
              Đề nghị Khoa & Phòng Đào tạo mở thêm 1 lớp học phần bù cho học phần LIF2004 trong học kỳ hè; đồng thời khuyến nghị sinh viên khóa 25 hoàn thiện hồ sơ chứng chỉ VSTEP B1 (CHUANNN) trước hạn chót đăng ký kỳ Thực tập chuyên ngành vào tháng 11/2026.
            </p>
          </div>
        </div>
      </div>

      {/* Print-only Signature Block */}
      <div className="print-only-signature" style={{ display: 'none' }}>
        <div style={{ textAlign: 'center', width: '45%' }}>
          <div style={{ fontWeight: 600, textTransform: 'uppercase' }}>TRƯỞNG KHOA CÔNG NGHỆ & QUẢN TRỊ SỐ</div>
          <div style={{ fontSize: '9pt', fontStyle: 'italic', marginBottom: '50px' }}>(Ký và ghi rõ họ tên)</div>
          <div style={{ fontWeight: 700 }}>PGS. TS. Lê Văn Tuấn</div>
        </div>
        <div style={{ textAlign: 'center', width: '45%' }}>
          <div style={{ fontStyle: 'italic', fontSize: '9pt', marginBottom: '4px' }}>Hà Nội, ngày 10 tháng 10 năm 2026</div>
          <div style={{ fontWeight: 600, textTransform: 'uppercase' }}>CỐ VẤN HỌC TẬP LẬP BÁO CÁO</div>
          <div style={{ fontSize: '9pt', fontStyle: 'italic', marginBottom: '50px' }}>(Ký và ghi rõ họ tên)</div>
          <div style={{ fontWeight: 700 }}>TS. Nguyễn Năng Thành</div>
        </div>
      </div>
    </div>
  );
};
