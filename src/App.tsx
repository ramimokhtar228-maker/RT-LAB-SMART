import React, { useState, useEffect } from 'react';
import { StorageService } from './services/storage';
import { 
  Order, 
  Patient, 
  TestCatalogItem, 
  TestPackage, 
  Booking, 
  Reagent, 
  Employee, 
  Expense, 
  AnalyzerDevice, 
  AuditLog, 
  UserRole 
} from './types/lis';
import { RT_LAB_INFO } from './data/labInfo';
import { Header } from './components/Header';
import { Sidebar, ActiveTab } from './components/Sidebar';

// Views
import { DashboardView } from './views/DashboardView';
import { BookingsView } from './views/BookingsView';
import { OrdersSamplingView } from './views/OrdersSamplingView';
import { WorklistView } from './views/WorklistView';
import { SmartReportsView } from './views/SmartReportsView';
import { ReportsView } from './views/ReportsView';
import { PatientsView } from './views/PatientsView';
import { LoyaltyView } from './views/LoyaltyView';
import { TestCatalogView } from './views/TestCatalogView';
import { PackagesView } from './views/PackagesView';
import { FinancialView } from './views/FinancialView';
import { CeoShareView } from './views/CeoShareView';
import { HrView } from './views/HrView';
import { InventoryView } from './views/InventoryView';
import { DeviceInterfaceView } from './views/DeviceInterfaceView';
import { PatientPortalView } from './views/PatientPortalView';
import { FullWorkflowView } from './views/FullWorkflowView';
import { ArchitectureView } from './views/ArchitectureView';
import { LabProfileView } from './views/LabProfileView';

// Modals
import { NewOrderModal } from './modals/NewOrderModal';
import { ReportPrintModal } from './modals/ReportPrintModal';
import { BarcodeLabelModal } from './modals/BarcodeLabelModal';
import { ConvertBookingModal } from './modals/ConvertBookingModal';
import { GithubDeployModal } from './modals/GithubDeployModal';

export default function App() {
  // Sync state with storage
  const refreshAllData = () => {
    setOrders(StorageService.getOrders());
    setPatients(StorageService.getPatients());
    setTests(StorageService.getTests());
    setPackages(StorageService.getPackages());
    setBookings(StorageService.getBookings());
    setReagents(StorageService.getReagents());
    setEmployees(StorageService.getEmployees());
    setExpenses(StorageService.getExpenses());
    setDevices(StorageService.getDevices());
    setAuditLogs(StorageService.getAuditLogs());
  };

  // Initialize storage & subscribe to live multi-device events
  useEffect(() => {
    StorageService.init();
    const unsubscribe = StorageService.subscribe(refreshAllData);
    return () => unsubscribe();
  }, []);

  // State
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [activeBranch, setActiveBranch] = useState<string>(RT_LAB_INFO.branches[0]?.id || 'behtim-main');
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>('Pathologist');

  // Datasets
  const [orders, setOrders] = useState<Order[]>(() => StorageService.getOrders());
  const [patients, setPatients] = useState<Patient[]>(() => StorageService.getPatients());
  const [tests, setTests] = useState<TestCatalogItem[]>(() => StorageService.getTests());
  const [packages, setPackages] = useState<TestPackage[]>(() => StorageService.getPackages());
  const [bookings, setBookings] = useState<Booking[]>(() => StorageService.getBookings());
  const [reagents, setReagents] = useState<Reagent[]>(() => StorageService.getReagents());
  const [employees, setEmployees] = useState<Employee[]>(() => StorageService.getEmployees());
  const [expenses, setExpenses] = useState<Expense[]>(() => StorageService.getExpenses());
  const [devices, setDevices] = useState<AnalyzerDevice[]>(() => StorageService.getDevices());
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => StorageService.getAuditLogs());

  // Modal states
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false);
  const [isGithubModalOpen, setIsGithubModalOpen] = useState(false);
  const [preselectedPatient, setPreselectedPatient] = useState<Patient | null>(null);
  const [preselectedPackageId, setPreselectedPackageId] = useState<string | null>(null);

  const [printReportOrder, setPrintReportOrder] = useState<Order | null>(null);
  const [barcodeOrder, setBarcodeOrder] = useState<Order | null>(null);
  const [convertBooking, setConvertBooking] = useState<Booking | null>(null);

  // Order Handlers
  const handleSaveOrder = (newOrder: Order) => {
    StorageService.saveOrder(newOrder);
    setOrders(StorageService.getOrders());
    setAuditLogs(StorageService.getAuditLogs());
  };

  const handleUpdateOrder = (updatedOrder: Order) => {
    StorageService.saveOrder(updatedOrder);
    setOrders(StorageService.getOrders());
    setAuditLogs(StorageService.getAuditLogs());
  };

  const handleDeleteOrder = (orderId: string) => {
    StorageService.deleteOrder(orderId);
    setOrders(StorageService.getOrders());
    setAuditLogs(StorageService.getAuditLogs());
  };

  // Patient Handlers
  const handleSavePatient = (patient: Patient) => {
    StorageService.savePatient(patient);
    setPatients(StorageService.getPatients());
  };

  const handleDeletePatient = (patientId: string) => {
    StorageService.deletePatient(patientId);
    setPatients(StorageService.getPatients());
  };

  const handleOpenNewOrderForPatient = (patient: Patient) => {
    setPreselectedPatient(patient);
    setPreselectedPackageId(null);
    setIsNewOrderOpen(true);
  };

  // Tests & Packages Handlers
  const handleSaveTest = (test: TestCatalogItem) => {
    StorageService.saveTest(test);
    setTests(StorageService.getTests());
  };

  const handleDeleteTest = (testId: string) => {
    StorageService.deleteTest(testId);
    setTests(StorageService.getTests());
  };

  const handleSavePackage = (pkg: TestPackage) => {
    StorageService.savePackage(pkg);
    setPackages(StorageService.getPackages());
  };

  const handleDeletePackage = (pkgId: string) => {
    StorageService.deletePackage(pkgId);
    setPackages(StorageService.getPackages());
  };

  // Bookings Handlers
  const handleSaveBooking = (booking: Booking) => {
    StorageService.saveBooking(booking);
    setBookings(StorageService.getBookings());
  };

  const handleDeleteBooking = (bookingId: string) => {
    StorageService.deleteBooking(bookingId);
    setBookings(StorageService.getBookings());
  };

  const handleConvertBooking = (booking: Booking) => {
    setConvertBooking(booking);
  };

  // Reagents Handlers
  const handleSaveReagent = (reagent: Reagent) => {
    StorageService.saveReagent(reagent);
    setReagents(StorageService.getReagents());
  };

  const handleDeleteReagent = (reagentId: string) => {
    StorageService.deleteReagent(reagentId);
    setReagents(StorageService.getReagents());
  };

  const handleConsumeReagent = (id: string, amount: number) => {
    StorageService.consumeReagent(id, amount);
    setReagents(StorageService.getReagents());
    setAuditLogs(StorageService.getAuditLogs());
  };

  // Employee Handlers
  const handleSaveEmployee = (emp: Employee) => {
    StorageService.saveEmployee(emp);
    setEmployees(StorageService.getEmployees());
  };

  const handleDeleteEmployee = (empId: string) => {
    StorageService.deleteEmployee(empId);
    setEmployees(StorageService.getEmployees());
  };

  // Expenses Handlers
  const handleAddExpense = (exp: Expense) => {
    StorageService.saveExpense(exp);
    setExpenses(StorageService.getExpenses());
    setAuditLogs(StorageService.getAuditLogs());
  };

  const handleEditExpense = (exp: Expense) => {
    StorageService.saveExpense(exp);
    setExpenses(StorageService.getExpenses());
    setAuditLogs(StorageService.getAuditLogs());
  };

  const handleDeleteExpense = (expId: string) => {
    StorageService.deleteExpense(expId);
    setExpenses(StorageService.getExpenses());
    setAuditLogs(StorageService.getAuditLogs());
  };

  // Device Sync Handler: Simulates automated data flow from Analyzer to LIS
  const handleSyncDeviceResults = (device: AnalyzerDevice) => {
    const pendingOrder = orders.find(o => 
      o.specimenStatus === 'In Processing' || 
      o.orderStatus === 'Sample Collected' ||
      (o.results && o.results.some(r => !r.resultValue))
    );

    if (pendingOrder) {
      const updatedResults = pendingOrder.results.map(r => {
        if (r.resultValue) return r;

        let mockVal = '100';
        let flag: any = 'Normal';
        if (r.testCode === 'CBC') mockVal = 'Hb: 13.9 g/dL, WBC: 7,200, PLT: 280,000';
        else if (r.testCode === 'FBS') mockVal = '92';
        else if (r.testCode === 'HBA1C') mockVal = '5.4';
        else if (r.testCode === 'CREAT') mockVal = '0.95';
        else if (r.testCode === 'UREA') mockVal = '28';
        else if (r.testCode === 'ALT') mockVal = '25';
        else if (r.testCode === 'AST') mockVal = '22';
        else if (r.testCode === 'TBIL') mockVal = '0.8';
        else if (r.testCode === 'TSH') mockVal = '2.1';
        else if (r.testCode === 'PT') mockVal = '12.8';

        return {
          ...r,
          resultValue: mockVal,
          flag
        };
      });

      const updatedOrder: Order = {
        ...pendingOrder,
        results: updatedResults,
        orderStatus: 'Results Entered',
        specimenStatus: 'Completed',
        clinicalInterpretation: 'تم استقبال النتائج آلياً ومطابقتها من جهاز ' + device.name + '.'
      };

      StorageService.saveOrder(updatedOrder);
      setOrders(StorageService.getOrders());
      StorageService.addAuditLog(
        `مزامنة نتائج من جهاز ${device.name}`,
        `تم نقل نتائج الطلب ${pendingOrder.orderNumber} آلياً`,
        'Result'
      );
      setAuditLogs(StorageService.getAuditLogs());
    }

    const updatedDevice: AnalyzerDevice = {
      ...device,
      lastSyncAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      pendingResultsCount: 0
    };
    StorageService.saveDevice(updatedDevice);
    setDevices(StorageService.getDevices());
  };

  // Operational Counters for badges
  const waitingSamplingCount = orders.filter(o => o.specimenStatus === 'Waiting Collection').length;
  const worklistPendingCount = orders.filter(o => o.orderStatus === 'Sample Collected' || o.specimenStatus === 'In Processing').length;
  const criticalCount = orders.filter(o => o.hasCriticalValue || o.reportStatus === 'Critical Alert').length;
  const pendingBookingsCount = bookings.filter(b => b.status === 'Pending').length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col antialiased">
      
      {/* Top Header */}
      <Header
        activeBranch={activeBranch}
        onSelectBranch={setActiveBranch}
        currentUserRole={currentUserRole}
        onChangeUserRole={setCurrentUserRole}
        onOpenNewOrder={() => {
          setPreselectedPatient(null);
          setPreselectedPackageId(null);
          setIsNewOrderOpen(true);
        }}
        criticalAlertCount={criticalCount}
        onOpenCriticalAlerts={() => setActiveTab('flags')}
        onOpenGithubGuide={() => setIsGithubModalOpen(true)}
      />

      {/* Main Layout (Sidebar + Stage) */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          waitingSamplingCount={waitingSamplingCount}
          worklistPendingCount={worklistPendingCount}
          criticalCount={criticalCount}
          pendingBookingsCount={pendingBookingsCount}
        />

        {/* View Content Stage */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 pb-20">
          
          {activeTab === 'dashboard' && (
            <DashboardView
              orders={orders}
              bookings={bookings}
              onNavigate={setActiveTab}
              onOpenNewOrder={() => {
                setPreselectedPatient(null);
                setPreselectedPackageId(null);
                setIsNewOrderOpen(true);
              }}
              onOpenPrintReport={setPrintReportOrder}
              onOpenBarcode={setBarcodeOrder}
            />
          )}

          {activeTab === 'bookings' && (
            <BookingsView
              bookings={bookings}
              onSaveBooking={handleSaveBooking}
              onConvertBookingToOrder={handleConvertBooking}
              onDeleteBooking={handleDeleteBooking}
            />
          )}

          {activeTab === 'orders' && (
            <OrdersSamplingView
              orders={orders}
              onUpdateOrder={handleUpdateOrder}
              onOpenNewOrder={() => {
                setPreselectedPatient(null);
                setPreselectedPackageId(null);
                setIsNewOrderOpen(true);
              }}
              onOpenPrintReport={setPrintReportOrder}
              onOpenBarcode={setBarcodeOrder}
              onDeleteOrder={handleDeleteOrder}
            />
          )}

          {(activeTab === 'worklist' || activeTab === 'flags') && (
            <WorklistView
              orders={orders}
              currentUserRole={currentUserRole}
              onUpdateOrder={handleUpdateOrder}
              onOpenPrintReport={setPrintReportOrder}
              onDeleteOrder={handleDeleteOrder}
            />
          )}

          {activeTab === 'smart-reports' && (
            <SmartReportsView
              orders={orders}
              onUpdateOrder={handleUpdateOrder}
              onOpenPrintReport={setPrintReportOrder}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsView
              orders={orders}
              onOpenPrintReport={setPrintReportOrder}
              onDeleteOrder={handleDeleteOrder}
            />
          )}

          {activeTab === 'patients' && (
            <PatientsView
              patients={patients}
              orders={orders}
              onSavePatient={handleSavePatient}
              onOpenNewOrderForPatient={handleOpenNewOrderForPatient}
              onOpenPrintReport={setPrintReportOrder}
              onDeletePatient={handleDeletePatient}
            />
          )}

          {activeTab === 'loyalty' && (
            <LoyaltyView
              patients={patients}
              orders={orders}
              onSavePatient={handleSavePatient}
            />
          )}

          {activeTab === 'catalog' && (
            <TestCatalogView
              tests={tests}
              onSaveTest={handleSaveTest}
              onDeleteTest={handleDeleteTest}
            />
          )}

          {activeTab === 'packages' && (
            <PackagesView
              packages={packages}
              tests={tests}
              onSavePackage={handleSavePackage}
              onDeletePackage={handleDeletePackage}
            />
          )}

          {activeTab === 'financial' && (
            <FinancialView
              orders={orders}
              expenses={expenses}
              onUpdateOrder={handleUpdateOrder}
              onAddExpense={handleAddExpense}
              onEditExpense={handleEditExpense}
              onDeleteExpense={handleDeleteExpense}
              onDeleteOrder={handleDeleteOrder}
            />
          )}

          {activeTab === 'ceo-share' && (
            <CeoShareView
              orders={orders}
              expenses={expenses}
              auditLogs={auditLogs}
              onRefresh={refreshAllData}
            />
          )}

          {activeTab === 'hr' && (
            <HrView
              employees={employees}
              onSaveEmployee={handleSaveEmployee}
              onDeleteEmployee={handleDeleteEmployee}
            />
          )}

          {activeTab === 'inventory' && (
            <InventoryView
              reagents={reagents}
              onSaveReagent={handleSaveReagent}
              onConsumeReagent={handleConsumeReagent}
              onDeleteReagent={handleDeleteReagent}
            />
          )}

          {activeTab === 'devices' && (
            <DeviceInterfaceView
              devices={devices}
              orders={orders}
              onSyncDeviceResults={handleSyncDeviceResults}
            />
          )}

          {activeTab === 'portal' && (
            <PatientPortalView
              orders={orders}
              packages={packages}
              onAddBooking={(b) => {
                handleSaveBooking(b);
                alert(`تم تسجيل الحجز بنجاح! كود الحجز هو: ${b.bookingCode}`);
              }}
              onOpenPrintReport={setPrintReportOrder}
            />
          )}

          {activeTab === 'workflow' && (
            <FullWorkflowView />
          )}

          {activeTab === 'architecture' && (
            <ArchitectureView onRefreshData={refreshAllData} />
          )}

          {activeTab === 'lab-profile' && (
            <LabProfileView />
          )}

        </main>
      </div>

      {/* Global Modals */}
      <NewOrderModal
        isOpen={isNewOrderOpen}
        onClose={() => setIsNewOrderOpen(false)}
        onSaveOrder={handleSaveOrder}
        preselectedPatient={preselectedPatient}
        preselectedPackageId={preselectedPackageId}
      />

      <ReportPrintModal
        order={printReportOrder}
        onClose={() => setPrintReportOrder(null)}
      />

      <BarcodeLabelModal
        order={barcodeOrder}
        onClose={() => setBarcodeOrder(null)}
      />

      <ConvertBookingModal
        booking={convertBooking}
        onClose={() => setConvertBooking(null)}
        onOrderCreated={(order) => {
          handleSaveOrder(order);
          setActiveTab('orders');
        }}
      />

      <GithubDeployModal
        isOpen={isGithubModalOpen}
        onClose={() => setIsGithubModalOpen(false)}
      />

    </div>
  );
}
