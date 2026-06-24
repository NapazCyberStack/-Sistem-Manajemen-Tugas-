import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTasks } from '../hooks/useTasks';

const Dashboard = () => {
  const { user } = useAuth();
  const { tasks, stats, refreshAll, loading, statsLoading } = useTasks(true);
  const navigate = useNavigate();

  // Refresh data on component mount
  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  // Calculate task completion percentage
  const getCompletionPercentage = () => {
    if (!stats.total) return 0;
    return Math.round((stats.status.completed / stats.total) * 100);
  };

  // Get status badge class name
  const getStatusBadge = (statusStr) => {
    const s = (statusStr || '').toLowerCase();
    if (s === 'pending') return 'badge-pending';
    if (s === 'in progress' || s === 'inprogress') return 'badge-in-progress';
    if (s === 'completed') return 'badge-completed';
    return 'bg-secondary';
  };

  // Get priority badge class name
  const getPriorityBadge = (priorityStr) => {
    const p = (priorityStr || '').toLowerCase();
    if (p === 'low') return 'badge-low';
    if (p === 'medium') return 'badge-medium';
    if (p === 'high') return 'badge-high';
    return 'bg-secondary';
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const isLoading = loading || statsLoading;

  return (
    <div className="animate-fade-in">
      {/* Header Banner */}
      <div className="custom-card p-4 mb-4 bg-gradient-primary text-white border-0 shadow">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div>
            <h2 className="fw-bold mb-1">Halo, {user?.username}! 👋</h2>
            <p className="m-0 opacity-85">
              {user?.role === 'Admin' 
                ? 'Sebagai Administrator, Anda dapat mengelola seluruh data tugas dalam sistem.' 
                : 'Berikut ringkasan progres tugas pribadi Anda untuk hari ini.'}
            </p>
          </div>
          <Link 
            to="/tasks" 
            className="btn btn-light text-primary border-0 fw-semibold px-4 py-2.5 rounded-3 align-self-start align-self-md-center"
          >
            <i className="bi bi-list-task me-2"></i> Lihat Semua Tugas
          </Link>
        </div>
      </div>

      {isLoading && tasks.length === 0 ? (
        <div className="d-flex justify-content-center align-items-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          {/* Statistics Grid */}
          <div className="row g-4 mb-4">
            
            {/* Total Tasks */}
            <div className="col-12 col-sm-6 col-xl-3">
              <div className="custom-card p-4 d-flex align-items-center gap-3">
                <div className="d-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary rounded-4" style={{ width: '60px', height: '60px' }}>
                  <i className="bi bi-collection-fill fs-3"></i>
                </div>
                <div>
                  <h6 className="text-secondary fw-semibold mb-1" style={{ fontSize: '14px' }}>Total Tugas</h6>
                  <h3 className="fw-bold m-0">{stats.total}</h3>
                </div>
              </div>
            </div>

            {/* Pending Tasks */}
            <div className="col-12 col-sm-6 col-xl-3">
              <div className="custom-card p-4 d-flex align-items-center gap-3">
                <div className="d-flex align-items-center justify-content-center bg-warning bg-opacity-10 text-warning rounded-4" style={{ width: '60px', height: '60px' }}>
                  <i className="bi bi-clock-history fs-3"></i>
                </div>
                <div>
                  <h6 className="text-secondary fw-semibold mb-1" style={{ fontSize: '14px' }}>Tugas Pending</h6>
                  <h3 className="fw-bold m-0">{stats.status.pending}</h3>
                </div>
              </div>
            </div>

            {/* In Progress Tasks */}
            <div className="col-12 col-sm-6 col-xl-3">
              <div className="custom-card p-4 d-flex align-items-center gap-3">
                <div className="d-flex align-items-center justify-content-center bg-blue bg-opacity-10 text-primary rounded-4" style={{ width: '60px', height: '60px', backgroundColor: 'rgba(13, 110, 253, 0.1)' }}>
                  <i className="bi bi-play-circle fs-3 text-primary"></i>
                </div>
                <div>
                  <h6 className="text-secondary fw-semibold mb-1" style={{ fontSize: '14px' }}>Sedang Dikerjakan</h6>
                  <h3 className="fw-bold m-0">{stats.status.inProgress}</h3>
                </div>
              </div>
            </div>

            {/* Completed Tasks */}
            <div className="col-12 col-sm-6 col-xl-3">
              <div className="custom-card p-4 d-flex align-items-center gap-3">
                <div className="d-flex align-items-center justify-content-center bg-success bg-opacity-10 text-success rounded-4" style={{ width: '60px', height: '60px' }}>
                  <i className="bi bi-check-circle-fill fs-3"></i>
                </div>
                <div>
                  <h6 className="text-secondary fw-semibold mb-1" style={{ fontSize: '14px' }}>Selesai</h6>
                  <h3 className="fw-bold m-0">{stats.status.completed}</h3>
                </div>
              </div>
            </div>

          </div>

          <div className="row g-4 mb-4">
            {/* Completion Chart representation */}
            <div className="col-lg-4 col-12">
              <div className="custom-card p-4 h-100 d-flex flex-column">
                <h5 className="fw-bold text-dark mb-4">Kemajuan Progres</h5>
                <div className="text-center my-auto py-3">
                  <div className="position-relative d-inline-block">
                    {/* Ring progress bar emulation */}
                    <div 
                      className="d-flex align-items-center justify-content-center rounded-circle border border-5 border-light bg-light"
                      style={{ width: '130px', height: '130px', fontSize: '32px', fontWeight: '800', color: '#4f46e5' }}
                    >
                      {getCompletionPercentage()}%
                    </div>
                  </div>
                  <h6 className="fw-semibold text-secondary mt-3">Tugas Telah Selesai</h6>
                  <div className="progress mt-3 rounded-pill" style={{ height: '8px' }}>
                    <div 
                      className="progress-bar bg-success rounded-pill" 
                      role="progressbar" 
                      style={{ width: `${getCompletionPercentage()}%` }} 
                      aria-valuenow={getCompletionPercentage()} 
                      aria-valuemin="0" 
                      aria-valuemax="100"
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Priority stats card */}
            <div className="col-lg-8 col-12">
              <div className="custom-card p-4 h-100">
                <h5 className="fw-bold text-dark mb-4">Beban Kerja Berdasarkan Prioritas</h5>
                <div className="row g-3 py-3">
                  {/* High priority */}
                  <div className="col-md-4 col-12">
                    <div className="border border-danger border-opacity-25 rounded-3 p-3 text-center bg-danger bg-opacity-5">
                      <span className="badge bg-danger rounded-pill px-3 py-1 mb-2">Tinggi</span>
                      <h2 className="fw-extrabold text-danger m-0">{stats.priority.high}</h2>
                      <small className="text-secondary">Tugas Mendesak</small>
                    </div>
                  </div>

                  {/* Medium priority */}
                  <div className="col-md-4 col-12">
                    <div className="border border-primary border-opacity-25 rounded-3 p-3 text-center bg-primary bg-opacity-5">
                      <span className="badge bg-primary rounded-pill px-3 py-1 mb-2">Sedang</span>
                      <h2 className="fw-extrabold text-primary m-0">{stats.priority.medium}</h2>
                      <small className="text-secondary">Tugas Normal</small>
                    </div>
                  </div>

                  {/* Low priority */}
                  <div className="col-md-4 col-12">
                    <div className="border border-secondary border-opacity-25 rounded-3 p-3 text-center bg-secondary bg-opacity-5">
                      <span className="badge bg-secondary rounded-pill px-3 py-1 mb-2">Rendah</span>
                      <h2 className="fw-extrabold text-secondary m-0">{stats.priority.low}</h2>
                      <small className="text-secondary">Tugas Rutin</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Tasks List */}
          <div className="custom-card p-4 mb-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold text-dark m-0">Aktivitas Tugas Terbaru</h5>
              <Link to="/tasks" className="btn btn-outline-primary btn-sm rounded-3 px-3">
                Lihat Selengkapnya <i className="bi bi-arrow-right"></i>
              </Link>
            </div>
            
            {tasks.length === 0 ? (
              <div className="text-center py-4">
                <i className="bi bi-emoji-smile fs-1 text-secondary opacity-30"></i>
                <h6 className="text-secondary mt-2">Tidak ada tugas terbaru yang ditemukan.</h6>
                <p className="text-secondary opacity-50" style={{ fontSize: '13px' }}>Klik 'Daftar Tugas' untuk membuat tugas baru Anda.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle border-0 m-0">
                  <thead className="table-light">
                    <tr>
                      <th className="border-0 rounded-start px-3 py-3" style={{ fontSize: '13px', textTransform: 'uppercase', color: '#64748b' }}>Judul Tugas</th>
                      <th className="border-0 py-3" style={{ fontSize: '13px', textTransform: 'uppercase', color: '#64748b' }}>Status</th>
                      <th className="border-0 py-3" style={{ fontSize: '13px', textTransform: 'uppercase', color: '#64748b' }}>Prioritas</th>
                      <th className="border-0 py-3" style={{ fontSize: '13px', textTransform: 'uppercase', color: '#64748b' }}>Tenggat Waktu</th>
                      {user?.role === 'Admin' && (
                        <th className="border-0 py-3" style={{ fontSize: '13px', textTransform: 'uppercase', color: '#64748b' }}>Pemilik</th>
                      )}
                      <th className="border-0 rounded-end px-3 py-3 text-center" style={{ fontSize: '13px', textTransform: 'uppercase', color: '#64748b' }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.slice(0, 5).map(task => (
                      <tr key={task._id}>
                        <td className="px-3 py-3 fw-semibold text-dark">{task.title}</td>
                        <td>
                          <span className={`badge ${getStatusBadge(task.status)} px-2.5 py-1.5 rounded-pill`}>
                            {task.status}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${getPriorityBadge(task.priority)} px-2 py-1 rounded`}>
                            {task.priority}
                          </span>
                        </td>
                        <td className="text-secondary">{formatDate(task.dueDate)}</td>
                        {user?.role === 'Admin' && (
                          <td className="text-secondary fw-medium">{task.userId?.username || 'Guest'}</td>
                        )}
                        <td className="text-center px-3">
                          <button 
                            onClick={() => navigate(`/tasks?id=${task._id}`)} 
                            className="btn btn-light btn-sm text-primary rounded-circle"
                            style={{ width: '32px', height: '32px', padding: 0 }}
                            title="Detail"
                          >
                            <i className="bi bi-chevron-right"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
