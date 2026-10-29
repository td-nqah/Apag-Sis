// ==========================================================================
// APAG Student Alerts Page Component (React + TypeScript)
// 100% High-Fidelity Restoration matching pages/student/alerts.html & Screenshot 7
// ==========================================================================

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldAlert, 
  AlertCircle, 
  AlertOctagon, 
  Award, 
  ShieldCheck, 
  Info, 
  AlertTriangle, 
  Check, 
  CheckCircle2, 
  ChevronDown, 
  Link2Off, 
  FileBadge, 
  TrendingDown, 
  GraduationCap, 
  ExternalLink, 
  FileText, 
  ChevronRight, 
  BrainCircuit, 
  Sparkles 
} from 'lucide-react';
import { Utils } from '../../utils/utils';

export const StudentAlerts: React.FC = () => {
  // Accordion state: all start collapsed by default
  const [openGroups, setOpenGroups] = useState<Record<number, boolean>>({
    1: false,
    2: false,
    3: false,
    4: false,
    5: false
  });

  const toggleGroup = (groupNum: number) => {
    setOpenGroups(prev => ({
      ...prev,
      [groupNum]: !prev[groupNum]
    }));
  };

  const handleSummaryCardClick = (groupNum: number) => {
    setOpenGroups(prev => ({
      ...prev,
      [groupNum]: true
    }));
    const el = document.getElementById(`accordionGroup${groupNum}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="alerts-page-container">
      {/* Live Status Monitor */}
      <div className="alerts-page-header" style={{ justifyContent: 'flex-end', marginBottom: '16px' }}>
        <div className="alerts-header-right" style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div className="alerts-live-status-pill" title="Hệ thống giám sát học vụ trực tuyến">
            <span className="status-pulse-dot"></span>
            <div>
              <div className="alerts-live-status-text">Hệ thống đang theo dõi tình trạng học tập của bạn</div>
              <div className="alerts-live-status-time">Cập nhật: 02/10/2026</div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Summary Cards (1 Row Desktop, Clickable to open Accordions) */}
      <div className="alerts-summary-grid">
        {/* Summary Card 1: Cảnh báo đang mở */}
        <div 
          className="alerts-summary-card" 
          id="summaryCardAlerts" 
          role="button" 
          tabIndex={0} 
          onClick={() => handleSummaryCardClick(1)}
          title="Nhấp để cuộn và mở danh sách Cảnh báo"
        >
          <div className="summary-card-header">
            <span className="summary-card-label">Cảnh báo đang mở</span>
            <div className="summary-card-icon-box icon-danger">
              <AlertCircle size={18} />
            </div>
          </div>
          <div className="summary-card-value-row">
            <span className="summary-card-number text-danger" id="summaryAlertsCount">02</span>
            <span className="summary-card-unit">Cảnh báo</span>
          </div>
          <div className="summary-card-footer text-danger">
            <Info size={14} />
            <span id="summaryAlertsSubtext">1 Tiên quyết • 1 Ngoại ngữ</span>
          </div>
        </div>

        {/* Summary Card 2: Rủi ro học tập */}
        <div 
          className="alerts-summary-card" 
          id="summaryCardRisk" 
          role="button" 
          tabIndex={0} 
          onClick={() => handleSummaryCardClick(2)}
          title="Nhấp để cuộn và mở phân tích Rủi ro học tập"
        >
          <div className="summary-card-header">
            <span className="summary-card-label">Rủi ro học tập</span>
            <div className="summary-card-icon-box icon-warning">
              <AlertOctagon size={18} />
            </div>
          </div>
          <div className="summary-card-value-row">
            <span className="summary-card-number text-warning" id="summaryRiskScore">82</span>
            <span className="summary-card-unit">/ 100 điểm</span>
          </div>
          <div className="summary-card-footer text-warning">
            <AlertTriangle size={14} />
            <span>Mức độ rủi ro dự báo giải trình được: Mức cao</span>
          </div>
        </div>

        {/* Summary Card 3: Tín chỉ tích lũy */}
        <div 
          className="alerts-summary-card" 
          id="summaryCardCredits" 
          role="button" 
          tabIndex={0} 
          onClick={() => handleSummaryCardClick(3)}
          title="Nhấp để cuộn và mở chi tiết Tín chỉ & Tiến độ"
        >
          <div className="summary-card-header">
            <span className="summary-card-label">Tín chỉ tích lũy</span>
            <div className="summary-card-icon-box icon-info">
              <Award size={18} />
            </div>
          </div>
          <div className="summary-card-value-row">
            <span className="summary-card-number text-info" id="summaryCreditsVal">72</span>
            <span className="summary-card-unit">/ 130 TC</span>
          </div>
          <div>
            <div className="summary-card-footer text-secondary mb-1">
              <Check size={14} />
              <span>55.4% tiến độ toàn khóa K25</span>
            </div>
            <div className="mini-progress-bar-wrap" style={{ border: '1px solid #D1D5DB', borderRadius: '999px', overflow: 'hidden' }}>
              <div className="mini-progress-bar-fill" style={{ width: '55.4%' }}></div>
            </div>
          </div>
        </div>

        {/* Summary Card 4: Quy chế đạt */}
        <div 
          className="alerts-summary-card" 
          id="summaryCardRegulations" 
          role="button" 
          tabIndex={0} 
          onClick={() => handleSummaryCardClick(4)}
          title="Nhấp để cuộn và mở khung đối chiếu Quy chế"
        >
          <div className="summary-card-header">
            <span className="summary-card-label">Quy chế đào tạo</span>
            <div className="summary-card-icon-box icon-success">
              <ShieldCheck size={18} />
            </div>
          </div>
          <div className="summary-card-value-row">
            <span className="summary-card-number text-success">Đạt chuẩn</span>
            <span className="summary-card-unit">QĐ 458/HVHC</span>
          </div>
          <div className="summary-card-footer text-success">
            <CheckCircle2 size={14} />
            <span>CPA 3.24 &gt; 1.60 (Chưa vi phạm)</span>
          </div>
        </div>
      </div>

      {/* Main Core: Accordion / Collapsible Sections */}
      <div className="alerts-accordion-list">
        {/* NHÓM 1: Cảnh báo học tập */}
        <div className={`alerts-accordion-item ${openGroups[1] ? 'is-open' : ''}`} id="accordionGroup1" data-group="1">
          <button 
            type="button" 
            className="alerts-accordion-header" 
            id="accordionHeader1" 
            aria-expanded={openGroups[1]} 
            onClick={() => toggleGroup(1)}
          >
            <div className="accordion-header-left">
              <div className="accordion-icon-box icon-danger">
                <AlertTriangle size={18} />
              </div>
              <div className="accordion-header-info">
                <div className="accordion-title-row">
                  <h2 className="accordion-title">Cảnh báo học tập</h2>
                  <span className="badge badge-danger" id="group1Badge">02 cảnh báo</span>
                  <span className="badge badge-outline text-xs text-danger font-semibold">Ưu tiên cao</span>
                </div>
                <p className="accordion-desc">Các vấn đề cần chú ý để tránh ảnh hưởng đến kết quả học tập</p>
              </div>
            </div>
            <div className="accordion-header-right">
              <span className="accordion-toggle-hint">Thu gọn / Mở rộng</span>
              <ChevronDown 
                size={18} 
                className="accordion-chevron-icon" 
                style={{ transform: openGroups[1] ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} 
              />
            </div>
          </button>

          <div 
            className={`alerts-accordion-collapse ${openGroups[1] ? 'show' : ''}`} 
            id="accordionCollapse1"
            style={{ gridTemplateRows: openGroups[1] ? '1fr' : '0fr' }}
          >
            <div className="accordion-content-inner">
              <div className="accordion-body-content">
                <div id="alertsContainer">
                  <div className="alert-item-card danger-type mb-3" style={{ padding: '16px', borderRadius: '8px', border: '1px solid var(--danger-border)', background: 'var(--danger-bg)' }}>
                    <div className="d-flex items-start gap-3">
                      <AlertOctagon size={20} className="text-danger" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <div style={{ flex: 1 }}>
                        <div className="d-flex justify-between items-center flex-wrap gap-2 mb-1">
                          <h3 className="font-bold text-danger" style={{ fontSize: '1.125rem', margin: 0 }}>Chưa hoàn thành Học phần tiên quyết LIF2004 (Hệ quản trị cơ sở dữ liệu)</h3>
                          <span className="badge badge-danger">Ưu tiên 1</span>
                        </div>
                        <p className="text-secondary mb-2" style={{ fontSize: '0.875rem', lineHeight: 1.55 }}>
                          Học phần này là điều kiện tiên quyết bắt buộc để học Khai phá dữ liệu (HK6) và Khóa luận tốt nghiệp (HK8).
                        </p>
                        <div className="d-flex items-center gap-2">
                          <Link to="/student/learning-path" className="btn btn-danger btn-xs">Thêm học phần vào HK6</Link>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="alert-item-card warning-type" style={{ padding: '16px', borderRadius: '8px', border: '1px solid var(--warning-border)', background: 'var(--warning-bg)' }}>
                    <div className="d-flex items-start gap-3">
                      <AlertTriangle size={20} className="text-warning" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <div style={{ flex: 1 }}>
                        <div className="d-flex justify-between items-center flex-wrap gap-2 mb-1">
                          <h3 className="font-bold text-warning" style={{ fontSize: '1.125rem', margin: 0 }}>Chưa nộp chứng chỉ Ngoại ngữ chuẩn đầu ra B1 (VSTEP / IELTS)</h3>
                          <span className="badge badge-warning">Ưu tiên 2</span>
                        </div>
                        <p className="text-secondary mb-2" style={{ fontSize: '0.875rem', lineHeight: 1.55 }}>
                          Theo QĐ 120/QĐ-HVHC, sinh viên phải nộp chứng chỉ trước HK7 để đủ điều kiện xét Thực tập tốt nghiệp.
                        </p>
                        <div className="d-flex items-center gap-2">
                          <span className="text-xs text-muted">Hạn chót: Trước đợt xét Thực tập HK7</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* NHÓM 2: Rủi ro học tập */}
        <div className={`alerts-accordion-item ${openGroups[2] ? 'is-open' : ''}`} id="accordionGroup2" data-group="2">
          <button 
            type="button" 
            className="alerts-accordion-header" 
            id="accordionHeader2" 
            aria-expanded={openGroups[2]} 
            onClick={() => toggleGroup(2)}
          >
            <div className="accordion-header-left">
              <div className="accordion-icon-box icon-warning">
                <AlertOctagon size={18} />
              </div>
              <div className="accordion-header-info">
                <div className="accordion-title-row">
                  <h2 className="accordion-title">Rủi ro học tập</h2>
                  <span className="badge badge-warning">03 yếu tố</span>
                </div>
                <p className="accordion-desc">Các yếu tố và nguy cơ tiềm ẩn có thể làm chậm tiến độ đào tạo</p>
              </div>
            </div>
            <div className="accordion-header-right">
              <span className="accordion-toggle-hint">Thu gọn / Mở rộng</span>
              <ChevronDown 
                size={18} 
                className="accordion-chevron-icon" 
                style={{ transform: openGroups[2] ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} 
              />
            </div>
          </button>

          <div 
            className={`alerts-accordion-collapse ${openGroups[2] ? 'show' : ''}`} 
            id="accordionCollapse2"
            style={{ gridTemplateRows: openGroups[2] ? '1fr' : '0fr' }}
          >
            <div className="accordion-content-inner">
              <div className="accordion-body-content">
                <div className="risk-factor-list space-y-3">
                  {/* Rủi ro 1 */}
                  <div className="risk-factor-card p-3 rounded border mb-3">
                    <div className="risk-factor-header d-flex justify-between items-center mb-1">
                      <div className="risk-factor-title d-flex items-center gap-2">
                        <Link2Off size={16} className="text-danger" />
                        <span className="font-bold text-main text-xs">Chưa hoàn thành Học phần tiên quyết LIF2004 (Hệ quản trị cơ sở dữ liệu)</span>
                      </div>
                      <span className="badge badge-danger font-bold">+35% Trọng số rủi ro</span>
                    </div>
                    <div className="risk-factor-body text-xs text-secondary mb-2">
                      Học phần này là điều kiện tiên quyết bắt buộc để đăng ký học 2 học phần chuyên ngành ở Học kỳ 6 (ISFI25-2010 và ISFI25-2014), đồng thời là điều kiện xét nhận Khóa luận tốt nghiệp (HK8).
                    </div>
                    <div className="risk-factor-solution text-xs text-primary d-flex items-center gap-1.5">
                      <Sparkles size={14} />
                      <span>Khuyến nghị: Đăng ký hoàn thành thực hành học phần LIF2004 trong kỳ phụ hoặc đợt đăng ký sớm Học kỳ 6.</span>
                    </div>
                  </div>

                  {/* Rủi ro 2 */}
                  <div className="risk-factor-card p-3 rounded border mb-3">
                    <div className="risk-factor-header d-flex justify-between items-center mb-1">
                      <div className="risk-factor-title d-flex items-center gap-2">
                        <FileBadge size={16} className="text-warning" />
                        <span className="font-bold text-main text-xs">Chưa nộp chứng chỉ Ngoại ngữ chuẩn đầu ra B1 (VSTEP / IELTS)</span>
                      </div>
                      <span className="badge badge-warning font-bold">+25% Trọng số rủi ro</span>
                    </div>
                    <div className="risk-factor-body text-xs text-secondary mb-2">
                      Theo Quyết định 120/QĐ-HVHC, sinh viên bắt buộc phải nộp chứng chỉ VSTEP B1 hoặc tương đương trước thời điểm xét nhận học phần Thực tập tốt nghiệp (HK7).
                    </div>
                    <div className="risk-factor-solution text-xs text-primary d-flex items-center gap-1.5">
                      <Sparkles size={14} />
                      <span>Khuyến nghị: Đăng ký dự thi đợt VSTEP tháng 11/2026 tại Học viện hoặc nộp bản sao công chứng tại Phòng 105 trước 30/12/2026.</span>
                    </div>
                  </div>

                  {/* Rủi ro 3 */}
                  <div className="risk-factor-card p-3 rounded border">
                    <div className="risk-factor-header d-flex justify-between items-center mb-1">
                      <div className="risk-factor-title d-flex items-center gap-2">
                        <TrendingDown size={16} className="text-warning" />
                        <span className="font-bold text-main text-xs">Biên độ suy giảm nhẹ điểm GPA học kỳ</span>
                      </div>
                      <span className="badge badge-warning font-bold">+20% Trọng số rủi ro</span>
                    </div>
                    <div className="risk-factor-body text-xs text-secondary mb-2">
                      Điểm trung bình học kỳ giảm nhẹ từ 3.35 (HK3) xuống 3.20 (HK4). Dù CPA tích lũy hiện tại (3.24) vẫn đạt chuẩn xếp loại Giỏi, sinh viên cần cân đối khối lượng học tập không vượt quá 18 tín chỉ.
                    </div>
                    <div className="risk-factor-solution text-xs text-primary d-flex items-center gap-1.5">
                      <Sparkles size={14} />
                      <span>Khuyến nghị: Đăng ký khối lượng học tập 15–17 tín chỉ ở HK6 để tối ưu kết quả học phần chuyên ngành.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* NHÓM 3: Tín chỉ & tiến độ */}
        <div className={`alerts-accordion-item ${openGroups[3] ? 'is-open' : ''}`} id="accordionGroup3" data-group="3">
          <button 
            type="button" 
            className="alerts-accordion-header" 
            id="accordionHeader3" 
            aria-expanded={openGroups[3]} 
            onClick={() => toggleGroup(3)}
          >
            <div className="accordion-header-left">
              <div className="accordion-icon-box icon-info">
                <GraduationCap size={18} />
              </div>
              <div className="accordion-header-info">
                <div className="accordion-title-row">
                  <h2 className="accordion-title">Tín chỉ & tiến độ chương trình</h2>
                  <span className="badge badge-info">72 / 130 TC (55.4%)</span>
                </div>
                <p className="accordion-desc">Tổng hợp tiến độ tích lũy học phần theo khung chương trình K25</p>
              </div>
            </div>
            <div className="accordion-header-right">
              <span className="accordion-toggle-hint">Thu gọn / Mở rộng</span>
              <ChevronDown 
                size={18} 
                className="accordion-chevron-icon" 
                style={{ transform: openGroups[3] ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} 
              />
            </div>
          </button>

          <div 
            className={`alerts-accordion-collapse ${openGroups[3] ? 'show' : ''}`} 
            id="accordionCollapse3"
            style={{ gridTemplateRows: openGroups[3] ? '1fr' : '0fr' }}
          >
            <div className="accordion-content-inner">
              <div className="accordion-body-content">
                <div className="credits-progress-dashboard">
                  <div className="credits-hero-bar p-3 border rounded mb-3" style={{ background: 'var(--surface-subtle)' }}>
                    <div className="credits-hero-top d-flex justify-between items-center mb-2">
                      <div className="d-flex items-center gap-2">
                        <span className="font-bold text-main">Tiến độ tích lũy tổng thể</span>
                        <span className="badge badge-primary font-mono font-bold">72 / 130 TC</span>
                      </div>
                      <span className="text-xs font-semibold text-primary">55.4% Hoàn thành</span>
                    </div>
                    <div className="credits-bar-track mb-3" style={{ height: '8px', background: 'var(--surface-muted, #f3f4f6)', border: '1px solid #D1D5DB', borderRadius: '4px', overflow: 'hidden' }}>
                      <div className="credits-bar-fill bg-primary" style={{ width: '55.4%', height: '100%' }}></div>
                    </div>
                    <div className="d-flex justify-between items-center text-xs text-muted flex-wrap gap-2">
                      <span>GPA Tích lũy: <strong className="text-main">3.24 / 4.00</strong></span>
                      <span>Học kỳ hiện tại: <strong className="text-main">Học kỳ 5 (Năm thứ 3)</strong></span>
                      <span>Dự kiến tốt nghiệp: <strong className="text-main">Tháng 06/2026</strong></span>
                    </div>
                  </div>

                  <div className="table-responsive border rounded mb-3">
                    <table className="minimal-table">
                      <thead>
                        <tr>
                          <th>Khối kiến thức</th>
                          <th style={{ width: '140px', textAlign: 'center' }}>Tín chỉ hoàn thành</th>
                          <th style={{ width: '120px', textAlign: 'center' }}>Tỷ lệ (%)</th>
                          <th style={{ width: '160px', textAlign: 'center' }}>Trạng thái</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="font-semibold text-main">Khối Kiến thức Giáo dục đại cương</td>
                          <td style={{ textAlign: 'center' }} className="font-mono">32 / 32 TC</td>
                          <td style={{ textAlign: 'center' }}>100%</td>
                          <td style={{ textAlign: 'center' }}><span className="badge badge-success">Hoàn thành</span></td>
                        </tr>
                        <tr>
                          <td className="font-semibold text-main">Khối Kiến thức Cơ sở ngành</td>
                          <td style={{ textAlign: 'center' }} className="font-mono">28 / 34 TC</td>
                          <td style={{ textAlign: 'center' }}>82.3%</td>
                          <td style={{ textAlign: 'center' }}><span className="badge badge-warning">Cần gỡ LIF2004</span></td>
                        </tr>
                        <tr>
                          <td className="font-semibold text-main">Khối Kiến thức Chuyên ngành</td>
                          <td style={{ textAlign: 'center' }} className="font-mono">12 / 44 TC</td>
                          <td style={{ textAlign: 'center' }}>27.3%</td>
                          <td style={{ textAlign: 'center' }}><span className="badge badge-info">Đang học HK5 & HK6</span></td>
                        </tr>
                        <tr>
                          <td className="font-semibold text-main">Thực tập & Khóa luận tốt nghiệp</td>
                          <td style={{ textAlign: 'center' }} className="font-mono">0 / 20 TC</td>
                          <td style={{ textAlign: 'center' }}>0.0%</td>
                          <td style={{ textAlign: 'center' }}><span className="badge badge-secondary">Kế hoạch HK7 - HK8</span></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="d-flex justify-between items-center flex-wrap gap-2 pt-2">
                    <span className="text-xs text-muted">Dữ liệu được đồng bộ từ Cơ sở dữ liệu Đào tạo APAG.</span>
                    <Link to="/student/curriculum" className="btn btn-outline btn-sm">
                      <ExternalLink size={14} />
                      <span>Xem toàn bộ Khung CTĐT K25</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* NHÓM 4: Quy chế & điều kiện */}
        <div className={`alerts-accordion-item ${openGroups[4] ? 'is-open' : ''}`} id="accordionGroup4" data-group="4">
          <button 
            type="button" 
            className="alerts-accordion-header" 
            id="accordionHeader4" 
            aria-expanded={openGroups[4]} 
            onClick={() => toggleGroup(4)}
          >
            <div className="accordion-header-left">
              <div className="accordion-icon-box icon-success">
                <ShieldCheck size={18} />
              </div>
              <div className="accordion-header-info">
                <div className="accordion-title-row">
                  <h2 className="accordion-title">Quy chế & điều kiện học vụ (QĐ 458/QĐ-HVHC)</h2>
                  <span className="badge badge-success">Đạt chuẩn an toàn</span>
                </div>
                <p className="accordion-desc">Đối chiếu các tiêu chí cảnh báo và xử lý học vụ theo quy định hiện hành</p>
              </div>
            </div>
            <div className="accordion-header-right">
              <span className="accordion-toggle-hint">Thu gọn / Mở rộng</span>
              <ChevronDown 
                size={18} 
                className="accordion-chevron-icon" 
                style={{ transform: openGroups[4] ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} 
              />
            </div>
          </button>

          <div 
            className={`alerts-accordion-collapse ${openGroups[4] ? 'show' : ''}`} 
            id="accordionCollapse4"
            style={{ gridTemplateRows: openGroups[4] ? '1fr' : '0fr' }}
          >
            <div className="accordion-content-inner">
              <div className="accordion-body-content">
                <div className="table-responsive border rounded mb-4">
                  <table className="minimal-table">
                    <thead>
                      <tr>
                        <th style={{ width: '32%' }}>Tiêu chí xét cảnh báo</th>
                        <th style={{ width: '36%' }}>Ngưỡng chạm vi phạm</th>
                        <th style={{ width: '18%', textAlign: 'center' }}>Chỉ số thực tế</th>
                        <th style={{ width: '14%', textAlign: 'center' }}>Đánh giá an toàn</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="font-semibold text-main">Điểm trung bình học kỳ (GPA)</td>
                        <td>&lt; 0.80 (HK đầu) hoặc &lt; 1.00 (HK tiếp)</td>
                        <td className="font-bold text-success" style={{ textAlign: 'center' }}>3.32 / 4.0</td>
                        <td style={{ textAlign: 'center' }}><span className="badge badge-success">Mức độ rủi ro thấp</span></td>
                      </tr>
                      <tr>
                        <td className="font-semibold text-main">Điểm trung bình tích lũy (CPA)</td>
                        <td>&lt; 1.20 (Năm 1), &lt; 1.40 (Năm 2), &lt; 1.60 (Năm 3)</td>
                        <td className="font-bold text-success" style={{ textAlign: 'center' }}>3.24 / 4.0</td>
                        <td style={{ textAlign: 'center' }}><span className="badge badge-success">Mức độ rủi ro thấp</span></td>
                      </tr>
                      <tr>
                        <td className="font-semibold text-main">Tổng số tín chỉ chưa đạt</td>
                        <td>Vượt quá 24 tín chỉ tích lũy</td>
                        <td className="font-bold text-success" style={{ textAlign: 'center' }}>0 tín chỉ</td>
                        <td style={{ textAlign: 'center' }}><span className="badge badge-success">Mức độ rủi ro thấp</span></td>
                      </tr>
                      <tr>
                        <td className="font-semibold text-main">Thời gian đào tạo tối đa</td>
                        <td>Vượt quá 6.0 năm (12 học kỳ chính quy)</td>
                        <td style={{ textAlign: 'center' }}>Năm 3 (Kỳ 5/8)</td>
                        <td style={{ textAlign: 'center' }}><span className="badge badge-success">Đúng hạn 100%</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div>
                  <div className="text-xs font-bold text-muted text-uppercase mb-2">VĂN BẢN QUY CHẾ PHÁP LÝ LIÊN QUAN</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
                    <Link to="/admin/regulations" className="policy-doc-chip p-3 rounded border d-flex items-center justify-between" style={{ background: 'var(--surface)' }}>
                      <div className="d-flex items-center gap-3">
                        <FileText size={18} className="text-primary" />
                        <div>
                          <div className="font-bold text-main text-xs">QĐ 458/QĐ-HVHC</div>
                          <div className="text-muted text-xs">Quy chế đào tạo trình độ đại học theo hệ thống tín chỉ</div>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-muted" />
                    </Link>

                    <Link to="/admin/regulations" className="policy-doc-chip p-3 rounded border d-flex items-center justify-between" style={{ background: 'var(--surface)' }}>
                      <div className="d-flex items-center gap-3">
                        <FileText size={18} className="text-primary" />
                        <div>
                          <div className="font-bold text-main text-xs">QĐ 120/QĐ-HVHC</div>
                          <div className="text-muted text-xs">Quy định chuẩn đầu ra ngoại ngữ (VSTEP B1/B2) & Tin học</div>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-muted" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* NHÓM 5: Phân tích nguyên nhân & Đề xuất AI */}
        <div className={`alerts-accordion-item ${openGroups[5] ? 'is-open' : ''}`} id="accordionGroup5" data-group="5">
          <button 
            type="button" 
            className="alerts-accordion-header" 
            id="accordionHeader5" 
            aria-expanded={openGroups[5]} 
            onClick={() => toggleGroup(5)}
          >
            <div className="accordion-header-left">
              <div className="accordion-icon-box icon-ai">
                <BrainCircuit size={18} />
              </div>
              <div className="accordion-header-info">
                <div className="accordion-title-row">
                  <h2 className="accordion-title">Phân tích nguyên nhân & Đề xuất AI</h2>
                  <span className="badge badge-primary">Xác suất rủi ro dự báo: 82%</span>
                </div>
                <p className="accordion-desc">Bóc tách trọng số các yếu tố rủi ro và mô hình khuyến nghị hỗ trợ học tập</p>
              </div>
            </div>
            <div className="accordion-header-right">
              <span className="accordion-toggle-hint">Thu gọn / Mở rộng</span>
              <ChevronDown 
                size={18} 
                className="accordion-chevron-icon" 
                style={{ transform: openGroups[5] ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} 
              />
            </div>
          </button>

          <div 
            className={`alerts-accordion-collapse ${openGroups[5] ? 'show' : ''}`} 
            id="accordionCollapse5"
            style={{ gridTemplateRows: openGroups[5] ? '1fr' : '0fr' }}
          >
            <div className="accordion-content-inner">
              <div className="accordion-body-content">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
                  <div className="xai-factor-box p-3 rounded border" style={{ background: 'var(--surface-subtle)' }}>
                    <div className="d-flex justify-between items-center mb-1">
                      <span className="font-bold text-xs text-main">Tiên quyết LIF2004</span>
                      <span className="badge badge-danger font-bold">+35%</span>
                    </div>
                    <div className="text-xs text-muted">Chưa đáp ứng điều kiện tiên quyết để đăng ký học phần Khai phá dữ liệu (HK6) và Khóa luận tốt nghiệp (HK8).</div>
                  </div>

                  <div className="xai-factor-box p-3 rounded border" style={{ background: 'var(--surface-subtle)' }}>
                    <div className="d-flex justify-between items-center mb-1">
                      <span className="font-bold text-xs text-main">Ngoại ngữ B1</span>
                      <span className="badge badge-warning font-bold">+25%</span>
                    </div>
                    <div className="text-xs text-muted">Chưa nộp chứng chỉ VSTEP B1 hoặc IELTS tương đương trước kỳ Thực tập HK7.</div>
                  </div>

                  <div className="xai-factor-box p-3 rounded border" style={{ background: 'var(--surface-subtle)' }}>
                    <div className="d-flex justify-between items-center mb-1">
                      <span className="font-bold text-xs text-main">Xu hướng GPA</span>
                      <span className="badge badge-warning font-bold">+20%</span>
                    </div>
                    <div className="text-xs text-muted">GPA giảm nhẹ từ 3.35 (HK3) xuống 3.20 (HK4), cần giữ vững phong độ ổn định.</div>
                  </div>

                  <div className="xai-factor-box p-3 rounded border" style={{ background: 'var(--surface-subtle)' }}>
                    <div className="d-flex justify-between items-center mb-1">
                      <span className="font-bold text-xs text-main">Tốc độ tích lũy</span>
                      <span className="badge badge-secondary font-bold">+2%</span>
                    </div>
                    <div className="text-xs text-muted">Tiến độ tín chỉ 72/130 TC ở mức chấp nhận được nhưng không có biên đệm an toàn.</div>
                  </div>
                </div>

                <div className="xai-synthesis-box p-3 rounded border" style={{ background: 'var(--surface-subtle)', borderLeft: '3px solid var(--primary)' }}>
                  <div className="d-flex items-center gap-2 mb-2">
                    <Sparkles size={16} className="text-primary" />
                    <span className="font-bold text-main text-xs">Giải trình mô hình AI & Kế hoạch hỗ trợ học tập:</span>
                  </div>
                  <p className="text-secondary mb-2" style={{ fontSize: '0.875rem', lineHeight: 1.55 }}>
                    Hệ thống phân định rõ: <strong>Dữ liệu thực tế</strong> chứng minh kết quả học tập của bạn hoàn toàn tốt (CPA 3.24, không có học phần chưa đạt). Tuy nhiên, <strong>suy luận của mô hình dự báo</strong> cho thấy rủi ro chậm tiến độ tập trung vào việc chưa hoàn thành học phần tiên quyết LIF2004 và chứng chỉ B1.
                  </p>
                  <p className="text-primary font-semibold mb-0" style={{ fontSize: '0.875rem', lineHeight: 1.55 }}>
                    💡 Kế hoạch hỗ trợ học tập: Khi bạn hoàn thành học phần tiên quyết LIF2004 trong HK6 và nộp chứng chỉ B1 trước tháng 12/2026, xác suất dự báo chậm tiến độ giảm từ 82% xuống dưới 15% (Mức độ rủi ro thấp).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default StudentAlerts;
