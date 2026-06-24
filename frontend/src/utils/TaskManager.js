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
    getStats() {
        return {
            total: this.tasks.length,
            todo: this.filterByStatus('todo').length,
            inProgress: this.filterByStatus('in-progress').length,
            done: this.filterByStatus('done').length,
        };
    }
}

export const formatDate = (date) => new Date(date).toLocaleDateString('id-ID');
export const truncateText = (text, max = 50) => text.length > max ? text.slice(0, max) + '...' : text;
