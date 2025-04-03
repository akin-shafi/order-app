// types/user.ts
export interface User {
    id: string;
    fullName: string; // Changed from 'name' to match AuthContext
    email?: string;
    phoneNumber: string;
    role?: string;
    avatar?: string; // Added for ProfileDetailsModal
    wallet_balance?: number; // Added for ProfileDetailsModal
    wallet_no?: string; // Added for ProfileDetailsModal
    bank_name?: string; // Added for ProfileDetailsModal
  }