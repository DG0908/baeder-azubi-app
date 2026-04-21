import { secureMonthlyReportsApi } from '../secureApi';

export type MonthlyReportStatus = 'ASSIGNED' | 'SUBMITTED' | 'SIGNED';

export type MonthlyReport = {
  id: string;
  azubiId: string;
  azubiName: string;
  assignedById: string;
  assignedByName: string | null;
  year: number;
  month: number;
  activity: string;
  activityDescription: string;
  content: string;
  status: MonthlyReportStatus;
  submittedAt: string | null;
  signedById: string | null;
  signedByName: string | null;
  signedAt: string | null;
  trainerFeedback: string;
  createdAt: string;
  updatedAt: string;
};

export type MonthlyReportListFilter = {
  azubiId?: string;
  status?: MonthlyReportStatus;
  year?: number;
};

const toReport = (entry: any): MonthlyReport => ({
  id: entry?.id,
  azubiId: entry?.azubiId,
  azubiName: entry?.azubiName || '',
  assignedById: entry?.assignedById,
  assignedByName: entry?.assignedByName || null,
  year: Number(entry?.year) || 0,
  month: Number(entry?.month) || 0,
  activity: entry?.activity || '',
  activityDescription: entry?.activityDescription || '',
  content: entry?.content || '',
  status: (entry?.status as MonthlyReportStatus) || 'ASSIGNED',
  submittedAt: entry?.submittedAt || null,
  signedById: entry?.signedById || null,
  signedByName: entry?.signedByName || null,
  signedAt: entry?.signedAt || null,
  trainerFeedback: entry?.trainerFeedback || '',
  createdAt: entry?.createdAt,
  updatedAt: entry?.updatedAt
});

export const listMonthlyReports = async (filter: MonthlyReportListFilter = {}): Promise<MonthlyReport[]> => {
  const params: Record<string, unknown> = {};
  if (filter.azubiId) params.azubiId = filter.azubiId;
  if (filter.status) params.status = filter.status;
  if (filter.year) params.year = filter.year;
  const data = (await secureMonthlyReportsApi.list(params)) as any[];
  return (data || []).map(toReport);
};

export type MonthlyReportAssignResult = {
  created: MonthlyReport[];
  skipped: { azubiId: string; azubiName: string; reason: string }[];
};

export const assignMonthlyReport = async (payload: {
  azubiIds?: string[];
  assignToAll?: boolean;
  year: number;
  month: number;
  activity: string;
  activityDescription?: string;
}): Promise<MonthlyReportAssignResult> => {
  const result = (await secureMonthlyReportsApi.assign(payload as Record<string, unknown>)) as any;
  return {
    created: ((result?.created as any[]) || []).map(toReport),
    skipped: ((result?.skipped as any[]) || []).map((entry) => ({
      azubiId: entry?.azubiId || '',
      azubiName: entry?.azubiName || '',
      reason: entry?.reason || ''
    }))
  };
};

export const submitMonthlyReport = async (reportId: string, content: string): Promise<MonthlyReport> => {
  const result = await secureMonthlyReportsApi.submit(reportId, { content });
  return toReport(result);
};

export const signMonthlyReport = async (reportId: string, trainerFeedback?: string): Promise<MonthlyReport> => {
  const result = await secureMonthlyReportsApi.sign(reportId, { trainerFeedback });
  return toReport(result);
};

export const deleteMonthlyReport = (reportId: string) => secureMonthlyReportsApi.remove(reportId);

export const monthLabels = [
  'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
  'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
];

export const formatMonthlyReportPeriod = (report: Pick<MonthlyReport, 'year' | 'month'>) => {
  const name = monthLabels[Math.max(0, Math.min(11, report.month - 1))];
  return `${name} ${report.year}`;
};
