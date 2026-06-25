// ============================================================
// TaskManager Class — JavaScript OOP Implementation
// Digunakan untuk filtering, sorting, dan statistik tasks
// ============================================================
export class TaskManager {
  constructor(tasks = []) {
    this.tasks = tasks;
  }

  filterByStatus(status) {
    return this.tasks.filter(t => t.status === status);
  }

  filterByPriority(priority) {
    return this.tasks.filter(t => t.priority === priority);
  }

  filterByKeyword(keyword) {
    const kw = keyword.toLowerCase();
    return this.tasks.filter(t =>
      t.title?.toLowerCase().includes(kw) ||
      t.description?.toLowerCase().includes(kw)
    );
  }

  sortByDate(order = 'desc') {
    return [...this.tasks].sort((a, b) => {
      const da = new Date(a.createdAt);
      const db = new Date(b.createdAt);
      return order === 'desc' ? db - da : da - db;
    });
  }

  sortByPriority() {
    const order = { High: 0, Medium: 1, Low: 2 };
    return [...this.tasks].sort((a, b) => order[a.priority] - order[b.priority]);
  }

  getStats() {
    return {
      total: this.tasks.length,
      todo: this.filterByStatus('Pending').length,
      inProgress: this.filterByStatus('In Progress').length,
      done: this.filterByStatus('Completed').length,
      high: this.filterByPriority('High').length,
      medium: this.filterByPriority('Medium').length,
      low: this.filterByPriority('Low').length,
    };
  }
}

// ============================================================
// Helper Functions
// ============================================================

/** Format tanggal ke format Indonesia */
export const formatDate = (date, options = {}) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    ...options
  });
};

/** Format tanggal singkat: 24 Jun 2026 */
export const formatDateShort = (date) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric'
  });
};

/** Potong teks panjang dengan ellipsis */
export const truncateText = (text, max = 50) => {
  if (!text) return '';
  return text.length > max ? text.slice(0, max) + '...' : text;
};

/** Hitung sisa hari hingga tenggat */
export const getDaysRemaining = (dueDate) => {
  if (!dueDate) return null;
  const diff = new Date(dueDate) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

/** Tentukan warna badge berdasarkan sisa hari */
export const getDueDateBadgeClass = (dueDate) => {
  const days = getDaysRemaining(dueDate);
  if (days === null) return 'bg-secondary';
  if (days < 0) return 'bg-danger';
  if (days <= 3) return 'bg-warning text-dark';
  return 'bg-success';
};

/** Konversi status ke label Indonesia */
export const statusLabel = (status) => {
  const map = { Pending: 'Menunggu', 'In Progress': 'Dikerjakan', Completed: 'Selesai' };
  return map[status] || status;
};
