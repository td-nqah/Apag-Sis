// ==========================================================================
// APAG Admin Users Management Component (React + TypeScript)
// 100% Fidelity with original pages/admin/users.html & js/admin/users.js
// ==========================================================================

import React, { useState } from 'react';
import { UserPlus, Search, X, Check, Lock, RotateCcw } from 'lucide-react';
import { Utils } from '../../utils/utils';

interface SystemUser {
  id: string;
  username: string;
  name: string;
  role: 'student' | 'advisor' | 'admin';
  roleLabel: string;
  roleBadge: string;
  email: string;
  status: 'active' | 'locked';
}

export const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<SystemUser[]>([
    {
      id: '1',
      username: 'student',
      name: 'Trần Mạnh Hà',
      role: 'student',
      roleLabel: 'Sinh viên (K25)',
      roleBadge: 'badge-info',
      email: 'hatm_k25@apag.edu.vn',
      status: 'active'
    },
    {
      id: '2',
      username: 'advisor',
      name: 'Nguyễn Năng Thành',
      role: 'advisor',
      roleLabel: 'Cố vấn học tập',
      roleBadge: 'badge-primary',
      email: 'minhtd@apag.edu.vn',
      status: 'active'
    },
    {
      id: '3',
      username: 'admin',
      name: 'ThS. Hoàng Quốc Việt',
      role: 'admin',
      roleLabel: 'Quản lý đào tạo',
      roleBadge: 'badge-danger',
      email: 'viethq@apag.edu.vn',
      status: 'active'
    }
  ]);

  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    name: '',
    role: 'student' as 'student' | 'advisor' | 'admin',
    email: '',
    password: ''
  });

  const handleResetPassword = (username: string) => {
    let savedPasswords: Record<string, string> = {};
    try {
      savedPasswords = JSON.parse(localStorage.getItem('apag_passwords') || '{}');
    } catch {}
    savedPasswords[username.toLowerCase()] = '123456';
    localStorage.setItem('apag_passwords', JSON.stringify(savedPasswords));
    Utils.showToast(`Đã đặt lại mật khẩu cho tài khoản "${username}" về mặc định: 123456`, 'success');
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.username || !newUser.name || !newUser.email) return;

    let roleLabel = 'Sinh viên (K25)';
    let roleBadge = 'badge-info';
    if (newUser.role === 'advisor') {
      roleLabel = 'Cố vấn học tập';
      roleBadge = 'badge-primary';
    } else if (newUser.role === 'admin') {
      roleLabel = 'Quản lý đào tạo';
      roleBadge = 'badge-danger';
    }

    const created: SystemUser = {
      id: Date.now().toString(),
      username: newUser.username.toLowerCase().trim(),
      name: newUser.name.trim(),
      role: newUser.role,
      roleLabel,
      roleBadge,
      email: newUser.email.trim(),
      status: 'active'
    };

    setUsers([...users, created]);
    setShowAddModal(false);
    setNewUser({ username: '', name: '', role: 'student', email: '', password: '' });
    Utils.showToast(`Đã tạo tài khoản "${created.username}" thành công!`, 'success');
  };

  const filtered = users.filter(u => 
    u.username.toLowerCase().includes(search.toLowerCase().trim()) || 
    u.name.toLowerCase().includes(search.toLowerCase().trim()) ||
    u.email.toLowerCase().includes(search.toLowerCase().trim())
  );

  return (
    <div>
      {/* Top Action Button */}
      <div className="d-flex justify-end mb-4" style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button 
          type="button" 
          className="btn btn-primary btn-sm" 
          id="btnAddUser"
          onClick={() => setShowAddModal(true)}
        >
          <UserPlus size={14} />
          <span>Tạo tài khoản mới</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="minimal-card mb-4 p-4">
        <div style={{ position: 'relative', maxWidth: '340px' }}>
          <Search size={15} style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            className="form-control" 
            placeholder="Tìm theo tài khoản, tên hoặc email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: '34px' }}
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="minimal-card">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="minimal-table">
              <thead>
                <tr>
                  <th>Tên đăng nhập</th>
                  <th>Họ và tên</th>
                  <th>Vai trò</th>
                  <th>Email</th>
                  <th>Trạng thái</th>
                  <th style={{ textAlign: 'center' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody id="usersTableBody">
                {filtered.map(u => (
                  <tr key={u.id}>
                    <td><code>{u.username}</code></td>
                    <td className="font-medium text-main">{u.name}</td>
                    <td><span className={`badge ${u.roleBadge}`}>{u.roleLabel}</span></td>
                    <td className="text-secondary">{u.email}</td>
                    <td>
                      <span className={`badge ${u.status === 'active' ? 'badge-success' : 'badge-warning'}`}>
                        {u.status === 'active' ? 'Hoạt động' : 'Đã khóa'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button 
                        type="button" 
                        className="btn btn-outline btn-xs"
                        onClick={() => handleResetPassword(u.username)}
                      >
                        Đặt lại mật khẩu
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="modal-backdrop" style={{ display: 'flex' }} onClick={() => setShowAddModal(false)}>
          <div className="modal-dialog" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Tạo tài khoản người dùng mới</h3>
              <button type="button" className="modal-close-btn" onClick={() => setShowAddModal(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAddUser}>
              <div className="modal-body space-y-3">
                <div className="form-group">
                  <label className="form-label text-xs font-semibold">Tên đăng nhập:</label>
                  <input 
                    type="text" 
                    className="form-control"
                    placeholder="VD: tranmanhha"
                    value={newUser.username}
                    onChange={e => setNewUser({ ...newUser, username: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label text-xs font-semibold">Họ và tên:</label>
                  <input 
                    type="text" 
                    className="form-control"
                    placeholder="VD: Trần Mạnh Hà"
                    value={newUser.name}
                    onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label text-xs font-semibold">Vai trò:</label>
                  <select 
                    className="form-control"
                    value={newUser.role}
                    onChange={e => setNewUser({ ...newUser, role: e.target.value as any })}
                  >
                    <option value="student">Sinh viên</option>
                    <option value="advisor">Cố vấn học tập</option>
                    <option value="admin">Quản lý đào tạo</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label text-xs font-semibold">Email học viện:</label>
                  <input 
                    type="email" 
                    className="form-control"
                    placeholder="VD: hatm_k25@apag.edu.vn"
                    value={newUser.email}
                    onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                  Hủy bỏ
                </button>
                <button type="submit" className="btn btn-primary">
                  Tạo người dùng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
