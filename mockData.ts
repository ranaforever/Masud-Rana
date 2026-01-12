
import { TourOption, Booker, CustomerTypeOption, ResponseData } from './types';

// Based on 'Tour Name' sheet (A2 to A50)
export const INITIAL_TOURS: TourOption[] = [
  { name: 'Coxs Bazar Relax Trip', fees: 8500 },
  { name: 'Sundarban Adventure', fees: 12000 },
  { name: 'Sajek Valley Relex', fees: 9500 }, // Using "Relex" as per user prompt
  { name: 'Sylhet Tea Garden', fees: 5500 },
  { name: 'Bandarban Relex Way', fees: 11000 },
];

// Based on 'Booker Codes' sheet
export const INITIAL_BOOKERS: Booker[] = [
  { code: 'BC001', name: 'Zaman Travels' },
  { code: 'BC002', name: 'Karim Agencies' },
  { code: 'BC003', name: 'Rahim Booker' },
];

// Based on 'Customer Type' sheet
export const INITIAL_CUSTOMER_TYPES: CustomerTypeOption[] = [
  { type: 'Solo', fees: 1500 },
  { type: 'Group', fees: 0 },
  { type: 'Family', fees: -500 },
];

export const INITIAL_RESPONSES: ResponseData[] = [
  {
    id: '1',
    fullName: 'Arif Ahmed',
    mobile: '+8801711223344',
    address: 'Dhaka, Bangladesh',
    gender: 'Male',
    religion: 'Muslim',
    tourFees: 8500,
    advanceAmount: 3000,
    dueAmount: 5500,
    paymentStatus: 'Partial',
    busNo: 1,
    seatNo: 'A1',
    tourName: 'Coxs Bazar Relax Trip',
    customerType: 'Group',
    bookedBy: 'BC001',
    discountAmount: 0
  }
];
