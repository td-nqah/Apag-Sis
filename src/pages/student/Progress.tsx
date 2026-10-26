// ==========================================================================
// APAG Student Progress & What-If Simulator Component (React + TypeScript)
// 100% High-Fidelity Restoration matching pages/student/progress.html & Screenshots 3, 4, 5
// ==========================================================================

import React, { useState, useEffect, useRef } from 'react';
import { 
  CheckCircle, 
  Clock, 
  RotateCcw, 
  Play, 
  ListChecks, 
  BarChart2, 
  Sparkles, 
  Calculator,
  GraduationCap,
  AlertCircle,
  CheckCircle2,
  Loader
} from 'lucide-react';
import { Chart } from 'chart.js/auto';
import { Utils } from '../../utils/utils';

interface SimCourse {
  code: string;
  name: string;
  credits: number;
  category: string;
  defaultGrade: string;
  isPrerequisite?: boolean;
  selected: boolean;
  expectedGrade: string;
}

export const StudentProgress: React.FC = () => {
  const chartCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  // Active tab state: 'audit' (Thẩm định tốt nghiệp) | 'conditions' (Kiểm tra điều kiện) | 'simulator' (Bộ mô phỏng)
  const [activeTab, setActiveTab] = useState<'audit' | 'conditions' | 'simulator'>('audit');

  const initialSimCourses: SimCourse[] = [
    { code: 'LIF2004', name: 'Hệ quản trị cơ sở dữ liệu', credits: 3, category: 'Chuyên ngành', defaultGrade: 'A', isPrerequisite: true, selected: true, expectedGrade: 'A' },
    { code: 'ISFI25-2010', name: 'Khai phá dữ liệu', credits: 3, category: 'Chuyên ngành', defaultGrade: 'B+', isPrerequisite: false, selected: true, expectedGrade: 'B+' },
    { code: 'ISFI25-2005', name: 'Quản trị dự án CNTT', credits: 3, category: 'Chuyên ngành', defaultGrade: 'A', isPrerequisite: false, selected: true, expectedGrade: 'A' },
    { code: 'LIF2005', name: 'Trí tuệ nhân tạo', credits: 3, category: 'Chuyên ngành', defaultGrade: 'A', isPrerequisite: false, selected: true, expectedGrade: 'A' },
    { code: 'ISFI25-2011', name: 'Hệ thống thông tin trong quản lý hành chính', credits: 3, category: 'Chuyên ngành', defaultGrade: 'B+', isPrerequisite: false, selected: true, expectedGrade: 'B+' },
    { code: 'ISFI25-2014', name: 'Dữ liệu lớn', credits: 3, category: 'Chuyên ngành', defaultGrade: 'B+', isPrerequisite: false, selected: false, expectedGrade: 'B+' }
  ];

  const [simCourses, setSimCourses] = useState<SimCourse[]>(initialSimCourses);

  const gradeMap: Record<string, number> = {
    'A': 4.0,
    'B+': 3.5,
    'B': 3.0,
    'C+': 2.5,
    'C': 2.0,
    'D+': 1.5,
    'D': 1.0,
    'F': 0.0
  };

  const gradeOptions = ['A', 'B+', 'B', 'C+', 'C', 'D+', 'D', 'F'];

  // Base student statistics
  const baseCredits = 72;
  const baseGpa = 3.24;
  const totalRequiredCredits = 130;

  // Calculate simulation metrics
  const selectedCourses = simCourses.filter(c => c.selected);
  const simTermCredits = selectedCourses.reduce((sum, c) => sum + c.credits, 0);
  const simTermQualityPoints = selectedCourses.reduce((sum, c) => sum + (c.credits * (gradeMap[c.expectedGrade] || 0)), 0);
  const simTermGpa = simTermCredits > 0 ? (simTermQualityPoints / simTermCredits) : 0;

  const simAfterCredits = baseCredits + simTermCredits;
  const simAfterQualityPoints = (baseGpa * baseCredits) + simTermQualityPoints;
  const simAfterGpa = simAfterCredits > 0 ? (simAfterQualityPoints / simAfterCredits) : baseGpa;
  const simDelta = simAfterGpa - baseGpa;

  // Doughnut chart initialization
  const initDoughnut = () => {
    if (!chartCanvasRef.current) return;
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
      chartInstanceRef.current = null;
    }

    const labelColor = '#4B5563';
    const borderColor = '#FFFFFF';
    const missingBg = '#CBD5E1';

    chartInstanceRef.current = new Chart(chartCanvasRef.current, {
      type: 'doughnut',
      data: {
        labels: ['Đại cương (24)', 'Cơ sở ngành (26)', 'Chuyên ngành (16)', 'Còn thiếu (64)'],
        datasets: [{
          data: [24, 26, 16, 64],
          backgroundColor: ['#10B981', '#3B82F6', '#8B5CF6', missingBg],
          borderWidth: 2,
          borderColor
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              boxWidth: 12,
              color: labelColor,
              font: { size: 11, family: 'Inter, system-ui, sans-serif' }
            }
          },
          tooltip: {
            backgroundColor: '#111827',
            borderColor: 'transparent',
            borderWidth: 0,
            titleColor: '#FFFFFF',
            bodyColor: '#FFFFFF',
            callbacks: {
              label: function(item: any) {
                const total = 130;
                const val = item.raw;
                const pct = ((val / total) * 100).toFixed(1);
                return ` ${item.label}: ${val} TC (${pct}%)`;
              }
            }
          }
        },
        cutout: '72%'
      }
    });
  };

  useEffect(() => {
    initDoughnut();
    return () => {
      if (chartInstanceRef.current) chartInstanceRef.current.destroy();
    };
  }, []);

  // Ensure doughnut chart stays crisp and correctly sized when switching to conditions tab
  useEffect(() => {
    if (activeTab === 'conditions') {
      const timer = setTimeout(() => {
        if (chartInstanceRef.current) {
          chartInstanceRef.current.resize();
        } else {
          initDoughnut();
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [activeTab]);

  const handleToggleSelect = (code: string) => {
    setSimCourses(prev => prev.map(c => c.code === code ? { ...c, selected: !c.selected } : c));
  };

  const handleGradeChange = (code: string, grade: string) => {
    setSimCourses(prev => prev.map(c => c.code === code ? { ...c, expectedGrade: grade } : c));
  };

  const handleReset = () => {
    setSimCourses(initialSimCourses);
    Utils.showToast('Đã đặt lại kịch bản mô phỏng về giá trị mặc định!', 'info');
  };

  const handleRunSimulation = () => {
    Utils.showToast(`Chạy mô phỏng hoàn tất! CPA dự kiến tăng lên ${simAfterGpa.toFixed(2)} (${simDelta >= 0 ? '+' : ''}${simDelta.toFixed(2)}).`, 'success');
  };

  const auditBlocks = [
    {
      id: 1,
      title: 'Khối kiến thức đại cương',
      term: '2022 - 2023 (HK1 & HK2)',
      desc: 'GDQP-AN (8 TC), Ngoại ngữ B1 (3 TC), CNTT cơ bản, GDTC, Triết học & Lịch sử Đảng',
      completed: 24,
      required: 24,
      percentage: 100,
      status: 'completed'
    },
    {
      id: 2,
      title: 'Khối kiến thức cơ sở ngành',
      term: '2023 - 2024 (HK3 & HK4)',
      desc: 'Cấu trúc MT & HĐH, Xác suất thống kê, Phương pháp tính, Tối ưu hóa, Data-Driven DM',
      completed: 27,
      required: 27,
      percentage: 100,
      status: 'completed'
    },
    {
      id: 3,
      title: 'Khối kiến thức chuyên ngành',
      term: '2024 - 2025 (HK5 & HK6)',
      desc: 'PT&TK HTTT, Lập trình OOP, CSDL, Python, Java, Mạng máy tính, Lập trình Web',
      completed: 21,
      required: 60,
      percentage: 35,
      status: 'in-progress'
    },
    {
      id: 4,
      title: 'Thực tập tốt nghiệp',
      term: '2025 - 2026 (HK7 & HK8)',
      desc: 'Kiến tập giữa kỳ, Trải nghiệm thực tế, Thực tập chuyên môn & Khóa luận tốt nghiệp',
      completed: 0,
      required: 19,
      percentage: 0,
      status: 'not-started'
    }
  ];

  const nonCreditCerts = [
    {
      name: 'Chuẩn Tiếng Anh B1 (CHUANNN - NLNN bậc 3/6)',
      note: 'Hạn chót: Trước HK7',
      status: 'Chưa đạt',
      badgeClass: 'badge-warning'
    },
    {
      name: 'Chứng chỉ Giáo dục Quốc phòng - An ninh (ISF0009)',
      note: '8 tín chỉ - Cấp 08/2023',
      status: 'Đã hoàn thành',
      badgeClass: 'badge-success'
    },
    {
      name: 'Giáo dục Thể chất (ISF0010)',
      note: '3 tín chỉ',
      status: 'Đã hoàn thành',
      badgeClass: 'badge-success'
    },
    {
      name: 'Chuẩn kỹ năng CNTT cơ bản (CHUANTH)',
      note: '3 tín chỉ',
      status: 'Đã hoàn thành',
      badgeClass: 'badge-success'
    }
  ];

  return (
    <div className="progress-workspace">
      {/* Header & In-Page Horizontal Tabs (Matching Image 2 Reference) */}
      <div style={{ marginBottom: '22px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Thẩm định tốt nghiệp & Mô phỏng điểm số
            </h1>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
              Khung chuẩn 130 Tín chỉ · Quy chế 458/QĐ-HVHC · Khóa 25 (2022 - 2026)
            </p>
          </div>
        </div>

        {/* Horizontal In-Page Underline Tabs */}
        <div 
          className="progress-tabs-nav"
          role="tablist" 
          aria-label="Danh mục chức năng tiến độ & thẩm định"
        >
          <button
            type="button"
            role="tab"
            id="tab-graduation-audit"
            aria-selected={activeTab === 'audit'}
            aria-controls="tabpanel-graduation-audit"
            tabIndex={activeTab === 'audit' ? 0 : -1}
            className={`progress-tab-btn ${activeTab === 'audit' ? 'active' : ''}`}
            onClick={() => setActiveTab('audit')}
          >
            <GraduationCap size={16} />
            <span>Thẩm định tốt nghiệp</span>
          </button>

          <button
            type="button"
            role="tab"
            id="tab-conditions-check"
            aria-selected={activeTab === 'conditions'}
            aria-controls="tabpanel-conditions-check"
            tabIndex={activeTab === 'conditions' ? 0 : -1}
            className={`progress-tab-btn ${activeTab === 'conditions' ? 'active' : ''}`}
            onClick={() => setActiveTab('conditions')}
          >
            <ListChecks size={16} />
            <span>Kiểm tra điều kiện</span>
          </button>

          <button
            type="button"
            role="tab"
            id="tab-grade-simulator"
            aria-selected={activeTab === 'simulator'}
            aria-controls="tabpanel-grade-simulator"
            tabIndex={activeTab === 'simulator' ? 0 : -1}
            className={`progress-tab-btn ${activeTab === 'simulator' ? 'active' : ''}`}
            onClick={() => setActiveTab('simulator')}
          >
            <Calculator size={16} />
            <span>Bộ mô phỏng</span>
          </button>
        </div>
      </div>

      {/* Right: Flexible Content Panel */}
      <main className="progress-content-panel">
        {/* Tab 1: Thẩm định tốt nghiệp */}
        <div
          role="tabpanel"
          id="tabpanel-graduation-audit"
          aria-labelledby="tab-graduation-audit"
          style={{ display: activeTab === 'audit' ? 'block' : 'none' }}
        >
          {/* 4-Year Academic Journey Table (Degree Audit Timeline) */}
          <div className="minimal-card mb-6">
        <div className="card-header d-flex justify-between items-center flex-wrap gap-2">
          <div>
            <h2 className="card-title text-base font-bold">1. Lộ trình thẩm định hành trình đào tạo 4 năm (2022 - 2026)</h2>
          </div>
          <span className="badge badge-success font-bold" id="totalAuditBadge">Đã tích lũy: 72 / 130 TC (55.4%)</span>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="minimal-table">
              <thead>
                <tr>
                  <th>Giai đoạn đào tạo</th>
                  <th>Niên khóa & Học kỳ</th>
                  <th>Tín chỉ tích lũy</th>
                  <th>Trọng tâm kiến thức</th>
                  <th>GPA trung bình</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="font-bold text-main">
                    <div className="d-flex items-center gap-2">
                      <CheckCircle size={16} className="text-success" />
                      <span>Năm thứ Nhất</span>
                    </div>
                  </td>
                  <td>2022 - 2023 (HK1 & HK2)</td>
                  <td><strong className="text-success">32 / 32 TC</strong> (100%)</td>
                  <td className="text-secondary text-xs">Giáo dục đại cương, Triết học, Toán cao cấp, GDQP-AN</td>
                  <td><span className="font-bold text-main">3.22 / 4.0</span></td>
                  <td><span className="badge badge-success">Đã hoàn thành</span></td>
                </tr>
                <tr>
                  <td className="font-bold text-main">
                    <div className="d-flex items-center gap-2">
                      <CheckCircle size={16} className="text-success" />
                      <span>Năm thứ Hai</span>
                    </div>
                  </td>
                  <td>2023 - 2024 (HK1 & HK2)</td>
                  <td><strong className="text-success">40 / 40 TC</strong> (100%)</td>
                  <td className="text-secondary text-xs">Cơ sở ngành APAG, CSDL, CTDL&GT, Toán rời rạc</td>
                  <td><span className="font-bold text-main">3.26 / 4.0</span></td>
                  <td><span className="badge badge-success">Đã hoàn thành</span></td>
                </tr>
                <tr style={{ background: 'rgba(37, 99, 235, 0.04)' }}>
                  <td className="font-bold text-primary">
                    <div className="d-flex items-center gap-2">
                      <Loader size={16} className="text-primary spin" />
                      <span>Năm thứ Ba (Hiện tại)</span>
                    </div>
                  </td>
                  <td>2024 - 2025 (HK1 & HK2)</td>
                  <td><strong className="text-primary">14 / 34 TC</strong> (Đang học HK1)</td>
                  <td className="text-secondary text-xs">Chính phủ số, HTTT Quản lý, An toàn thông tin, Khối tự chọn</td>
                  <td><span className="font-bold text-primary">3.24 / 4.0 (Tạm tính)</span></td>
                  <td><span className="badge badge-primary">Đang học HK1</span></td>
                </tr>
                <tr>
                  <td className="font-bold text-muted">
                    <div className="d-flex items-center gap-2">
                      <Clock size={16} className="text-muted" />
                      <span>Năm thứ Tư (Năm cuối)</span>
                    </div>
                  </td>
                  <td>2025 - 2026 (HK1 & HK2)</td>
                  <td><strong className="text-muted">0 / 24 TC</strong> (Kế hoạch)</td>
                  <td className="text-secondary text-xs">Thực tập cơ quan nhà nước, Khóa luận/Đề án tốt nghiệp</td>
                  <td className="text-muted">--</td>
                  <td><span className="badge badge-outline">Dự kiến 06/2026</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 2. Detailed 4 Blocks Analysis (Full-Width Card) */}
      <div className="minimal-card mb-6">
        <div className="card-header d-flex justify-between items-center flex-wrap gap-2">
          <div>
            <h3 className="card-title text-base font-bold">2. Phân tích chi tiết 4 khối kiến thức CTĐT</h3>
          </div>
          <span className="badge badge-primary font-bold">Khung chuẩn 130 TC</span>
        </div>
        <div className="card-body p-0" id="auditBlocksDetailed">
          <div className="table-responsive">
            <table className="minimal-table">
              <thead>
                <tr>
                  <th>Khối kiến thức</th>
                  <th>Niên khóa & Học kỳ</th>
                  <th>Tín chỉ tích lũy</th>
                  <th>Trọng tâm kiến thức</th>
                  <th>Tiến độ</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {auditBlocks.map((b) => {
                  let icon = <CheckCircle size={16} className="text-success" />;
                  let titleClass = "font-bold text-main";
                  let creditsClass = "text-success";
                  let statusBadge = <span className="badge badge-success">Đã hoàn thành</span>;
                  let barColor = "bg-success";
                  let rowStyle: React.CSSProperties | undefined = undefined;

                  if (b.status === 'in-progress') {
                    icon = <Loader size={16} className="text-primary spin" />;
                    titleClass = "font-bold text-primary";
                    creditsClass = "text-primary";
                    statusBadge = <span className="badge badge-primary">Đang tích lũy</span>;
                    barColor = "bg-primary";
                    rowStyle = { background: 'rgba(37, 99, 235, 0.04)' };
                  } else if (b.status === 'not-started') {
                    icon = <Clock size={16} className="text-muted" />;
                    titleClass = "font-bold text-muted";
                    creditsClass = "text-muted";
                    statusBadge = <span className="badge badge-outline">Chưa bắt đầu</span>;
                    barColor = "bg-muted";
                  }

                  return (
                    <tr key={b.id} style={rowStyle}>
                      <td className={titleClass}>
                        <div className="d-flex items-center gap-2">
                          {icon}
                          <span>{b.id}. {b.title}</span>
                        </div>
                      </td>
                      <td className="text-secondary text-xs">{b.term}</td>
                      <td>
                        <strong className={creditsClass}>{b.completed} / {b.required} TC</strong>
                        <span className="text-xs text-muted ms-1">({b.percentage}%)</span>
                      </td>
                      <td className="text-secondary text-xs" style={{ minWidth: '180px' }}>
                        {b.desc}
                      </td>
                      <td>
                        <div className="d-flex items-center gap-2" style={{ minWidth: '95px' }}>
                          <div className="progress" style={{ flex: 1, height: '6px', background: 'var(--surface-muted, #f1f5f9)', borderRadius: '999px', overflow: 'hidden' }}>
                            <div className={`progress-bar ${barColor}`} style={{ width: `${Math.min(100, b.percentage)}%`, height: '100%' }} />
                          </div>
                          <span className="text-xs font-bold text-main" style={{ minWidth: '34px', textAlign: 'right' }}>
                            {b.percentage}%
                          </span>
                        </div>
                      </td>
                      <td>
                        {statusBadge}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    {/* Tab 2: Kiểm tra điều kiện (Thẻ chuẩn ĐK đầu ra dài 2, Thẻ tỷ lệ dài 1 cùng hàng) */}
    <div
      role="tabpanel"
      id="tabpanel-conditions-check"
      aria-labelledby="tab-conditions-check"
      style={{ display: activeTab === 'conditions' ? 'block' : 'none' }}
    >
      <div className="conditions-check-grid mb-6">
        {/* Thẻ chuẩn điều kiện đầu ra (Dài 2) */}
        <div className="minimal-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <div className="card-header d-flex justify-between items-center flex-wrap gap-2" style={{ marginBottom: '12px' }}>
            <div>
              <h3 className="card-title text-base font-bold">Chuẩn đầu ra điều kiện phi tín chỉ</h3>
              <p className="text-xs text-muted" style={{ margin: '2px 0 0 0' }}>
                Các điều kiện bắt buộc để xét tốt nghiệp chính quy theo Quy chế đào tạo
              </p>
            </div>
            <span className="badge badge-primary font-semibold">4 điều kiện</span>
          </div>
          <div className="card-body p-0" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div className="non-credit-certs-list" id="nonCreditCertificatesContainer" style={{ flex: 1, padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {nonCreditCerts.map((c) => (
                <div 
                  key={c.name} 
                  className="non-credit-cert-item" 
                  style={{ 
                    padding: '14px 18px', 
                    borderRadius: '10px', 
                    border: '1px solid var(--border)', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    backgroundColor: 'var(--surface-nested, #F8FAFC)',
                    gap: '16px'
                  }}
                >
                  <div className="non-credit-cert-info" style={{ flex: 1 }}>
                    <div className="non-credit-cert-title font-semibold text-sm text-main" style={{ color: 'var(--text-primary)' }}>
                      {c.name}
                    </div>
                    <div className="non-credit-cert-note text-xs text-muted" style={{ marginTop: '4px' }}>
                      {c.note}
                    </div>
                  </div>
                  <span className={`badge ${c.badgeClass}`} style={{ flexShrink: 0, padding: '4px 12px', fontSize: '0.75rem', fontWeight: 600 }}>
                    {c.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Thẻ tỷ lệ hoàn thành khối kiến thức (Dài 1) */}
        <div className="minimal-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <div className="card-header" style={{ marginBottom: '12px' }}>
            <h3 className="card-title text-base font-bold">Tỷ lệ hoàn thành khối kiến thức</h3>
            <p className="text-xs text-muted" style={{ margin: '2px 0 0 0' }}>
              Biểu đồ tích lũy 130 tín chỉ theo CTĐT
            </p>
          </div>
          <div className="card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ height: '240px', position: 'relative' }}>
              <canvas ref={chartCanvasRef} id="progressDoughnutChart"></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Tab 3: Bộ mô phỏng */}
    <div
      role="tabpanel"
      id="tabpanel-grade-simulator"
      aria-labelledby="tab-grade-simulator"
      style={{ display: activeTab === 'simulator' ? 'block' : 'none' }}
    >
      {/* ==================================================================
           WHAT-IF ACADEMIC SIMULATOR (MÔ PHỎNG GIẢ LẬP KẾT QUẢ HỌC TẬP)
           ================================================================== */}
      <section className="minimal-card p-6" id="whatIfSection" style={{ border: '1.5px solid var(--primary-border)', background: 'var(--surface)', marginBottom: '24px' }}>
        <div className="d-flex justify-between items-start flex-wrap gap-4 mb-4 pb-3 border-bottom" style={{ borderBottom: '1px solid var(--border)' }}>
          <div>
            <div className="d-flex items-center gap-2 mb-1">
              <span className="badge badge-primary font-bold d-inline-flex items-center gap-1">
                <Sparkles size={14} />
                <span>Công cụ AI Simulation</span>
              </span>
              <span className="badge badge-warning font-semibold">
                ⚠️ Simulation - không phải kết quả chính thức
              </span>
            </div>
            <h2 className="text-lg font-bold text-main">Mô phỏng kịch bản điểm số</h2>
          </div>
          
          <div className="d-flex gap-2">
            <button type="button" className="btn btn-secondary btn-sm" id="btnResetSimulation" onClick={handleReset}>
              <RotateCcw size={14} />
              <span>Đặt lại mặc định</span>
            </button>
            <button type="button" className="btn btn-primary btn-sm" id="btnRunSimulation" onClick={handleRunSimulation}>
              <Play size={14} />
              <span>Chạy mô phỏng</span>
            </button>
          </div>
        </div>

        {/* Simulation Grid: Inputs Left vs Results Right */}
        <div className="dashboard-grid" style={{ gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
          {/* Left: Course Selection & Expected Grade Input */}
          <div>
            <h3 className="text-sm font-semibold mb-3 d-flex items-center gap-2 text-main">
              <ListChecks size={16} className="text-primary" />
              <span>Chọn các học phần dự kiến học trong Học kỳ 6:</span>
            </h3>

            <div className="table-responsive">
              <table className="minimal-table" style={{ fontSize: '0.8125rem' }}>
                <thead>
                  <tr>
                    <th style={{ width: '40px' }}>Chọn</th>
                    <th>Mã & Tên học phần</th>
                    <th>Số TC</th>
                    <th>Điểm dự kiến</th>
                  </tr>
                </thead>
                <tbody id="whatIfCoursesTableBody">
                  {simCourses.map((c) => (
                    <tr key={c.code} style={c.isPrerequisite ? { background: 'rgba(239, 68, 68, 0.03)' } : {}}>
                      <td className="text-center">
                        <input 
                          type="checkbox" 
                          className="sim-course-checkbox form-check-input"
                          checked={c.selected}
                          onChange={() => handleToggleSelect(c.code)}
                          style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                        />
                      </td>
                      <td>
                        <div className="d-flex items-center gap-2">
                          <span className="font-bold text-main">{c.code}</span>
                          <span className="text-secondary">{c.name}</span>
                          {c.isPrerequisite && (
                            <span className="badge badge-danger text-xs font-bold" style={{ padding: '2px 6px' }}>
                              [Tiên quyết]
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-muted mt-0.5">{c.category}</div>
                      </td>
                      <td>
                        <span className="badge badge-secondary font-semibold">{c.credits} TC</span>
                      </td>
                      <td style={{ minWidth: '130px' }}>
                        <select 
                          className="form-select form-select-sm sim-grade-select font-semibold"
                          value={c.expectedGrade}
                          onChange={(e) => handleGradeChange(c.code, e.target.value)}
                          style={{ cursor: 'pointer', padding: '4px 8px', fontSize: '0.8125rem' }}
                        >
                          {gradeOptions.map(g => (
                            <option key={g} value={g}>{g} ({gradeMap[g].toFixed(1)})</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="d-flex justify-between items-center mt-3 text-xs text-muted">
              <span>Tổng số tín chỉ giả lập: <strong className="text-primary" id="simSelectedCredits">{simTermCredits} TC</strong></span>
              <span>Thang điểm: 4.0 (A: 4.0 | B+: 3.5 | B: 3.0 | C+: 2.5 | C: 2.0 | F: 0.0)</span>
            </div>
          </div>

          {/* Right: Real-time Comparison Dashboard (Before / Scenario / After) */}
          <div>
            <h3 className="text-sm font-semibold mb-3 d-flex items-center gap-2 text-main">
              <BarChart2 size={16} className="text-primary" />
              <span>So sánh Before / Scenario / After:</span>
            </h3>

            {/* 3-Way Metric Comparison Cards */}
            <div className="grid grid-cols-3 gap-3 mb-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              {/* BEFORE */}
              <div 
                className="p-3 rounded text-center" 
                style={{ 
                  background: 'var(--surface-subtle)', 
                  border: '1px solid var(--border)', 
                  boxShadow: 'var(--shadow-xs)' 
                }}
              >
                <div className="text-xs text-muted font-semibold uppercase">Trước mô phỏng</div>
                <div className="text-lg font-bold text-secondary mt-1" id="simBeforeGpa">{baseGpa.toFixed(2)}</div>
                <div className="text-xs text-muted">{baseCredits} / 130 TC</div>
                <div className="text-xs text-muted mt-1">55.4% tiến độ</div>
              </div>

              {/* SCENARIO */}
              <div 
                className="p-3 rounded text-center" 
                style={{ 
                  background: 'rgba(37, 99, 235, 0.05)', 
                  border: '1px solid var(--primary-border, rgba(37, 99, 235, 0.3))', 
                  boxShadow: 'var(--shadow-xs)' 
                }}
              >
                <div className="text-xs text-primary font-bold uppercase">Kỳ giả lập</div>
                <div className="text-lg font-bold text-primary mt-1" id="simTermGpa">{simTermGpa.toFixed(2)}</div>
                <div className="text-xs text-primary" id="simTermCredits">+{simTermCredits} TC</div>
                <div className="text-xs text-primary mt-1">HK6</div>
              </div>

              {/* AFTER */}
              <div 
                className="p-3 rounded text-center" 
                style={{ 
                  background: 'var(--surface-dark, #1E293B)', 
                  border: '1px solid rgba(255, 255, 255, 0.1)', 
                  color: '#FFFFFF', 
                  boxShadow: 'var(--shadow-card)' 
                }}
              >
                <div className="text-xs font-bold uppercase" style={{ color: 'var(--text-dark-secondary)' }}>Sau mô phỏng</div>
                <div className="text-lg font-bold text-success mt-1" id="simAfterGpa">{simAfterGpa.toFixed(2)}</div>
                <div className="text-xs" style={{ color: 'var(--text-dark-secondary)' }} id="simAfterCredits">{simAfterCredits} / 130 TC</div>
                <div className={`badge ${simDelta >= 0 ? 'badge-success' : 'badge-danger'} badge-xs mt-1 font-bold`} id="simDeltaBadge">
                  Δ {simDelta >= 0 ? '+' : ''}{simDelta.toFixed(2)} GPA
                </div>
              </div>
            </div>

            {/* AI Impact Assessment Callout */}
            <div className="p-4 rounded border mb-4" style={{ background: 'var(--surface-subtle)', borderLeft: '3px solid var(--success)' }}>
              <div className="d-flex items-center gap-2 text-xs font-bold text-success mb-1">
                <CheckCircle2 size={14} />
                <span>ĐÁNH GIÁ TÁC ĐỘNG TỐT NGHIỆP TỪ AI RULE ENGINE:</span>
              </div>
              <p className="text-xs text-main mb-2" id="simImpactStatement">
                {selectedCourses.some(c => c.code === 'LIF2004')
                  ? <>Nếu hoàn thành đạt kết quả trên, bạn sẽ hoàn thành học phần tiên quyết <strong>LIF2004</strong>, giảm 35% nguy cơ chậm tiến độ và tích lũy được <strong>{simAfterCredits}/130 tín chỉ</strong>.</>
                  : <>Chú ý: Học phần tiên quyết <strong>LIF2004</strong> chưa được chọn trong đợt này. Bạn có nguy cơ chậm tiến độ đăng ký các học phần chuyên ngành tiếp theo.</>
                }
              </p>
              <div className="text-xs text-muted">
                • Dự báo tiến độ: <strong>Đủ điều kiện nhận Khóa luận tốt nghiệp đúng hạn (06/2026)</strong>.
              </div>
            </div>

            <div className="text-xs text-muted text-center" style={{ fontStyle: 'italic' }}>
              Lưu ý: Kết quả mô phỏng chỉ mang tính chất định hướng lập kế hoạch học tập, không có giá trị thay thế bảng điểm chính thức do Phòng Đào tạo cấp.
            </div>
          </div>
        </div>
      </section>
    </div>
  </main>
</div>
  );
};

export default StudentProgress;
