export type Urgency = 'Routine' | 'STAT';

export type SpecimenStatus = 'Waiting Collection' | 'Collected' | 'In Processing' | 'Completed';

export type OrderStatus = 'Pending' | 'Sample Collected' | 'Results Entered' | 'Approved' | 'Delivered' | 'Cancelled';

export type ReportStatus = 'In Progress' | 'Approved' | 'Critical Alert';

export type ResultFlag = 'Normal' | 'High' | 'Low' | 'Critical/Panic';

export type BookingStatus = 'Pending' | 'Confirmed' | 'Cancelled';

export type BookingType = 'Home Visit' | 'Lab Branch Visit' | 'Lab Visit' | 'Branch Visit' | 'Walk-In';

export type PaymentMethod = 'Cash' | 'InstaPay' | 'Wallet' | 'Bank Transfer' | 'Card' | 'Vodafone Cash';

export type UserRole = 'Technologist' | 'Pathologist' | 'Receptionist' | 'LabManager';

export interface TubeInfo {
  id: string;
  name: string;
  arabicName: string;
  colorHex: string;
  capColor: string;
  additive: string;
  instructions: string;
}

export interface ReferenceRange {
  gender: 'All' | 'Male' | 'Female';
  ageMin?: number;
  ageMax?: number;
  min: number;
  max: number;
  criticalLow?: number;
  criticalHigh?: number;
  textualRange?: string;
}

export interface TestCatalogItem {
  id: string;
  code: string;
  name: string;
  arabicName: string;
  category: 'Hematology' | 'Biochemistry' | 'Immunology' | 'Hormones' | 'Microbiology' | 'Urine & Stool' | 'Coagulation' | 'Tumor Markers' | 'Cardiac';
  profileCategory?: string; // Grouping into separate printable A4 profile pages
  price: number;
  specimenType: string;
  tubeId: string;
  unit: string;
  referenceRanges: ReferenceRange[];
  method: string;
  estimatedHours: number;
  isAutoCalculated?: boolean;
  formulaDescription?: string;
}

export interface TestPackage {
  id: string;
  code: string;
  name: string;
  arabicName: string;
  description: string;
  originalPrice: number;
  packagePrice: number;
  testIds: string[];
}

export interface OrderTestResult {
  testId: string;
  testName: string;
  testCode: string;
  profileCategory?: string;
  resultValue: string;
  unit: string;
  referenceRangeText: string;
  flag: ResultFlag;
  previousValue?: string;
  previousDate?: string;
  deltaChangePercent?: number;
  deltaAlert?: boolean;
  notes?: string;
  isAutoCalculated?: boolean;
  formulaDescription?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientAgeUnit?: 'Years' | 'Months' | 'Days';
  patientGender: 'Male' | 'Female';
  patientPhone: string;
  patientNationalId?: string;
  referringDoctor: string;
  urgency: Urgency;
  branch?: string;
  registeredBranch?: string;
  createdAt: string;
  collectedAt?: string;
  collectedBy?: string;
  verifiedBy?: string;
  tubesNeeded?: string[];
  testIds: string[];
  packageIds?: string[];
  results: OrderTestResult[];
  specimenStatus: SpecimenStatus;
  orderStatus: OrderStatus;
  reportStatus: ReportStatus;
  totalAmount: number;
  discount: number;
  netAmount: number;
  paidAmount: number;
  remainingAmount: number;
  paymentMethod: PaymentMethod;
  barcode: string;
  clinicalInterpretation?: string;
  clinicalComment?: string;
  clinicalNotes?: string;
  recommendations?: string;
  approvedBy?: string;
  approvedAt?: string;
  hasCriticalValue?: boolean;
}

export interface Patient {
  id: string;
  name: string;
  phone: string;
  age: number;
  ageUnit?: 'Years' | 'Months' | 'Days';
  dateOfBirth?: string;
  gender: 'Male' | 'Female';
  nationalId?: string;
  address?: string;
  referringDoctor?: string;
  chronicDiseases?: string[];
  allergies?: string[];
  notes?: string;
  registeredAt?: string;
  registeredBranch?: string;
  createdAt?: string;
}

export interface Booking {
  id: string;
  bookingCode: string;
  patientName: string;
  phone: string;
  age?: number;
  gender?: 'Male' | 'Female';
  address: string;
  bookingDate: string;
  bookingTime?: string;
  timeSlot?: string;
  type: BookingType;
  packageId?: string;
  packageName?: string;
  estimatedPrice?: number;
  estimatedAmount?: number;
  status: BookingStatus;
  fastingRequired?: boolean;
  notes?: string;
  convertedToOrderId?: string;
  createdAt: string;
}

export interface Reagent {
  id: string;
  code: string;
  name: string;
  arabicName?: string;
  category: string;
  catalogNumber?: string;
  manufacturer?: string;
  lotNumber: string;
  currentStock: number;
  minimumStock: number;
  unit: string;
  expiryDate: string;
  supplier: string;
  unitCost?: number;
  costPerUnit?: number;
  storageTemperature?: string;
  status?: string;
  lastRestockedDate?: string;
}

export interface Employee {
  id: string;
  name: string;
  jobTitle: string;
  nationalId: string;
  phone: string;
  shift: 'Morning' | 'Evening' | 'Night' | '24h Rotation' | 'Full Time';
  basicSalary: number;
  incentives: number;
  deductions: number;
  overtimeHours: number;
  attendanceDays: number;
  absenceDays: number;
  joinedDate: string;
  role: UserRole;
}

export interface Expense {
  id: string;
  description: string;
  category: 'Reagents & Supplies' | 'Equipment Maintenance' | 'Rent & Utilities' | 'Salaries & Staff' | 'Hospitality & Logistics' | 'Marketing' | 'Rent' | 'Maintenance' | 'Other';
  amount: number;
  date: string;
  recordedBy: string;
  notes?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  performedBy?: string;
  userName?: string;
  role?: string;
  details: string;
  entityType?: 'Financial' | 'Order' | 'Result' | 'Inventory' | 'Settings';
  category?: string;
}

export interface AnalyzerDevice {
  id: string;
  name: string;
  model?: string;
  type?: 'Hematology' | 'Clinical Chemistry' | 'Immunology' | 'Coagulation';
  protocol: 'ASTM E1394' | 'HL7 v2.5' | 'Serial RS232' | 'TCP/IP' | 'HL7' | 'ASTM';
  ipAddress: string;
  port: number;
  baudRate?: number;
  serialNumber?: string;
  status: 'Online' | 'Offline' | 'Busy' | 'Syncing' | 'Idle';
  lastSyncAt?: string;
  lastSyncTime?: string;
  pendingResultsCount?: number;
  supportedProfiles?: string[];
}
