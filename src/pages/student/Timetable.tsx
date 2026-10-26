// ==========================================================================
// APAG Student Timetable & Assignments Workspace (React + TypeScript)
// Feature 5: Interactive calendar view (Week/Month) for classes, exams,
// and lab sessions + Assignment & Task checklist (To-do, In Progress, Submitted)
// with priority badges (High, Medium, Low).
// ==========================================================================

import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  User, 
  CheckCircle2, 
  Circle, 
  AlertCircle, 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  Filter, 
  Download, 
  Layers, 
  X, 
  CheckSquare, 
  FileText,
  AlertTriangle
} from 'lucide-react';
import { Utils } from '../../utils/utils';

export interface TimetableEvent {
  id: string;
  code: string;
  title: string;
  type: 'lecture' | 'lab' | 'exam';
  dayOfWeek: number; // 2 = Mon, 3 = Tue, ... 7 = Sat
  dayName: string;
  dateStr: string;
  timeSlot: 'morning' | 'afternoon';
  startTime: string;
  endTime: string;
  room: string;
  instructor: string;
}

export interface StudentTask {
  id: string;
  courseCode: string;
  title: string;
  dueDate: string;
  dueTime: string;
  status: 'todo' | 'in_progress' | 'submitted';
  priority: 'high' | 'medium' | 'low';
  weight: string;
}

export const StudentTimetable: React.FC = () => {
  const [calendarView, setCalendarView] = useState<'week' | 'month'>('week');
  const [taskFilter, setTaskFilter] = useState<'all' | 'todo' | 'in_progress' | 'submitted'>('all');
  const [selectedDayMonth, setSelectedDayMonth] = useState<number>(14);

  // Timetable Events (Week 7: 14/10 - 20/10/2024)
  const [events, setEvents] = useState<TimetableEvent[]>([
    {
      id: 'ev-1',
      code: 'LIF2003',
      title: 'Phân tích & Thiết kế hệ thống thông tin',
      type: 'lecture',
      dayOfWeek: 2,
      dayName: 'Thứ 2',
      dateStr: '14/10/2024',
      timeSlot: 'morning',
      startTime: '08:00',
      endTime: '11:15',
      room: 'P402, Nhà A1',
      instructor: 'TS. Nguyễn Năng Thành'
    },
    {
      id: 'ev-2',
      code: 'LIF2113',
      title: 'Mạng máy tính & Truyền thông',
      type: 'lab',
      dayOfWeek: 2,
      dayName: 'Thứ 2',
      dateStr: '14/10/2024',
      timeSlot: 'afternoon',
      startTime: '13:30',
      endTime: '16:45',
      room: 'Lab 302, Nhà C',
      instructor: 'ThS. Nguyễn Văn Bình'
    },
    {
      id: 'ev-3',
      code: 'LIF2020',
      title: 'Lập trình ứng dụng Web doanh nghiệp',
      type: 'lab',
      dayOfWeek: 4,
      dayName: 'Thứ 4',
      dateStr: '16/10/2024',
      timeSlot: 'morning',
      startTime: '08:00',
      endTime: '11:15',
      room: 'P205, Nhà B',
      instructor: 'TS. Vũ Minh Tuấn'
    },
    {
      id: 'ev-4',
      code: 'ISFI25-2007',
      title: 'Công nghệ phần mềm ứng dụng',
      type: 'lecture',
      dayOfWeek: 6,
      dayName: 'Thứ 6',
      dateStr: '18/10/2024',
      timeSlot: 'afternoon',
      startTime: '13:30',
      endTime: '16:45',
      room: 'P101, Nhà A1',
      instructor: 'ThS. Lê Hoàng Long'
    },
    {
      id: 'ev-5',
      code: 'VSTEP-B1',
      title: 'Thi Đánh giá Chuẩn đầu ra Tiếng Anh B1 (Đợt 2)',
      type: 'exam',
      dayOfWeek: 7,
      dayName: 'Thứ 7',
      dateStr: '19/10/2024',
      timeSlot: 'morning',
      startTime: '07:30',
      endTime: '11:30',
      room: 'Hội trường Lớn A1',
      instructor: 'Hội đồng Khảo thí'
    }
  ]);

  // Tasks & Assignments Checklist
  const [tasks, setTasks] = useState<StudentTask[]>([
    {
      id: 'task-1',
      courseCode: 'LIF2020',
      title: 'Bài tập lớn: Thiết kế RESTful API Node.js & React Frontend',
      dueDate: '16/10/2024',
      dueTime: '23:59',
      status: 'in_progress',
      priority: 'high',
      weight: '20% Tổng kết'
    },
    {
      id: 'task-2',
      courseCode: 'LIF2113',
      title: 'Báo cáo thực hành Lab 3: Cấu hình VLAN & Định tuyến OSPF',
      dueDate: '17/10/2024',
      dueTime: '17:00',
      status: 'todo',
      priority: 'high',
      weight: '10% Quá trình'
    },
    {
      id: 'task-3',
      courseCode: 'ISFI25-2007',
      title: 'Đặc tả yêu cầu phần mềm SRS theo chuẩn IEEE 830',
      dueDate: '20/10/2024',
      dueTime: '23:59',
      status: 'todo',
      priority: 'medium',
      weight: '15% Giữa kỳ'
    },
    {
      id: 'task-4',
      courseCode: 'LIF2003',
      title: 'Sơ đồ Use Case và Activity Diagram hệ thống Đào tạo APAG',
      dueDate: '12/10/2024',
      dueTime: '23:59',
      status: 'submitted',
      priority: 'low',
      weight: '10% Quá trình'
    }
  ]);

  // Add Task Modal
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [newTaskForm, setNewTaskForm] = useState({
    courseCode: 'LIF2003',
    title: '',
    dueDate: '2024-10-22',
    dueTime: '23:59',
    priority: 'medium' as 'high' | 'medium' | 'low',
    weight: '15% Điểm'
  });

  // Toggle Task Status (cycle: todo -> in_progress -> submitted)
  const handleToggleTaskStatus = (taskId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const nextStatus = t.status === 'todo' ? 'in_progress' : t.status === 'in_progress' ? 'submitted' : 'todo';
        return { ...t, status: nextStatus };
      }
      return t;
    }));
  };

  // Add Task Submission
  const handleAddTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskForm.title.trim()) return;

    const created: StudentTask = {
      id: `task_${Date.now()}`,
      courseCode: newTaskForm.courseCode,
      title: newTaskForm.title.trim(),
      dueDate: newTaskForm.dueDate,
      dueTime: newTaskForm.dueTime,
      status: 'todo',
      priority: newTaskForm.priority,
      weight: newTaskForm.weight
    };

    setTasks([created, ...tasks]);
    setShowAddTaskModal(false);
    setNewTaskForm({
      courseCode: 'LIF2003',
      title: '',
      dueDate: '2024-10-22',
      dueTime: '23:59',
      priority: 'medium',
      weight: '15% Điểm'
    });
    Utils.showToast('Đã thêm bài tập mới vào danh sách!', 'success');
  };

  // Filtered Tasks
  const filteredTasks = tasks.filter(t => {
    if (taskFilter === 'all') return true;
    return t.status === taskFilter;
  });

  const weekDays = [
    { dayNumber: 2, label: 'Thứ 2', date: '14/10' },
    { dayNumber: 3, label: 'Thứ 3', date: '15/10' },
    { dayNumber: 4, label: 'Thứ 4', date: '16/10' },
    { dayNumber: 5, label: 'Thứ 5', date: '17/10' },
    { dayNumber: 6, label: 'Thứ 6', date: '18/10' },
    { dayNumber: 7, label: 'Thứ 7', date: '19/10' }
  ];

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
          onClick={() => Utils.showToast('Đã đồng bộ lịch học với Google Calendar & Apple Calendar (iCal)!', 'success')}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Download size={14} />
          <span>Xuất lịch iCal</span>
        </button>

        <button 
          type="button" 
          className="btn btn-primary btn-sm"
          onClick={() => setShowAddTaskModal(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Plus size={14} />
          <span>Thêm bài tập / deadline</span>
        </button>
      </div>

      {/* Main 12-Column Grid Area */}
      <div 
        className="timetable-main-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 8fr) minmax(0, 4fr)',
          gap: '24px',
          alignItems: 'start'
        }}
      >
        {/* ==================================================================
            LEFT 8-COL: INTERACTIVE CALENDAR (WEEK / MONTH VIEW)
            ================================================================== */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Calendar Controls Bar */}
          <div 
            className="minimal-card"
            style={{
              padding: '12px 16px',
              borderRadius: '10px',
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <button 
                  type="button" 
                  className="btn btn-ghost btn-xs"
                  onClick={() => Utils.showToast('Tuần 6: 07/10 - 13/10/2024', 'info')}
                  style={{ padding: '4px' }}
                >
                  <ChevronLeft size={16} />
                </button>
                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Tuần 7 (14/10 - 20/10/2024)
                </span>
                <button 
                  type="button" 
                  className="btn btn-ghost btn-xs"
                  onClick={() => Utils.showToast('Tuần 8: 21/10 - 27/10/2024', 'info')}
                  style={{ padding: '4px' }}
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '2px 8px', borderRadius: '4px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
                Học kỳ 1 • 2024-2025
              </span>
            </div>

            {/* View Mode Switcher */}
            <div style={{ display: 'inline-flex', padding: '3px', borderRadius: '8px', backgroundColor: 'var(--surface-subtle)', border: '1px solid var(--border)' }}>
              <button
                type="button"
                onClick={() => setCalendarView('week')}
                style={{
                  padding: '4px 12px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: calendarView === 'week' ? 'var(--surface)' : 'transparent',
                  color: calendarView === 'week' ? 'var(--primary)' : 'var(--text-secondary)',
                  boxShadow: calendarView === 'week' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none'
                }}
              >
                Theo tuần
              </button>
              <button
                type="button"
                onClick={() => setCalendarView('month')}
                style={{
                  padding: '4px 12px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: calendarView === 'month' ? 'var(--surface)' : 'transparent',
                  color: calendarView === 'month' ? 'var(--primary)' : 'var(--text-secondary)',
                  boxShadow: calendarView === 'month' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none'
                }}
              >
                Theo tháng
              </button>
            </div>
          </div>

          {/* WEEK VIEW GRID */}
          {calendarView === 'week' && (
            <div 
              className="minimal-card"
              style={{
                borderRadius: '10px',
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border)',
                overflowX: 'auto'
              }}
            >
              <div style={{ minWidth: '600px' }}>
              {/* Day Header Row */}
              <div 
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(6, 1fr)',
                  backgroundColor: 'var(--surface-subtle)',
                  borderBottom: '1px solid var(--border)',
                  textAlign: 'center'
                }}
              >
                {weekDays.map(d => (
                  <div key={d.dayNumber} style={{ padding: '10px 6px', borderRight: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: d.dayNumber === 2 ? 'var(--primary)' : 'var(--text-primary)' }}>
                      {d.label}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      {d.date}
                    </div>
                  </div>
                ))}
              </div>

              {/* Slots Row (Morning / Afternoon) */}
              <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {/* Morning Label */}
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  🌅 Buổi Sáng (07:30 - 11:30)
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '10px' }}>
                  {weekDays.map(d => {
                    const morningEvents = events.filter(e => e.dayOfWeek === d.dayNumber && e.timeSlot === 'morning');
                    return (
                      <div key={d.dayNumber} style={{ minHeight: '120px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {morningEvents.map(ev => {
                          const badgeColor = ev.type === 'lecture' ? 'var(--primary)' : ev.type === 'lab' ? '#0D9488' : '#DC2626';
                          const badgeBg = ev.type === 'lecture' ? 'var(--primary-light)' : ev.type === 'lab' ? 'rgba(13, 148, 136, 0.1)' : 'var(--danger-bg)';
                          return (
                            <div 
                              key={ev.id}
                              style={{
                                padding: '10px',
                                borderRadius: '8px',
                                backgroundColor: badgeBg,
                                border: '1px solid var(--border)',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '4px'
                              }}
                            >
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: badgeColor, display: 'inline-block' }} />
                                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: badgeColor }}>
                                    {ev.startTime} - {ev.endTime}
                                  </span>
                                </div>
                                <span style={{ fontSize: '0.75rem', padding: '2px 7px', borderRadius: '4px', backgroundColor: 'var(--surface)', fontWeight: 600 }}>
                                  {ev.type === 'lecture' ? 'Lý thuyết' : ev.type === 'lab' ? 'Thực hành' : 'Thi'}
                                </span>
                              </div>

                              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.35 }}>
                                {ev.title}
                              </div>

                              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <MapPin size={13} /> {ev.room}
                              </div>

                              <div style={{ fontSize: '0.875rem', lineHeight: 1.5, color: 'var(--text-secondary)' }}>
                                GV: {ev.instructor}
                              </div>
                            </div>
                          );
                        })}
                        {morningEvents.length === 0 && (
                          <div style={{ height: '100%', borderRadius: '6px', border: '1px dashed var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                            Trống
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Afternoon Label */}
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: '10px' }}>
                  🌤️ Buổi Chiều (13:30 - 17:00)
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '10px' }}>
                  {weekDays.map(d => {
                    const afternoonEvents = events.filter(e => e.dayOfWeek === d.dayNumber && e.timeSlot === 'afternoon');
                    return (
                      <div key={d.dayNumber} style={{ minHeight: '120px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {afternoonEvents.map(ev => {
                          const badgeColor = ev.type === 'lecture' ? 'var(--primary)' : ev.type === 'lab' ? '#0D9488' : '#DC2626';
                          const badgeBg = ev.type === 'lecture' ? 'var(--primary-light)' : ev.type === 'lab' ? 'rgba(13, 148, 136, 0.1)' : 'var(--danger-bg)';
                          return (
                            <div 
                              key={ev.id}
                              style={{
                                padding: '10px',
                                borderRadius: '8px',
                                backgroundColor: badgeBg,
                                border: '1px solid var(--border)',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '4px'
                              }}
                            >
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: badgeColor, display: 'inline-block' }} />
                                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: badgeColor }}>
                                    {ev.startTime} - {ev.endTime}
                                  </span>
                                </div>
                                <span style={{ fontSize: '0.75rem', padding: '2px 7px', borderRadius: '4px', backgroundColor: 'var(--surface)', fontWeight: 600 }}>
                                  {ev.type === 'lecture' ? 'Lý thuyết' : 'Thực hành'}
                                </span>
                              </div>

                              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.35 }}>
                                {ev.title}
                              </div>

                              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <MapPin size={13} /> {ev.room}
                              </div>

                              <div style={{ fontSize: '0.875rem', lineHeight: 1.5, color: 'var(--text-secondary)' }}>
                                GV: {ev.instructor}
                              </div>
                            </div>
                          );
                        })}
                        {afternoonEvents.length === 0 && (
                          <div style={{ height: '100%', borderRadius: '6px', border: '1px dashed var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                            Trống
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          )}

          {/* MONTH VIEW CALENDAR */}
          {calendarView === 'month' && (
            <div 
              className="minimal-card"
              style={{
                borderRadius: '10px',
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border)',
                padding: '20px'
              }}
            >
              <div style={{ textAlign: 'center', fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '14px' }}>
                Tháng 10 / 2024
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', textAlign: 'center' }}>
                {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map(h => (
                  <div key={h} style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', paddingBottom: '6px' }}>{h}</div>
                ))}

                {Array.from({ length: 31 }, (_, i) => i + 1).map(day => {
                  const hasEvent = [14, 16, 18, 19].includes(day);
                  const isSelected = selectedDayMonth === day;

                  return (
                    <div 
                      key={day}
                      onClick={() => setSelectedDayMonth(day)}
                      style={{
                        padding: '10px',
                        borderRadius: '8px',
                        border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border)',
                        backgroundColor: isSelected ? 'var(--primary-light)' : 'var(--surface-subtle)',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: '44px'
                      }}
                    >
                      <span style={{ fontSize: '0.8125rem', fontWeight: isSelected ? 800 : 500, color: 'var(--text-primary)' }}>
                        {day}
                      </span>
                      {hasEvent && (
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--primary)', marginTop: '2px' }} />
                      )}
                    </div>
                  );
                })}
              </div>

              <div style={{ marginTop: '16px', padding: '12px', borderRadius: '8px', backgroundColor: 'var(--surface-subtle)', border: '1px solid var(--border)', fontSize: '0.75rem' }}>
                <strong>Lịch ngày {selectedDayMonth}/10/2024:</strong> {selectedDayMonth === 14 ? '2 ca học (PT&TK HTTT tại P402 và Mạng máy tính tại Lab 302)' : selectedDayMonth === 16 ? '1 ca học Web Doanh nghiệp tại P205' : selectedDayMonth === 19 ? 'Thi Chuẩn Ngoại ngữ B1 tại Hội trường A1' : 'Không có ca học theo lịch trình'}
              </div>
            </div>
          )}
        </div>

        {/* ==================================================================
            RIGHT 4-COL: ASSIGNMENT & TASK CHECKLIST (TO-DO / PROGRESS / SUBMITTED)
            ================================================================== */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Tasks Container Card */}
          <div 
            className="minimal-card"
            style={{
              padding: '18px 20px',
              borderRadius: '10px',
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  Kế hoạch học tập & Bài tập
                </h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  {tasks.filter(t => t.status === 'submitted').length} / {tasks.length} bài đã nộp
                </span>
              </div>

              <button 
                type="button" 
                className="btn btn-outline btn-xs"
                onClick={() => setShowAddTaskModal(true)}
                style={{ fontSize: '0.75rem', padding: '3px 8px' }}
              >
                + Thêm
              </button>
            </div>

            {/* Filter Chips */}
            <div style={{ display: 'flex', gap: '4px', marginBottom: '14px', flexWrap: 'wrap' }}>
              {(['all', 'todo', 'in_progress', 'submitted'] as const).map(tab => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setTaskFilter(tab)}
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    padding: '3px 8px',
                    borderRadius: '6px',
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor: taskFilter === tab ? 'var(--primary)' : 'var(--surface-subtle)',
                    color: taskFilter === tab ? '#FFFFFF' : 'var(--text-secondary)'
                  }}
                >
                  {tab === 'all' ? 'Tất cả' : tab === 'todo' ? 'Cần làm' : tab === 'in_progress' ? 'Đang làm' : 'Đã nộp'}
                </button>
              ))}
            </div>

            {/* Task Checklist Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {filteredTasks.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                  Không có bài tập hoặc kế hoạch học tập nào trong mục này.
                </div>
              ) : (
                filteredTasks.map(task => {
                  const priorityColor = task.priority === 'high' 
                    ? { bg: 'var(--danger-bg)', color: 'var(--danger)', border: 'var(--danger-border)' }
                    : task.priority === 'medium'
                      ? { bg: 'var(--warning-bg)', color: 'var(--warning-text)', border: 'var(--warning-border)' }
                      : { bg: 'var(--primary-light)', color: 'var(--primary)', border: 'var(--primary-border)' };

                  return (
                    <div 
                      key={task.id}
                      style={{
                        padding: '12px',
                        borderRadius: '8px',
                        backgroundColor: 'var(--surface-subtle)',
                        border: '1px solid var(--border)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                        opacity: task.status === 'submitted' ? 0.7 : 1
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, fontFamily: 'monospace', color: 'var(--primary)' }}>
                            {task.courseCode}
                          </span>
                          <span 
                            style={{
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              padding: '2px 7px',
                              borderRadius: '4px',
                              backgroundColor: priorityColor.bg,
                              color: priorityColor.color,
                              border: `1px solid ${priorityColor.border}`
                            }}
                          >
                            {task.priority === 'high' ? 'Cao' : task.priority === 'medium' ? 'Bình thường' : 'Thấp'}
                          </span>
                        </div>

                        {/* Status Checkbox Button */}
                        <button
                          type="button"
                          onClick={() => handleToggleTaskStatus(task.id)}
                          title="Bấm để đổi trạng thái"
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '0.75rem',
                            color: task.status === 'submitted' ? 'var(--success)' : 'var(--text-secondary)'
                          }}
                        >
                          {task.status === 'submitted' ? (
                            <CheckCircle2 size={16} className="text-success" />
                          ) : (
                            <Circle size={16} />
                          )}
                        </button>
                      </div>

                      <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', textDecoration: task.status === 'submitted' ? 'line-through' : 'none', lineHeight: 1.35 }}>
                        {task.title}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px', paddingTop: '6px', borderTop: '1px solid var(--border-subtle)' }}>
                        <span style={{ color: task.priority === 'high' && task.status !== 'submitted' ? 'var(--danger)' : 'var(--text-secondary)', fontWeight: 600 }}>
                          ⏰ Hạn nộp: {task.dueDate} ({task.dueTime})
                        </span>
                        <span>{task.weight}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ====================================================================
          MODAL: THÊM KẾ HOẠCH HỌC TẬP MỚI
          ==================================================================== */}
      {showAddTaskModal && (
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
            if (e.target === e.currentTarget) setShowAddTaskModal(false);
          }}
        >
          <div 
            style={{
              backgroundColor: 'var(--surface)',
              borderRadius: '12px',
              border: '1px solid var(--border)',
              maxWidth: '460px',
              width: '100%',
              padding: '24px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                Thêm bài tập / Kế hoạch học tập
              </h3>
              <button 
                type="button" 
                onClick={() => setShowAddTaskModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddTaskSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Học phần</label>
                  <select 
                    className="form-control"
                    value={newTaskForm.courseCode}
                    onChange={(e) => setNewTaskForm({ ...newTaskForm, courseCode: e.target.value })}
                  >
                    <option value="LIF2003">LIF2003 - Phân tích & Thiết kế HTTT</option>
                    <option value="LIF2113">LIF2113 - Mạng máy tính & Truyền thông</option>
                    <option value="LIF2020">LIF2020 - Lập trình Web doanh nghiệp</option>
                    <option value="ISFI25-2007">ISFI25-2007 - Công nghệ phần mềm</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Tên bài tập / Kế hoạch học tập *</label>
                  <input 
                    type="text" 
                    className="form-control"
                    placeholder="VD: Nộp báo cáo Đồ án giữa kỳ"
                    value={newTaskForm.title}
                    onChange={(e) => setNewTaskForm({ ...newTaskForm, title: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Ngày hết hạn</label>
                    <input 
                      type="date" 
                      className="form-control"
                      value={newTaskForm.dueDate}
                      onChange={(e) => setNewTaskForm({ ...newTaskForm, dueDate: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Mức độ ưu tiên</label>
                    <select 
                      className="form-control"
                      value={newTaskForm.priority}
                      onChange={(e: any) => setNewTaskForm({ ...newTaskForm, priority: e.target.value })}
                    >
                      <option value="high">Cao</option>
                      <option value="medium">Bình thường</option>
                      <option value="low">Thấp</option>
                    </select>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button 
                  type="button" 
                  className="btn btn-outline btn-sm"
                  onClick={() => setShowAddTaskModal(false)}
                >
                  Hủy
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary btn-sm"
                >
                  Lưu kế hoạch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentTimetable;
