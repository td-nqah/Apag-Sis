// ==========================================================================
// APAG Admin Curriculum & Regulations Component (React + TypeScript)
// Standard Table Architecture matching system guidelines:
// - Header background #D9E1F2, bold, centered
// - Cells border 1px solid #000000, Serif font (Times New Roman / Georgia)
// - Cards border 1.5pt solid #000000
// - Interactive accordion & course breakdown in Curriculum Config Modal
// ==========================================================================

import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  BookOpen, 
  Layers, 
  FileText, 
  Download, 
  Sliders, 
  Search, 
  ChevronDown, 
  ChevronRight, 
  Eye, 
  GraduationCap,
  ListFilter
} from 'lucide-react';
import { Utils } from '../../utils/utils';

export interface CourseDetail {
  code: string;
  name: string;
  credits: number;
  theory: number;
  practice: number;
  type: 'Bắt buộc' | 'Tự chọn';
  prereq?: string;
  semester: number;
}

export interface KnowledgeBlock {
  name: string;
  credits: number;
  comp: number;
  elec: number;
  courses: CourseDetail[];
}

export interface ProgramCurriculum {
  id: string;
  code: string;
  cohort: string;
  name: string;
  credits: number;
  semesters: number;
  breakdown: string;
  badgeClass: string;
  regulationCode: string;
  blocks: KnowledgeBlock[];
}

export interface RegulationItem {
  id: string;
  docCode: string;
  title: string;
  authority: string;
  effectiveFrom: string;
  keyArticles: string;
  ragChunks: number;
  type: string;
}

export const AdminCurriculum: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'programs' | 'regulations'>('programs');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [selectedProgram, setSelectedProgram] = useState<ProgramCurriculum | null>(null);
  const [modalViewMode, setModalViewMode] = useState<'blocks' | 'allCourses'>('blocks');
  const [expandedBlocks, setExpandedBlocks] = useState<Record<number, boolean>>({ 0: true, 1: false, 2: false });
  const [courseSearchInModal, setCourseSearchInModal] = useState('');

  // Regulations Modal State
  const [selectedReg, setSelectedReg] = useState<RegulationItem | null>(null);

  const [programs] = useState<ProgramCurriculum[]>([
    {
      id: 'cntt',
      code: 'CNTT-APAG',
      cohort: 'K22 - K26',
      name: 'CNTT trong Quản lý công',
      credits: 130,
      semesters: 8,
      breakdown: 'Khối ĐC: 24 TC · CSN: 30 TC · CN: 46 TC · TN: 15 TC · TC: 15 TC',
      badgeClass: 'badge-primary',
      regulationCode: 'QĐ 458/QĐ-HVHC',
      blocks: [
        {
          name: '1. Khối kiến thức Giáo dục đại cương',
          credits: 24,
          comp: 20,
          elec: 4,
          courses: [
            { code: 'ISF0009', name: 'Giáo dục quốc phòng và an ninh', credits: 8, theory: 3, practice: 5, type: 'Bắt buộc', semester: 1 },
            { code: 'CHUANNN', name: 'Chuẩn năng lực Ngoại ngữ bậc 3/6 (VSTEP B1)', credits: 3, theory: 3, practice: 0, type: 'Bắt buộc', semester: 1 },
            { code: 'CHUANTH', name: 'Chuẩn kỹ năng sử dụng CNTT cơ bản', credits: 3, theory: 1, practice: 2, type: 'Bắt buộc', semester: 1 },
            { code: 'ISF0010', name: 'Giáo dục thể chất', credits: 3, theory: 1, practice: 2, type: 'Bắt buộc', semester: 2 },
            { code: 'ISF0004', name: 'Chủ nghĩa xã hội khoa học', credits: 2, theory: 2, practice: 0, type: 'Bắt buộc', semester: 3 },
            { code: 'ISF0006', name: 'Lịch sử Đảng Cộng sản Việt Nam', credits: 2, theory: 2, practice: 0, type: 'Bắt buộc', semester: 3 },
            { code: 'SMF0003', name: 'Đạo đức công vụ và Trách nhiệm xã hội', credits: 3, theory: 3, practice: 0, type: 'Tự chọn', semester: 5 }
          ]
        },
        {
          name: '2. Khối kiến thức Cơ sở ngành & Liên ngành',
          credits: 30,
          comp: 24,
          elec: 6,
          courses: [
            { code: 'ISFI25-1005', name: 'Khởi nghiệp và đổi mới sáng tạo', credits: 3, theory: 2, practice: 1, type: 'Bắt buộc', semester: 2 },
            { code: 'EMF25-1013', name: 'Marketing căn bản và Truyền thông số', credits: 3, theory: 3, practice: 0, type: 'Bắt buộc', semester: 2 },
            { code: 'ISFI25-1007', name: 'Cấu trúc máy tính và Hệ điều hành', credits: 3, theory: 2, practice: 1, type: 'Bắt buộc', semester: 3 },
            { code: 'LIF0006', name: 'Xác suất và thống kê ứng dụng', credits: 3, theory: 2, practice: 1, type: 'Bắt buộc', semester: 3 },
            { code: 'LIF1009', name: 'Phương pháp tính và Đại số tuyến tính', credits: 3, theory: 2, practice: 1, type: 'Bắt buộc', semester: 3 },
            { code: 'LIF1010', name: 'Tối ưu hóa và Mô hình hóa toán học', credits: 3, theory: 2, practice: 1, type: 'Bắt buộc', prereq: 'LIF1009', semester: 3 },
            { code: 'ISFI25-1006', name: 'Ra quyết định dựa trên dữ liệu', credits: 3, theory: 2, practice: 1, type: 'Bắt buộc', prereq: 'LIF0006', semester: 4 },
            { code: 'ISFI25-1008', name: 'Nhập môn Hệ thống thông tin', credits: 3, theory: 3, practice: 0, type: 'Bắt buộc', semester: 2 },
            { code: 'AMF25-1009', name: 'Kỹ năng giao tiếp trong môi trường công vụ', credits: 3, theory: 3, practice: 0, type: 'Tự chọn', semester: 5 },
            { code: 'AMF25-1005', name: 'Kỹ năng soạn thảo văn bản quản lý nhà nước', credits: 3, theory: 3, practice: 0, type: 'Tự chọn', semester: 5 }
          ]
        },
        {
          name: '3. Khối kiến thức Chuyên ngành HTTT & Dữ liệu',
          credits: 46,
          comp: 36,
          elec: 10,
          courses: [
            { code: 'LIF2003', name: 'Phân tích và thiết kế hệ thống thông tin', credits: 3, theory: 2, practice: 1, type: 'Bắt buộc', prereq: 'LIF1006, LIF2004', semester: 3 },
            { code: 'LIF2019', name: 'Lập trình hướng đối tượng (OOP)', credits: 3, theory: 2, practice: 1, type: 'Bắt buộc', semester: 3 },
            { code: 'LIF1006', name: 'Cấu trúc dữ liệu và giải thuật', credits: 3, theory: 2, practice: 1, type: 'Bắt buộc', semester: 3 },
            { code: 'LIF2004', name: 'Hệ quản trị cơ sở dữ liệu', credits: 3, theory: 2, practice: 1, type: 'Bắt buộc', semester: 4 },
            { code: 'LIF2115', name: 'Lập trình Python phân tích dữ liệu', credits: 3, theory: 2, practice: 1, type: 'Bắt buộc', semester: 4 },
            { code: 'ISFI25-2004', name: 'Lập trình ứng dụng Java doanh nghiệp', credits: 3, theory: 2, practice: 1, type: 'Bắt buộc', prereq: 'LIF2019', semester: 4 },
            { code: 'LIF2113', name: 'Mạng máy tính và Truyền thông dữ liệu', credits: 3, theory: 2, practice: 1, type: 'Bắt buộc', prereq: 'ISFI25-1007', semester: 5 },
            { code: 'LIF2020', name: 'Lập trình ứng dụng Web doanh nghiệp', credits: 3, theory: 2, practice: 1, type: 'Bắt buộc', prereq: 'LIF2019', semester: 5 },
            { code: 'ISFI25-2007', name: 'Công nghệ phần mềm và Quản trị quy trình', credits: 3, theory: 2, practice: 1, type: 'Bắt buộc', prereq: 'LIF2003', semester: 5 },
            { code: 'ISFI25-2010', name: 'Khai phá dữ liệu và Học máy', credits: 3, theory: 2, practice: 1, type: 'Bắt buộc', prereq: 'LIF2004, LIF2115', semester: 5 },
            { code: 'ISFI25-2001', name: 'An toàn và bảo mật hệ thống thông tin', credits: 3, theory: 2, practice: 1, type: 'Bắt buộc', prereq: 'LIF2113', semester: 6 },
            { code: 'ISFI25-2002', name: 'Quản trị và vận hành hệ thống thông tin', credits: 3, theory: 2, practice: 1, type: 'Bắt buộc', prereq: 'LIF2003', semester: 6 },
            { code: 'LIF2005', name: 'Trí tuệ nhân tạo và Ứng dụng AI khu vực công', credits: 3, theory: 2, practice: 1, type: 'Bắt buộc', prereq: 'LIF2115', semester: 6 },
            { code: 'ISFI25-2005', name: 'Quản trị dự án công nghệ thông tin', credits: 3, theory: 3, practice: 0, type: 'Bắt buộc', prereq: 'ISFI25-2007', semester: 6 },
            { code: 'ISFI25-2014', name: 'Dữ liệu lớn và Công nghệ xử lý phân tán', credits: 3, theory: 2, practice: 1, type: 'Bắt buộc', prereq: 'ISFI25-2010', semester: 7 },
            { code: 'LIF2023', name: 'Lập trình ứng dụng với C# và .NET', credits: 3, theory: 2, practice: 1, type: 'Tự chọn', prereq: 'LIF2019', semester: 4 },
            { code: 'LIF2024', name: 'Lập trình ứng dụng với PHP và Laravel', credits: 3, theory: 2, practice: 1, type: 'Tự chọn', semester: 4 }
          ]
        },
        {
          name: '4. Thực tập tốt nghiệp & Khóa luận',
          credits: 15,
          comp: 15,
          elec: 0,
          courses: [
            { code: 'ISFI25-3001', name: 'Trải nghiệm thực tế tại cơ quan hành chính', credits: 3, theory: 0, practice: 3, type: 'Bắt buộc', semester: 6 },
            { code: 'ISFI25-3002', name: 'Thực tập tốt nghiệp chuyên môn', credits: 6, theory: 0, practice: 6, type: 'Bắt buộc', prereq: 'ISFI25-3001', semester: 7 },
            { code: 'ISFI25-3003', name: 'Khóa luận tốt nghiệp cử nhân', credits: 6, theory: 0, practice: 6, type: 'Bắt buộc', prereq: 'CPA >= 2.50', semester: 8 }
          ]
        },
        {
          name: '5. Học phần tự chọn tự do',
          credits: 15,
          comp: 0,
          elec: 15,
          courses: [
            { code: 'ELEC-01', name: 'Chuyển đổi số trong quản lý công', credits: 3, theory: 3, practice: 0, type: 'Tự chọn', semester: 6 },
            { code: 'ELEC-02', name: 'Quản trị đô thị thông minh và Hạ tầng IoT', credits: 3, theory: 3, practice: 0, type: 'Tự chọn', semester: 6 },
            { code: 'ELEC-03', name: 'Chính phủ số và Dịch vụ công trực tuyến', credits: 3, theory: 3, practice: 0, type: 'Tự chọn', semester: 7 },
            { code: 'ELEC-04', name: 'Kinh tế số và Thương mại điện tử', credits: 3, theory: 3, practice: 0, type: 'Tự chọn', semester: 7 },
            { code: 'ELEC-05', name: 'Pháp luật công nghệ thông tin và Sở hữu trí tuệ', credits: 3, theory: 3, practice: 0, type: 'Tự chọn', semester: 7 }
          ]
        }
      ]
    },
    {
      id: 'qlnn',
      code: 'QLNN-APAG',
      cohort: 'K22 - K26',
      name: 'Quản lý nhà nước',
      credits: 132,
      semesters: 8,
      breakdown: 'Khối ĐC: 24 TC · CSN: 34 TC · CN: 44 TC · TN: 15 TC · TC: 15 TC',
      badgeClass: 'badge-secondary',
      regulationCode: 'QĐ 458/QĐ-HVHC',
      blocks: [
        {
          name: '1. Khối kiến thức Giáo dục đại cương',
          credits: 24,
          comp: 20,
          elec: 4,
          courses: [
            { code: 'ISF0009', name: 'Giáo dục quốc phòng và an ninh', credits: 8, theory: 3, practice: 5, type: 'Bắt buộc', semester: 1 },
            { code: 'CHUANNN', name: 'Chuẩn năng lực Ngoại ngữ B1', credits: 3, theory: 3, practice: 0, type: 'Bắt buộc', semester: 1 },
            { code: 'CHUANTH', name: 'Chuẩn kỹ năng sử dụng CNTT cơ bản', credits: 3, theory: 1, practice: 2, type: 'Bắt buộc', semester: 1 },
            { code: 'ISF0010', name: 'Giáo dục thể chất', credits: 3, theory: 1, practice: 2, type: 'Bắt buộc', semester: 2 },
            { code: 'ISF0004', name: 'Chủ nghĩa xã hội khoa học', credits: 2, theory: 2, practice: 0, type: 'Bắt buộc', semester: 3 },
            { code: 'ISF0006', name: 'Lịch sử Đảng Cộng sản Việt Nam', credits: 2, theory: 2, practice: 0, type: 'Bắt buộc', semester: 3 },
            { code: 'SMF0003', name: 'Tâm lý học quản lý và đạo đức công vụ', credits: 3, theory: 3, practice: 0, type: 'Tự chọn', semester: 5 }
          ]
        },
        {
          name: '2. Khối kiến thức Cơ sở ngành Quản trị công',
          credits: 34,
          comp: 28,
          elec: 6,
          courses: [
            { code: 'PAD1001', name: 'Khoa học quản lý đại cương', credits: 3, theory: 3, practice: 0, type: 'Bắt buộc', semester: 2 },
            { code: 'PAD1002', name: 'Tổ chức bộ máy hành chính nhà nước', credits: 3, theory: 3, practice: 0, type: 'Bắt buộc', semester: 2 },
            { code: 'PAD1003', name: 'Kinh tế học công cộng', credits: 3, theory: 3, practice: 0, type: 'Bắt buộc', semester: 3 },
            { code: 'PAD1004', name: 'Quản trị nhân lực khu vực công', credits: 3, theory: 3, practice: 0, type: 'Bắt buộc', semester: 3 },
            { code: 'PAD1005', name: 'Luật hành chính và Tố tụng hành chính', credits: 4, theory: 4, practice: 0, type: 'Bắt buộc', semester: 3 },
            { code: 'PAD1006', name: 'Phân tích và hoạch định chính sách công', credits: 3, theory: 3, practice: 0, type: 'Bắt buộc', semester: 4 },
            { code: 'PAD1007', name: 'Tài chính công và Ngân sách nhà nước', credits: 3, theory: 3, practice: 0, type: 'Bắt buộc', semester: 4 },
            { code: 'PAD1008', name: 'Kỹ năng điều hành và tổ chức công vụ', credits: 3, theory: 2, practice: 1, type: 'Bắt buộc', semester: 4 },
            { code: 'PAD1009', name: 'Quan hệ công chúng trong cơ quan nhà nước', credits: 3, theory: 3, practice: 0, type: 'Tự chọn', semester: 5 },
            { code: 'PAD1010', name: 'Văn hóa công sở và Lễ tân ngoại giao', credits: 3, theory: 3, practice: 0, type: 'Tự chọn', semester: 5 }
          ]
        },
        {
          name: '3. Khối kiến thức Chuyên ngành Quản lý nhà nước',
          credits: 44,
          comp: 34,
          elec: 10,
          courses: [
            { code: 'PAD2001', name: 'Quản lý nhà nước về kinh tế', credits: 3, theory: 3, practice: 0, type: 'Bắt buộc', semester: 5 },
            { code: 'PAD2002', name: 'Quản lý nhà nước về xã hội và dân tộc', credits: 3, theory: 3, practice: 0, type: 'Bắt buộc', semester: 5 },
            { code: 'PAD2003', name: 'Quản lý nhà nước về đô thị và nông thôn', credits: 3, theory: 3, practice: 0, type: 'Bắt buộc', semester: 5 },
            { code: 'PAD2004', name: 'Thanh tra và Kiểm tra công vụ', credits: 3, theory: 3, practice: 0, type: 'Bắt buộc', semester: 6 },
            { code: 'PAD2005', name: 'Giải quyết khiếu nại, tố cáo hành chính', credits: 3, theory: 3, practice: 0, type: 'Bắt buộc', semester: 6 },
            { code: 'PAD2006', name: 'Quản lý dịch vụ công và Đấu thầu công', credits: 3, theory: 3, practice: 0, type: 'Bắt buộc', semester: 6 },
            { code: 'PAD2007', name: 'Cải cách hành chính nhà nước', credits: 3, theory: 3, practice: 0, type: 'Bắt buộc', semester: 6 },
            { code: 'PAD2008', name: 'Chính sách an sinh xã hội và xóa đói giảm nghèo', credits: 3, theory: 3, practice: 0, type: 'Bắt buộc', semester: 7 },
            { code: 'PAD2009', name: 'Đánh giá tác động chính sách (RIA)', credits: 3, theory: 2, practice: 1, type: 'Bắt buộc', semester: 7 },
            { code: 'PAD2010', name: 'Chính quyền điện tử và Dữ liệu hành chính', credits: 3, theory: 2, practice: 1, type: 'Bắt buộc', semester: 7 },
            { code: 'PAD2011', name: 'Quản lý tài nguyên, môi trường và biến đổi khí hậu', credits: 3, theory: 3, practice: 0, type: 'Tự chọn', semester: 6 },
            { code: 'PAD2012', name: 'Quản trị khủng hoảng và Truyền thông chính sách', credits: 3, theory: 3, practice: 0, type: 'Tự chọn', semester: 7 }
          ]
        },
        {
          name: '4. Thực tập tốt nghiệp & Khóa luận',
          credits: 15,
          comp: 15,
          elec: 0,
          courses: [
            { code: 'PAD3001', name: 'Kiến tập tại cơ quan hành chính địa phương', credits: 3, theory: 0, practice: 3, type: 'Bắt buộc', semester: 6 },
            { code: 'PAD3002', name: 'Thực tập tốt nghiệp quản lý nhà nước', credits: 6, theory: 0, practice: 6, type: 'Bắt buộc', semester: 7 },
            { code: 'PAD3003', name: 'Khóa luận tốt nghiệp quản lý nhà nước', credits: 6, theory: 0, practice: 6, type: 'Bắt buộc', semester: 8 }
          ]
        },
        {
          name: '5. Học phần tự chọn tự do',
          credits: 15,
          comp: 0,
          elec: 15,
          courses: [
            { code: 'PAD-EL01', name: 'Quản lý dự án đầu tư công', credits: 3, theory: 3, practice: 0, type: 'Tự chọn', semester: 6 },
            { code: 'PAD-EL02', name: 'Hợp tác quốc tế trong quản trị công', credits: 3, theory: 3, practice: 0, type: 'Tự chọn', semester: 6 },
            { code: 'PAD-EL03', name: 'Giám sát xã hội và Dân chủ cơ sở', credits: 3, theory: 3, practice: 0, type: 'Tự chọn', semester: 7 },
            { code: 'PAD-EL04', name: 'Quản lý tài sản công', credits: 3, theory: 3, practice: 0, type: 'Tự chọn', semester: 7 },
            { code: 'PAD-EL05', name: 'Chính sách phát triển kinh tế vùng', credits: 3, theory: 3, practice: 0, type: 'Tự chọn', semester: 7 }
          ]
        }
      ]
    },
    {
      id: 'law',
      code: 'LAW-APAG',
      cohort: 'K22 - K26',
      name: 'Luật học & Pháp luật đại cương',
      credits: 135,
      semesters: 8,
      breakdown: 'Khối ĐC: 24 TC · CSN: 36 TC · CN: 45 TC · TN: 15 TC · TC: 15 TC',
      badgeClass: 'badge-secondary',
      regulationCode: 'QĐ 458/QĐ-HVHC',
      blocks: [
        {
          name: '1. Khối kiến thức Giáo dục đại cương',
          credits: 24,
          comp: 20,
          elec: 4,
          courses: [
            { code: 'ISF0009', name: 'Giáo dục quốc phòng và an ninh', credits: 8, theory: 3, practice: 5, type: 'Bắt buộc', semester: 1 },
            { code: 'CHUANNN', name: 'Chuẩn năng lực Ngoại ngữ B1', credits: 3, theory: 3, practice: 0, type: 'Bắt buộc', semester: 1 },
            { code: 'CHUANTH', name: 'Chuẩn kỹ năng sử dụng CNTT cơ bản', credits: 3, theory: 1, practice: 2, type: 'Bắt buộc', semester: 1 },
            { code: 'ISF0010', name: 'Giáo dục thể chất', credits: 3, theory: 1, practice: 2, type: 'Bắt buộc', semester: 2 },
            { code: 'ISF0004', name: 'Chủ nghĩa xã hội khoa học', credits: 2, theory: 2, practice: 0, type: 'Bắt buộc', semester: 3 },
            { code: 'ISF0006', name: 'Lịch sử Đảng Cộng sản Việt Nam', credits: 2, theory: 2, practice: 0, type: 'Bắt buộc', semester: 3 },
            { code: 'LAW1000', name: 'Logic học đại cương', credits: 3, theory: 3, practice: 0, type: 'Tự chọn', semester: 4 }
          ]
        },
        {
          name: '2. Khối kiến thức Cơ sở ngành Pháp luật',
          credits: 36,
          comp: 30,
          elec: 6,
          courses: [
            { code: 'LAW1001', name: 'Lý luận chung về Nhà nước và Pháp luật', credits: 4, theory: 4, practice: 0, type: 'Bắt buộc', semester: 2 },
            { code: 'LAW1002', name: 'Lịch sử nhà nước và pháp luật Việt Nam', credits: 3, theory: 3, practice: 0, type: 'Bắt buộc', semester: 2 },
            { code: 'LAW1003', name: 'Luật Hiến pháp Việt Nam', credits: 4, theory: 4, practice: 0, type: 'Bắt buộc', semester: 2 },
            { code: 'LAW1004', name: 'Luật Hành chính', credits: 4, theory: 4, practice: 0, type: 'Bắt buộc', semester: 3 },
            { code: 'LAW1005', name: 'Luật Dân sự 1 (Tài sản và quyền sở hữu)', credits: 4, theory: 4, practice: 0, type: 'Bắt buộc', semester: 3 },
            { code: 'LAW1006', name: 'Luật Hình sự 1', credits: 4, theory: 4, practice: 0, type: 'Bắt buộc', semester: 3 },
            { code: 'LAW1007', name: 'Luật Tố tụng dân sự', credits: 4, theory: 4, practice: 0, type: 'Bắt buộc', semester: 4 },
            { code: 'LAW1008', name: 'Luật Tố tụng hình sự', credits: 3, theory: 3, practice: 0, type: 'Bắt buộc', semester: 4 },
            { code: 'LAW1009', name: 'Xây dựng và ban hành văn bản quy phạm pháp luật', credits: 3, theory: 3, practice: 0, type: 'Tự chọn', semester: 5 },
            { code: 'LAW1010', name: 'Pháp luật so sánh', credits: 3, theory: 3, practice: 0, type: 'Tự chọn', semester: 5 }
          ]
        },
        {
          name: '3. Khối kiến thức Chuyên ngành Luật hành chính',
          credits: 45,
          comp: 35,
          elec: 10,
          courses: [
            { code: 'LAW2001', name: 'Luật Tố tụng hành chính', credits: 4, theory: 4, practice: 0, type: 'Bắt buộc', semester: 5 },
            { code: 'LAW2002', name: 'Luật Đất đai và Môi trường', credits: 4, theory: 4, practice: 0, type: 'Bắt buộc', semester: 5 },
            { code: 'LAW2003', name: 'Luật Doanh nghiệp và Thương mại', credits: 4, theory: 4, practice: 0, type: 'Bắt buộc', semester: 5 },
            { code: 'LAW2004', name: 'Luật Lao động và An sinh xã hội', credits: 3, theory: 3, practice: 0, type: 'Bắt buộc', semester: 6 },
            { code: 'LAW2005', name: 'Luật Thuế và Ngân sách', credits: 3, theory: 3, practice: 0, type: 'Bắt buộc', semester: 6 },
            { code: 'LAW2006', name: 'Pháp luật về Công chức và Công vụ', credits: 3, theory: 3, practice: 0, type: 'Bắt buộc', semester: 6 },
            { code: 'LAW2007', name: 'Pháp luật về Phòng, chống tham nhũng', credits: 3, theory: 3, practice: 0, type: 'Bắt buộc', semester: 6 },
            { code: 'LAW2008', name: 'Kỹ năng giải quyết tranh chấp hành chính', credits: 3, theory: 2, practice: 1, type: 'Bắt buộc', semester: 7 },
            { code: 'LAW2009', name: 'Kỹ năng tư vấn pháp luật và trợ giúp pháp lý', credits: 3, theory: 2, practice: 1, type: 'Bắt buộc', semester: 7 },
            { code: 'LAW2010', name: 'Công pháp quốc tế', credits: 3, theory: 3, practice: 0, type: 'Bắt buộc', semester: 7 },
            { code: 'LAW2011', name: 'Tư pháp quốc tế', credits: 2, theory: 2, practice: 0, type: 'Bắt buộc', semester: 7 },
            { code: 'LAW2012', name: 'Pháp luật về Dân chủ ở cơ sở', credits: 3, theory: 3, practice: 0, type: 'Tự chọn', semester: 6 },
            { code: 'LAW2013', name: 'Pháp luật về Đấu thầu và Đầu tư công', credits: 3, theory: 3, practice: 0, type: 'Tự chọn', semester: 7 }
          ]
        },
        {
          name: '4. Thực tập tốt nghiệp & Khóa luận',
          credits: 15,
          comp: 15,
          elec: 0,
          courses: [
            { code: 'LAW3001', name: 'Kiến tập tại Tòa án và Viện kiểm sát', credits: 3, theory: 0, practice: 3, type: 'Bắt buộc', semester: 6 },
            { code: 'LAW3002', name: 'Thực tập tốt nghiệp pháp luật', credits: 6, theory: 0, practice: 6, type: 'Bắt buộc', semester: 7 },
            { code: 'LAW3003', name: 'Khóa luận tốt nghiệp ngành Luật', credits: 6, theory: 0, practice: 6, type: 'Bắt buộc', semester: 8 }
          ]
        },
        {
          name: '5. Học phần tự chọn tự do',
          credits: 15,
          comp: 0,
          elec: 15,
          courses: [
            { code: 'LAW-EL01', name: 'Kỹ năng tranh tụng trong vụ án hành chính', credits: 3, theory: 2, practice: 1, type: 'Tự chọn', semester: 6 },
            { code: 'LAW-EL02', name: 'Pháp luật về Hợp đồng công và PPP', credits: 3, theory: 3, practice: 0, type: 'Tự chọn', semester: 6 },
            { code: 'LAW-EL03', name: 'Giám định tư pháp và Luật sư', credits: 3, theory: 3, practice: 0, type: 'Tự chọn', semester: 7 },
            { code: 'LAW-EL04', name: 'Pháp luật về Chứng khoán và Tài chính', credits: 3, theory: 3, practice: 0, type: 'Tự chọn', semester: 7 },
            { code: 'LAW-EL05', name: 'Quyền con người và Quyền công dân', credits: 3, theory: 3, practice: 0, type: 'Tự chọn', semester: 7 }
          ]
        }
      ]
    }
  ]);

  const [regulations] = useState<RegulationItem[]>([
    {
      id: 'reg-1',
      docCode: 'QĐ 458/QĐ-HVHC',
      title: 'Quy chế đào tạo đại học chính quy theo hệ thống tín chỉ',
      authority: 'Giám đốc Học viện',
      effectiveFrom: 'Từ năm học 2022-2023',
      keyArticles: 'Điều 14 (Cảnh báo kết quả), Điều 18 (Điều kiện tốt nghiệp), Điều 10 (Học phần tiên quyết)',
      ragChunks: 14,
      type: 'Quy chế đào tạo'
    },
    {
      id: 'reg-2',
      docCode: 'QĐ 120/QĐ-HVHC',
      title: 'Quy định chuẩn đầu ra Năng lực ngoại ngữ và Tin học K25',
      authority: 'Giám đốc Học viện',
      effectiveFrom: 'Khóa K23 trở về sau',
      keyArticles: 'Điều 4 (Chuẩn Ngoại ngữ VSTEP B1), Điều 6 (Chuẩn kỹ năng CNTT cơ bản)',
      ragChunks: 8,
      type: 'Chuẩn đầu ra'
    },
    {
      id: 'reg-3',
      docCode: 'HD 89/HD-HVHC',
      title: 'Hướng dẫn tổ chức thực tập và xét khóa luận tốt nghiệp cử nhân',
      authority: 'Phòng Quản lý Đào tạo',
      effectiveFrom: 'Khóa K22 - K26',
      keyArticles: 'Điều 3 (Điều kiện làm khóa luận CPA >= 3.0), Điều 5 (Đánh giá học phần thực tập 15 TC)',
      ragChunks: 6,
      type: 'Hướng dẫn thực hiện'
    }
  ]);

  const handleOpenConfig = (p: ProgramCurriculum) => {
    setSelectedProgram(p);
    setModalViewMode('blocks');
    setExpandedBlocks({ 0: true, 1: false, 2: false, 3: false, 4: false });
    setCourseSearchInModal('');
  };

  const handleSaveConfig = () => {
    Utils.showToast(`Đã lưu cấu hình khung chương trình đào tạo ${selectedProgram?.name} thành công!`, 'success');
    setSelectedProgram(null);
  };

  const toggleBlockExpand = (index: number) => {
    setExpandedBlocks(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const expandAllBlocks = () => {
    if (!selectedProgram) return;
    const allExp: Record<number, boolean> = {};
    selectedProgram.blocks.forEach((_, idx) => {
      allExp[idx] = true;
    });
    setExpandedBlocks(allExp);
  };

  const collapseAllBlocks = () => {
    setExpandedBlocks({});
  };

  const filteredPrograms = programs.filter(p => 
    p.code.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
    p.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
    p.cohort.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  const filteredRegulations = regulations.filter(r => 
    r.docCode.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
    r.title.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
    r.type.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  // All courses of selected program for flat table view
  const allCoursesOfSelectedProgram = selectedProgram
    ? selectedProgram.blocks.flatMap(b => b.courses.map(c => ({ ...c, blockName: b.name })))
    : [];

  const filteredAllCoursesInModal = allCoursesOfSelectedProgram.filter(c => 
    c.code.toLowerCase().includes(courseSearchInModal.toLowerCase().trim()) ||
    c.name.toLowerCase().includes(courseSearchInModal.toLowerCase().trim()) ||
    c.blockName.toLowerCase().includes(courseSearchInModal.toLowerCase().trim())
  );

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
      {/* Top Action Toolbar */}
      <div 
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '16px'
        }}
      >
          {/* Tab Switcher */}
          <div style={{ display: 'flex', background: 'var(--surface-subtle)', padding: '2px', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <button
              type="button"
              onClick={() => setActiveTab('programs')}
              style={{
                padding: '6px 14px',
                fontSize: '0.75rem',
                fontWeight: activeTab === 'programs' ? 700 : 500,
                color: activeTab === 'programs' ? 'var(--text-primary)' : 'var(--text-secondary)',
                backgroundColor: activeTab === 'programs' ? 'var(--surface)' : 'transparent',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              📚 Khung chương trình đào tạo ({programs.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('regulations')}
              style={{
                padding: '6px 14px',
                fontSize: '0.75rem',
                fontWeight: activeTab === 'regulations' ? 700 : 500,
                color: activeTab === 'regulations' ? 'var(--text-primary)' : 'var(--text-secondary)',
                backgroundColor: activeTab === 'regulations' ? 'var(--surface)' : 'transparent',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              📜 Văn bản quy chế đào tạo ({regulations.length})
            </button>
          </div>

          <div style={{ position: 'relative', width: '240px' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              className="form-control"
              placeholder="Tìm kiếm chương trình, quy chế..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '30px', fontSize: '0.75rem', height: '32px' }}
            />
          </div>
        </div>

      {/* Main Table Content */}
      {activeTab === 'programs' ? (
        <div 
          className="minimal-card"
          style={{
            border: '1px solid var(--border)',
            borderRadius: '10px',
            backgroundColor: 'var(--surface)',
            overflow: 'hidden',
            marginBottom: '24px'
          }}
        >
          <div className="table-responsive">
            <table className="minimal-table">
              <thead>
                <tr>
                  <th style={{ width: '130px' }}>MÃ CTĐT</th>
                  <th style={{ width: '220px' }}>TÊN CHƯƠNG TRÌNH ĐÀO TẠO</th>
                  <th style={{ width: '110px' }}>KHÓA ÁP DỤNG</th>
                  <th style={{ width: '110px', textAlign: 'right' }}>TỔNG TÍN CHỈ</th>
                  <th style={{ width: '110px', textAlign: 'center' }}>THỜI GIAN</th>
                  <th>CƠ CẤU KHỐI KIẾN THỨC</th>
                  <th style={{ width: '140px' }}>QUY CHUẨN ÁP DỤNG</th>
                  <th style={{ width: '130px', textAlign: 'center' }}>THAO TÁC</th>
                </tr>
              </thead>
              <tbody>
                {filteredPrograms.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                      Không tìm thấy chương trình đào tạo nào phù hợp.
                    </td>
                  </tr>
                ) : (
                  filteredPrograms.map((p) => (
                    <tr key={p.id}>
                      <td style={{ fontWeight: 600 }}>
                        <code>{p.code}</code>
                      </td>
                      <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                        {p.name}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <code>{p.cohort}</code>
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--primary)' }}>
                        {p.credits} TC
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {p.semesters} học kỳ
                      </td>
                      <td style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                        {p.breakdown}
                      </td>
                      <td>
                        <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{p.regulationCode}</span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          type="button"
                          className="btn btn-outline btn-xs"
                          onClick={() => handleOpenConfig(p)}
                          style={{ fontSize: '0.75rem', padding: '4px 10px', whiteSpace: 'nowrap' }}
                        >
                          Cấu hình chi tiết
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div 
          className="minimal-card"
          style={{
            border: '1px solid var(--border)',
            borderRadius: '10px',
            backgroundColor: 'var(--surface)',
            overflow: 'hidden',
            marginBottom: '24px'
          }}
        >
          <div className="table-responsive">
            <table className="minimal-table">
              <thead>
                <tr>
                  <th style={{ width: '140px' }}>SỐ HIỆU VĂN BẢN</th>
                  <th style={{ width: '260px' }}>TÊN VĂN BẢN QUY CHẾ & PHÁP QUY</th>
                  <th style={{ width: '130px' }}>PHÂN LOẠI</th>
                  <th style={{ width: '140px' }}>CƠ QUAN BAN HÀNH</th>
                  <th style={{ width: '130px' }}>HIỆU LỰC</th>
                  <th>CÁC ĐIỀU KHOẢN TRỌNG YẾU</th>
                  <th style={{ width: '120px', textAlign: 'center' }}>CHỈ MỤC RAG</th>
                  <th style={{ width: '120px', textAlign: 'center' }}>THAO TÁC</th>
                </tr>
              </thead>
              <tbody>
                {filteredRegulations.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                      Không tìm thấy văn bản quy chế nào phù hợp.
                    </td>
                  </tr>
                ) : (
                  filteredRegulations.map((r) => (
                    <tr key={r.id}>
                      <td style={{ fontWeight: 600 }}>
                        <code>{r.docCode}</code>
                      </td>
                      <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                        {r.title}
                      </td>
                      <td>
                        <span>{r.type}</span>
                      </td>
                      <td>{r.authority}</td>
                      <td>{r.effectiveFrom}</td>
                      <td style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                        {r.keyArticles}
                      </td>
                      <td style={{ textAlign: 'center', fontWeight: 600 }}>
                        {r.ragChunks} phân đoạn
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          type="button"
                          className="btn btn-outline btn-xs"
                          onClick={() => setSelectedReg(r)}
                          style={{ fontSize: '0.75rem', padding: '4px 10px', whiteSpace: 'nowrap' }}
                        >
                          Xem chi tiết
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL: CẤU HÌNH KHUNG CHƯƠNG TRÌNH & XEM HỌC PHẦN BÊN TRONG
          ==================================================================== */}
      {selectedProgram && (
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
            if (e.target === e.currentTarget) setSelectedProgram(null);
          }}
        >
          <div 
            style={{ 
              maxWidth: '960px',
              width: '100%',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: 'var(--surface)',
              borderRadius: '12px',
              border: '1px solid var(--border)',
              padding: '24px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
            }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
              <div>
                <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  Cấu hình khung chương trình: {selectedProgram.name}
                </h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  Mã: <strong>{selectedProgram.code}</strong> • Tổng: <strong>{selectedProgram.credits} Tín chỉ</strong> ({selectedProgram.semesters} học kỳ)
                </span>
              </div>
              <button 
                type="button" 
                onClick={() => setSelectedProgram(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px' }}
                title="Đóng modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Regulatory Note */}
            <div style={{ padding: '8px 12px', borderRadius: '8px', backgroundColor: 'var(--surface-subtle)', border: '1px solid var(--border)', fontSize: '0.75rem', marginBottom: '14px' }}>
              <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Quy chuẩn đào tạo áp dụng: </span>
              <span style={{ color: 'var(--text-secondary)' }}>{selectedProgram.regulationCode} về ban hành chuẩn chương trình đào tạo đại học chính quy theo hệ thống tín chỉ.</span>
            </div>

            {/* Modal View Mode Tabs & Quick Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
              <div style={{ display: 'flex', background: 'var(--surface-subtle)', padding: '2px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <button
                  type="button"
                  onClick={() => setModalViewMode('blocks')}
                  style={{
                    padding: '4px 12px',
                    fontSize: '0.75rem',
                    fontWeight: modalViewMode === 'blocks' ? 700 : 500,
                    color: modalViewMode === 'blocks' ? 'var(--text-primary)' : 'var(--text-secondary)',
                    backgroundColor: modalViewMode === 'blocks' ? 'var(--surface)' : 'transparent',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  📊 Phân bổ theo khối kiến thức (5 khối)
                </button>
                <button
                  type="button"
                  onClick={() => setModalViewMode('allCourses')}
                  style={{
                    padding: '4px 12px',
                    fontSize: '0.75rem',
                    fontWeight: modalViewMode === 'allCourses' ? 700 : 500,
                    color: modalViewMode === 'allCourses' ? 'var(--text-primary)' : 'var(--text-secondary)',
                    backgroundColor: modalViewMode === 'allCourses' ? 'var(--surface)' : 'transparent',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  📚 Danh mục toàn bộ học phần ({allCoursesOfSelectedProgram.length} học phần)
                </button>
              </div>

              {modalViewMode === 'blocks' ? (
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button 
                    type="button" 
                    className="btn btn-outline btn-xs"
                    onClick={expandAllBlocks}
                    style={{ fontSize: '0.6875rem', padding: '3px 8px' }}
                  >
                    Mở rộng tất cả học phần
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-outline btn-xs"
                    onClick={collapseAllBlocks}
                    style={{ fontSize: '0.6875rem', padding: '3px 8px' }}
                  >
                    Thu gọn
                  </button>
                </div>
              ) : (
                <div style={{ position: 'relative', width: '220px' }}>
                  <Search size={13} style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input 
                    type="text" 
                    className="form-control"
                    placeholder="Tìm kiếm học phần theo mã hoặc tên..."
                    value={courseSearchInModal}
                    onChange={(e) => setCourseSearchInModal(e.target.value)}
                    style={{ paddingLeft: '26px', fontSize: '0.6875rem', height: '28px' }}
                  />
                </div>
              )}
            </div>

            {/* Modal Body Scroll Area */}
            <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px', marginBottom: '16px' }}>
              {modalViewMode === 'blocks' ? (
                /* ACCORDION TABLE: 5 BLOCKS WITH EXPANDABLE COURSES */
                <div style={{ border: '1px solid var(--border)', borderRadius: '8px', overflowX: 'auto' }}>
                  <table className="minimal-table" style={{ width: '100%', marginBottom: 0 }}>
                    <thead>
                      <tr>
                        <th style={{ textAlign: 'left', paddingLeft: '14px' }}>KHỐI KIẾN THỨC</th>
                        <th style={{ width: '110px', textAlign: 'center' }}>TỔNG SỐ TC</th>
                        <th style={{ width: '100px', textAlign: 'center' }}>BẮT BUỘC</th>
                        <th style={{ width: '100px', textAlign: 'center' }}>TỰ CHỌN</th>
                        <th style={{ width: '160px', textAlign: 'center' }}>CHI TIẾT HỌC PHẦN</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedProgram.blocks.map((b, i) => {
                        const isExpanded = !!expandedBlocks[i];
                        return (
                          <React.Fragment key={i}>
                            {/* Parent Block Row */}
                            <tr 
                              style={{ 
                                backgroundColor: isExpanded ? 'var(--surface-subtle)' : 'var(--surface)',
                                cursor: 'pointer',
                                transition: 'background-color 0.15s ease'
                              }}
                              onClick={() => toggleBlockExpand(i)}
                            >
                              <td style={{ fontWeight: 700, paddingLeft: '14px', color: 'var(--text-primary)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  {isExpanded ? (
                                    <ChevronDown size={16} className="text-primary" />
                                  ) : (
                                    <ChevronRight size={16} className="text-muted" />
                                  )}
                                  <span>{b.name}</span>
                                </div>
                              </td>
                              <td style={{ textAlign: 'center', fontWeight: 700, color: 'var(--primary)' }}>
                                {b.credits} TC
                              </td>
                              <td style={{ textAlign: 'center' }}>{b.comp} TC</td>
                              <td style={{ textAlign: 'center' }}>{b.elec} TC</td>
                              <td style={{ textAlign: 'center' }}>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleBlockExpand(i);
                                  }}
                                  className="btn btn-outline btn-xs"
                                  style={{
                                    fontSize: '0.6875rem',
                                    padding: '2px 8px',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    backgroundColor: isExpanded ? 'var(--primary)' : 'var(--surface)',
                                    color: isExpanded ? '#FFFFFF' : 'var(--text-primary)'
                                  }}
                                >
                                  <Eye size={12} />
                                  <span>{isExpanded ? 'Thu gọn học phần' : `Xem ${b.courses.length} học phần`}</span>
                                </button>
                              </td>
                            </tr>

                            {/* Expanded Nested Table: Courses Inside this Block */}
                            {isExpanded && (
                              <tr>
                                <td colSpan={5} style={{ padding: '0', backgroundColor: '#F8FAFC' }}>
                                  <div style={{ padding: '12px 14px', borderTop: '1px dashed #CBD5E1', borderBottom: '1px solid var(--border)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                                        📋 Danh sách các học phần thuộc: <span style={{ color: 'var(--primary)' }}>{b.name}</span>
                                      </span>
                                      <span style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>
                                        Tổng {b.courses.length} học phần ({b.courses.reduce((acc, c) => acc + c.credits, 0)} TC)
                                      </span>
                                    </div>

                                    {/* Nested Table */}
                                    <div style={{ border: '1px solid var(--border)', borderRadius: '6px', overflowX: 'auto', backgroundColor: 'var(--surface)' }}>
                                      <table className="minimal-table" style={{ width: '100%', marginBottom: 0, fontSize: '0.75rem' }}>
                                        <thead>
                                          <tr style={{ backgroundColor: '#E2E8F0' }}>
                                            <th style={{ width: '100px', textAlign: 'center' }}>MÃ HỌC PHẦN</th>
                                            <th>TÊN HỌC PHẦN</th>
                                            <th style={{ width: '80px', textAlign: 'center' }}>TÍN CHỈ</th>
                                            <th style={{ width: '90px', textAlign: 'center' }}>LT / TH</th>
                                            <th style={{ width: '95px', textAlign: 'center' }}>LOẠI</th>
                                            <th style={{ width: '160px' }}>HỌC PHẦN TIÊN QUYẾT</th>
                                            <th style={{ width: '95px', textAlign: 'center' }}>HỌC KỲ GỢI Ý</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {b.courses.map((c, cIdx) => (
                                            <tr key={cIdx} style={{ backgroundColor: cIdx % 2 === 0 ? 'var(--surface)' : 'var(--surface-subtle)' }}>
                                              <td style={{ textAlign: 'center' }}>
                                                <code>{c.code}</code>
                                              </td>
                                              <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                                                {c.name}
                                              </td>
                                              <td style={{ textAlign: 'center', fontWeight: 700, color: 'var(--primary)' }}>
                                                {c.credits} TC
                                              </td>
                                              <td style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                                                {c.theory} / {c.practice}
                                              </td>
                                              <td style={{ textAlign: 'center' }}>
                                                <span 
                                                  style={{
                                                    fontSize: '0.6875rem',
                                                    fontWeight: 600,
                                                    padding: '1px 6px',
                                                    borderRadius: '4px',
                                                    backgroundColor: c.type === 'Bắt buộc' ? '#EFF6FF' : '#FEF3C7',
                                                    color: c.type === 'Bắt buộc' ? '#2563EB' : '#D97706',
                                                    border: `1px solid ${c.type === 'Bắt buộc' ? '#BFDBFE' : '#FDE68A'}`
                                                  }}
                                                >
                                                  {c.type}
                                                </span>
                                              </td>
                                              <td style={{ fontSize: '0.6875rem', color: c.prereq ? 'var(--danger)' : 'var(--text-muted)' }}>
                                                {c.prereq ? `Tiên quyết: ${c.prereq}` : '—'}
                                              </td>
                                              <td style={{ textAlign: 'center', fontWeight: 600, color: 'var(--text-secondary)' }}>
                                                Học kỳ {c.semester}
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                /* FLAT ALL COURSES TABLE */
                <div style={{ border: '1px solid var(--border)', borderRadius: '8px', overflowX: 'auto' }}>
                  <table className="minimal-table" style={{ width: '100%', marginBottom: 0, fontSize: '0.75rem' }}>
                    <thead>
                      <tr>
                        <th style={{ width: '100px', textAlign: 'center' }}>MÃ HP</th>
                        <th>TÊN HỌC PHẦN</th>
                        <th style={{ width: '180px' }}>KHỐI KIẾN THỨC</th>
                        <th style={{ width: '75px', textAlign: 'center' }}>SỐ TC</th>
                        <th style={{ width: '80px', textAlign: 'center' }}>LT / TH</th>
                        <th style={{ width: '90px', textAlign: 'center' }}>PHÂN LOẠI</th>
                        <th style={{ width: '140px' }}>TIÊN QUYẾT</th>
                        <th style={{ width: '80px', textAlign: 'center' }}>HỌC KỲ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAllCoursesInModal.length === 0 ? (
                        <tr>
                          <td colSpan={8} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                            Không tìm thấy học phần nào khớp với từ khóa tìm kiếm.
                          </td>
                        </tr>
                      ) : (
                        filteredAllCoursesInModal.map((c, idx) => (
                          <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? 'var(--surface)' : 'var(--surface-subtle)' }}>
                            <td style={{ textAlign: 'center' }}>
                              <code>{c.code}</code>
                            </td>
                            <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                              {c.name}
                            </td>
                            <td style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>
                              {c.blockName}
                            </td>
                            <td style={{ textAlign: 'center', fontWeight: 700, color: 'var(--primary)' }}>
                              {c.credits} TC
                            </td>
                            <td style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                              {c.theory} / {c.practice}
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              <span 
                                style={{
                                  fontSize: '0.6875rem',
                                  fontWeight: 600,
                                  padding: '1px 6px',
                                  borderRadius: '4px',
                                  backgroundColor: c.type === 'Bắt buộc' ? '#EFF6FF' : '#FEF3C7',
                                  color: c.type === 'Bắt buộc' ? '#2563EB' : '#D97706',
                                  border: `1px solid ${c.type === 'Bắt buộc' ? '#BFDBFE' : '#FDE68A'}`
                                }}
                              >
                                {c.type}
                              </span>
                            </td>
                            <td style={{ fontSize: '0.6875rem', color: c.prereq ? 'var(--danger)' : 'var(--text-muted)' }}>
                              {c.prereq || '—'}
                            </td>
                            <td style={{ textAlign: 'center', fontWeight: 600, color: 'var(--text-secondary)' }}>
                              HK {c.semester}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '14px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                💡 <em>Mẹo: Bạn có thể nhấp trực tiếp vào tên khối kiến thức hoặc bấm nút "Xem học phần" để mở danh sách học phần bên trong.</em>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setSelectedProgram(null)}>
                  Đóng
                </button>
                <button type="button" className="btn btn-primary btn-sm" onClick={handleSaveConfig}>
                  Lưu cấu hình CTĐT
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Regulation Detail Modal */}
      {selectedReg && (
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
            if (e.target === e.currentTarget) setSelectedReg(null);
          }}
        >
          <div 
            style={{ 
              maxWidth: '620px',
              width: '100%',
              backgroundColor: 'var(--surface)',
              borderRadius: '12px',
              border: '1px solid var(--border)',
              padding: '24px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  {selectedReg.docCode}: {selectedReg.title}
                </h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  Cơ quan: {selectedReg.authority} • {selectedReg.effectiveFrom}
                </span>
              </div>
              <button 
                type="button" 
                onClick={() => setSelectedReg(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
              <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: 'var(--surface-subtle)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  Các điều khoản trọng yếu được trích xuất:
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {selectedReg.keyArticles}
                </div>
              </div>

              <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: 'var(--surface-subtle)', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Cơ sở tri thức RAG AI
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    Đã lập chỉ mục {selectedReg.ragChunks} phân đoạn vector hóa
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-secondary btn-xs"
                  onClick={() => Utils.showToast(`Đang tải file văn bản ${selectedReg.docCode}...`, 'info')}
                  style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <Download size={12} />
                  <span>Tải văn bản gốc</span>
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => setSelectedReg(null)}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCurriculum;
