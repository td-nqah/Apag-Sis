// ==========================================================================
// APAG Advisor Students Roster Page Component (React + TypeScript)
// Exact 1:1 Restoration matching pages/advisor/students.html & js/advisor/students.js
// ==========================================================================

import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FileSpreadsheet, Search } from 'lucide-react';
import * as XLSX from 'xlsx';
import { Utils } from '../../utils/utils';
import { MOCK_ALL_STUDENTS } from '../../services/mockData';

export const AdvisorStudents: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const classParam = searchParams.get('class');

  const [currentRisk, setCurrentRisk] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const studentsList = useMemo(() => {
    let list = (MOCK_ALL_STUDENTS as any[]) || [];
    if (classParam) {
      list = list.filter(s => s.class === classParam);
    }
    return list;
  }, [classParam]);

  const filtered = useMemo(() => {
    let list = [...studentsList];
    if (currentRisk !== 'all') {
      if (currentRisk === 'high') {
        list = list.filter(s => s.riskLevel === 'high' || s.riskLevel === 'critical');
      } else {
        list = list.filter(s => s.riskLevel === currentRisk);
      }
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(s => 
        (s.fullName && s.fullName.toLowerCase().includes(q)) || 
        (s.name && s.name.toLowerCase().includes(q)) || 
        (s.studentId && s.studentId.toLowerCase().includes(q))
      );
    }
    return list;
  }, [studentsList, currentRisk, searchQuery]);

  // Counts for filters
  const normalCount = studentsList.filter(s => s.riskLevel === 'normal').length;
  const watchCount = studentsList.filter(s => s.riskLevel === 'watch').length;
  const highCount = studentsList.filter(s => s.riskLevel === 'high' || s.riskLevel === 'critical').length;

  const handleExportExcel = () => {
    try {
      const rows = studentsList.map(s => ({
        'Mã SV': s.studentId,
        'Họ và tên': s.fullName || s.name,
        'Lớp': s.class,
        'GPA': s.gpa,
        'Tín chỉ tích lũy': s.credits || s.creditsCompleted || 72,
        'Tiến độ (%)': s.progress || s.progressPercentage || 55.4,
        'Mức độ rủi ro': (s.riskLevel === 'high' || s.riskLevel === 'critical') ? 'Cao' : (s.riskLevel === 'watch' ? 'Theo dõi' : 'Bình thường'),
        'Email': s.email
      }));

      const ws = XLSX.utils.json_to_sheet(rows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'DanhSach_SinhVien_K25HTTB');
      XLSX.writeFile(wb, 'Danh_Sach_Lop_K25_HTTB_Co_Van.xlsx');
      Utils.showToast('Đã tải xuống danh sách sinh viên!', 'success');
    } catch (err) {
      console.error(err);
      Utils.showToast('Lỗi khi xuất tệp Excel', 'danger');
    }
  };

  return (
    <div>
      {/* Top Action Button */}
      <div className="d-flex justify-end mb-4" style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button type="button" className="btn btn-secondary btn-sm" onClick={handleExportExcel}>
          <FileSpreadsheet size={14} />
          <span>Xuất danh sách (.xlsx)</span>
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="minimal-card mb-6 p-4">
        <div className="d-flex justify-between items-center flex-wrap gap-4" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="d-flex gap-2 flex-wrap items-center" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span className="text-xs font-semibold text-muted uppercase">Mức rủi ro:</span>
            <button 
              type="button" 
              className={`btn btn-sm ${currentRisk === 'all' ? 'btn-primary active' : 'btn-secondary'}`}
              onClick={() => setCurrentRisk('all')}
            >
              Tất cả ({studentsList.length})
            </button>
            <button 
              type="button" 
              className={`btn btn-sm ${currentRisk === 'high' ? 'btn-primary active' : 'btn-secondary'}`}
              onClick={() => setCurrentRisk('high')}
            >
              Cao ({highCount})
            </button>
            <button 
              type="button" 
              className={`btn btn-sm ${currentRisk === 'normal' ? 'btn-primary active' : 'btn-secondary'}`}
              onClick={() => setCurrentRisk('normal')}
            >
              Bình thường ({normalCount})
            </button>
            <button 
              type="button" 
              className={`btn btn-sm ${currentRisk === 'watch' ? 'btn-primary active' : 'btn-secondary'}`}
              onClick={() => setCurrentRisk('watch')}
            >
              Theo dõi ({watchCount})
            </button>
          </div>

          <div className="input-with-icon" style={{ width: '280px', position: 'relative' }}>
            <Search size={14} className="text-muted" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              className="form-control" 
              placeholder="Tìm theo tên, MSSV..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '34px' }}
            />
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="minimal-card">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="minimal-table">
              <thead>
                <tr>
                  <th style={{ width: '120px' }}>MSSV</th>
                  <th>HỌ VÀ TÊN</th>
                  <th style={{ width: '110px' }}>LỚP</th>
                  <th style={{ width: '80px' }}>GPA</th>
                  <th style={{ width: '150px' }}>TÍN CHỈ TÍCH LŨY</th>
                  <th style={{ width: '140px' }}>TIẾN ĐỘ</th>
                  <th style={{ width: '150px' }}>PHÂN LOẠI RỦI RO</th>
                  <th style={{ width: '130px' }}>THAO TÁC</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-6 text-muted">
                      Không tìm thấy sinh viên nào phù hợp.
                    </td>
                  </tr>
                ) : (
                  filtered.map(s => {
                    const isHigh = s.riskLevel === 'high' || s.riskLevel === 'critical';
                    const isWatch = s.riskLevel === 'watch';
                    const riskBadge = isHigh ? (
                      <span className="badge badge-danger">Cao</span>
                    ) : isWatch ? (
                      <span className="badge badge-warning">Theo dõi</span>
                    ) : (
                      <span className="badge badge-success">Bình thường</span>
                    );

                    const progressPct = s.progress || s.progressPercentage || 55.4;
                    const progressColor = isHigh 
                      ? '#EF4444' 
                      : isWatch 
                        ? '#F59E0B' 
                        : '#10B981';

                    return (
                      <tr key={s.studentId}>
                        <td><code>{s.studentId}</code></td>
                        <td className="font-medium">{s.fullName || s.name}</td>
                        <td>{s.class}</td>
                        <td style={{ textAlign: 'right' }}>
                          <span className={`font-bold ${s.gpa < 2.5 ? 'text-danger' : 'text-primary'}`}>
                            {Number(s.gpa).toFixed(2)}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>{s.credits || s.creditsCompleted || 72} / 130 TC</td>
                        <td>
                          <div className="d-flex items-center gap-2" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div 
                              className="progress-bar-container flex-1" 
                              style={{ 
                                width: '80px', 
                                height: '7px', 
                                background: '#F1F5F9', 
                                border: '1px solid #D1D5DB', 
                                borderRadius: '999px', 
                                overflow: 'hidden' 
                              }}
                            >
                              <div 
                                className="progress-bar-fill" 
                                style={{ 
                                  width: `${progressPct}%`, 
                                  height: '100%', 
                                  backgroundColor: progressColor,
                                  borderRadius: '999px'
                                }}
                              ></div>
                            </div>
                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#000000', minWidth: '32px' }}>
                              {progressPct}%
                            </span>
                          </div>
                        </td>
                        <td>{riskBadge}</td>
                        <td style={{ textAlign: 'center' }}>
                          <button 
                            type="button" 
                            className="btn btn-outline btn-xs"
                            onClick={() => navigate(`/advisor/student-detail?id=${s.studentId}`)}
                          >
                            Hồ sơ & Đánh giá
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
    </div>
  );
};
