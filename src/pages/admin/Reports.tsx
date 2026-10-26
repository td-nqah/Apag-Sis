// ==========================================================================
// APAG Admin Institution Reports & Analytics Component (React + TypeScript)
// Feature 6: Interactive Recharts visualizations (Grade distributions,
// student attendance & passing rate trends, department performance comparison)
// + Multi-level drill-down analytics and Excel/PDF export.
// ==========================================================================

import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  FileSpreadsheet, 
  Filter, 
  Users, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  ShieldCheck, 
  Award,
  Download,
  Printer,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  Cell
} from 'recharts';
import * as XLSX from 'xlsx';
import { Utils } from '../../utils/utils';
import { MOCK_ADMIN_ANALYTICS } from '../../services/mockData';

export const AdminReports: React.FC = () => {
  const [currentScope, setCurrentScope] = useState<'school' | 'departments' | 'majors' | 'classes'>('school');
  const [selectedDept, setSelectedDept] = useState('all');
  const [selectedMajor, setSelectedMajor] = useState('all');
  const [selectedClass, setSelectedClass] = useState('all');

  const { academy, majors, classes } = MOCK_ADMIN_ANALYTICS;

  // Grade Distribution Dataset for Recharts
  const gradeDistributionData = [
    { grade: 'A (8.5 - 10)', students: 340, percentage: 14.5, fill: '#2563EB' },
    { grade: 'B+ (8.0 - 8.4)', students: 520, percentage: 22.1, fill: '#3B82F6' },
    { grade: 'B (7.0 - 7.9)', students: 680, percentage: 28.9, fill: '#0D9488' },
    { grade: 'C+ (6.5 - 6.9)', students: 390, percentage: 16.6, fill: '#047857' },
    { grade: 'C (5.5 - 6.4)', students: 260, percentage: 11.1, fill: '#B45309' },
    { grade: 'D (4.0 - 5.4)', students: 110, percentage: 4.7, fill: '#C2410C' },
    { grade: 'F (< 4.0)', students: 50, percentage: 2.1, fill: '#B91C1C' }
  ];

  // Attendance & Passing Rate Historical Trends Dataset
  const trendData = [
    { semester: 'HK1 (22-23)', attendanceRate: 94.2, passRate: 88.5, avgGpa: 3.12 },
    { semester: 'HK2 (22-23)', attendanceRate: 95.1, passRate: 90.2, avgGpa: 3.18 },
    { semester: 'HK1 (23-24)', attendanceRate: 93.8, passRate: 89.1, avgGpa: 3.15 },
    { semester: 'HK2 (23-24)', attendanceRate: 96.0, passRate: 92.4, avgGpa: 3.22 },
    { semester: 'HK1 (24-25)', attendanceRate: 96.8, passRate: 93.8, avgGpa: 3.24 }
  ];

  // Department Comparison Dataset for Recharts
  const departmentPerformanceData = [
    { 
      name: 'CN & Quản trị số', 
      avgGpa: 3.24, 
      onTrackRate: 95.8, 
      students: 520, 
      warningRate: 4.2 
    },
    { 
      name: 'Kinh tế & QTKD', 
      avgGpa: 3.16, 
      onTrackRate: 94.2, 
      students: 780, 
      warningRate: 5.8 
    },
    { 
      name: 'Luật & QLNN', 
      avgGpa: 3.19, 
      onTrackRate: 95.0, 
      students: 650, 
      warningRate: 5.0 
    }
  ];

  // Compute Drill-down dynamic rows and KPIs
  const drillData = useMemo(() => {
    let tableRows: Array<{
      name: string;
      total: number;
      avgGpa: number;
      atRisk: number;
      onTrackRate: string;
    }> = [];

    let scopeBadge = 'Toàn học viện';
    let tableHeading = 'Phân bổ theo Khoa chuyên môn trực thuộc';
    let tableSubheading = 'Số liệu tổng hợp 3 Khoa đào tạo trọng điểm';

    let currentTotal = academy.totalStudents;
    let currentGpa = academy.avgGpa;
    let currentRisk = academy.warningCount;
    let currentOnTrack = academy.onTrackRate;

    if (currentScope === 'school' || currentScope === 'departments') {
      scopeBadge = currentScope === 'school' ? 'Toàn học viện' : 'Cấp Khoa';
      tableHeading = 'Phân bổ theo Khoa chuyên môn trực thuộc';
      tableSubheading = 'Số liệu tổng hợp 3 Khoa đào tạo trọng điểm';
      tableRows = academy.faculties.map(f => {
        const atRiskCount = Math.round(f.students * (f.warningRate / 100));
        return {
          name: f.name,
          total: f.students,
          avgGpa: f.avgGpa,
          atRisk: atRiskCount,
          onTrackRate: (100 - f.warningRate).toFixed(1)
        };
      });
    } else if (currentScope === 'majors') {
      scopeBadge = 'Cấp Ngành';
      tableHeading = 'Danh sách các Ngành đào tạo';
      tableSubheading = 'Phân tích chỉ số tiến độ theo chuyên ngành';
      const majorList = majors['CNTT'] || [];
      tableRows = majorList.map(m => {
        const atRiskCount = Math.round(m.students * (m.warningRate / 100));
        return {
          name: m.name,
          total: m.students,
          avgGpa: m.avgGpa,
          atRisk: atRiskCount,
          onTrackRate: (100 - m.warningRate).toFixed(1)
        };
      });

      currentTotal = tableRows.reduce((sum, r) => sum + r.total, 0);
      currentRisk = tableRows.reduce((sum, r) => sum + r.atRisk, 0);
      currentGpa = tableRows.length > 0 
        ? parseFloat((tableRows.reduce((sum, r) => sum + r.avgGpa, 0) / tableRows.length).toFixed(2)) 
        : 3.18;
      currentOnTrack = parseFloat(((1 - (currentRisk / currentTotal)) * 100).toFixed(1));
    } else if (currentScope === 'classes') {
      scopeBadge = 'Cấp Lớp sinh hoạt';
      tableHeading = 'Danh sách các Lớp sinh hoạt K25';
      tableSubheading = 'Giám sát chi tiết theo lớp hành chính K25';
      const classList = classes['HTTT'] || [];
      tableRows = classList.map(c => {
        const atRiskCount = Math.round(c.students * (c.warningRate / 100));
        return {
          name: `${c.name} (${c.advisor})`,
          total: c.students,
          avgGpa: c.avgGpa,
          atRisk: atRiskCount,
          onTrackRate: (100 - c.warningRate).toFixed(1)
        };
      });

      currentTotal = tableRows.reduce((sum, r) => sum + r.total, 0);
      currentRisk = tableRows.reduce((sum, r) => sum + r.atRisk, 0);
      currentGpa = tableRows.length > 0 
        ? parseFloat((tableRows.reduce((sum, r) => sum + r.avgGpa, 0) / tableRows.length).toFixed(2)) 
        : 3.20;
      currentOnTrack = parseFloat(((1 - (currentRisk / currentTotal)) * 100).toFixed(1));
    }

    const atRiskPct = currentTotal > 0 ? ((currentRisk / currentTotal) * 100).toFixed(1) : '0.0';

    return {
      scopeBadge,
      tableHeading,
      tableSubheading,
      tableRows,
      currentTotal,
      currentGpa,
      currentRisk,
      currentOnTrack,
      atRiskPct
    };
  }, [currentScope, selectedDept, selectedMajor, selectedClass]);

  const cohortHistoricalStats = [
    { cohort: 'Khóa 23 (2020 - 2024)', students: '630 SV', avgGpa: '3.18', progress: '97.6%', warning: '15 SV (2.4%)', gradRate: '96.2%' },
    { cohort: 'Khóa 24 (2021 - 2025)', students: '620 SV', avgGpa: '3.15', progress: '96.1%', warning: '24 SV (3.9%)', gradRate: '94.8%' },
    { cohort: 'Khóa 25 (2022 - 2026)', students: '580 SV', avgGpa: '3.12', progress: '95.5%', warning: '26 SV (4.5%)', gradRate: '94.2%' },
    { cohort: 'Khóa 26 (2023 - 2027)', students: '620 SV', avgGpa: '3.08', progress: '96.8%', warning: '20 SV (3.2%)', gradRate: '95.0%' }
  ];

  // Export Full Report to Multi-sheet Excel
  const handleExportFullReport = () => {
    try {
      const wb = XLSX.utils.book_new();

      // Sheet 1: Drill-down current view
      const drillRows: any[][] = [
        ['Tên đơn vị / Phân cấp', 'Tổng số SV', 'GPA Trung bình', 'Số lượng cảnh báo', 'Tỷ lệ đúng tiến độ (%)']
      ];
      drillData.tableRows.forEach(r => {
        drillRows.push([r.name, r.total, r.avgGpa, r.atRisk, r.onTrackRate]);
      });
      const wsDrill = XLSX.utils.aoa_to_sheet(drillRows);
      XLSX.utils.book_append_sheet(wb, wsDrill, 'PhanTich_TheoCapDo');

      // Sheet 2: Cohorts
      const cohortRows: any[][] = [
        ['Khóa đào tạo', 'Quy mô sinh viên', 'GPA Trung bình', 'Tỷ lệ đạt tiến độ chuẩn', 'Số lượng cảnh báo', 'Tỷ lệ tốt nghiệp dự kiến']
      ];
      cohortHistoricalStats.forEach(c => {
        cohortRows.push([c.cohort, c.students, c.avgGpa, c.progress, c.warning, c.gradRate]);
      });
      const wsCohort = XLSX.utils.aoa_to_sheet(cohortRows);
      XLSX.utils.book_append_sheet(wb, wsCohort, 'DoiChieu_NienKhoa');

      // Sheet 3: Grade Distribution
      const gradeRows: any[][] = [
        ['Thang điểm chữ', 'Số lượng SV đạt', 'Tỷ lệ (%)']
      ];
      gradeDistributionData.forEach(g => {
        gradeRows.push([g.grade, g.students, g.percentage]);
      });
      const wsGrade = XLSX.utils.aoa_to_sheet(gradeRows);
      XLSX.utils.book_append_sheet(wb, wsGrade, 'PhoDiem_ToanVien');

      const dateStr = new Date().toISOString().split('T')[0];
      XLSX.writeFile(wb, `APAG_BaoCao_PhanTichDaCap_${dateStr}.xlsx`);
      Utils.showToast('Đã xuất báo cáo phân tích đào tạo đa cấp thành công!', 'success');
    } catch (err) {
      console.error(err);
      Utils.showToast('Lỗi khi xuất tệp báo cáo Excel', 'danger');
    }
  };

  // Export PDF / Print
  const handleExportPdf = () => {
    window.print();
  };

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
      {/* Action Toolbar */}
      <div 
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '8px',
          marginBottom: '16px'
        }}
      >
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button 
            type="button" 
            className="btn btn-outline btn-sm"
            onClick={handleExportPdf}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Printer size={14} />
            <span>In / Xuất PDF</span>
          </button>

          <button 
            type="button" 
            className="btn btn-primary btn-sm"
            onClick={handleExportFullReport}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Download size={14} />
            <span>Xuất báo cáo Excel (3 Sheet)</span>
          </button>
        </div>
      </div>

      {/* 4 Dynamic KPI Cards based on current Drill-down Level */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px',
          marginBottom: '20px'
        }}
      >
        <div 
          className="minimal-card"
          style={{
            padding: '18px 20px',
            borderRadius: '10px',
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              Quy mô sinh viên
            </span>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
              {drillData.scopeBadge}
            </span>
          </div>
          <div style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
            {drillData.currentTotal.toLocaleString('vi-VN')} <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500 }}>SV</span>
          </div>
          <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            4 khóa chính quy toàn học viện
          </div>
        </div>

        <div 
          className="minimal-card"
          style={{
            padding: '18px 20px',
            borderRadius: '10px',
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              GPA Trung bình
            </span>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', backgroundColor: 'var(--success-bg)', color: 'var(--success)', border: '1px solid var(--success-border)' }}>
              Khá - Giỏi
            </span>
          </div>
          <div style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--primary)', lineHeight: 1 }}>
            {drillData.currentGpa} <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500 }}>/ 4.0</span>
          </div>
          <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Tăng +0.06 so với năm trước
          </div>
        </div>

        <div 
          className="minimal-card"
          style={{
            padding: '18px 20px',
            borderRadius: '10px',
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              Sinh viên rủi ro
            </span>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', backgroundColor: 'var(--warning-bg)', color: 'var(--warning-text)', border: '1px solid var(--warning-border)' }}>
              {drillData.atRiskPct}%
            </span>
          </div>
          <div style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--warning-text)', lineHeight: 1 }}>
            {drillData.currentRisk} <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500 }}>SV</span>
          </div>
          <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Cần hỗ trợ học tập hoàn thành học phần tiên quyết
          </div>
        </div>

        <div 
          className="minimal-card"
          style={{
            padding: '18px 20px',
            borderRadius: '10px',
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              Đúng tiến độ (On-track)
            </span>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', backgroundColor: 'var(--success-bg)', color: 'var(--success)', border: '1px solid var(--success-border)' }}>
              Đạt chỉ tiêu
            </span>
          </div>
          <div style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--success)', lineHeight: 1 }}>
            {drillData.currentOnTrack}%
          </div>
          <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Chuẩn tốt nghiệp 4 năm
          </div>
        </div>
      </div>

      {/* ====================================================================
          RECHARTS VISUALIZATION SUITE (2-COLUMN GRID)
          ==================================================================== */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 460px), 1fr))',
          gap: '20px',
          marginBottom: '20px'
        }}
      >
        {/* CHART 1: GRADE DISTRIBUTION (PHỔ ĐIỂM TOÀN VIỆN) */}
        <div 
          className="minimal-card"
          style={{
            padding: '20px',
            borderRadius: '10px',
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                Phổ điểm học tập toàn Viện (Grade Distribution)
              </h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Phân bố sinh viên theo thang điểm chữ A, B+, B, C+, C, D, F
              </span>
            </div>
            <span style={{ fontSize: '0.75rem', padding: '2px 6px', borderRadius: '4px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', fontWeight: 600 }}>
              2.350 SV
            </span>
          </div>

          <div style={{ width: '100%', height: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gradeDistributionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="grade" tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', borderRadius: '8px', fontSize: '12px' }}
                  formatter={(value: any) => [`${value} Sinh viên`, 'Số lượng']}
                />
                <Bar dataKey="students" radius={[4, 4, 0, 0]}>
                  {gradeDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 2: ATTENDANCE & PASSING RATE TRENDS (LINE / AREA CHART) */}
        <div 
          className="minimal-card"
          style={{
            padding: '20px',
            borderRadius: '10px',
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                Xu hướng Chuyên cần & Tỷ lệ Đạt học phần qua các kỳ
              </h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Giám sát tỷ lệ đi học chuyên cần và kết quả thi qua 5 học kỳ gần nhất
              </span>
            </div>
            <span style={{ fontSize: '0.75rem', padding: '2px 6px', borderRadius: '4px', backgroundColor: 'var(--success-bg)', color: 'var(--success)', fontWeight: 600 }}>
              96.8% Đi học
            </span>
          </div>

          <div style={{ width: '100%', height: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="semester" tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} />
                <YAxis domain={[80, 100]} tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', borderRadius: '8px', fontSize: '12px' }}
                  formatter={(value: any, name?: any) => [
                    `${value}%`,
                    name === 'attendanceRate' ? 'Chuyên cần (%)' : 'Tỷ lệ Đạt học phần (%)'
                  ]}
                />
                <Legend 
                  verticalAlign="top" 
                  align="right" 
                  iconType="circle"
                  wrapperStyle={{ fontSize: '12px', paddingBottom: '10px' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="attendanceRate" 
                  name="Chuyên cần (%)"
                  stroke="#2563EB" 
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#2563EB' }}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="passRate" 
                  name="Tỷ lệ Đạt học phần (%)"
                  stroke="#047857" 
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#047857' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* CHART 3: DEPARTMENT PERFORMANCE COMPARISON */}
      <div 
        className="minimal-card"
        style={{
          padding: '20px',
          borderRadius: '10px',
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--border)',
          marginBottom: '20px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              So sánh Chỉ số Tiến độ & Tỷ lệ Đúng hạn giữa các Khoa chuyên môn
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Đối chiếu trực quan giữa GPA trung bình và tỷ lệ sinh viên hoàn thành tín chỉ đúng lộ trình
            </span>
          </div>
        </div>

        <div style={{ width: '100%', height: '240px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={departmentPerformanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'var(--text-primary)' }} />
              <YAxis domain={[80, 100]} tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', borderRadius: '8px', fontSize: '12px' }}
                formatter={(value: any) => [`${value}%`, 'Tỷ lệ đúng tiến độ']}
              />
              <Bar dataKey="onTrackRate" name="Tỷ lệ đúng hạn (%)" fill="#2563EB" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Dynamic Drill-down Breakdown Table */}
      <div 
        className="minimal-card"
        style={{
          borderRadius: '10px',
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--border)',
          overflow: 'hidden'
        }}
      >
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              {drillData.tableHeading}
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              {drillData.tableSubheading}
            </span>
          </div>
          <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', backgroundColor: 'var(--surface-subtle)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
            {drillData.tableRows.length} đơn vị
          </span>
        </div>

        <div className="table-responsive">
          <table className="minimal-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--surface-subtle)', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '10px 14px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>TÊN ĐƠN VỊ / PHÂN CẤP</th>
                <th style={{ padding: '10px 14px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textAlign: 'right' }}>TỔNG SỐ SV</th>
                <th style={{ padding: '10px 14px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textAlign: 'right' }}>GPA TRUNG BÌNH</th>
                <th style={{ padding: '10px 14px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textAlign: 'right' }}>CẢNH BÁO HỌC VỤ</th>
                <th style={{ padding: '10px 14px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textAlign: 'right' }}>TỶ LỆ ĐÚNG TIẾN ĐỘ</th>
              </tr>
            </thead>
            <tbody>
              {drillData.tableRows.map((row, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '10px 14px', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {row.name}
                  </td>
                  <td style={{ padding: '10px 14px', textAlign: 'right', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    {row.total} SV
                  </td>
                  <td style={{ padding: '10px 14px', textAlign: 'right', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--primary)' }}>
                    {row.avgGpa.toFixed(2)}
                  </td>
                  <td style={{ padding: '10px 14px', textAlign: 'right' }}>
                    <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '999px', backgroundColor: row.atRisk > 20 ? 'var(--danger-bg)' : 'var(--warning-bg)', color: row.atRisk > 20 ? 'var(--danger)' : 'var(--warning-text)', border: `1px solid ${row.atRisk > 20 ? 'var(--danger-border)' : 'var(--warning-border)'}` }}>
                      {row.atRisk} SV ({((row.atRisk / row.total) * 100).toFixed(1)}%)
                    </span>
                  </td>
                  <td style={{ padding: '10px 14px', textAlign: 'right', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--success)' }}>
                    {row.onTrackRate}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
