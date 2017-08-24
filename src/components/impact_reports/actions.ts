import { backend } from '../../services/async';

export const getReports = (id: string) => backend.get('FETCH_REPORTS', `software/${id}/reports`);
export const generateReport = (id: string) => backend.post('GENERATE_REPORT', `software/${id}/generate_report`, {});
