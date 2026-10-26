// ==========================================================================
// APAG Student Dashboard Page Component (React + TypeScript)
// Architecture: Minimalist Design System, F-Shape Scan, 3-Second Rule
// Tầng 1: 3 Thẻ Chỉ số Học tập Cốt lõi (Donut Tiến độ, GPA 32px, Cảnh báo màu)
// Tầng 2: 8 cột (Lưới học phần 2 cột + Gợi ý AI) + 4 cột (Timeline lịch học & CVHT)
// ==========================================================================

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Compass, 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  MapPin, 
  Calendar, 
  ChevronRight, 
  ChevronLeft,
  BookOpen, 
  ArrowUpRight, 
  Layers, 
  X,
  Info,
  Check,
  Flame,
  Zap,
  Sliders,
  Target,
  Bell,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Utils } from '../../utils/utils';

interface EnrolledCourse {
  code: string;
  name: string;
  credits: number;
  midGrade: number;
  progress: number;
  instructor: string;
  room: string;
  schedule: string;
  attendance: string;
  assignment: string;
  midterm: string;
  finalWeight: string;
  status: string;
}

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Modal States
  const [selectedCourse, setSelectedCourse] = useState<EnrolledCourse | null>(null);
  const [isConsultModalOpen, setIsConsultModalOpen] = useState(false);
  const [reqSubject, setReqSubject] = useState('Xin hướng dẫn lập kế hoạch học phần tiên quyết LIF2004');
  const [reqContent, setReqContent] = useState('Em chào Thầy, em xin phép nhờ Thầy tư vấn lịch mở lớp học phần LIF2004 (Hệ quản trị CSDL) ở HK6 để em hoàn thành học phần tiên quyết cho Khóa luận tốt nghiệp ạ...');

  // Active Enrolled Courses Data
  const enrolledCourses: EnrolledCourse[] = [
    {
      code: 'LIF2003',
      name: 'Phân tích và thiết kế hệ thống thông tin',
      credits: 3,
      midGrade: 8.5,
      progress: 70,
      instructor: 'TS. Nguyễn Năng Thành',
      room: 'P402, Nhà A1',
      schedule: 'Thứ 2 (08:00 - 11:15)',
      attendance: '10/10',
      assignment: '8.5',
      midterm: '8.5',
      finalWeight: 'Thi viết (50%)',
      status: 'Đang học'
    },
    {
      code: 'LIF2113',
      name: 'Mạng máy tính và truyền thông',
      credits: 3,
      midGrade: 8.0,
      progress: 65,
      instructor: 'ThS. Nguyễn Văn Bình',
      room: 'Lab 302, Nhà C',
      schedule: 'Thứ 2 (13:30 - 16:45)',
      attendance: '9.5/10',
      assignment: '8.0',
      midterm: '8.0',
      finalWeight: 'Thực hành (50%)',
      status: 'Đang học'
    },
    {
      code: 'LIF2020',
      name: 'Lập trình ứng dụng Web doanh nghiệp',
      credits: 3,
      midGrade: 8.2,
      progress: 80,
      instructor: 'TS. Vũ Minh Tuấn',
      room: 'P205, Nhà B',
      schedule: 'Thứ 4 (08:00 - 11:15)',
      attendance: '10/10',
      assignment: '8.5',
      midterm: '8.0',
      finalWeight: 'Bảo vệ Đồ án (50%)',
      status: 'Đang học'
    },
    {
      code: 'ISF325-2007',
      name: 'Công nghệ phần mềm ứng dụng',
      credits: 3,
      midGrade: 8.8,
      progress: 75,
      instructor: 'ThS. Lê Hoàng Long',
      room: 'P101, Nhà A1',
      schedule: 'Thứ 6 (13:30 - 16:45)',
      attendance: '10/10',
      assignment: '9.0',
      midterm: '8.5',
      finalWeight: 'Thi trắc nghiệm (50%)',
      status: 'Đang học'
    },
    {
      code: 'ISFI25-1006',
      name: 'Data-Driven Decision Making',
      credits: 3,
      midGrade: 8.4,
      progress: 60,
      instructor: 'TS. Hoàng Anh Tuấn',
      room: 'P301, Nhà B',
      schedule: 'Thứ 5 (08:00 - 11:15)',
      attendance: '10/10',
      assignment: '8.5',
      midterm: '8.0',
      finalWeight: 'Tiểu luận & Thuyết trình (50%)',
      status: 'Đang học'
    }
  ];

  // Course Carousel State (exactly 3 courses per page on desktop)
  const [currentCoursePage, setCurrentCoursePage] = useState(0);
  const [coursesPerPage, setCoursesPerPage] = useState(() => {
    if (typeof window === 'undefined') return 3;
    if (window.innerWidth < 768) return 1;
    if (window.innerWidth < 1180) return 2;
    return 3;
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCoursesPerPage(1);
      } else if (window.innerWidth < 1180) {
        setCoursesPerPage(2);
      } else {
        setCoursesPerPage(3);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalCoursePages = Math.ceil(enrolledCourses.length / coursesPerPage);
  const validCoursePage = Math.min(currentCoursePage, Math.max(0, totalCoursePages - 1));
  const displayedCourses = enrolledCourses.slice(
    validCoursePage * coursesPerPage,
    validCoursePage * coursesPerPage + coursesPerPage
  );

  // Trigger contextual AI Drawer
  const handleAskAiAboutCourse = (course: EnrolledCourse, e: React.MouseEvent) => {
    e.stopPropagation();
    window.dispatchEvent(new CustomEvent('open-ai-drawer', {
      detail: { courseCode: course.code, courseName: course.name }
    }));
  };

  const handleConsultSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsConsultModalOpen(false);
    Utils.showToast('Đề nghị học vụ đã được gửi thành công tới TS. Nguyễn Năng Thành (Mã REQ-1026).', 'success');
  };

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
      {/* ====================================================================
          SECTION A: GREETING & 4 MINIMALIST SAAS KPI CARDS
          ==================================================================== */}
      <div 
        style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '16px', 
          flexWrap: 'wrap', 
          gap: '12px' 
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px 0' }}>
            Xin chào, {user?.fullName || user?.name || 'Trần Mạnh Hà'} 👋
          </h1>
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
            MSSV: <strong style={{ color: 'var(--text-primary)' }}>{user?.studentId || '2505HTTB012'}</strong> · Ngành: <strong>Hệ thống thông tin (HTTT)</strong> · Khóa: <strong>K25 (2022 - 2026)</strong>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span 
            style={{ 
              fontSize: '0.75rem', 
              fontWeight: 600, 
              padding: '4px 12px', 
              borderRadius: '999px', 
              backgroundColor: 'var(--surface)', 
              border: '1px solid var(--border)', 
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Calendar size={13} className="text-primary" />
            <span>Học kỳ 1 (2024 - 2025)</span>
          </span>
        </div>
      </div>

      <section 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px',
          marginBottom: '20px'
        }}
      >
        {/* KPI 1: Current GPA */}
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Điểm TB Tích lũy (GPA)
            </span>
            <span 
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: '999px',
                backgroundColor: 'var(--success-bg)',
                color: 'var(--success-text)',
                border: '1px solid var(--success-border)'
              }}
            >
              +0.08 kỳ trước ▲
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
              3.24
            </span>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
              / 4.00
            </span>
          </div>
          <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            <span>Xếp loại: <strong style={{ color: 'var(--primary)' }}>Giỏi (QĐ 458)</strong></span>
            <Link to="/student/grades" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
              Sổ điểm →
            </Link>
          </div>
        </div>

        {/* KPI 2: Expected Graduation (Dự kiến tốt nghiệp) */}
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Dự kiến tốt nghiệp
            </span>
            <span 
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: '999px',
                backgroundColor: 'var(--success-bg)',
                color: 'var(--success-text)',
                border: '1px solid var(--success-border)'
              }}
            >
              Đúng hạn (4 năm)
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '1.625rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
              Tháng 06/2026
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
              (K25)
            </span>
          </div>
          <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            <span>Còn lại: <strong>3 học kỳ (35 TC)</strong></span>
            <Link to="/student/progress" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
              Thẩm định →
            </Link>
          </div>
        </div>

        {/* KPI 3: Upcoming Deadlines */}
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Hạn chót tuần này
            </span>
            <span 
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: '999px',
                backgroundColor: 'var(--warning-bg)',
                color: 'var(--warning-text)',
                border: '1px solid var(--warning-border)'
              }}
            >
              3 kế hoạch học tập
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
              03
            </span>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
              bài nộp / kiểm tra
            </span>
          </div>
          <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            <span>Gần nhất: <strong>Hôm nay (23:59)</strong></span>
            <Link to="/student/alerts" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
              Chi tiết →
            </Link>
          </div>
        </div>

        {/* KPI 4: Academic Status */}
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Tình trạng học vụ
            </span>
            <span 
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: '999px',
                backgroundColor: 'var(--success-bg)',
                color: 'var(--success-text)',
                border: '1px solid var(--success-border)',
                display: 'flex',
                alignItems: 'center',
                gap: '3px'
              }}
            >
              <Check size={12} /> Bình thường
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>
              Đủ điều kiện HK6
            </span>
          </div>
          <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            <span>Học phí: <strong style={{ color: 'var(--success-text)' }}>Đã hoàn thành</strong></span>
            <span style={{ color: 'var(--text-muted)' }}>Kỳ 1 • 24-25</span>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 2: ACADEMIC PROGRESS & ACADEMIC ADVISOR (EQUAL ROW)
          ==================================================================== */}
      <section className="dashboard-equal-row">
        {/* Left Card: Tiến độ tích lũy */}
        <div 
          className="minimal-card"
          style={{
            padding: '20px',
            borderRadius: '12px',
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Award size={16} className="text-primary" />
                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Tiến độ tích lũy khung chương trình (120 TC)
                </span>
              </div>
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--primary)' }}>
                70.8%
              </span>
            </div>

            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>
              Đã tích lũy: <strong style={{ color: 'var(--text-primary)' }}>85 TC</strong> · Cần tích lũy thêm: <strong style={{ color: 'var(--text-primary)' }}>35 TC</strong> (HK6, HK7, HK8)
            </div>

            {/* Stacked Progress Bar */}
            <div style={{ height: '8px', backgroundColor: 'var(--surface-subtle)', borderRadius: '999px', overflow: 'hidden', display: 'flex', border: '1px solid var(--border)', marginBottom: '12px' }}>
              <div style={{ width: '42.5%', backgroundColor: '#2563EB' }} title="Đại cương (51 TC)" />
              <div style={{ width: '22.5%', backgroundColor: '#0D9488' }} title="Cơ sở ngành (27 TC)" />
              <div style={{ width: '5.8%', backgroundColor: '#F59E0B' }} title="Chuyên ngành đã học (7 TC)" />
              <div style={{ width: '29.2%', backgroundColor: 'transparent' }} />
            </div>

            {/* Compact Breakdown Pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: '#2563EB', display: 'inline-block' }} />
                <span>Đại cương: <strong>51/51 TC (100%)</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: '#0D9488', display: 'inline-block' }} />
                <span>Cơ sở: <strong>27/27 TC (100%)</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: '#F59E0B', display: 'inline-block' }} />
                <span>Chuyên ngành: <strong>7/23 TC (30%)</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '2px', border: '1px dashed var(--border)', display: 'inline-block' }} />
                <span>Tốt nghiệp: <strong>0/19 TC</strong></span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'flex-end' }}>
            <Link 
              to="/student/progress" 
              style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <span>Xem chi tiết tiến độ</span>
              <ChevronRight size={13} />
            </Link>
          </div>
        </div>

        {/* Right Card: Cố vấn học tập trực tiếp */}
        <div 
          className="minimal-card"
          style={{
            padding: '20px',
            borderRadius: '12px',
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.02em' }}>
                Cố vấn học tập trực tiếp
              </span>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '2px 8px', borderRadius: '999px', backgroundColor: 'var(--success-bg)', color: 'var(--success-text)', border: '1px solid var(--success-border)' }}>
                Đang trực tuyến
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '12px' }}>
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces" 
                alt="Advisor" 
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/images/default-avatar.png';
                }}
                style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid var(--border)' }}
              />
              <div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  TS. Nguyễn Năng Thành
                </div>
                <div style={{ fontSize: '0.875rem', lineHeight: 1.5, color: 'var(--text-secondary)' }}>
                  Khoa Công nghệ & Quản trị số
                </div>
                <div style={{ fontSize: '0.875rem', lineHeight: 1.5, color: 'var(--text-muted)', marginTop: '2px' }}>
                  P402, Nhà A1 • Trụ sở APAG (Lớp 25HTTB01)
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: '8px' }}>
            <button 
              type="button" 
              className="btn btn-secondary btn-sm"
              onClick={() => Utils.showToast('Đã gửi thông báo đăng ký lịch tư vấn tới TS. Nguyễn Năng Thành (Lớp 25HTTB01).', 'success')}
              style={{ flex: 1, justifyContent: 'center', fontSize: '0.875rem' }}
            >
              📅 Đặt lịch hẹn
            </button>
            <button 
              type="button" 
              className="btn btn-outline btn-sm"
              onClick={() => setIsConsultModalOpen(true)}
              style={{ flex: 1, justifyContent: 'center', fontSize: '0.875rem' }}
            >
              ✉ Gửi đề nghị
            </button>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 3: CURRENT COURSES (CAROUSEL 3-PER-PAGE) & SCHEDULE
          ==================================================================== */}
      <section className="dashboard-courses-schedule-grid">
        {/* Left: Current Courses Carousel Card */}
        <div 
          className="minimal-card"
          style={{
            padding: '20px',
            borderRadius: '12px',
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%'
          }}
        >
          <div>
            {/* Carousel Header with Navigation Controls */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <h2 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  Học phần đang học (Học kỳ 1 • 2024 - 2025)
                </h2>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Đang học {enrolledCourses.length} học phần · {enrolledCourses.reduce((sum, c) => sum + c.credits, 0)} Tín chỉ
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {/* Page indicator */}
                <span 
                  style={{ 
                    fontSize: '0.75rem', 
                    fontWeight: 600, 
                    color: 'var(--text-secondary)', 
                    padding: '3px 8px', 
                    borderRadius: '4px', 
                    backgroundColor: 'var(--surface-subtle)',
                    border: '1px solid var(--border)'
                  }}
                >
                  {validCoursePage + 1} / {totalCoursePages}
                </span>

                {/* Arrow Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <button
                    type="button"
                    disabled={validCoursePage === 0}
                    onClick={() => setCurrentCoursePage(prev => Math.max(0, prev - 1))}
                    aria-label="Trang học phần trước"
                    title="Trang trước"
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '6px',
                      border: '1px solid var(--border)',
                      backgroundColor: validCoursePage === 0 ? 'var(--surface-subtle)' : 'var(--surface)',
                      color: validCoursePage === 0 ? 'var(--text-muted)' : 'var(--text-primary)',
                      cursor: validCoursePage === 0 ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <ChevronLeft size={15} />
                  </button>

                  <button
                    type="button"
                    disabled={validCoursePage >= totalCoursePages - 1}
                    onClick={() => setCurrentCoursePage(prev => Math.min(totalCoursePages - 1, prev + 1))}
                    aria-label="Trang học phần tiếp theo"
                    title="Trang tiếp theo"
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '6px',
                      border: '1px solid var(--border)',
                      backgroundColor: validCoursePage >= totalCoursePages - 1 ? 'var(--surface-subtle)' : 'var(--surface)',
                      color: validCoursePage >= totalCoursePages - 1 ? 'var(--text-muted)' : 'var(--text-primary)',
                      cursor: validCoursePage >= totalCoursePages - 1 ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <ChevronRight size={15} />
                  </button>
                </div>

                <Link to="/student/grades" className="text-xs font-semibold" style={{ color: 'var(--primary)', textDecoration: 'none', marginLeft: '4px' }}>
                  Xem tất cả ({enrolledCourses.length}) →
                </Link>
              </div>
            </div>

            {/* Carousel Grid: Exactly 3 course cards per page on desktop */}
            <div 
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${coursesPerPage}, minmax(0, 1fr))`,
                gap: '12px',
                marginBottom: '10px'
              }}
            >
              {displayedCourses.map((c) => (
                <div 
                  key={c.code}
                  onClick={() => setSelectedCourse(c)}
                  style={{
                    padding: '14px',
                    borderRadius: '10px',
                    backgroundColor: 'var(--surface-subtle)',
                    border: '1px solid var(--border)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'all 120ms ease-out'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--primary)';
                    e.currentTarget.style.backgroundColor = 'var(--surface)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.backgroundColor = 'var(--surface-subtle)';
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, fontFamily: 'monospace', color: 'var(--primary)', backgroundColor: 'var(--primary-light)', padding: '2px 8px', borderRadius: '4px' }}>
                        {c.code}
                      </span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                        {c.credits} TC
                      </span>
                    </div>

                    <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px', lineHeight: 1.4, minHeight: '38px' }}>
                      {c.name}
                    </div>

                    <div style={{ fontSize: '0.875rem', lineHeight: 1.5, color: 'var(--text-secondary)', marginBottom: '10px' }}>
                      GV: {c.instructor}
                    </div>
                  </div>

                  <div>
                    {/* Progress Bar & Midterm Grade */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Điểm quá trình:</span>
                      <strong style={{ color: 'var(--primary)', fontSize: '0.875rem' }}>{c.midGrade}</strong>
                    </div>

                    <div style={{ height: '6px', backgroundColor: 'var(--surface)', borderRadius: '999px', overflow: 'hidden', border: '1px solid var(--border)', marginBottom: '10px' }}>
                      <div style={{ width: `${c.progress}%`, height: '100%', backgroundColor: 'var(--primary)' }}></div>
                    </div>

                    {/* 1-Click AI Study Buddy Prompt Chips */}
                    <div style={{ paddingTop: '8px', borderTop: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Sparkles size={13} className="text-primary" />
                          <span>AI Study Buddy:</span>
                        </span>
                        <ArrowUpRight size={13} className="text-muted" />
                      </div>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.dispatchEvent(new CustomEvent('open-ai-drawer', {
                              detail: { initialPrompt: `Tư vấn lộ trình ôn tập và trọng tâm kiến thức thi kết thúc học phần ${c.code} - ${c.name}?` }
                            }));
                          }}
                          style={{
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            padding: '4px 10px',
                            borderRadius: '6px',
                            backgroundColor: 'var(--surface)',
                            border: '1px solid var(--border)',
                            color: 'var(--primary)',
                            cursor: 'pointer'
                          }}
                        >
                          ✨ Lộ trình ôn
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.dispatchEvent(new CustomEvent('open-ai-drawer', {
                              detail: { initialPrompt: `Điểm quá trình của mình học phần ${c.code} đang là ${c.midGrade}. Tư vấn cho mình phương pháp ôn tập để nâng kết quả tổng kết lên loại A (>= 8.5)?` }
                            }));
                          }}
                          style={{
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            padding: '4px 10px',
                            borderRadius: '6px',
                            backgroundColor: 'var(--success-bg)',
                            border: '1px solid var(--success-border)',
                            color: 'var(--success-text)',
                            cursor: 'pointer'
                          }}
                        >
                          🎯 Mục tiêu loại A
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.dispatchEvent(new CustomEvent('open-ai-drawer', {
                              detail: { initialPrompt: `Tạo bộ câu hỏi flashcard ôn tập 5 chủ đề cốt lõi nhất của học phần ${c.code} - ${c.name}.` }
                            }));
                          }}
                          style={{
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            padding: '4px 10px',
                            borderRadius: '6px',
                            backgroundColor: 'var(--surface)',
                            border: '1px solid var(--border)',
                            color: 'var(--text-secondary)',
                            cursor: 'pointer'
                          }}
                        >
                          📚 Flashcard
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ paddingTop: '10px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>
              Nhấp vào học phần để xem chi tiết điểm đánh giá (Chuyên cần, Bài tập, Giữa kỳ, Cuối kỳ)
            </span>
            <span style={{ color: 'var(--text-muted)' }}>
              Hiển thị {displayedCourses.length} / {enrolledCourses.length} học phần
            </span>
          </div>
        </div>

        {/* Right: Timeline Lịch học & Sự kiện Hôm nay */}
        <div 
          className="minimal-card"
          style={{
            padding: '20px',
            borderRadius: '12px',
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <h2 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={16} className="text-primary" />
                <span>Lịch học & Sự kiện hôm nay</span>
              </h2>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', backgroundColor: 'var(--surface-subtle)', color: 'var(--text-secondary)' }}>
                Hôm nay
              </span>
            </div>

            {/* Vertical Timeline */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Event 1 */}
              <div 
                style={{
                  padding: '12px 14px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--primary-light)',
                  border: '1px solid var(--primary-border)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary)', display: 'inline-block' }} />
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)' }}>08:00 - 11:15 • Sắp diễn ra</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', backgroundColor: 'var(--surface)', color: 'var(--primary)', fontWeight: 600 }}>P402, Nhà A1</span>
                </div>
                <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  LIF2003 - Phân tích & Thiết kế HTTT
                </div>
                <div style={{ fontSize: '0.875rem', lineHeight: 1.5, color: 'var(--text-secondary)' }}>
                  Giảng viên: TS. Nguyễn Năng Thành
                </div>
              </div>

              {/* Event 2 */}
              <div 
                style={{
                  padding: '12px 14px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--surface-subtle)',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--text-muted)', display: 'inline-block' }} />
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>13:30 - 16:45 • Ca chiều</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', backgroundColor: 'var(--surface)', color: 'var(--text-secondary)' }}>Lab 302, Nhà C</span>
                </div>
                <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  LIF2113 - Mạng máy tính
                </div>
                <div style={{ fontSize: '0.875rem', lineHeight: 1.5, color: 'var(--text-secondary)' }}>
                  Giảng viên: ThS. Nguyễn Văn Bình
                </div>
              </div>

              {/* Upcoming Deadline */}
              <div 
                style={{
                  padding: '12px 14px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--danger-bg)',
                  border: '1px solid var(--danger-border)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--danger)', display: 'inline-block' }} />
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--danger)' }}>15/10/2024 • Đếm ngược 1 ngày</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--danger)', fontWeight: 700 }}>Hạn chót</span>
                </div>
                <div style={{ fontSize: '0.875rem', lineHeight: 1.5, fontWeight: 700, color: 'var(--danger-text)' }}>
                  Hạn nộp đăng ký đợt thi Chuẩn đầu ra VSTEP B1
                </div>
              </div>
            </div>
          </div>

          <div style={{ paddingTop: '10px', marginTop: '12px', borderTop: '1px solid var(--border)', fontSize: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Tuần 7 (HK1 2024-2025)</span>
            <Link to="/student/timetable" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
              Thời khóa biểu tuần →
            </Link>
          </div>
        </div>
      </section>

      {/* ====================================================================
          MODAL 1: CHI TIẾT ĐẦU ĐIỂM HỌC PHẦN (PROGRESSIVE DISCLOSURE)
          ==================================================================== */}
      {selectedCourse && (
        <div 
          className="modal-backdrop active"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.45)',
            backdropFilter: 'blur(3px)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedCourse(null);
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', backgroundColor: 'var(--primary-light)', padding: '2px 8px', borderRadius: '4px' }}>
                  {selectedCourse.code}
                </span>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: '6px 0 2px' }}>
                  {selectedCourse.name}
                </h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  Giảng viên: {selectedCourse.instructor} • {selectedCourse.credits} Tín chỉ
                </span>
              </div>
              <button 
                type="button" 
                onClick={() => setSelectedCourse(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Score Breakdown Table */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                Chi tiết các đầu điểm thành phần:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', textAlign: 'center' }}>
                <div style={{ padding: '10px', backgroundColor: 'var(--surface-subtle)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Chuyên cần (10%)</div>
                  <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>{selectedCourse.attendance}</div>
                </div>
                <div style={{ padding: '10px', backgroundColor: 'var(--surface-subtle)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Bài tập / BTL (20%)</div>
                  <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>{selectedCourse.assignment}</div>
                </div>
                <div style={{ padding: '10px', backgroundColor: 'var(--primary-light)', borderRadius: '8px', border: '1px solid var(--primary-border)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>Điểm giữa kỳ (20%)</div>
                  <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--primary)', marginTop: '2px' }}>{selectedCourse.midGrade}</div>
                </div>
              </div>
            </div>

            {/* Course Logistics */}
            <div style={{ padding: '12px', backgroundColor: 'var(--surface-subtle)', borderRadius: '8px', fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
              <div>📅 Lịch học: <strong>{selectedCourse.schedule}</strong></div>
              <div>📍 Địa điểm: <strong>{selectedCourse.room}</strong></div>
              <div>📝 Hình thức thi cuối kỳ: <strong>{selectedCourse.finalWeight}</strong></div>
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button 
                type="button" 
                className="btn btn-outline btn-sm"
                onClick={() => setSelectedCourse(null)}
              >
                Đóng
              </button>
              <button 
                type="button" 
                className="btn btn-primary btn-sm"
                onClick={(e) => {
                  const c = selectedCourse;
                  setSelectedCourse(null);
                  handleAskAiAboutCourse(c, e);
                }}
              >
                <Sparkles size={14} />
                <span>Tra cứu thông tin học phần bằng Trợ lý học thuật AI</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL 2: GỬI ĐỀ NGHỊ HỌC VỤ TỚI CỐ VẤN HỌC TẬP
          ==================================================================== */}
      {isConsultModalOpen && (
        <div 
          className="modal-backdrop active"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.45)',
            backdropFilter: 'blur(3px)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsConsultModalOpen(false);
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
                Gửi đề nghị học vụ tới Cố vấn học tập
              </h3>
              <button 
                type="button" 
                onClick={() => setIsConsultModalOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleConsultSubmit}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>
                  Chủ đề đề nghị
                </label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={reqSubject} 
                  onChange={(e) => setReqSubject(e.target.value)} 
                  required 
                  style={{ width: '100%', padding: '8px 12px', fontSize: '0.8125rem', borderRadius: '6px', border: '1px solid var(--border)', backgroundColor: 'var(--surface-subtle)', color: 'var(--text-primary)' }}
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>
                  Nội dung chi tiết
                </label>
                <textarea 
                  className="form-control" 
                  rows={4} 
                  value={reqContent} 
                  onChange={(e) => setReqContent(e.target.value)} 
                  required 
                  style={{ width: '100%', padding: '8px 12px', fontSize: '0.8125rem', borderRadius: '6px', border: '1px solid var(--border)', backgroundColor: 'var(--surface-subtle)', color: 'var(--text-primary)' }}
                />
              </div>

              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', padding: '10px 12px', borderRadius: '6px', backgroundColor: 'var(--surface-subtle)', border: '1px solid var(--border)', marginBottom: '16px' }}>
                💡 <strong>Tóm tắt tự động bởi AI:</strong> Đề nghị thuộc diện cần hỗ trợ học tập ưu tiên để hoàn thành học phần tiên quyết LIF2004, đảm bảo tiến độ tốt nghiệp chuẩn 4 năm.
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button 
                  type="button" 
                  className="btn btn-outline btn-sm"
                  onClick={() => setIsConsultModalOpen(false)}
                >
                  Hủy bỏ
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary btn-sm"
                >
                  Gửi đề nghị
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
