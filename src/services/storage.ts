import {
  Patient,
  Order,
  TestCatalogItem,
  TestPackage,
  Booking,
  Reagent,
  Employee,
  Expense,
  AuditLog,
  AnalyzerDevice,
  TubeInfo,
  ResultFlag
} from '../types/lis';
import {
  TUBES_DATA,
  INITIAL_TESTS,
  INITIAL_PACKAGES,
  INITIAL_PATIENTS,
  INITIAL_ORDERS,
  INITIAL_BOOKINGS,
  INITIAL_REAGENTS,
  INITIAL_EMPLOYEES,
  INITIAL_EXPENSES,
  INITIAL_DEVICES,
  INITIAL_AUDIT_LOGS
} from '../data/initialData';

const STORAGE_KEYS = {
  PATIENTS: 'rt_ramy_patients_v2',
  ORDERS: 'rt_ramy_orders_v2',
  TESTS: 'rt_ramy_tests_v2',
  PACKAGES: 'rt_ramy_packages_v2',
  BOOKINGS: 'rt_ramy_bookings_v2',
  REAGENTS: 'rt_ramy_reagents_v2',
  EMPLOYEES: 'rt_ramy_employees_v2',
  EXPENSES: 'rt_ramy_expenses_v2',
  DEVICES: 'rt_ramy_devices_v2',
  AUDIT_LOGS: 'rt_ramy_audit_logs_v2',
  CEO_PIN: 'rt_ramy_ceo_pin_v2',
  CEO_PERCENTAGE: 'rt_ramy_ceo_share_pct_v2',
  DEVICE_ID: 'rt_ramy_device_uuid_v2'
};

// Cross-tab broadcast channel
const broadcast = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('rt_lab_sync_channel') : null;

// In-memory fallback if localStorage is blocked by iframe security policies
const memoryStore: Record<string, string> = {};

function safeGet(key: string): string | null {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(key);
    }
  } catch {
    // iframe sandbox or privacy settings blocked localStorage
  }
  return memoryStore[key] ?? null;
}

function safeSet(key: string, value: string): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, value);
    }
  } catch {
    // blocked or quota exceeded
  }
  memoryStore[key] = value;
}

// Unique device fingerprint
let currentDeviceId = safeGet(STORAGE_KEYS.DEVICE_ID);
if (!currentDeviceId) {
  currentDeviceId = 'dev-' + Math.random().toString(36).substring(2, 9);
  safeSet(STORAGE_KEYS.DEVICE_ID, currentDeviceId);
}

// Change event listeners for React components
type Listener = () => void;
const listeners: Set<Listener> = new Set();

function notifyListeners() {
  listeners.forEach(fn => fn());
}

function getItem<T>(key: string, defaultValue: T): T {
  try {
    const raw = safeGet(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw) as T;
  } catch (e) {
    console.error('Failed reading key', key, e);
    return defaultValue;
  }
}

function setItem<T>(key: string, value: T): void {
  try {
    safeSet(key, JSON.stringify(value));
  } catch (e) {
    console.error('Failed writing key', key, e);
  }
}

export const StorageService = {
  getDeviceId(): string {
    return currentDeviceId || 'client-default';
  },

  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  init() {
    // Initialize defaults if not present or expand test catalog
    const existingTests = getItem<TestCatalogItem[]>(STORAGE_KEYS.TESTS, []);
    if (!safeGet(STORAGE_KEYS.TESTS) || existingTests.length < 35) {
      // Merge initial tests so existing custom tests are preserved while new tests are added
      const existingIds = new Set(existingTests.map(t => t.id));
      const mergedTests = [...existingTests];
      for (const t of INITIAL_TESTS) {
        if (!existingIds.has(t.id)) {
          mergedTests.push(t);
        }
      }
      setItem(STORAGE_KEYS.TESTS, mergedTests.length > 0 ? mergedTests : INITIAL_TESTS);
    }
    if (!safeGet(STORAGE_KEYS.PACKAGES)) {
      setItem(STORAGE_KEYS.PACKAGES, INITIAL_PACKAGES);
    }
    if (!safeGet(STORAGE_KEYS.PATIENTS)) {
      setItem(STORAGE_KEYS.PATIENTS, INITIAL_PATIENTS);
    }
    if (!safeGet(STORAGE_KEYS.ORDERS)) {
      setItem(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
    }
    if (!safeGet(STORAGE_KEYS.BOOKINGS)) {
      setItem(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
    }
    if (!safeGet(STORAGE_KEYS.REAGENTS)) {
      setItem(STORAGE_KEYS.REAGENTS, INITIAL_REAGENTS);
    }
    if (!safeGet(STORAGE_KEYS.EMPLOYEES)) {
      setItem(STORAGE_KEYS.EMPLOYEES, INITIAL_EMPLOYEES);
    }
    if (!safeGet(STORAGE_KEYS.EXPENSES)) {
      setItem(STORAGE_KEYS.EXPENSES, INITIAL_EXPENSES);
    }
    if (!safeGet(STORAGE_KEYS.DEVICES)) {
      setItem(STORAGE_KEYS.DEVICES, INITIAL_DEVICES);
    }
    if (!safeGet(STORAGE_KEYS.AUDIT_LOGS)) {
      setItem(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
    }
    if (!safeGet(STORAGE_KEYS.CEO_PIN)) {
      setItem(STORAGE_KEYS.CEO_PIN, '7777');
    }
    if (!safeGet(STORAGE_KEYS.CEO_PERCENTAGE)) {
      setItem(STORAGE_KEYS.CEO_PERCENTAGE, 40);
    }

    // Try fetching latest central database from server on init
    this.syncFromServer();

    // Periodic synchronization every 4 seconds to guarantee multi-device sync
    setInterval(() => {
      this.syncFromServer();
    }, 4000);

    // Sync on tab focus
    if (typeof window !== 'undefined') {
      window.addEventListener('focus', () => {
        this.syncFromServer();
      });
    }

    // Listen to local BroadcastChannel for other tabs on same machine
    if (broadcast) {
      broadcast.onmessage = (event) => {
        if (event.data?.type === 'db_changed' && event.data.senderId !== currentDeviceId) {
          notifyListeners();
        }
      };
    }

    // Listen to Server-Sent Events (SSE) for Real-Time Multi-Device Sync
    this.setupServerSentEvents();
  },

  setupServerSentEvents() {
    try {
      const evtSource = new EventSource('/api/sync/stream');
      evtSource.onmessage = (e) => {
        try {
          const parsed = JSON.parse(e.data);
          if (parsed.event === 'database_updated') {
            if (parsed.payload?.senderDeviceId !== currentDeviceId) {
              console.log('[Multi-Device Sync] Received real-time update from another device!');
              this.syncFromServer();
            }
          }
        } catch {
          // ignore keep-alive pings
        }
      };
      evtSource.onerror = () => {
        // SSE will reconnect automatically
      };
    } catch (e) {
      console.warn('SSE not supported or disabled in this client', e);
    }
  },

  async syncFromServer() {
    try {
      const res = await fetch('/api/database');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          const d = json.data;
          if (d.tests) setItem(STORAGE_KEYS.TESTS, d.tests);
          if (d.packages) setItem(STORAGE_KEYS.PACKAGES, d.packages);
          if (d.patients) setItem(STORAGE_KEYS.PATIENTS, d.patients);
          if (d.orders) setItem(STORAGE_KEYS.ORDERS, d.orders);
          if (d.bookings) setItem(STORAGE_KEYS.BOOKINGS, d.bookings);
          if (d.reagents) setItem(STORAGE_KEYS.REAGENTS, d.reagents);
          if (d.employees) setItem(STORAGE_KEYS.EMPLOYEES, d.employees);
          if (d.expenses) setItem(STORAGE_KEYS.EXPENSES, d.expenses);
          if (d.devices) setItem(STORAGE_KEYS.DEVICES, d.devices);
          if (d.auditLogs) setItem(STORAGE_KEYS.AUDIT_LOGS, d.auditLogs);
          notifyListeners();
        }
      }
    } catch {
      // offline or running standalone
    }
  },

  async syncToServer(actionDescription: string) {
    notifyListeners();
    if (broadcast) {
      broadcast.postMessage({ type: 'db_changed', senderId: currentDeviceId, action: actionDescription });
    }

    try {
      const payload = {
        lastAction: actionDescription,
        lastUpdatedByDeviceId: currentDeviceId,
        lastUpdatedTime: new Date().toISOString(),
        tests: this.getTests(),
        packages: this.getPackages(),
        patients: this.getPatients(),
        orders: this.getOrders(),
        bookings: this.getBookings(),
        reagents: this.getReagents(),
        employees: this.getEmployees(),
        expenses: this.getExpenses(),
        devices: this.getDevices(),
        auditLogs: this.getAuditLogs()
      };

      await fetch('/api/database', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-device-id': currentDeviceId || 'unknown'
        },
        body: JSON.stringify(payload)
      });
    } catch {
      // fallback to pure local persistence if server is unreachable
    }
  },

  // Patients (CRUD)
  getPatients(): Patient[] {
    return getItem(STORAGE_KEYS.PATIENTS, INITIAL_PATIENTS);
  },
  savePatient(patient: Patient) {
    const list = this.getPatients();
    const idx = list.findIndex(p => p.id === patient.id);
    if (idx >= 0) {
      list[idx] = patient;
    } else {
      list.unshift(patient);
    }
    setItem(STORAGE_KEYS.PATIENTS, list);
    this.addAuditLog('تحديث ملف مريض', `تم حفظ بيانات المريض: ${patient.name}`, 'Order');
    this.syncToServer(`حفظ بيانات المريض ${patient.name}`);
    return list;
  },
  deletePatient(patientId: string) {
    const list = this.getPatients().filter(p => p.id !== patientId);
    setItem(STORAGE_KEYS.PATIENTS, list);
    this.addAuditLog('حذف نهائي لمريض', `تم حذف المريض ذو المعرف: ${patientId}`, 'Order');
    this.syncToServer(`حذف المريض ${patientId}`);
    return list;
  },

  // Orders (CRUD)
  getOrders(): Order[] {
    return getItem(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
  },
  saveOrder(order: Order) {
    const list = this.getOrders();
    const idx = list.findIndex(o => o.id === order.id);
    if (idx >= 0) {
      list[idx] = order;
    } else {
      list.unshift(order);
    }
    setItem(STORAGE_KEYS.ORDERS, list);
    this.addAuditLog('حفظ وتحديث طلب', `طلب ${order.orderNumber} للمريض ${order.patientName} (${order.orderStatus})`, 'Order');
    this.syncToServer(`تحديث الطلب ${order.orderNumber}`);
    return list;
  },
  deleteOrder(orderId: string) {
    const list = this.getOrders().filter(o => o.id !== orderId);
    setItem(STORAGE_KEYS.ORDERS, list);
    this.addAuditLog('حذف نهائي لطلب فحص', `تم حذف الطلب المعرف: ${orderId}`, 'Order');
    this.syncToServer(`حذف الطلب ${orderId}`);
    return list;
  },

  // Tests Catalog (CRUD)
  getTests(): TestCatalogItem[] {
    return getItem(STORAGE_KEYS.TESTS, INITIAL_TESTS);
  },
  saveTest(test: TestCatalogItem) {
    const list = this.getTests();
    const idx = list.findIndex(t => t.id === test.id);
    if (idx >= 0) {
      list[idx] = test;
    } else {
      list.push(test);
    }
    setItem(STORAGE_KEYS.TESTS, list);
    this.addAuditLog('تعديل في دليل التحاليل', `تحليل ${test.arabicName} (${test.code})`, 'Settings');
    this.syncToServer(`تعديل التحليل ${test.code}`);
    return list;
  },
  deleteTest(testId: string) {
    const list = this.getTests().filter(t => t.id !== testId);
    setItem(STORAGE_KEYS.TESTS, list);
    this.addAuditLog('حذف نهائي لتحليل من الفهرس', `معرف: ${testId}`, 'Settings');
    this.syncToServer(`حذف التحليل ${testId}`);
    return list;
  },

  // Packages (CRUD)
  getPackages(): TestPackage[] {
    return getItem(STORAGE_KEYS.PACKAGES, INITIAL_PACKAGES);
  },
  savePackage(pkg: TestPackage) {
    const list = this.getPackages();
    const idx = list.findIndex(p => p.id === pkg.id);
    if (idx >= 0) {
      list[idx] = pkg;
    } else {
      list.push(pkg);
    }
    setItem(STORAGE_KEYS.PACKAGES, list);
    this.addAuditLog('حفظ باقة تحاليل', `باقة ${pkg.arabicName} بسعر ${pkg.packagePrice} ج.م`, 'Settings');
    this.syncToServer(`حفظ الباقة ${pkg.code}`);
    return list;
  },
  deletePackage(pkgId: string) {
    const list = this.getPackages().filter(p => p.id !== pkgId);
    setItem(STORAGE_KEYS.PACKAGES, list);
    this.addAuditLog('حذف نهائي لباقة تحاليل', `معرف الباقة: ${pkgId}`, 'Settings');
    this.syncToServer(`حذف الباقة ${pkgId}`);
    return list;
  },

  // Bookings (CRUD)
  getBookings(): Booking[] {
    return getItem(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
  },
  saveBooking(booking: Booking) {
    const list = this.getBookings();
    const idx = list.findIndex(b => b.id === booking.id);
    if (idx >= 0) {
      list[idx] = booking;
    } else {
      list.unshift(booking);
    }
    setItem(STORAGE_KEYS.BOOKINGS, list);
    this.addAuditLog('تحديث حجز', `حجز ${booking.bookingCode} - ${booking.status}`, 'Order');
    this.syncToServer(`تحديث الحجز ${booking.bookingCode}`);
    return list;
  },
  deleteBooking(bookingId: string) {
    const list = this.getBookings().filter(b => b.id !== bookingId);
    setItem(STORAGE_KEYS.BOOKINGS, list);
    this.addAuditLog('حذف نهائي لحجز', `معرف الحجز: ${bookingId}`, 'Order');
    this.syncToServer(`حذف الحجز ${bookingId}`);
    return list;
  },

  // Reagents (CRUD)
  getReagents(): Reagent[] {
    return getItem(STORAGE_KEYS.REAGENTS, INITIAL_REAGENTS);
  },
  saveReagent(reagent: Reagent) {
    const list = this.getReagents();
    const idx = list.findIndex(r => r.id === reagent.id);
    if (idx >= 0) {
      list[idx] = reagent;
    } else {
      list.push(reagent);
    }
    setItem(STORAGE_KEYS.REAGENTS, list);
    this.addAuditLog('تحديث مخزون كاشف', `الكاشف: ${reagent.name}`, 'Inventory');
    this.syncToServer(`تحديث الكاشف ${reagent.name}`);
    return list;
  },
  deleteReagent(reagentId: string) {
    const list = this.getReagents().filter(r => r.id !== reagentId);
    setItem(STORAGE_KEYS.REAGENTS, list);
    this.addAuditLog('حذف نهائي لكاشف مخبري', `معرف الكاشف: ${reagentId}`, 'Inventory');
    this.syncToServer(`حذف الكاشف ${reagentId}`);
    return list;
  },
  consumeReagent(id: string, amount: number) {
    const list = this.getReagents();
    const item = list.find(r => r.id === id);
    if (item) {
      item.currentStock = Math.max(0, item.currentStock - amount);
      setItem(STORAGE_KEYS.REAGENTS, list);
      this.addAuditLog('استهلاك كاشف مخبري', `تم استهلاك ${amount} ${item.unit} من ${item.name}`, 'Inventory');
      this.syncToServer(`استهلاك ${amount} من ${item.name}`);
    }
    return list;
  },

  // Employees & HR (CRUD)
  getEmployees(): Employee[] {
    return getItem(STORAGE_KEYS.EMPLOYEES, INITIAL_EMPLOYEES);
  },
  saveEmployee(emp: Employee) {
    const list = this.getEmployees();
    const idx = list.findIndex(e => e.id === emp.id);
    if (idx >= 0) {
      list[idx] = emp;
    } else {
      list.push(emp);
    }
    setItem(STORAGE_KEYS.EMPLOYEES, list);
    this.addAuditLog('تعديل ملف موظف', `الموظف: ${emp.name}`, 'Settings');
    this.syncToServer(`تعديل الموظف ${emp.name}`);
    return list;
  },
  deleteEmployee(empId: string) {
    const list = this.getEmployees().filter(e => e.id !== empId);
    setItem(STORAGE_KEYS.EMPLOYEES, list);
    this.addAuditLog('حذف نهائي لموظف', `معرف الموظف: ${empId}`, 'Settings');
    this.syncToServer(`حذف الموظف ${empId}`);
    return list;
  },

  // Expenses (CRUD)
  getExpenses(): Expense[] {
    return getItem(STORAGE_KEYS.EXPENSES, INITIAL_EXPENSES);
  },
  saveExpense(expense: Expense) {
    const list = this.getExpenses();
    const idx = list.findIndex(e => e.id === expense.id);
    if (idx >= 0) {
      list[idx] = expense;
    } else {
      list.unshift(expense);
    }
    setItem(STORAGE_KEYS.EXPENSES, list);
    this.addAuditLog('تسجيل مصروف', `${expense.description} بمبلغ ${expense.amount} ج.م`, 'Financial');
    this.syncToServer(`تسجيل مصروف ${expense.amount}`);
    return list;
  },
  deleteExpense(expId: string) {
    const list = this.getExpenses().filter(e => e.id !== expId);
    setItem(STORAGE_KEYS.EXPENSES, list);
    this.addAuditLog('حذف نهائي لإيصال مصروف', `معرف المصروف: ${expId}`, 'Financial');
    this.syncToServer(`حذف مصروف ${expId}`);
    return list;
  },

  // Devices (CRUD)
  getDevices(): AnalyzerDevice[] {
    return getItem(STORAGE_KEYS.DEVICES, INITIAL_DEVICES);
  },
  saveDevice(device: AnalyzerDevice) {
    const list = this.getDevices();
    const idx = list.findIndex(d => d.id === device.id);
    if (idx >= 0) {
      list[idx] = device;
    } else {
      list.push(device);
    }
    setItem(STORAGE_KEYS.DEVICES, list);
    this.syncToServer(`تحديث الجهاز ${device.name}`);
    return list;
  },
  deleteDevice(devId: string) {
    const list = this.getDevices().filter(d => d.id !== devId);
    setItem(STORAGE_KEYS.DEVICES, list);
    this.addAuditLog('حذف جهاز تحليل', `معرف: ${devId}`, 'Settings');
    this.syncToServer(`حذف جهاز ${devId}`);
    return list;
  },

  // Audit Logs
  getAuditLogs(): AuditLog[] {
    return getItem(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
  },
  addAuditLog(action: string, details: string, entityType: 'Financial' | 'Order' | 'Result' | 'Inventory' | 'Settings') {
    const logs = this.getAuditLogs();
    const now = new Date();
    const newLog: AuditLog = {
      id: 'log-' + Date.now(),
      timestamp: now.toISOString().replace('T', ' ').substring(0, 19),
      action,
      details,
      entityType,
      performedBy: 'مستخدم النظام (RT LAB User)',
      role: 'نظام معامل رامي مختار'
    };
    logs.unshift(newLog);
    setItem(STORAGE_KEYS.AUDIT_LOGS, logs.slice(0, 300));
  },

  // CEO PIN & Percentages
  getCeoPin(): string {
    return getItem(STORAGE_KEYS.CEO_PIN, '7777');
  },
  setCeoPin(newPin: string) {
    setItem(STORAGE_KEYS.CEO_PIN, newPin);
    this.addAuditLog('تغيير رمز PIN الإدارة', 'تم تعديل الرمز السري للمدير', 'Financial');
    this.syncToServer('تغيير رمز PIN');
  },
  getCeoSharePercentage(): number {
    return getItem(STORAGE_KEYS.CEO_PERCENTAGE, 40);
  },
  setCeoSharePercentage(pct: number) {
    setItem(STORAGE_KEYS.CEO_PERCENTAGE, pct);
    this.addAuditLog('تعديل نسب الأرباح', `${pct}% للإدارة و ${100 - pct}% للمعمل`, 'Financial');
    this.syncToServer(`تعديل نسبة الإدارة ${pct}%`);
  },

  // Tube Calculator Helper
  calculateRequiredTubes(testIds: string[]): { tube: TubeInfo; count: number; tests: TestCatalogItem[] }[] {
    const allTests = this.getTests();
    const selectedTests = allTests.filter(t => testIds.includes(t.id));
    
    const map = new Map<string, TestCatalogItem[]>();
    for (const test of selectedTests) {
      const existing = map.get(test.tubeId) || [];
      existing.push(test);
      map.set(test.tubeId, existing);
    }

    const result: { tube: TubeInfo; count: number; tests: TestCatalogItem[] }[] = [];
    for (const [tubeId, tests] of map.entries()) {
      const tubeInfo = TUBES_DATA.find(t => t.id === tubeId) || {
        id: tubeId,
        name: 'أنبوبة فحص',
        arabicName: 'أنبوبة فحص',
        colorHex: '#991B1B',
        capColor: 'red',
        additive: 'قياسي',
        instructions: 'سحب العينة وفق المعايير.'
      };

      const count = Math.ceil(tests.length / 6) || 1;
      result.push({ tube: tubeInfo, count, tests });
    }

    return result;
  },

  // Auto flag evaluator
  evaluateResultFlag(test: TestCatalogItem, valueStr: string, gender: 'Male' | 'Female'): ResultFlag {
    const val = parseFloat(valueStr);
    if (isNaN(val)) return 'Normal';

    const range = test.referenceRanges.find(r => r.gender === gender || r.gender === 'All') || test.referenceRanges[0];
    if (!range) return 'Normal';

    if (range.criticalHigh !== undefined && val >= range.criticalHigh) return 'Critical/Panic';
    if (range.criticalLow !== undefined && val <= range.criticalLow) return 'Critical/Panic';

    if (val > range.max) return 'High';
    if (val < range.min) return 'Low';

    return 'Normal';
  },

  // Reset to demo
  resetToDemo() {
    localStorage.removeItem(STORAGE_KEYS.TESTS);
    localStorage.removeItem(STORAGE_KEYS.PACKAGES);
    localStorage.removeItem(STORAGE_KEYS.PATIENTS);
    localStorage.removeItem(STORAGE_KEYS.ORDERS);
    localStorage.removeItem(STORAGE_KEYS.BOOKINGS);
    localStorage.removeItem(STORAGE_KEYS.REAGENTS);
    localStorage.removeItem(STORAGE_KEYS.EMPLOYEES);
    localStorage.removeItem(STORAGE_KEYS.EXPENSES);
    localStorage.removeItem(STORAGE_KEYS.DEVICES);
    localStorage.removeItem(STORAGE_KEYS.AUDIT_LOGS);
    this.init();
    this.syncToServer('إعادة ضبط البيانات إلى الوضع المصنعي الافتراضي');
  },

  exportDatabaseJSON(): string {
    const data = {
      exportedAt: new Date().toISOString(),
      labName: 'معامل رامي مختار للتحاليل الطبية - RT LAB',
      tests: this.getTests(),
      packages: this.getPackages(),
      patients: this.getPatients(),
      orders: this.getOrders(),
      bookings: this.getBookings(),
      reagents: this.getReagents(),
      employees: this.getEmployees(),
      expenses: this.getExpenses(),
      devices: this.getDevices(),
      auditLogs: this.getAuditLogs()
    };
    return JSON.stringify(data, null, 2);
  }
};
