// ==========================================================================
// APAG Admin Courses & Departments Management (React + TypeScript)
// Feature 3: Course catalog with search & filter, course detail view (syllabus,
// prerequisites, credits, assigned lecturer, enrolled student list),
// department management (add/edit dept, assign head), course status badges.
// ==========================================================================

import React, { useState, useMemo } from 'react';
import { 
  Network, 
  Download, 
  Plus, 
  AlertOctagon, 
  Users, 
  Percent, 
  TrendingUp, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  X, 
  Check,
  Building,
  BookOpen,
  Edit3,
  Calendar,
  Layers,
  GraduationCap,
  FileText,
  UserCheck
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { Utils } from '../../utils/utils';
import { MOCK_COURSE_INTELLIGENCE } from '../../services/mockData';

export interface CourseItem {
  code: string;
  name: string;
  credits: number;
  theoryCredits?: number;
  practiceCredits?: number;
  category: string;
  department: string;
  lecturer: string;
  status: 'Open' | 'In Progress' | 'Completed';
  statusLabel: string;
  prerequisites: string[];
  syllabusOverview: string;
  avgScore: number;
  passRate: number;
  failRate: number;
  studentsBlocked: number;
  bottleneckSeverity: 'critical' | 'high' | 'medium' | 'low';
  reason: string;
  enrolledStudents?: Array<{
    id: string;
    studentId: string;
    name: string;
    class: string;
    attendance: number;
    midterm: number;
  }>;
}

export interface DepartmentItem {
  id: string;
  code: string;
  name: string;
  headOfDept: string;
  headEmail: string;
  facultyCount: number;
  studentCount: number;
  majors: string[];
  office: string;
}

export const AdminCourses: React.FC = () => {
  const [activeMainTab, setActiveMainTab] = useState<'courses' | 'departments'>('courses');

  // Courses Dataset with enhanced details
  const [courses, setCourses] = useState<CourseItem[]>([
    {
      code: 'LIF2003',
      name: 'Phân tích và thiết kế hệ thống thông tin',
      credits: 3,
      theoryCredits: 2,
      practiceCredits: 1,
      category: 'Chuyên ngành',
      department: 'Khoa Công nghệ & Quản trị số',
      lecturer: 'TS. Nguyễn Năng Thành',
      status: 'In Progress',
      statusLabel: 'Đang giảng dạy',
      prerequisites: ['LIF1006 - Cơ sở lập trình'],
      syllabusOverview: 'Trang bị phương pháp luận phân tích yêu cầu phần mềm, mô hình hóa UML, thiết kế kiến trúc và CSDL quan hệ cho hệ thống thông tin doanh nghiệp.',
      avgScore: 7.2,
      passRate: 88,
      failRate: 12,
      studentsBlocked: 0,
      bottleneckSeverity: 'low',
      reason: 'Tiến độ học tập và đạt học phần của sinh viên diễn ra thuận lợi.',
      enrolledStudents: [
        { id: '1', studentId: '2505HTTB012', name: 'Trần Mạnh Hà', class: '25HTTB01', attendance: 9.5, midterm: 8.5 },
        { id: '2', studentId: '2505HTTB001', name: 'Nguyễn Văn An', class: '25HTTB01', attendance: 10.0, midterm: 9.5 },
        { id: '3', studentId: '2505HTTB002', name: 'Lê Thị Mai', class: '25HTTB01', attendance: 8.0, midterm: 7.0 },
        { id: '4', studentId: '2505HTTB020', name: 'Đặng Thùy Linh', class: '25HTTB01', attendance: 9.5, midterm: 8.5 }
      ]
    },
    {
      code: 'LIF2004',
      name: 'Hệ quản trị cơ sở dữ liệu',
      credits: 3,
      theoryCredits: 2,
      practiceCredits: 1,
      category: 'Cơ sở ngành',
      department: 'Khoa Công nghệ & Quản trị số',
      lecturer: 'TS. Lê Hoàng Long',
      status: 'Open',
      statusLabel: 'Đang mở đăng ký',
      prerequisites: ['LIF1006 - Cơ sở lập trình'],
      syllabusOverview: 'Lý thuyết mô hình quan hệ, đại số quan hệ, ngôn ngữ SQL nâng cao, lập chỉ mục và tối ưu hóa câu truy vấn trong PostgreSQL và Oracle.',
      avgScore: 5.6,
      passRate: 68,
      failRate: 32,
      studentsBlocked: 18,
      bottleneckSeverity: 'critical',
      reason: 'Học phần tiên quyết có tỷ lệ chưa đạt 32%, khiến 18 sinh viên chưa đáp ứng điều kiện đăng ký Khai phá dữ liệu ở HK6.',
      enrolledStudents: [
        { id: '5', studentId: '2505HTTB003', name: 'Hoàng Quốc Bảo', class: '25HTTB01', attendance: 6.0, midterm: 4.5 },
        { id: '6', studentId: '2505HTTB008', name: 'Bùi Đức Duy', class: '25HTTB02', attendance: 5.0, midterm: 3.5 }
      ]
    },
    {
      code: 'LIF2113',
      name: 'Mạng máy tính và truyền thông',
      credits: 3,
      theoryCredits: 2,
      practiceCredits: 1,
      category: 'Cơ sở ngành',
      department: 'Khoa Công nghệ & Quản trị số',
      lecturer: 'ThS. Nguyễn Văn Bình',
      status: 'In Progress',
      statusLabel: 'Đang giảng dạy',
      prerequisites: ['LIF1001 - Tin học đại cương'],
      syllabusOverview: 'Mô hình 7 tầng OSI, TCP/IP, cấu hình định tuyến tĩnh/động, chuyển mạch VLAN và an ninh mạng căn bản trên thiết bị Cisco.',
      avgScore: 6.9,
      passRate: 82,
      failRate: 18,
      studentsBlocked: 12,
      bottleneckSeverity: 'high',
      reason: 'Đang là điều kiện tiên quyết cho học phần An toàn hệ thống thông tin.',
      enrolledStudents: [
        { id: '1', studentId: '2505HTTB012', name: 'Trần Mạnh Hà', class: '25HTTB01', attendance: 9.5, midterm: 8.0 },
        { id: '7', studentId: '2505HTTB007', name: 'Phạm Thành Long', class: '25HTTB01', attendance: 7.0, midterm: 5.5 }
      ]
    },
    {
      code: 'ISFI25-2010',
      name: 'Khai phá dữ liệu & Business Intelligence',
      credits: 3,
      theoryCredits: 2,
      practiceCredits: 1,
      category: 'Chuyên ngành',
      department: 'Khoa Công nghệ & Quản trị số',
      lecturer: 'TS. Vũ Minh Tuấn',
      status: 'Open',
      statusLabel: 'Đang mở đăng ký',
      prerequisites: ['LIF2004 - Hệ quản trị CSDL'],
      syllabusOverview: 'Quy trình CRISP-DM, các thuật toán phân lớp, gom cụm (Clustering), luật kết hợp và xây dựng Dashboard phân tích với PowerBI.',
      avgScore: 7.5,
      passRate: 92,
      failRate: 8,
      studentsBlocked: 0,
      bottleneckSeverity: 'low',
      reason: 'Học phần nâng cao chuẩn bị mở lớp cho HK2.',
      enrolledStudents: []
    },
    {
      code: 'ISFI25-2007',
      name: 'Công nghệ phần mềm ứng dụng',
      credits: 3,
      theoryCredits: 2,
      practiceCredits: 1,
      category: 'Chuyên ngành',
      department: 'Khoa Công nghệ & Quản trị số',
      lecturer: 'ThS. Lê Hoàng Long',
      status: 'Completed',
      statusLabel: 'Đã hoàn thành',
      prerequisites: ['LIF2003 - PT&TK HTTT'],
      syllabusOverview: 'Mô hình Agile Scrum, CI/CD, kiểm thử tự động, viết tài liệu đặc tả SRS và quản lý phiên bản với Git/GitHub.',
      avgScore: 7.8,
      passRate: 94,
      failRate: 6,
      studentsBlocked: 0,
      bottleneckSeverity: 'low',
      reason: 'Học phần đã hoàn thành giảng dạy kỳ trước với kết quả tốt.',
      enrolledStudents: []
    }
  ]);

  // Department Dataset
  const [departments, setDepartments] = useState<DepartmentItem[]>([
    {
      id: 'dept_1',
      code: 'CN-QTS',
      name: 'Khoa Công nghệ & Quản trị số',
      headOfDept: 'TS. Nguyễn Năng Thành',
      headEmail: 'thanh.nguyen@apag.edu.vn',
      facultyCount: 18,
      studentCount: 520,
      majors: ['Hệ thống thông tin', 'Khoa học dữ liệu', 'Chuyển đổi số công vụ'],
      office: 'P402, Nhà A1 - Trụ sở APAG'
    },
    {
      id: 'dept_2',
      code: 'KT-QTKD',
      name: 'Khoa Quản lý kinh tế & QTKD',
      headOfDept: 'PGS.TS. Trần Đình Thắng',
      headEmail: 'thang.tran@apag.edu.vn',
      facultyCount: 24,
      studentCount: 780,
      majors: ['Quản lý kinh tế', 'Tài chính công', 'Quản trị kinh doanh'],
      office: 'P301, Nhà B - Trụ sở APAG'
    },
    {
      id: 'dept_3',
      code: 'LUAT-QLNN',
      name: 'Khoa Luật & Quản lý nhà nước',
      headOfDept: 'TS. Phạm Quỳnh Trang',
      headEmail: 'trang.pham@apag.edu.vn',
      facultyCount: 20,
      studentCount: 650,
      majors: ['Luật hành chính', 'Quản lý nhà nước', 'Chính sách công'],
      office: 'P204, Nhà A2 - Trụ sở APAG'
    }
  ]);

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Detail Drawer state
  const [selectedCourseDetail, setSelectedCourseDetail] = useState<CourseItem | null>(null);

  // Modals state
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [newCourse, setNewCourse] = useState({
    code: '',
    name: '',
    credits: 3,
    category: 'Chuyên ngành',
    department: 'Khoa Công nghệ & Quản trị số',
    lecturer: 'TS. Nguyễn Năng Thành',
    status: 'Open' as 'Open' | 'In Progress' | 'Completed',
    prerequisites: '',
    syllabusOverview: ''
  });

  const [showDeptModal, setShowDeptModal] = useState(false);
  const [editingDept, setEditingDept] = useState<DepartmentItem | null>(null);

  // Filtered courses
  const filteredCourses = useMemo(() => {
    let list = [...courses];

    if (categoryFilter !== 'all') {
      list = list.filter(c => c.category === categoryFilter);
    }

    if (statusFilter !== 'all') {
      list = list.filter(c => c.status === statusFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(c => 
        c.code.toLowerCase().includes(q) || 
        c.name.toLowerCase().includes(q) ||
        c.lecturer.toLowerCase().includes(q)
      );
    }

    return list;
  }, [courses, categoryFilter, statusFilter, searchQuery]);

  // Handle Export Excel
  const handleExportAnalytics = () => {
    const exportData = courses.map(c => ({
      'Mã HP': c.code,
      'Tên học phần': c.name,
      'Số TC': c.credits,
      'Khối kiến thức': c.category,
      'Khoa quản lý': c.department,
      'Giảng viên': c.lecturer,
      'Trạng thái': c.statusLabel,
      'Học phần tiên quyết': c.prerequisites.join('; '),
      'Điểm TB': c.avgScore,
      'Tỷ lệ Đạt (%)': c.passRate,
      'SV chưa đủ ĐK đăng ký': c.studentsBlocked
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'HocPhan_Danh_Muc');
    XLSX.writeFile(wb, 'APAG_DanhMuc_HocPhan_Va_Khoa.xlsx');
    Utils.showToast('Đã xuất danh mục học phần & khoa chuyên môn thành công!', 'success');
  };

  // Add course submit
  const handleAddCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourse.code || !newCourse.name) return;

    const created: CourseItem = {
      code: newCourse.code.trim().toUpperCase(),
      name: newCourse.name.trim(),
      credits: Number(newCourse.credits),
      category: newCourse.category,
      department: newCourse.department,
      lecturer: newCourse.lecturer,
      status: newCourse.status,
      statusLabel: newCourse.status === 'Open' ? 'Đang mở đăng ký' : newCourse.status === 'In Progress' ? 'Đang giảng dạy' : 'Đã hoàn thành',
      prerequisites: newCourse.prerequisites ? [newCourse.prerequisites] : [],
      syllabusOverview: newCourse.syllabusOverview || 'Đề cương chi tiết theo chuẩn kiểm định chất lượng đào tạo APAG.',
      avgScore: 7.0,
      passRate: 100,
      failRate: 0,
      studentsBlocked: 0,
      bottleneckSeverity: 'low',
      reason: 'Học phần mới được khởi tạo.',
      enrolledStudents: []
    };

    setCourses([created, ...courses]);
    setShowAddCourseModal(false);
    setNewCourse({
      code: '',
      name: '',
      credits: 3,
      category: 'Chuyên ngành',
      department: 'Khoa Công nghệ & Quản trị số',
      lecturer: 'TS. Nguyễn Năng Thành',
      status: 'Open',
      prerequisites: '',
      syllabusOverview: ''
    });
    Utils.showToast(`Đã thêm học phần ${created.code} thành công!`, 'success');
  };

  // Department Edit Submit
  const handleSaveDepartment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDept) return;

    setDepartments(prev => prev.map(d => d.id === editingDept.id ? editingDept : d));
    setShowDeptModal(false);
    setEditingDept(null);
    Utils.showToast('Đã cập nhật thông tin Khoa & Trưởng khoa thành công!', 'success');
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
            className="btn btn-secondary btn-sm"
            onClick={handleExportAnalytics}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Download size={14} />
            <span>Xuất báo cáo Excel</span>
          </button>
          <button 
            type="button" 
            className="btn btn-primary btn-sm"
            onClick={() => setShowAddCourseModal(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Plus size={14} />
            <span>Thêm học phần mới</span>
          </button>
        </div>

      {/* Main Mode Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <button
          type="button"
          onClick={() => setActiveMainTab('courses')}
          style={{
            padding: '8px 16px',
            fontSize: '0.8125rem',
            fontWeight: 600,
            borderRadius: '8px',
            border: activeMainTab === 'courses' ? '1px solid var(--primary)' : '1px solid var(--border)',
            backgroundColor: activeMainTab === 'courses' ? 'var(--primary)' : 'var(--surface)',
            color: activeMainTab === 'courses' ? '#FFFFFF' : 'var(--text-primary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <BookOpen size={14} />
          <span>Danh mục Học phần ({courses.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveMainTab('departments')}
          style={{
            padding: '8px 16px',
            fontSize: '0.8125rem',
            fontWeight: 600,
            borderRadius: '8px',
            border: activeMainTab === 'departments' ? '1px solid var(--primary)' : '1px solid var(--border)',
            backgroundColor: activeMainTab === 'departments' ? 'var(--primary)' : 'var(--surface)',
            color: activeMainTab === 'departments' ? '#FFFFFF' : 'var(--text-primary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Building size={14} />
          <span>Quản lý Khoa / Bộ môn ({departments.length})</span>
        </button>
      </div>

      {/* TAB 1: COURSES CATALOG */}
      {activeMainTab === 'courses' && (
        <>
          {/* Filter Bar */}
          <div 
            className="minimal-card"
            style={{
              padding: '14px 16px',
              borderRadius: '10px',
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', width: '280px' }}>
                <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  className="form-control"
                  placeholder="Tìm kiếm theo Mã HP, Tên học phần, Giảng viên..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ width: '100%', paddingLeft: '32px', fontSize: '0.8125rem', height: '34px', borderRadius: '6px' }}
                />
              </div>

              <select 
                className="form-control"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                style={{ width: 'auto', fontSize: '0.75rem', height: '34px', borderRadius: '6px' }}
              >
                <option value="all">Tất cả khối kiến thức</option>
                <option value="Đại cương">Đại cương</option>
                <option value="Cơ sở ngành">Cơ sở ngành</option>
                <option value="Chuyên ngành">Chuyên ngành</option>
                <option value="Thực tập tốt nghiệp">Thực tập & Khóa luận</option>
              </select>

              <select 
                className="form-control"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{ width: 'auto', fontSize: '0.75rem', height: '34px', borderRadius: '6px' }}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="Open">Đang mở đăng ký</option>
                <option value="In Progress">Đang giảng dạy</option>
                <option value="Completed">Đã hoàn thành</option>
              </select>
            </div>

            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Có <strong>{filteredCourses.length}</strong> học phần
            </div>
          </div>

          {/* Table */}
          <div 
            className="minimal-card"
            style={{
              borderRadius: '10px',
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)',
              overflow: 'hidden'
            }}
          >
            <div className="table-responsive">
              <table className="minimal-table">
                <thead>
                  <tr>
                    <th style={{ width: '100px' }}>MÃ HP</th>
                    <th>TÊN HỌC PHẦN</th>
                    <th style={{ width: '70px' }}>TC</th>
                    <th>GIẢNG VIÊN</th>
                    <th>HỌC PHẦN TIÊN QUYẾT</th>
                    <th style={{ width: '130px' }}>TRẠNG THÁI</th>
                    <th style={{ width: '110px' }}>ĐẠT / CHƯA ĐẠT</th>
                    <th style={{ width: '120px' }}>THAO TÁC</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCourses.map(course => {
                    const statusBadgeClass = course.status === 'Open'
                      ? { bg: 'var(--primary-light)', color: 'var(--primary)', border: 'var(--primary-border)' }
                      : course.status === 'In Progress'
                        ? { bg: 'var(--warning-bg)', color: 'var(--warning-text)', border: 'var(--warning-border)' }
                        : { bg: 'var(--success-bg)', color: 'var(--success)', border: 'var(--success-border)' };

                    return (
                      <tr key={course.code} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td style={{ padding: '10px 12px' }}>
                          <code style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', padding: '2px 6px', borderRadius: '4px', backgroundColor: 'var(--surface-subtle)', border: '1px solid var(--border)' }}>
                            {course.code}
                          </code>
                        </td>

                        <td style={{ padding: '10px 12px' }}>
                          <div 
                            onClick={() => setSelectedCourseDetail(course)}
                            style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer' }}
                          >
                            {course.name}
                          </div>
                          <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                            {course.category} • {course.department}
                          </div>
                        </td>

                        <td style={{ padding: '10px 12px', textAlign: 'center', fontSize: '0.8125rem', fontWeight: 700 }}>
                          {course.credits}
                        </td>

                        <td style={{ padding: '10px 12px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                          {course.lecturer}
                        </td>

                        <td style={{ padding: '10px 12px', fontSize: '0.75rem' }}>
                          {course.prerequisites.length > 0 ? (
                            <span style={{ color: course.studentsBlocked > 0 ? 'var(--danger)' : 'var(--text-secondary)' }}>
                              {course.prerequisites[0]}
                            </span>
                          ) : (
                            <span style={{ color: 'var(--text-muted)' }}>Không</span>
                          )}
                        </td>

                        <td style={{ padding: '10px 12px' }}>
                          <span 
                            style={{
                              fontSize: '0.6875rem',
                              fontWeight: 600,
                              padding: '2px 8px',
                              borderRadius: '999px',
                              backgroundColor: statusBadgeClass.bg,
                              color: statusBadgeClass.color,
                              border: `1px solid ${statusBadgeClass.border}`
                            }}
                          >
                            {course.statusLabel}
                          </span>
                        </td>

                        <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--success)' }}>{course.passRate}%</span>
                          <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}> / </span>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--danger)' }}>{course.failRate}%</span>
                        </td>

                        <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                          <button
                            type="button"
                            className="btn btn-outline btn-xs"
                            onClick={() => setSelectedCourseDetail(course)}
                            style={{ fontSize: '0.6875rem', padding: '3px 8px' }}
                          >
                            Chi tiết
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* TAB 2: DEPARTMENTS MANAGEMENT */}
      {activeMainTab === 'departments' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '16px' }}>
          {departments.map(dept => (
            <div 
              key={dept.id}
              className="minimal-card"
              style={{
                padding: '20px',
                borderRadius: '10px',
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--primary)', backgroundColor: 'var(--primary-light)', padding: '2px 6px', borderRadius: '4px' }}>
                    {dept.code}
                  </span>
                  <button 
                    type="button"
                    className="btn btn-ghost btn-xs"
                    onClick={() => {
                      setEditingDept(dept);
                      setShowDeptModal(true);
                    }}
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    <Edit3 size={14} /> Sửa
                  </button>
                </div>

                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: '4px 0 12px' }}>
                  {dept.name}
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <UserCheck size={14} className="text-primary" />
                    <span>Trưởng khoa: <strong style={{ color: 'var(--text-primary)' }}>{dept.headOfDept}</strong></span>
                  </div>
                  <div>Email: <strong>{dept.headEmail}</strong></div>
                  <div>Văn phòng: <strong>{dept.office}</strong></div>
                </div>

                <div style={{ display: 'flex', gap: '12px', padding: '10px', backgroundColor: 'var(--surface-subtle)', borderRadius: '8px', border: '1px solid var(--border)', textAlign: 'center', marginBottom: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Giảng viên</div>
                    <div style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)' }}>{dept.facultyCount}</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Sinh viên</div>
                    <div style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--primary)' }}>{dept.studentCount}</div>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Chuyên ngành đào tạo:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {dept.majors.map((m, i) => (
                      <span key={i} style={{ fontSize: '0.6875rem', padding: '2px 6px', borderRadius: '4px', backgroundColor: 'var(--surface-subtle)', border: '1px solid var(--border)' }}>
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ====================================================================
          COURSE DETAIL DRAWER (SYLLABUS, PREREQUISITES, ENROLLED STUDENTS)
          ==================================================================== */}
      {selectedCourseDetail && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.35)',
            backdropFilter: 'blur(2px)',
            zIndex: 11000,
            display: 'flex',
            justifyContent: 'flex-end'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedCourseDetail(null);
          }}
        >
          <div 
            style={{
              width: '520px',
              maxWidth: '100%',
              height: '100%',
              backgroundColor: 'var(--surface)',
              borderLeft: '1px solid var(--border)',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '-4px 0 24px rgba(0,0,0,0.12)'
            }}
          >
            {/* Header */}
            <div style={{ padding: '20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--primary)', backgroundColor: 'var(--primary-light)', padding: '2px 6px', borderRadius: '4px' }}>
                  {selectedCourseDetail.code}
                </span>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', margin: '6px 0 2px' }}>
                  {selectedCourseDetail.name}
                </h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  {selectedCourseDetail.department}
                </span>
              </div>
              <button 
                type="button" 
                onClick={() => setSelectedCourseDetail(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Quick Info Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', textAlign: 'center' }}>
                <div style={{ padding: '10px', borderRadius: '8px', backgroundColor: 'var(--surface-subtle)', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Số tín chỉ</div>
                  <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-primary)' }}>{selectedCourseDetail.credits} TC</div>
                </div>
                <div style={{ padding: '10px', borderRadius: '8px', backgroundColor: 'var(--surface-subtle)', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Trạng thái</div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--primary)', marginTop: '2px' }}>{selectedCourseDetail.statusLabel}</div>
                </div>
                <div style={{ padding: '10px', borderRadius: '8px', backgroundColor: 'var(--surface-subtle)', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Điểm TB</div>
                  <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--primary)' }}>{selectedCourseDetail.avgScore}</div>
                </div>
              </div>

              {/* Lecturer & Prerequisites */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8125rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-subtle)' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Giảng viên phụ trách:</span>
                  <strong style={{ color: 'var(--text-primary)' }}>{selectedCourseDetail.lecturer}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-subtle)' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Khối kiến thức:</span>
                  <strong style={{ color: 'var(--text-primary)' }}>{selectedCourseDetail.category}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-subtle)' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Học phần tiên quyết:</span>
                  <strong style={{ color: selectedCourseDetail.prerequisites.length > 0 ? 'var(--primary)' : 'var(--text-muted)' }}>
                    {selectedCourseDetail.prerequisites.join(', ') || 'Không yêu cầu'}
                  </strong>
                </div>
              </div>

              {/* Syllabus Overview */}
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Tóm tắt Đề cương chi tiết
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5, padding: '12px', borderRadius: '8px', backgroundColor: 'var(--surface-subtle)', border: '1px solid var(--border)' }}>
                  {selectedCourseDetail.syllabusOverview}
                </div>
              </div>

              {/* Enrolled Students List */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                    Sinh viên đăng ký ({selectedCourseDetail.enrolledStudents?.length || 0})
                  </div>
                </div>

                {selectedCourseDetail.enrolledStudents && selectedCourseDetail.enrolledStudents.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {selectedCourseDetail.enrolledStudents.map(std => (
                      <div 
                        key={std.id}
                        style={{
                          padding: '8px 12px',
                          borderRadius: '6px',
                          backgroundColor: 'var(--surface-subtle)',
                          border: '1px solid var(--border)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          fontSize: '0.75rem'
                        }}
                      >
                        <div>
                          <strong>{std.name}</strong> <span style={{ color: 'var(--text-muted)' }}>({std.studentId})</span>
                          <div style={{ color: 'var(--text-secondary)', fontSize: '0.6875rem' }}>Lớp: {std.class}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ color: 'var(--primary)', fontWeight: 700 }}>GK: {std.midterm}</span>
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.6875rem', marginLeft: '6px' }}>CC: {std.attendance}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '16px', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                    Chưa có sinh viên đăng ký cho lớp học phần này.
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end' }}>
              <button 
                type="button" 
                className="btn btn-outline btn-sm"
                onClick={() => setSelectedCourseDetail(null)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL: THÊM HỌC PHẦN MỚI
          ==================================================================== */}
      {showAddCourseModal && (
        <div 
          className="modal-backdrop active"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.45)',
            backdropFilter: 'blur(3px)',
            zIndex: 12000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowAddCourseModal(false);
          }}
        >
          <div 
            style={{
              backgroundColor: 'var(--surface)',
              borderRadius: '12px',
              border: '1px solid var(--border)',
              maxWidth: '520px',
              width: '100%',
              padding: '24px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                Thêm mới học phần vào CTĐT
              </h3>
              <button 
                type="button" 
                onClick={() => setShowAddCourseModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddCourseSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Mã HP *</label>
                    <input 
                      type="text" 
                      className="form-control"
                      placeholder="VD: ISFI25-2015"
                      value={newCourse.code}
                      onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Tên học phần *</label>
                    <input 
                      type="text" 
                      className="form-control"
                      placeholder="VD: Phát triển ứng dụng Web nâng cao"
                      value={newCourse.name}
                      onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Số tín chỉ *</label>
                    <input 
                      type="number" 
                      className="form-control"
                      value={newCourse.credits}
                      min={1}
                      max={10}
                      onChange={(e) => setNewCourse({ ...newCourse, credits: Number(e.target.value) })}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Trạng thái</label>
                    <select 
                      className="form-control"
                      value={newCourse.status}
                      onChange={(e: any) => setNewCourse({ ...newCourse, status: e.target.value })}
                    >
                      <option value="Open">Đang mở đăng ký</option>
                      <option value="In Progress">Đang giảng dạy</option>
                      <option value="Completed">Đã hoàn thành</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Khối kiến thức</label>
                    <select 
                      className="form-control"
                      value={newCourse.category}
                      onChange={(e) => setNewCourse({ ...newCourse, category: e.target.value })}
                    >
                      <option value="Đại cương">Đại cương</option>
                      <option value="Cơ sở ngành">Cơ sở ngành</option>
                      <option value="Chuyên ngành">Chuyên ngành</option>
                      <option value="Thực tập tốt nghiệp">Thực tập & Khóa luận</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Khoa phụ trách</label>
                    <select 
                      className="form-control"
                      value={newCourse.department}
                      onChange={(e) => setNewCourse({ ...newCourse, department: e.target.value })}
                    >
                      <option value="Khoa Công nghệ & Quản trị số">Khoa Công nghệ & Quản trị số</option>
                      <option value="Khoa Quản lý kinh tế & QTKD">Khoa Quản lý kinh tế & QTKD</option>
                      <option value="Khoa Luật & Quản lý nhà nước">Khoa Luật & Quản lý nhà nước</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Học phần tiên quyết (nếu có)</label>
                  <input 
                    type="text" 
                    className="form-control"
                    placeholder="VD: LIF2004 - Hệ quản trị CSDL"
                    value={newCourse.prerequisites}
                    onChange={(e) => setNewCourse({ ...newCourse, prerequisites: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button 
                  type="button" 
                  className="btn btn-outline btn-sm"
                  onClick={() => setShowAddCourseModal(false)}
                >
                  Hủy
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary btn-sm"
                >
                  Thêm học phần
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL: CHỈNH SỬA KHOA / GÁN TRƯỞNG KHOA
          ==================================================================== */}
      {showDeptModal && editingDept && (
        <div 
          className="modal-backdrop active"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.45)',
            backdropFilter: 'blur(3px)',
            zIndex: 12000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowDeptModal(false);
          }}
        >
          <div 
            style={{
              backgroundColor: 'var(--surface)',
              borderRadius: '12px',
              border: '1px solid var(--border)',
              maxWidth: '480px',
              width: '100%',
              padding: '24px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                Cập nhật Khoa & Gán Trưởng khoa
              </h3>
              <button 
                type="button" 
                onClick={() => setShowDeptModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveDepartment}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Tên Khoa</label>
                  <input 
                    type="text" 
                    className="form-control"
                    value={editingDept.name}
                    onChange={(e) => setEditingDept({ ...editingDept, name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Trưởng khoa phụ trách *</label>
                  <input 
                    type="text" 
                    className="form-control"
                    value={editingDept.headOfDept}
                    onChange={(e) => setEditingDept({ ...editingDept, headOfDept: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Email Trưởng khoa</label>
                  <input 
                    type="email" 
                    className="form-control"
                    value={editingDept.headEmail}
                    onChange={(e) => setEditingDept({ ...editingDept, headEmail: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Văn phòng Khoa</label>
                  <input 
                    type="text" 
                    className="form-control"
                    value={editingDept.office}
                    onChange={(e) => setEditingDept({ ...editingDept, office: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button 
                  type="button" 
                  className="btn btn-outline btn-sm"
                  onClick={() => setShowDeptModal(false)}
                >
                  Hủy
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary btn-sm"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCourses;
