// ==========================================================================
// APAG Advisor Alerts & Intervention Management Component (React + TypeScript)
// Exact 1:1 Restoration matching pages/advisor/alerts.html & js/advisor/alerts.js
// Module 7 • Intervention & Follow-up
// ==========================================================================

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, 
  Mail, 
  AlertOctagon, 
  AlertTriangle, 
  Info, 
  Activity, 
  Clock, 
  CheckCircle2, 
  TrendingUp, 
  Edit3, 
  Eye, 
  X, 
  Save 
} from 'lucide-react';
import { Utils } from '../../utils/utils';
import { MOCK_ALL_STUDENTS, MOCK_INTERVENTIONS } from '../../services/mockData';

export const AdvisorAlerts: React.FC = () => {
  const navigate = useNavigate();

  const [filterMode, setFilterMode] = useState<'all' | 'high' | 'watch' | 'in_progress' | 'resolved'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Local intervention states
  const [interventions, setInterventions] = useState(() => {
    return MOCK_INTERVENTIONS;
  });

  // Modal state
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [planInput, setPlanInput] = useState('');
  const [deadlineInput, setDeadlineInput] = useState('');
  const [statusSelect, setStatusSelect] = useState('in_progress');
  const [notesInput, setNotesInput] = useState('');

  // At-risk students merged with interventions
  const allAtRiskStudents = useMemo(() => {
    const rawList = MOCK_ALL_STUDENTS.filter(s => s.riskLevel === 'high' || s.riskLevel === 'watch' || s.riskLevel === 'critical');
    return rawList.map(s => {
      const intv = interventions.find(i => i.studentId === s.studentId);
      return {
        ...s,
        riskLevel: s.riskLevel === 'critical' ? 'high' : s.riskLevel,
        intervention: intv || null,
        interventionStatus: intv?.status || s.interventionStatus || 'pending'
      };
    });
  }, [interventions]);

  // Counts for KPIs
  const highCount = allAtRiskStudents.filter(s => s.riskLevel === 'high').length;
  const watchCount = allAtRiskStudents.filter(s => s.riskLevel === 'watch').length;
  const inProgressCount = allAtRiskStudents.filter(s => s.interventionStatus === 'in_progress' || s.interventionStatus === 'urgent').length;
  const resolvedCount = allAtRiskStudents.filter(s => s.interventionStatus === 'resolved').length;

  // Filtered rows
  const filteredList = useMemo(() => {
    let list = [...allAtRiskStudents];

    if (filterMode === 'high') {
      list = list.filter(s => s.riskLevel === 'high');
    } else if (filterMode === 'watch') {
      list = list.filter(s => s.riskLevel === 'watch');
    } else if (filterMode === 'in_progress') {
      list = list.filter(s => s.interventionStatus === 'in_progress' || s.interventionStatus === 'urgent');
    } else if (filterMode === 'resolved') {
      list = list.filter(s => s.interventionStatus === 'resolved');
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(s => 
        (s.name || (s as any).fullName || '').toLowerCase().includes(q) || 
        s.studentId.toLowerCase().includes(q)
      );
    }

    return list;
  }, [allAtRiskStudents, filterMode, searchQuery]);

  // Open modal
  const handleOpenIntervene = (student: any) => {
    setSelectedStudent(student);
    setPlanInput(student.intervention?.actionPlan || 'Ưu tiên đăng ký học bù học phần tiên quyết trong Học kỳ 6; kiểm tra tiến độ nộp chứng chỉ tiếng Anh B1.');
    setDeadlineInput(student.intervention?.deadline || '15/11/2026');
    setStatusSelect(student.interventionStatus === 'pending' ? 'in_progress' : student.interventionStatus);
    setNotesInput(student.intervention?.notes || '');
  };

  const handleSaveIntervention = () => {
    const newIntv = {
      id: `intv_${Date.now()}`,
      studentId: selectedStudent.studentId,
      studentName: selectedStudent.name || (selectedStudent as any).fullName || '',
      riskCategory: selectedStudent.riskReason || 'Chưa tích lũy học phần tiên quyết',
      actionPlan: planInput,
      assignedAdvisor: 'TS. Nguyễn Năng Thành',
      createdAt: new Date().toLocaleDateString('vi-VN'),
      deadline: deadlineInput,
      status: statusSelect,
      notes: notesInput
    };

    setInterventions(prev => {
      const filtered = prev.filter(i => i.studentId !== selectedStudent.studentId);
      return [...filtered, newIntv];
    });

    Utils.showToast(`Đã lưu kế hoạch hỗ trợ học tập cho sinh viên ${selectedStudent.name || (selectedStudent as any).fullName}!`, 'success');
    setSelectedStudent(null);
  };

  const handleBulkInvite = () => {
    Utils.showToast('Đã gửi thông báo mời trao đổi học vụ đến 5 sinh viên nguy cơ cao qua Email & SMS!', 'success');
  };

  return (
    <div>
      {/* Top Action Button */}
      <div className="d-flex justify-end mb-4" style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button type="button" className="btn btn-primary btn-sm" onClick={handleBulkInvite}>
          <Mail size={14} />
          <span>Mời trao đổi học vụ 5 sinh viên nguy cơ cao</span>
        </button>
      </div>

      {/* 4 Metric KPI Cards */}
      <div className="metrics-grid mb-6">
        <div className="metric-card metric-card-dark">
          <div className="metric-header d-flex justify-between items-center mb-1">
            <span className="metric-label">Cảnh báo Nguy cơ cao</span>
            <span className="badge badge-danger font-bold">Khẩn cấp</span>
          </div>
          <div className="metric-value-row">
            <span className="metric-number text-danger">{highCount.toString().padStart(2, '0')}</span>
            <span className="metric-unit"> Sinh viên</span>
          </div>
          <div className="metric-footer d-flex items-center gap-1" style={{ color: 'var(--text-dark-secondary, #94A3B8)', marginTop: '4px' }}>
            <AlertOctagon size={14} className="text-danger" />
            <span>Nguy cơ chậm tiến độ &gt; 1 năm</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header d-flex justify-between items-center mb-1">
            <span className="metric-label">Theo dõi</span>
            <AlertTriangle size={16} className="text-warning" />
          </div>
          <div className="metric-value-row">
            <span className="metric-number text-warning">{watchCount.toString().padStart(2, '0')}</span>
            <span className="metric-unit"> Sinh viên</span>
          </div>
          <div className="metric-footer text-warning d-flex items-center gap-1" style={{ marginTop: '4px' }}>
            <Info size={14} />
            <span>Thiếu chứng chỉ B1 / Chưa đạt học phần cơ sở</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header d-flex justify-between items-center mb-1">
            <span className="metric-label">Đang hỗ trợ học vụ</span>
            <Activity size={16} className="text-primary" />
          </div>
          <div className="metric-value-row">
            <span className="metric-number text-primary">{inProgressCount.toString().padStart(2, '0')}</span>
            <span className="metric-unit"> Hồ sơ</span>
          </div>
          <div className="metric-footer text-primary d-flex items-center gap-1" style={{ marginTop: '4px' }}>
            <Clock size={14} />
            <span>Đang thực hiện kế hoạch hành động</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header d-flex justify-between items-center mb-1">
            <span className="metric-label">Đã hỗ trợ thành công</span>
            <CheckCircle2 size={16} className="text-success" />
          </div>
          <div className="metric-value-row">
            <span className="metric-number text-success">{resolvedCount.toString().padStart(2, '0')}</span>
            <span className="metric-unit"> Đã giải quyết</span>
          </div>
          <div className="metric-footer text-success d-flex items-center gap-1" style={{ marginTop: '4px' }}>
            <TrendingUp size={14} />
            <span>Đã hoàn thành chuẩn bổ sung</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="minimal-card p-4 mb-4">
        <div className="d-flex justify-between items-center flex-wrap gap-3" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Segmented Control Filters */}
          <div className="segmented-control" style={{ display: 'flex', gap: '4px' }}>
            <button 
              type="button" 
              className={`segmented-btn ${filterMode === 'all' ? 'active' : ''}`}
              onClick={() => setFilterMode('all')}
            >
              Tất cả ({allAtRiskStudents.length})
            </button>
            <button 
              type="button" 
              className={`segmented-btn ${filterMode === 'high' ? 'active' : ''}`}
              onClick={() => setFilterMode('high')}
            >
              Cao ({highCount})
            </button>
            <button 
              type="button" 
              className={`segmented-btn ${filterMode === 'watch' ? 'active' : ''}`}
              onClick={() => setFilterMode('watch')}
            >
              Theo dõi ({watchCount})
            </button>
            <button 
              type="button" 
              className={`segmented-btn ${filterMode === 'in_progress' ? 'active' : ''}`}
              onClick={() => setFilterMode('in_progress')}
            >
              Đang hỗ trợ ({inProgressCount})
            </button>
            <button 
              type="button" 
              className={`segmented-btn ${filterMode === 'resolved' ? 'active' : ''}`}
              onClick={() => setFilterMode('resolved')}
            >
              Đã giải quyết ({resolvedCount})
            </button>
          </div>

          {/* Search box */}
          <div className="d-flex items-center gap-2" style={{ minWidth: '260px' }}>
            <input 
              type="text" 
              className="form-control form-control-sm" 
              placeholder="Tìm theo tên hoặc MSSV..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Main Alert & Intervention Table */}
      <div className="minimal-card">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="minimal-table" style={{ fontSize: '0.8125rem' }}>
              <thead>
                <tr>
                  <th style={{ width: '110px' }}>Mức độ</th>
                  <th style={{ width: '110px' }}>MSSV</th>
                  <th style={{ width: '170px' }}>Sinh viên</th>
                  <th style={{ width: '70px', textAlign: 'right' }}>GPA</th>
                  <th style={{ width: '90px', textAlign: 'right' }}>Tín chỉ</th>
                  <th>Chẩn đoán nguyên nhân AI</th>
                  <th style={{ width: '130px' }}>Trạng thái hỗ trợ</th>
                  <th style={{ width: '160px', textAlign: 'center' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredList.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-6 text-muted">
                      Không tìm thấy sinh viên phù hợp điều kiện lọc.
                    </td>
                  </tr>
                ) : (
                  filteredList.map(s => {
                    const isHigh = s.riskLevel === 'high';
                    const severityBadge = isHigh ? (
                      <span className="badge badge-danger font-bold">Cao</span>
                    ) : (
                      <span className="badge badge-warning font-semibold">Theo dõi</span>
                    );

                    let statusBadge = <span className="badge badge-secondary text-muted">Chờ lập KH</span>;
                    if (s.interventionStatus === 'urgent') {
                      statusBadge = <span className="badge badge-danger font-bold">Khẩn cấp</span>;
                    } else if (s.interventionStatus === 'in_progress') {
                      statusBadge = <span className="badge badge-primary font-semibold">Đang hỗ trợ</span>;
                    } else if (s.interventionStatus === 'resolved') {
                      statusBadge = <span className="badge badge-success font-semibold">Đã giải quyết</span>;
                    }

                    return (
                      <tr key={s.studentId}>
                        <td>{severityBadge}</td>
                        <td><code>{s.studentId}</code></td>
                        <td>
                          <div className="font-medium text-main">{s.name || (s as any).fullName}</div>
                          <div className="text-xs text-muted font-mono">{s.class}</div>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <span className={`font-bold ${s.gpa < 2.5 ? 'text-danger' : 'text-main'}`}>
                            {Number(s.gpa).toFixed(2)}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <span className="text-xs font-semibold">{s.credits} / 130</span>
                        </td>
                        <td className="text-secondary text-xs">
                          <div>{s.riskReason || (s as any).alertReason || 'Chưa tích lũy học phần tiên quyết hoặc chậm tiến độ'}</div>
                          {s.intervention && (
                            <div className="text-muted mt-1" style={{ fontStyle: 'italic' }}>
                              • KH: {s.intervention.actionPlan}
                            </div>
                          )}
                        </td>
                        <td>{statusBadge}</td>
                        <td style={{ textAlign: 'center' }}>
                          <div className="d-inline-flex gap-1.5" style={{ display: 'inline-flex', gap: '6px' }}>
                            <button 
                              type="button" 
                              className="btn btn-primary btn-xs"
                              onClick={() => handleOpenIntervene(s)}
                            >
                              <Edit3 size={12} />
                              <span>Hỗ trợ</span>
                            </button>
                            <button 
                              type="button" 
                              className="btn btn-outline btn-xs"
                              onClick={() => navigate(`/advisor/student-detail?id=${s.studentId}`)}
                            >
                              <span>Hồ sơ 360°</span>
                            </button>
                          </div>
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

      {/* Intervention Modal */}
      {selectedStudent && (
        <div 
          className="modal-backdrop" 
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
          onClick={(e) => { if (e.target === e.currentTarget) setSelectedStudent(null); }}
        >
          <div className="minimal-card" style={{ width: '100%', maxWidth: '540px', margin: '20px', padding: '24px' }}>
            <div className="d-flex justify-between items-center mb-4" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 className="text-base font-bold text-main">
                Lập kế hoạch hỗ trợ học vụ - {selectedStudent.fullName} ({selectedStudent.studentId})
              </h3>
              <button type="button" className="btn-close" onClick={() => setSelectedStudent(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div className="p-3 rounded mb-3" style={{ background: 'var(--surface-subtle)', border: '1px solid var(--border)' }}>
              <div className="d-flex justify-between items-center text-xs mb-1" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-muted">Chẩn đoán rủi ro:</span>
                <span className={`badge ${selectedStudent.riskLevel === 'high' ? 'badge-danger' : 'badge-warning'} font-bold`}>
                  Mức độ rủi ro dự báo: 80/100
                </span>
              </div>
              <div className="text-xs font-semibold text-main">{selectedStudent.alertReason || 'Chậm tiến độ tín chỉ'}</div>
              <div className="text-xs text-muted mt-1">GPA hiện tại: {selectedStudent.gpa} • Tích lũy: {selectedStudent.credits}/130 tín chỉ</div>
            </div>

            <div className="form-group mb-3">
              <label className="form-label text-xs font-semibold">Kế hoạch hỗ trợ học tập cụ thể</label>
              <textarea 
                className="form-control" 
                rows={3} 
                value={planInput}
                onChange={(e) => setPlanInput(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label text-xs font-semibold">Thời hạn hoàn thành</label>
                <input 
                  type="text" 
                  className="form-control form-control-sm" 
                  value={deadlineInput}
                  onChange={(e) => setDeadlineInput(e.target.value)}
                  placeholder="dd/mm/yyyy" 
                />
              </div>
              <div className="form-group">
                <label className="form-label text-xs font-semibold">Trạng thái hỗ trợ</label>
                <select 
                  className="form-control form-control-sm font-semibold" 
                  value={statusSelect}
                  onChange={(e) => setStatusSelect(e.target.value)}
                >
                  <option value="in_progress">Đang hỗ trợ</option>
                  <option value="urgent">Khẩn cấp</option>
                  <option value="resolved">Đã giải quyết</option>
                </select>
              </div>
            </div>

            <div className="form-group mb-4">
              <label className="form-label text-xs font-semibold">Ghi chú bổ sung của Cố vấn</label>
              <textarea 
                className="form-control" 
                rows={2} 
                value={notesInput}
                onChange={(e) => setNotesInput(e.target.value)}
                placeholder="Ghi chú thêm..."
              />
            </div>

            <div className="d-flex justify-end gap-2" style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button type="button" className="btn btn-outline btn-sm" onClick={() => setSelectedStudent(null)}>
                Hủy bỏ
              </button>
              <button type="button" className="btn btn-primary btn-sm" onClick={handleSaveIntervention}>
                <Save size={14} />
                <span>Lưu kế hoạch</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
