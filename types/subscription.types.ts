export enum SubscriptionType {
  GREGMAT = "gregmat",
  GREGMAT_PREPSWIFT = "gregmat_prepswift",
}

export enum SubscriptionStatus {
  ACTIVE = "active",
  EXPIRED = "expired",
  CANCELLED = "cancelled",
}

export enum SubscriptionRequestStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export interface ISubscription {
  _id: string;
  user:
    | string
    | {
        _id: string;
        username: string;
        email: string;
      };
  type: SubscriptionType;
  status: SubscriptionStatus;
  price: number;
  startDate: string;
  endDate: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ISubscriptionRequest {
  _id: string;
  user:
    | string
    | {
        _id: string;
        username: string;
        email: string;
      };
  type: SubscriptionType;
  message?: string;
  status: SubscriptionRequestStatus;
  reviewedBy?: {
    _id: string;
    username: string;
    email: string;
  };
  reviewedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSubscriptionRequestInput {
  type: SubscriptionType;
  message?: string;
}
