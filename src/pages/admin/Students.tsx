// ==========================================================================
// APAG Admin User Directory Component (React + TypeScript)
// Feature 2: Searchable & sortable table, filters, 500px slide-out detail drawer,
// pagination, bulk actions, and full CRUD modals with form validation.
// ==========================================================================

import React, { useState, useMemo } from 'react';
import { 
  Download, 
  UserPlus, 
  Search, 
  X, 
  Mail, 
  Edit3, 
  Trash2, 
  ChevronRight, 
  ChevronLeft, 
  SlidersHorizontal,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  BookOpen,
  Calendar,
  Phone,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Send,
  FileSpreadsheet,
  CheckSquare,
  Square
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { Utils } from '../../utils/utils';
import { MOCK_ALL_STUDENTS, MOCK_USERS } from '../../services/mockData';

export interface DirectoryUser {
  id: string;
  studentId: string;
  fullName: string;
  name: string;
  class: string;
  cohort: string;
  major: string;
  majorName: string;
  faculty: string;
  gpa: number;
  credits: number;
  creditsCompleted?: number;
  advisorName: string;
  status: 'Đang học' | 'Tạm hoãn' | 'Đã tốt nghiệp' | 'Cảnh báo';
  email: string;
  phone?: string;
  hometown?: string;
  role: 'student' | 'lecturer' | 'advisor';
  avatar?: string;
  notes?: string[];
  enrolledCourses?: Array<{
    code: string;
    name: string;
    credits: number;
    grade: string;
    semester: string;
  }>;
}

export const AdminStudents: React.FC = () => {
  // Initial Combined Data (Students + Lecturers/Advisors)
  const [userList, setUserList] = useState<DirectoryUser[]>(() => {
    const rawStudents: any[] = (MOCK_ALL_STUDENTS as any[]) || [];
    const formattedStudents: DirectoryUser[] = rawStudents.map((s, idx) => ({
      id: s.id || `std_${idx + 1}`,
      studentId: s.studentId || `2505HTTB0${idx < 10 ? '0' + idx : idx}`,
      fullName: s.fullName || s.name || `Sinh viên ${idx + 1}`,
      name: s.name || s.fullName || `Sinh viên ${idx + 1}`,
      class: s.class || '25HTTB01',
      cohort: s.cohort || 'K25',
      major: s.major || 'HTTT',
      majorName: s.majorName || 'Hệ thống thông tin',
      faculty: s.faculty || 'Khoa Công nghệ & Quản trị số',
      gpa: Number(s.gpa || 3.2),
      credits: Number(s.credits || s.creditsCompleted || 72),
      advisorName: s.advisorName || 'TS. Nguyễn Năng Thành',
      status: s.status === 'Bình thường' || s.status === 'Đang học' ? 'Đang học' : s.riskLevel === 'critical' ? 'Cảnh báo' : 'Đang học',
      email: s.email || `sv_${s.studentId?.toLowerCase()}@apag.edu.vn`,
      phone: s.phone || '0988 123 456',
      hometown: s.hometown || 'Hà Nội',
      role: 'student',
      avatar: s.avatar || '/assets/images/default-avatar.png',
      notes: [
        'Hồ sơ học vụ đầy đủ, đã nộp chuẩn ngoại ngữ B1.',
        'Đạt thành tích giải Nhì cuộc thi Olympic Tin học Học viện 2024.'
      ],
      enrolledCourses: [
        { code: 'LIF2003', name: 'Phân tích & Thiết kế HTTT', credits: 3, grade: '8.5', semester: 'HK1 (24-25)' },
        { code: 'LIF2113', name: 'Mạng máy tính & Truyền thông', credits: 3, grade: '8.0', semester: 'HK1 (24-25)' },
        { code: 'LIF2020', name: 'Lập trình Web Doanh nghiệp', credits: 3, grade: '8.2', semester: 'HK1 (24-25)' },
        { code: 'ISFI25-2007', name: 'Công nghệ phần mềm ứng dụng', credits: 3, grade: '8.8', semester: 'HK1 (24-25)' }
      ]
    }));

    // Add Mock Faculty/Advisor Users
    const facultyUsers: DirectoryUser[] = [
      {
        id: 'fac_1',
        studentId: 'GV001',
        fullName: 'TS. Nguyễn Năng Thành',
        name: 'TS. Nguyễn Năng Thành',
        class: 'Cố vấn 25HTTB01',
        cohort: 'Giảng viên',
        major: 'HTTT',
        majorName: 'Hệ thống thông tin',
        faculty: 'Khoa Công nghệ & Quản trị số',
        gpa: 4.0,
        credits: 120,
        advisorName: 'Trưởng bộ môn',
        status: 'Đang học',
        email: 'thanh.nguyen@apag.edu.vn',
        phone: '0903 888 999',
        hometown: 'Hà Nội',
        role: 'advisor',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces',
        notes: ['Phụ trách 44 sinh viên lớp 25HTTB01.', 'Đã hoàn thành đánh giá giữa kỳ.']
      },
      {
        id: 'fac_2',
        studentId: 'GV002',
        fullName: 'ThS. Nguyễn Văn Bình',
        name: 'ThS. Nguyễn Văn Bình',
        class: 'Giảng viên',
        cohort: 'Giảng viên',
        major: 'CNTT',
        majorName: 'Mạng máy tính',
        faculty: 'Khoa Công nghệ & Quản trị số',
        gpa: 4.0,
        credits: 120,
        advisorName: 'Bộ môn Mạng',
        status: 'Đang học',
        email: 'binh.nguyen@apag.edu.vn',
        phone: '0912 456 789',
        hometown: 'Đà Nẵng',
        role: 'lecturer',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces',
        notes: ['Giảng dạy học phần Mạng máy tính & An toàn thông tin.']
      }
    ];

    return [...formattedStudents, ...facultyUsers];
  });

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [roleTab, setRoleTab] = useState<'all' | 'student' | 'faculty'>('all');
  const [selectedFaculty, setSelectedFaculty] = useState('all');
  const [selectedCohort, setSelectedCohort] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Sorting State
  const [sortField, setSortField] = useState<'studentId' | 'fullName' | 'gpa' | 'credits' | 'cohort'>('studentId');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Selection & Bulk Actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // 500px Detail Drawer State
  const [drawerUser, setDrawerUser] = useState<DirectoryUser | null>(null);
  const [drawerActiveTab, setDrawerActiveTab] = useState<'profile' | 'courses' | 'notes'>('profile');
  const [newNoteText, setNewNoteText] = useState('');

  // Modals State
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<DirectoryUser | null>(null);
  const [deletingUser, setDeletingUser] = useState<DirectoryUser | null>(null);

  // New Student Form State
  const [newUserForm, setNewUserForm] = useState({
    studentId: '',
    fullName: '',
    role: 'student' as 'student' | 'advisor' | 'lecturer',
    class: '25HTTB01',
    cohort: 'K25',
    faculty: 'Khoa Công nghệ & Quản trị số',
    majorName: 'Hệ thống thông tin',
    email: '',
    phone: '',
    gpa: '3.20',
    credits: '72'
  });

  // Handle Sort Toggle
  const handleSort = (field: 'studentId' | 'fullName' | 'gpa' | 'credits' | 'cohort') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Filtered & Sorted Users
  const filteredUsers = useMemo(() => {
    let list = [...userList];

    // Filter by Role Tab
    if (roleTab === 'student') {
      list = list.filter(u => u.role === 'student');
    } else if (roleTab === 'faculty') {
      list = list.filter(u => u.role === 'advisor' || u.role === 'lecturer');
    }

    // Filter by Faculty
    if (selectedFaculty !== 'all') {
      list = list.filter(u => u.faculty === selectedFaculty);
    }

    // Filter by Cohort
    if (selectedCohort !== 'all') {
      list = list.filter(u => u.cohort === selectedCohort);
    }

    // Filter by Status
    if (selectedStatus !== 'all') {
      list = list.filter(u => u.status === selectedStatus);
    }

    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(u => 
        u.fullName.toLowerCase().includes(q) ||
        u.studentId.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.class.toLowerCase().includes(q)
      );
    }

    // Sort
    list.sort((a, b) => {
      let valA: any = a[sortField];
      let valB: any = b[sortField];

      if (typeof valA === 'string') {
        return sortOrder === 'asc' 
          ? valA.localeCompare(valB) 
          : valB.localeCompare(valA);
      }
      return sortOrder === 'asc' ? valA - valB : valB - valA;
    });

    return list;
  }, [userList, roleTab, selectedFaculty, selectedCohort, selectedStatus, searchQuery, sortField, sortOrder]);

  // Paginated Slices
  const totalPages = Math.ceil(filteredUsers.length / pageSize) || 1;
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, currentPage, pageSize]);

  // Toggle Single Selection
  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // Toggle Select All on Current Page
  const handleSelectAllCurrentPage = () => {
    const currentIds = paginatedUsers.map(u => u.id);
    const allSelected = currentIds.every(id => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds(prev => prev.filter(id => !currentIds.includes(id)));
    } else {
      setSelectedIds(prev => Array.from(new Set([...prev, ...currentIds])));
    }
  };

  // Export to Excel / CSV
  const handleExportExcel = () => {
    const exportData = (selectedIds.length > 0 
      ? userList.filter(u => selectedIds.includes(u.id))
      : filteredUsers
    ).map(u => ({
      'Mã ĐD': u.studentId,
      'Họ và tên': u.fullName,
      'Vai trò': u.role === 'student' ? 'Sinh viên' : 'Giảng viên / CVHT',
      'Lớp / Bộ môn': u.class,
      'Khoa chuyên môn': u.faculty,
      'Khóa': u.cohort,
      'GPA Tích lũy': u.gpa,
      'Tín chỉ': u.credits,
      'Trạng thái': u.status,
      'Email': u.email,
      'Số điện thoại': u.phone || ''
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Danh_Sach_Nguoi_Dung');
    XLSX.writeFile(wb, 'APAG_SIS_Danh_Sach_Nguoi_Dung.xlsx');
    Utils.showToast(`Đã xuất ${exportData.length} bản ghi người dùng thành công!`, 'success');
  };

  // Handle Bulk Email
  const handleBulkEmail = () => {
    if (selectedIds.length === 0) {
      Utils.showToast('Vui lòng chọn ít nhất một người dùng để gửi thông báo!', 'warning');
      return;
    }
    Utils.showToast(`Đã mở giao diện gửi thông báo tới ${selectedIds.length} người dùng được chọn.`, 'info');
  };

  // Add User Submission
  const handleAddUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserForm.studentId || !newUserForm.fullName || !newUserForm.email) {
      Utils.showToast('Vui lòng điền đầy đủ các thông tin bắt buộc!', 'warning');
      return;
    }

    const created: DirectoryUser = {
      id: `usr_${Date.now()}`,
      studentId: newUserForm.studentId.trim().toUpperCase(),
      fullName: newUserForm.fullName.trim(),
      name: newUserForm.fullName.trim(),
      role: newUserForm.role,
      class: newUserForm.class,
      cohort: newUserForm.cohort,
      faculty: newUserForm.faculty,
      major: 'HTTT',
      majorName: newUserForm.majorName,
      email: newUserForm.email.trim(),
      phone: newUserForm.phone || '0988 000 111',
      gpa: parseFloat(newUserForm.gpa) || 3.0,
      credits: parseInt(newUserForm.credits) || 70,
      advisorName: 'TS. Nguyễn Năng Thành',
      status: 'Đang học',
      notes: ['Tài khoản mới được tạo bởi Quản trị viên hệ thống.']
    };

    setUserList([created, ...userList]);
    setShowAddModal(false);
    setNewUserForm({
      studentId: '',
      fullName: '',
      role: 'student',
      class: '25HTTB01',
      cohort: 'K25',
      faculty: 'Khoa Công nghệ & Quản trị số',
      majorName: 'Hệ thống thông tin',
      email: '',
      phone: '',
      gpa: '3.20',
      credits: '72'
    });
    Utils.showToast(`Đã thêm mới người dùng ${created.fullName} (${created.studentId})!`, 'success');
  };

  // Edit User Submission
  const handleEditUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    setUserList(prev => prev.map(u => u.id === editingUser.id ? editingUser : u));
    if (drawerUser && drawerUser.id === editingUser.id) {
      setDrawerUser(editingUser);
    }
    setEditingUser(null);
    Utils.showToast('Đã cập nhật thông tin người dùng thành công!', 'success');
  };

  // Delete User Confirmation
  const handleConfirmDelete = () => {
    if (!deletingUser) return;
    setUserList(prev => prev.filter(u => u.id !== deletingUser.id));
    if (drawerUser && drawerUser.id === deletingUser.id) {
      setDrawerUser(null);
    }
    setSelectedIds(prev => prev.filter(id => id !== deletingUser.id));
    setDeletingUser(null);
    Utils.showToast('Đã xóa hồ sơ người dùng khỏi hệ thống!', 'success');
  };

  // Add Note in Drawer
  const handleAddDrawerNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!drawerUser || !newNoteText.trim()) return;

    const updatedUser = {
      ...drawerUser,
      notes: [...(drawerUser.notes || []), `[${new Date().toLocaleDateString('vi-VN')}] ${newNoteText.trim()}`]
    };

    setUserList(prev => prev.map(u => u.id === drawerUser.id ? updatedUser : u));
    setDrawerUser(updatedUser);
    setNewNoteText('');
    Utils.showToast('Đã lưu ghi chú cố vấn học tập!', 'success');
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
            className="btn btn-secondary btn-sm"
            onClick={handleExportExcel}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Download size={14} />
            <span>Xuất Excel ({selectedIds.length > 0 ? selectedIds.length : filteredUsers.length})</span>
          </button>

          {selectedIds.length > 0 && (
            <button 
              type="button" 
              className="btn btn-outline btn-sm"
              onClick={handleBulkEmail}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Mail size={14} />
              <span>Gửi thông báo ({selectedIds.length})</span>
            </button>
          )}

          <button 
            type="button" 
            className="btn btn-primary btn-sm"
            onClick={() => setShowAddModal(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <UserPlus size={14} />
            <span>Thêm người dùng mới</span>
          </button>
        </div>
      </div>

      {/* Role Segmented Tabs & Filters Bar */}
      <div 
        className="minimal-card"
        style={{
          padding: '14px 16px',
          borderRadius: '10px',
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--border)',
          marginBottom: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}
      >
        {/* Top Filter Controls: Role Tabs + Global Search */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          {/* Segmented Control */}
          <div style={{ display: 'inline-flex', padding: '3px', borderRadius: '8px', backgroundColor: 'var(--surface-subtle)', border: '1px solid var(--border)' }}>
            <button
              type="button"
              onClick={() => { setRoleTab('all'); setCurrentPage(1); }}
              style={{
                padding: '5px 12px',
                fontSize: '0.75rem',
                fontWeight: 600,
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: roleTab === 'all' ? 'var(--surface)' : 'transparent',
                color: roleTab === 'all' ? 'var(--primary)' : 'var(--text-secondary)',
                boxShadow: roleTab === 'all' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none'
              }}
            >
              Tất cả ({userList.length})
            </button>
            <button
              type="button"
              onClick={() => { setRoleTab('student'); setCurrentPage(1); }}
              style={{
                padding: '5px 12px',
                fontSize: '0.75rem',
                fontWeight: 600,
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: roleTab === 'student' ? 'var(--surface)' : 'transparent',
                color: roleTab === 'student' ? 'var(--primary)' : 'var(--text-secondary)',
                boxShadow: roleTab === 'student' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none'
              }}
            >
              Sinh viên ({userList.filter(u => u.role === 'student').length})
            </button>
            <button
              type="button"
              onClick={() => { setRoleTab('faculty'); setCurrentPage(1); }}
              style={{
                padding: '5px 12px',
                fontSize: '0.75rem',
                fontWeight: 600,
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: roleTab === 'faculty' ? 'var(--surface)' : 'transparent',
                color: roleTab === 'faculty' ? 'var(--primary)' : 'var(--text-secondary)',
                boxShadow: roleTab === 'faculty' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none'
              }}
            >
              Giảng viên & Cố vấn ({userList.filter(u => u.role !== 'student').length})
            </button>
          </div>

          {/* Search Input */}
          <div style={{ position: 'relative', width: '320px', maxWidth: '100%' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              className="form-control"
              placeholder="Tìm theo Tên, MSSV, Email, Lớp..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              style={{ width: '100%', paddingLeft: '32px', fontSize: '0.8125rem', height: '34px', borderRadius: '6px', backgroundColor: 'var(--surface-subtle)', border: '1px solid var(--border)' }}
            />
            {searchQuery && (
              <button 
                type="button"
                onClick={() => setSearchQuery('')}
                style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={13} />
              </button>
            )}
          </div>
        </div>

        {/* Second Row: Specific Filters */}
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '10px', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <SlidersHorizontal size={13} /> Lọc theo:
          </span>

          {/* Faculty Select */}
          <select 
            className="form-control"
            value={selectedFaculty}
            onChange={(e) => { setSelectedFaculty(e.target.value); setCurrentPage(1); }}
            style={{ width: 'auto', minWidth: '180px', fontSize: '0.75rem', height: '30px', padding: '2px 8px', borderRadius: '6px' }}
          >
            <option value="all">Tất cả Khoa chuyên môn</option>
            <option value="Khoa Công nghệ & Quản trị số">Khoa Công nghệ & Quản trị số</option>
            <option value="Khoa Quản lý kinh tế & QTKD">Khoa Kinh tế & QTKD</option>
            <option value="Khoa Luật & QLNN">Khoa Luật & QLNN</option>
          </select>

          {/* Cohort Select */}
          <select 
            className="form-control"
            value={selectedCohort}
            onChange={(e) => { setSelectedCohort(e.target.value); setCurrentPage(1); }}
            style={{ width: 'auto', fontSize: '0.75rem', height: '30px', padding: '2px 8px', borderRadius: '6px' }}
          >
            <option value="all">Tất cả Khóa</option>
            <option value="K25">Khóa 25 (2022)</option>
            <option value="K24">Khóa 24 (2021)</option>
            <option value="K23">Khóa 23 (2020)</option>
            <option value="Giảng viên">Giảng viên / CVHT</option>
          </select>

          {/* Status Select */}
          <select 
            className="form-control"
            value={selectedStatus}
            onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
            style={{ width: 'auto', fontSize: '0.75rem', height: '30px', padding: '2px 8px', borderRadius: '6px' }}
          >
            <option value="all">Tất cả Trạng thái</option>
            <option value="Đang học">Đang học</option>
            <option value="Cảnh báo">Cảnh báo học vụ</option>
            <option value="Tạm hoãn">Tạm hoãn</option>
            <option value="Đã tốt nghiệp">Đã tốt nghiệp</option>
          </select>

          {(selectedFaculty !== 'all' || selectedCohort !== 'all' || selectedStatus !== 'all' || searchQuery) && (
            <button
              type="button"
              className="btn btn-outline btn-xs"
              onClick={() => {
                setSelectedFaculty('all');
                setSelectedCohort('all');
                setSelectedStatus('all');
                setSearchQuery('');
                setCurrentPage(1);
              }}
              style={{ fontSize: '0.75rem', height: '28px', color: 'var(--text-muted)' }}
            >
              Đặt lại bộ lọc
            </button>
          )}

          <div style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Hiển thị <strong>{filteredUsers.length}</strong> kết quả
          </div>
        </div>
      </div>

      {/* Main Table Card */}
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
                <th style={{ width: '40px', textAlign: 'center' }}>
                  <input 
                    type="checkbox"
                    checked={paginatedUsers.length > 0 && paginatedUsers.every(u => selectedIds.includes(u.id))}
                    onChange={handleSelectAllCurrentPage}
                    style={{ cursor: 'pointer' }}
                  />
                </th>
                <th 
                  onClick={() => handleSort('studentId')}
                  style={{ cursor: 'pointer' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                    <span>MÃ ĐỊNH DANH</span>
                    {sortField === 'studentId' ? (sortOrder === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />) : <ArrowUpDown size={12} className="text-muted" />}
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('fullName')}
                  style={{ cursor: 'pointer' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                    <span>HỌ VÀ TÊN</span>
                    {sortField === 'fullName' ? (sortOrder === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />) : <ArrowUpDown size={12} className="text-muted" />}
                  </div>
                </th>
                <th>LỚP / BỘ MÔN</th>
                <th>KHOA CHUYÊN MÔN</th>
                <th 
                  onClick={() => handleSort('gpa')}
                  style={{ cursor: 'pointer' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                    <span>GPA</span>
                    {sortField === 'gpa' ? (sortOrder === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />) : <ArrowUpDown size={12} className="text-muted" />}
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('credits')}
                  style={{ cursor: 'pointer' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                    <span>TÍN CHỈ</span>
                    {sortField === 'credits' ? (sortOrder === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />) : <ArrowUpDown size={12} className="text-muted" />}
                  </div>
                </th>
                <th style={{ width: '130px' }}>TRẠNG THÁI</th>
                <th style={{ width: '110px' }}>THAO TÁC</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
                    Không tìm thấy người dùng nào phù hợp với điều kiện tìm kiếm.
                  </td>
                </tr>
              ) : (
                paginatedUsers.map(user => {
                  const isSelected = selectedIds.includes(user.id);
                  return (
                    <tr 
                      key={user.id}
                      style={{
                        borderBottom: '1px solid var(--border-subtle)',
                        backgroundColor: isSelected ? 'var(--primary-light)' : 'transparent',
                        transition: 'background-color 100ms ease'
                      }}
                    >
                      <td style={{ textAlign: 'center', padding: '10px' }}>
                        <input 
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelect(user.id)}
                          style={{ cursor: 'pointer' }}
                        />
                      </td>

                      <td style={{ padding: '10px 12px' }}>
                        <code style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', padding: '2px 6px', borderRadius: '4px', backgroundColor: 'var(--surface-subtle)', border: '1px solid var(--border)' }}>
                          {user.studentId}
                        </code>
                      </td>

                      <td style={{ padding: '10px 12px' }}>
                        <div 
                          onClick={() => setDrawerUser(user)}
                          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
                        >
                          <img 
                            src={user.avatar || '/assets/images/default-avatar.png'} 
                            alt={user.fullName}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/assets/images/default-avatar.png';
                            }}
                            style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border)' }}
                          />
                          <div>
                            <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                              {user.fullName}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td style={{ padding: '10px 12px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        {user.class}
                      </td>

                      <td style={{ padding: '10px 12px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        {user.faculty}
                      </td>

                      <td style={{ padding: '10px 12px', textAlign: 'right', fontSize: '0.8125rem', fontWeight: 700, color: user.gpa < 2.0 ? 'var(--danger)' : 'var(--primary)' }}>
                        {user.role === 'student' ? user.gpa.toFixed(2) : '-'}
                      </td>

                      <td style={{ padding: '10px 12px', textAlign: 'right', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        {user.role === 'student' ? `${user.credits} / 120` : '-'}
                      </td>

                      <td style={{ padding: '10px 12px' }}>
                        <span 
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            padding: '2px 8px',
                            borderRadius: '999px',
                            backgroundColor: user.status === 'Đang học' 
                              ? 'var(--success-bg)' 
                              : user.status === 'Cảnh báo' 
                                ? 'var(--danger-bg)' 
                                : 'var(--surface-subtle)',
                            color: user.status === 'Đang học' 
                              ? 'var(--success)' 
                              : user.status === 'Cảnh báo' 
                                ? 'var(--danger)' 
                                : 'var(--text-muted)',
                            border: `1px solid ${user.status === 'Đang học' ? 'var(--success-border)' : user.status === 'Cảnh báo' ? 'var(--danger-border)' : 'var(--border)'}`
                          }}
                        >
                          {user.status}
                        </span>
                      </td>

                      <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <button
                            type="button"
                            className="btn btn-outline btn-xs"
                            onClick={() => setDrawerUser(user)}
                            title="Xem chi tiết hồ sơ (500px Drawer)"
                            style={{ padding: '3px 8px', fontSize: '0.75rem' }}
                          >
                            Chi tiết
                          </button>
                          <button
                            type="button"
                            className="btn btn-ghost btn-xs"
                            onClick={() => setEditingUser(user)}
                            title="Sửa thông tin"
                            style={{ padding: '4px', color: 'var(--text-secondary)' }}
                          >
                            <Edit3 size={13} />
                          </button>
                          <button
                            type="button"
                            className="btn btn-ghost btn-xs"
                            onClick={() => setDeletingUser(user)}
                            title="Xóa người dùng"
                            style={{ padding: '4px', color: 'var(--danger)' }}
                          >
                            <Trash2 size={13} />
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

        {/* Pagination Bar */}
        <div 
          style={{
            padding: '12px 16px',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.75rem',
            color: 'var(--text-secondary)'
          }}
        >
          <div>
            Đang hiển thị <strong>{paginatedUsers.length}</strong> trên tổng số <strong>{filteredUsers.length}</strong> bản ghi
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              type="button"
              className="btn btn-outline btn-xs"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              style={{ display: 'flex', alignItems: 'center', gap: '4px', opacity: currentPage === 1 ? 0.5 : 1 }}
            >
              <ChevronLeft size={13} /> Trước
            </button>

            {Array.from({ length: totalPages }, (_, idx) => idx + 1).slice(
              Math.max(0, currentPage - 3),
              Math.min(totalPages, currentPage + 2)
            ).map(pg => (
              <button
                key={pg}
                type="button"
                onClick={() => setCurrentPage(pg)}
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontWeight: pg === currentPage ? 700 : 500,
                  border: pg === currentPage ? '1px solid var(--primary)' : '1px solid var(--border)',
                  backgroundColor: pg === currentPage ? 'var(--primary)' : 'transparent',
                  color: pg === currentPage ? '#FFFFFF' : 'var(--text-primary)',
                  cursor: 'pointer'
                }}
              >
                {pg}
              </button>
            ))}

            <button
              type="button"
              className="btn btn-outline btn-xs"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              style={{ display: 'flex', alignItems: 'center', gap: '4px', opacity: currentPage === totalPages ? 0.5 : 1 }}
            >
              Sau <ChevronRight size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* ====================================================================
          500PX SLIDE-OUT DETAIL DRAWER (PROGRESSIVE DISCLOSURE)
          ==================================================================== */}
      {drawerUser && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.35)',
            backdropFilter: 'blur(2px)',
            zIndex: 11000,
            display: 'flex',
            justifyContent: 'flex-end',
            transition: 'opacity 150ms ease'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setDrawerUser(null);
          }}
        >
          <div 
            style={{
              width: '500px',
              maxWidth: '100%',
              height: '100%',
              backgroundColor: 'var(--surface)',
              borderLeft: '1px solid var(--border)',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '-4px 0 24px rgba(0,0,0,0.12)'
            }}
          >
            {/* Drawer Header */}
            <div 
              style={{
                padding: '20px',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img 
                  src={drawerUser.avatar || '/assets/images/default-avatar.png'} 
                  alt={drawerUser.fullName}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/assets/images/default-avatar.png';
                  }}
                  style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border)' }}
                />
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                    {drawerUser.fullName}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                    <code style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)' }}>
                      {drawerUser.studentId}
                    </code>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>• {drawerUser.class}</span>
                  </div>
                </div>
              </div>

              <button 
                type="button" 
                onClick={() => setDrawerUser(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '6px' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Drawer Navigation Tabs */}
            <div 
              style={{
                display: 'flex',
                borderBottom: '1px solid var(--border)',
                backgroundColor: 'var(--surface-subtle)',
                padding: '0 20px'
              }}
            >
              <button
                type="button"
                onClick={() => setDrawerActiveTab('profile')}
                style={{
                  padding: '10px 14px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  border: 'none',
                  borderBottom: drawerActiveTab === 'profile' ? '2px solid var(--primary)' : '2px solid transparent',
                  backgroundColor: 'transparent',
                  color: drawerActiveTab === 'profile' ? 'var(--primary)' : 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
              >
                Hồ sơ & Liên hệ
              </button>

              <button
                type="button"
                onClick={() => setDrawerActiveTab('courses')}
                style={{
                  padding: '10px 14px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  border: 'none',
                  borderBottom: drawerActiveTab === 'courses' ? '2px solid var(--primary)' : '2px solid transparent',
                  backgroundColor: 'transparent',
                  color: drawerActiveTab === 'courses' ? 'var(--primary)' : 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
              >
                Học phần & Điểm đánh giá
              </button>

              <button
                type="button"
                onClick={() => setDrawerActiveTab('notes')}
                style={{
                  padding: '10px 14px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  border: 'none',
                  borderBottom: drawerActiveTab === 'notes' ? '2px solid var(--primary)' : '2px solid transparent',
                  backgroundColor: 'transparent',
                  color: drawerActiveTab === 'notes' ? 'var(--primary)' : 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
              >
                Ghi chú Cố vấn ({drawerUser.notes?.length || 0})
              </button>
            </div>

            {/* Drawer Body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {drawerActiveTab === 'profile' && (
                <>
                  {/* Academic Status Card */}
                  <div style={{ padding: '14px', borderRadius: '8px', backgroundColor: 'var(--surface-subtle)', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px' }}>
                      Chỉ số học tập hiện tại
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', textAlign: 'center' }}>
                      <div style={{ padding: '8px', borderRadius: '6px', backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>GPA Tích lũy</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>{drawerUser.gpa.toFixed(2)}</div>
                      </div>
                      <div style={{ padding: '8px', borderRadius: '6px', backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Tín chỉ</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>{drawerUser.credits} / 120</div>
                      </div>
                      <div style={{ padding: '8px', borderRadius: '6px', backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Trạng thái</div>
                        <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--success)', marginTop: '4px' }}>{drawerUser.status}</div>
                      </div>
                    </div>
                  </div>

                  {/* Profile Details List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.8125rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-subtle)' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Khoa chuyên môn:</span>
                      <strong style={{ color: 'var(--text-primary)' }}>{drawerUser.faculty}</strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-subtle)' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Chuyên ngành:</span>
                      <strong style={{ color: 'var(--text-primary)' }}>{drawerUser.majorName}</strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-subtle)' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Khóa tuyển sinh:</span>
                      <strong style={{ color: 'var(--text-primary)' }}>{drawerUser.cohort}</strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-subtle)' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Cố vấn học tập:</span>
                      <strong style={{ color: 'var(--primary)' }}>{drawerUser.advisorName}</strong>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div style={{ marginTop: '8px' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', marginBottom: '8px' }}>
                      Thông tin liên lạc
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Mail size={14} className="text-primary" />
                        <span>Email: <strong style={{ color: 'var(--text-primary)' }}>{drawerUser.email}</strong></span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Phone size={14} className="text-primary" />
                        <span>Điện thoại: <strong style={{ color: 'var(--text-primary)' }}>{drawerUser.phone}</strong></span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <MapPin size={14} className="text-primary" />
                        <span>Quê quán / Địa chỉ: <strong style={{ color: 'var(--text-primary)' }}>{drawerUser.hometown}</strong></span>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {drawerActiveTab === 'courses' && (
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '10px' }}>
                    Danh sách học phần đang học & Điểm số
                  </div>

                  {drawerUser.enrolledCourses && drawerUser.enrolledCourses.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {drawerUser.enrolledCourses.map(course => (
                        <div 
                          key={course.code}
                          style={{
                            padding: '10px 12px',
                            borderRadius: '8px',
                            backgroundColor: 'var(--surface-subtle)',
                            border: '1px solid var(--border)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}
                        >
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', fontFamily: 'monospace' }}>
                                {course.code}
                              </span>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>• {course.credits} TC</span>
                            </div>
                            <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
                              {course.name}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                              {course.semester}
                            </div>
                          </div>

                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--primary)' }}>
                              {course.grade}
                            </div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 600 }}>Quá trình</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
                      Chưa có dữ liệu học phần học kỳ hiện tại.
                    </div>
                  )}
                </div>
              )}

              {drawerActiveTab === 'notes' && (
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '10px' }}>
                    Nhật ký hỗ trợ học tập & Đánh giá Cố vấn
                  </div>

                  {/* Notes Timeline */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                    {(drawerUser.notes || []).map((note, idx) => (
                      <div 
                        key={idx}
                        style={{
                          padding: '10px 12px',
                          borderRadius: '8px',
                          backgroundColor: 'var(--surface-subtle)',
                          border: '1px solid var(--border)',
                          fontSize: '0.75rem',
                          color: 'var(--text-primary)',
                          lineHeight: 1.4
                        }}
                      >
                        {note}
                      </div>
                    ))}
                  </div>

                  {/* Add Note Form */}
                  <form onSubmit={handleAddDrawerNote}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>
                      Thêm ghi chú cố vấn mới:
                    </label>
                    <textarea 
                      className="form-control"
                      rows={3}
                      placeholder="Nhập nội dung trao đổi, tư vấn hoặc cảnh báo học vụ..."
                      value={newNoteText}
                      onChange={(e) => setNewNoteText(e.target.value)}
                      style={{ width: '100%', fontSize: '0.8125rem', borderRadius: '6px', marginBottom: '8px' }}
                    />
                    <button 
                      type="submit" 
                      className="btn btn-primary btn-sm"
                      style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                    >
                      <Send size={13} />
                      <span>Lưu ghi chú vào hồ sơ</span>
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* Drawer Footer Actions */}
            <div 
              style={{
                padding: '16px 20px',
                borderTop: '1px solid var(--border)',
                backgroundColor: 'var(--surface-subtle)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <button 
                type="button" 
                className="btn btn-outline btn-sm"
                onClick={() => setDrawerUser(null)}
              >
                Đóng
              </button>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  type="button" 
                  className="btn btn-outline btn-sm"
                  onClick={() => {
                    const u = drawerUser;
                    setDrawerUser(null);
                    setEditingUser(u);
                  }}
                  style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <Edit3 size={13} /> Chỉnh sửa
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    Utils.showToast(`Đã gửi email học vụ tới ${drawerUser.email}`, 'success');
                  }}
                  style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <Mail size={13} /> Gửi Email
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL: THÊM MỚI NGƯỜI DÙNG (ADD USER)
          ==================================================================== */}
      {showAddModal && (
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
            if (e.target === e.currentTarget) setShowAddModal(false);
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
                Thêm mới người dùng vào hệ thống APAG
              </h3>
              <button 
                type="button" 
                onClick={() => setShowAddModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddUserSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                      Mã định danh (MSSV / MSG) *
                    </label>
                    <input 
                      type="text" 
                      className="form-control"
                      placeholder="VD: 2505HTTB099"
                      value={newUserForm.studentId}
                      onChange={(e) => setNewUserForm({ ...newUserForm, studentId: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                      Vai trò người dùng *
                    </label>
                    <select 
                      className="form-control"
                      value={newUserForm.role}
                      onChange={(e: any) => setNewUserForm({ ...newUserForm, role: e.target.value })}
                    >
                      <option value="student">Sinh viên</option>
                      <option value="advisor">Cố vấn học tập</option>
                      <option value="lecturer">Giảng viên</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                    Họ và tên đầy đủ *
                  </label>
                  <input 
                    type="text" 
                    className="form-control"
                    placeholder="VD: Nguyễn Thành Nam"
                    value={newUserForm.fullName}
                    onChange={(e) => setNewUserForm({ ...newUserForm, fullName: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                      Email học viện *
                    </label>
                    <input 
                      type="email" 
                      className="form-control"
                      placeholder="name@apag.edu.vn"
                      value={newUserForm.email}
                      onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                      Số điện thoại
                    </label>
                    <input 
                      type="text" 
                      className="form-control"
                      placeholder="0912 345 678"
                      value={newUserForm.phone}
                      onChange={(e) => setNewUserForm({ ...newUserForm, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                      Lớp sinh hoạt / Bộ môn
                    </label>
                    <input 
                      type="text" 
                      className="form-control"
                      placeholder="25HTTB01"
                      value={newUserForm.class}
                      onChange={(e) => setNewUserForm({ ...newUserForm, class: e.target.value })}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                      Khóa tuyển sinh
                    </label>
                    <select 
                      className="form-control"
                      value={newUserForm.cohort}
                      onChange={(e) => setNewUserForm({ ...newUserForm, cohort: e.target.value })}
                    >
                      <option value="K25">Khóa 25 (2022)</option>
                      <option value="K26">Khóa 26 (2023)</option>
                      <option value="K24">Khóa 24 (2021)</option>
                      <option value="Giảng viên">Giảng viên / CVHT</option>
                    </select>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button 
                  type="button" 
                  className="btn btn-outline btn-sm"
                  onClick={() => setShowAddModal(false)}
                >
                  Hủy bỏ
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary btn-sm"
                >
                  Tạo hồ sơ người dùng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL: CHỈNH SỬA NGƯỜI DÙNG (EDIT USER)
          ==================================================================== */}
      {editingUser && (
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
            if (e.target === e.currentTarget) setEditingUser(null);
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
                Chỉnh sửa thông tin hồ sơ #{editingUser.studentId}
              </h3>
              <button 
                type="button" 
                onClick={() => setEditingUser(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleEditUserSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                    Họ và tên
                  </label>
                  <input 
                    type="text" 
                    className="form-control"
                    value={editingUser.fullName}
                    onChange={(e) => setEditingUser({ ...editingUser, fullName: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                      Email
                    </label>
                    <input 
                      type="email" 
                      className="form-control"
                      value={editingUser.email}
                      onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                      Điện thoại
                    </label>
                    <input 
                      type="text" 
                      className="form-control"
                      value={editingUser.phone || ''}
                      onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                      Lớp
                    </label>
                    <input 
                      type="text" 
                      className="form-control"
                      value={editingUser.class}
                      onChange={(e) => setEditingUser({ ...editingUser, class: e.target.value })}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                      Trạng thái học vụ
                    </label>
                    <select 
                      className="form-control"
                      value={editingUser.status}
                      onChange={(e: any) => setEditingUser({ ...editingUser, status: e.target.value })}
                    >
                      <option value="Đang học">Đang học</option>
                      <option value="Cảnh báo">Cảnh báo học vụ</option>
                      <option value="Tạm hoãn">Tạm hoãn</option>
                      <option value="Đã tốt nghiệp">Đã tốt nghiệp</option>
                    </select>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button 
                  type="button" 
                  className="btn btn-outline btn-sm"
                  onClick={() => setEditingUser(null)}
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

      {/* ====================================================================
          MODAL: XÁC NHẬN XÓA (DELETE CONFIRMATION)
          ==================================================================== */}
      {deletingUser && (
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
            if (e.target === e.currentTarget) setDeletingUser(null);
          }}
        >
          <div 
            style={{
              backgroundColor: 'var(--surface)',
              borderRadius: '12px',
              border: '1px solid var(--border)',
              maxWidth: '440px',
              width: '100%',
              padding: '24px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--danger)', marginBottom: '12px' }}>
              <AlertTriangle size={24} />
              <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                Xác nhận xóa người dùng
              </h3>
            </div>

            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0 0 20px' }}>
              Bạn có chắc chắn muốn xóa hồ sơ của <strong>{deletingUser.fullName}</strong> (Mã: <code>{deletingUser.studentId}</code>) không? Toàn bộ lịch sử học tập và điểm số liên quan sẽ bị xóa khỏi bộ đệm dữ liệu.
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button 
                type="button" 
                className="btn btn-outline btn-sm"
                onClick={() => setDeletingUser(null)}
              >
                Hủy bỏ
              </button>
              <button 
                type="button" 
                className="btn btn-danger btn-sm"
                onClick={handleConfirmDelete}
              >
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStudents;
