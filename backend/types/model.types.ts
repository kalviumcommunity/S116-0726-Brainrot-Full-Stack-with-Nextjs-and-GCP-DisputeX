import { AppDisputeStatus, AppRole } from '../types/app.types';

// ─── User ─────────────────────────────────────────────────────────────────────
export interface UserModel {
  id: string;
  email: string;
  password: string;
  role: AppRole;
  createdAt: Date;
  updatedAt: Date;
}

export type PublicUser = Omit<UserModel, 'password'>;

// ─── Merchant ─────────────────────────────────────────────────────────────────
export interface MerchantModel {
  id: string;
  name: string;
  businessId: string;
  contactEmail: string;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Dispute ──────────────────────────────────────────────────────────────────
export interface DisputeModel {
  id: string;
  merchantId: string;
  amount: number;
  currency: string;
  reason: string;
  status: AppDisputeStatus;
  evidenceUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Notification ─────────────────────────────────────────────────────────────
export interface NotificationModel {
  id: string;
  merchantId: string;
  type: string;
  title: string;
  description: string;
  isRead: boolean;
  createdAt: Date;
}

// ─── Activity ─────────────────────────────────────────────────────────────────
export interface ActivityModel {
  id: string;
  disputeId: string;
  action: string;
  description: string;
  createdAt: Date;
}

// ─── Base Entity ─────────────────────────────────────────────────────────────
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt?: Date;
}
