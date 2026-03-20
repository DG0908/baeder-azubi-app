import { AccountStatus, AppRole } from '@prisma/client';

export interface AuthenticatedUser {
  id: string;
  email: string;
  displayName: string;
  role: AppRole;
  status: AccountStatus;
  canSignReports: boolean;
  organizationId: string | null;
}
