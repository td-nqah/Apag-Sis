// ==========================================================================
// APAG Advisor Progress Tracking Page Component (React + TypeScript)
// ==========================================================================

import React, { useState } from 'react';
import { TrendingUp, Download, Search, CheckCircle2, AlertTriangle, Users } from 'lucide-react';
import { Utils } from '../../utils/utils';

export const AdvisorProgress: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState('all');

  const studentProgressList = [
    { id: '2505HTTB012', name: 'Trần Mạnh Hà', class: '2505HTTB', credits: 72, target: 130, pct: 55.4, gpa: 3.24, status: 'Đúng hạn', gradDate: '06/2026' },
    { id: '2505HTTB013', name: 'Lê Thu Trang', class: '2505HTTB', credits: 75, target: 130, pct: 57.7, gpa: 3.65, status: 'Vượt tiến độ', gradDate: '06/2026' },
    { id: '2505HTTB014', name: 'Nguyễn Văn An', class: '2505HTTB', credits: 54, target: 130, pct: 41.5, gpa: 2.15, status: 'Chậm tiến độ', gradDate: '12/2026' },
    { id: '2505HTTB015', name: 'Phạm Minh Đức', class: '2505HTTB', credits: 48, target: 130, pct: 36.9, gpa: 1.85, status: 'Nguy cơ cao', gradDate: '2027' },
    { id: '2505HTTB016', name: 'Hoàng Mai Anh', class: '2505HTTB', credits: 70, target: 130, pct: 53.8, gpa: 3.10, status: 'Đúng hạn', gradDate: '06/2026' }
  ];

  return (
    <div>
      {/* Top Action Button */}
      <div className="d-flex justify-end mb-4" style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button type="button" className="btn btn-secondary btn-sm" onClick={() => Utils.showToast('Đang xuất báo cáo tiến độ Excel...', 'info')}>
          <Download size={14} />
          <span>Xuất báo cáo tiến độ</span>
        </button>
      </div>

      {/* Progress Bracket Summary */}
      <div className="metrics-grid mb-6">
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Đúng hạn tốt nghiệp</span>
            <CheckCircle2 className="metric-icon text-success" size={18} />
          </div>
          <div className="metric-value-row">
            <span className="metric-number text-success">40</span>
            <span className="metric-unit">/ 45 SV (88.9%)</span>
          </div>
          <div className="metric-footer text-muted">Dự kiến tốt nghiệp 06/2026</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Nguy cơ chậm hạn</span>
            <AlertTriangle className="metric-icon text-warning" size={18} />
          </div>
          <div className="metric-value-row">
            <span className="metric-number text-warning">05</span>
            <span className="metric-unit">SV (11.1%)</span>
          </div>
          <div className="metric-footer text-muted">Thiếu trên 12 tín chỉ chuẩn</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Tiến độ tích lũy TB</span>
            <TrendingUp className="metric-icon text-primary" size={18} />
          </div>
          <div className="metric-value-row">
            <span className="metric-number text-primary">55.2%</span>
          </div>
          <div className="metric-footer text-muted">Trung bình 71.8 TC / SV</div>
        </div>
      </div>

      {/* Students Progress Table */}
      <div className="minimal-card">
        <div className="card-header d-flex justify-between items-center" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h2 className="card-title">Chi tiết tiến độ tích lũy sinh viên</h2>
          <select 
            className="form-control form-control-sm"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            style={{ width: '150px' }}
          >
            <option value="all">Tất cả các lớp</option>
            <option value="2505HTTB">Lớp 2505HTTB</option>
          </select>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="minimal-table">
              <thead>
                <tr>
                  <th>Mã SV</th>
                  <th>Họ và tên</th>
                  <th>Lớp</th>
                  <th>Tín chỉ hoàn thành</th>
                  <th style={{ width: '220px' }}>Tiến độ tích lũy</th>
                  <th style={{ textAlign: 'right' }}>GPA</th>
                  <th>Trạng thái</th>
                  <th>Dự kiến tốt nghiệp</th>
                </tr>
              </thead>
              <tbody>
                {studentProgressList.filter(s => selectedClass === 'all' || s.class === selectedClass).map(s => (
                  <tr key={s.id}>
                    <td><code>{s.id}</code></td>
                    <td className="font-semibold text-main">{s.name}</td>
                    <td><code>{s.class}</code></td>
                    <td><strong>{s.credits}</strong> / {s.target} TC</td>
                    <td>
                      <div className="progress-cell-bar">
                        <div className="progress-cell-track">
                          <div 
                            className="progress-cell-fill" 
                            style={{ 
                              width: `${s.pct}%`, 
                              background: s.pct >= 50 ? 'var(--success)' : 'var(--warning)' 
                            }}
                          ></div>
                        </div>
                        <span className="progress-cell-text">{s.pct}%</span>
                      </div>
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 700 }}>{s.gpa.toFixed(2)}</td>
                    <td>
                      <span className={`badge badge-${s.status === 'Đúng hạn' || s.status === 'Vượt tiến độ' ? 'success' : s.status === 'Chậm tiến độ' ? 'warning' : 'danger'}`}>
                        {s.status}
                      </span>
                    </td>
                    <td>{s.gradDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
