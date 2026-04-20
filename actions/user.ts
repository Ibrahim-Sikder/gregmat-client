"use server";

import fetchWrapper from "@/lib/fetchWrapper";

export interface ISubscription {
  _id: string;
  type: string;
  status: "active" | "expired" | "cancelled";
  price: number;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface IUser {
  _id: string;
  uId: number;
  auth: string;

  username: string;
  email: string;
  profilePicture?: string;
  role: "user" | "admin";
  isEmailVerified: boolean;

  subscription?: ISubscription;

  createdAt: string;
  updatedAt: string;
}

export async function getCurrentUser() {
  try {
    const response = await fetchWrapper("/user/profile");
    return response.data;
  } catch (error) {
    return null;
  }
}
