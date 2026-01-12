
export interface ResponseData {
  id: string;
  fullName: string;
  mobile: string;
  address: string;
  gender: string;
  religion: string;
  tourFees: number;
  advanceAmount: number;
  dueAmount: number;
  paymentStatus: 'Paid' | 'Partial' | 'Unpaid';
  busNo: number;
  seatNo: string;
  tourName: string;
  customerType: string;
  bookedBy: string; // Booker Code
  discountAmount: number;
  soloExtraFee?: number;
  message?: string;
}

export interface Expense {
  id: string;
  tourName: string;
  description: string;
  amount: number;
  category: string;
  date: string;
}

export interface TourOption {
  name: string;
  fees: number;
}

export interface Booker {
  code: string;
  name: string;
}

export interface CustomerTypeOption {
  type: string;
  fees: number;
}

export type ViewType = 'booking' | 'dashboard' | 'edit' | 'expenses';
