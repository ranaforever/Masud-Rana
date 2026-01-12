
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Bus, 
  LayoutDashboard, 
  Edit3, 
  Phone, 
  AlertCircle,
  X,
  MapPin,
  ChevronDown,
  Settings,
  Database,
  CheckCircle2,
  Bell,
  PartyPopper,
  Info,
  Sun,
  Moon,
  Receipt
} from 'lucide-react';
import { 
  ResponseData, 
  TourOption, 
  Booker, 
  CustomerTypeOption, 
  ViewType,
  Expense
} from './types';
import { 
  INITIAL_TOURS, 
  INITIAL_BOOKERS, 
  INITIAL_CUSTOMER_TYPES, 
  INITIAL_RESPONSES 
} from './mockData';
import SeatMap from './components/SeatMap';
import BookingModal from './components/BookingModal';
import Dashboard from './components/Dashboard';
import EditSection from './components/EditSection';
import AdminPanel from './components/AdminPanel';
import PassengerDetailsModal from './components/PassengerDetailsModal';
import ExpensesView from './components/ExpensesView';

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'payment';
}

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType | 'admin'>('booking');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('tour_lagbe_theme') === 'dark');
  
  const [responses, setResponses] = useState<ResponseData[]>(() => {
    const saved = localStorage.getItem('tour_lagbe_responses');
    return saved ? JSON.parse(saved) : INITIAL_RESPONSES;
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('tour_lagbe_expenses');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [selectedPassenger, setSelectedPassenger] = useState<ResponseData | null>(null);

  const [tours, setTours] = useState<TourOption[]>(() => {
    const saved = localStorage.getItem('tour_lagbe_tours');
    return saved ? JSON.parse(saved) : INITIAL_TOURS;
  });
  const [bookers, setBookers] = useState<Booker[]>(() => {
    const saved = localStorage.getItem('tour_lagbe_bookers');
    return saved ? JSON.parse(saved) : INITIAL_BOOKERS;
  });
  const [customerTypes, setCustomerTypes] = useState<CustomerTypeOption[]>(() => {
    const saved = localStorage.getItem('tour_lagbe_customer_types');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMER_TYPES;
  });

  const [activeTourName, setActiveTourName] = useState<string>(tours[0]?.name || '');

  useEffect(() => {
    localStorage.setItem('tour_lagbe_responses', JSON.stringify(responses));
    localStorage.setItem('tour_lagbe_expenses', JSON.stringify(expenses));
    localStorage.setItem('tour_lagbe_tours', JSON.stringify(tours));
    localStorage.setItem('tour_lagbe_bookers', JSON.stringify(bookers));
    localStorage.setItem('tour_lagbe_customer_types', JSON.stringify(customerTypes));
    localStorage.setItem('tour_lagbe_theme', isDarkMode ? 'dark' : 'light');
    
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [responses, expenses, tours, bookers, customerTypes, isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const addNotification = useCallback((message: string, type: 'success' | 'error' | 'info' | 'payment' = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4500);
  }, []);

  const handleSeatClick = (seat: string) => {
    const passenger = responses.find(r => r.tourName === activeTourName && r.seatNo === seat);
    if (passenger) {
      setSelectedPassenger(passenger);
    } else {
      setSelectedSeat(seat);
    }
  };

  const handleBooking = (newData: ResponseData) => {
    setResponses(prev => [...prev, newData]);
    setSelectedSeat(null);
    addNotification(`নতুন বুকিং: ${newData.fullName} (সিট ${newData.seatNo})`, 'success');
  };

  const handleUpdate = (updatedData: ResponseData) => {
    setResponses(prev => prev.map(r => r.id === updatedData.id ? updatedData : r));
    if (selectedPassenger?.id === updatedData.id) {
      setSelectedPassenger(updatedData);
    }
    addNotification(`তথ্য আপডেট করা হয়েছে: ${updatedData.fullName}`, 'info');
  };

  const handleDelete = (id: string) => {
    const record = responses.find(r => r.id === id);
    if (window.confirm(`আপনি কি নিশ্চিত যে আপনি ${record?.fullName}-এর বুকিং মুছতে চান?`)) {
      setResponses(prev => prev.filter(r => r.id !== id));
      addNotification("বুকিং মুছে ফেলা হয়েছে", 'error');
    }
  };

  const currentOccupancy = responses.filter(r => r.tourName === activeTourName).length;
  const totalSeats = 45;

  return (
    <div className={`min-h-screen flex flex-col font-sans antialiased pb-24 lg:pb-0 transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-[#F9FBFF] text-slate-900'}`}>
      
      <div className="fixed top-24 right-4 z-[200] space-y-3 max-w-sm w-full pointer-events-none">
        {notifications.map(n => (
          <div key={n.id} className={`pointer-events-auto p-5 rounded-[1.5rem] shadow-2xl border flex items-center gap-4 animate-in slide-in-from-right duration-500 ${
            isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
          }`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              n.type === 'success' ? 'bg-green-500/10 text-green-500' : 
              n.type === 'error' ? 'bg-red-500/10 text-red-500' : 
              n.type === 'payment' ? 'bg-orange-500/10 text-orange-500' : 'bg-blue-500/10 text-blue-500'
            }`}>
              {n.type === 'success' ? <CheckCircle2 size={20} /> : 
               n.type === 'payment' ? <PartyPopper size={20} /> : 
               n.type === 'error' ? <AlertCircle size={20} /> : <Info size={20} />}
            </div>
            <div className="flex-1">
              <p className={`text-[10px] font-black uppercase tracking-widest leading-none mb-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>System Notification</p>
              <p className={`text-xs font-black uppercase tracking-tight ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{n.message}</p>
            </div>
          </div>
        ))}
      </div>

      <header className={`backdrop-blur-2xl shadow-sm border-b sticky top-0 z-[60] transition-colors duration-300 ${isDarkMode ? 'bg-slate-950/90 border-slate-800' : 'bg-white/90 border-slate-100'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex justify-between h-20 lg:h-24 items-center">
            <div className="flex items-center gap-4 lg:gap-6 group cursor-pointer" onClick={() => setActiveView('booking')}>
              <img 
                src="https://i.ibb.co/gb4jzgXj/Orange-and-Blue-Travel-Agency-Logo-1-1.png" 
                alt="Logo" 
                className="h-12 w-12 lg:h-16 lg:w-16 object-contain rounded-full border-2 border-slate-50 p-1 shadow-sm"
              />
              <div>
                <h1 className="text-2xl lg:text-3xl font-[1000] text-[#FF6B00] leading-none tracking-tighter italic uppercase">TOUR লাগবে</h1>
                <p className={`text-[10px] lg:text-[13px] font-extrabold uppercase tracking-[0.2em] font-bangla transition-colors duration-300 ${isDarkMode ? 'text-blue-400' : 'text-[#003B95]'}`}>আপনার বিশস্থ ভ্রমণ সঙ্গী</p>
              </div>
            </div>

            <nav className="hidden lg:flex items-center bg-transparent gap-2">
              <div className={`flex items-center p-1.5 rounded-2xl border transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <NavButton active={activeView === 'booking'} onClick={() => setActiveView('booking')} icon={<Bus size={18} />} label="Manifest" isDarkMode={isDarkMode} />
                <NavButton active={activeView === 'dashboard'} onClick={() => setActiveView('dashboard')} icon={<LayoutDashboard size={18} />} label="Financials" isDarkMode={isDarkMode} />
                <NavButton active={activeView === 'expenses'} onClick={() => setActiveView('expenses')} icon={<Receipt size={18} />} label="Expenses" isDarkMode={isDarkMode} />
                <NavButton active={activeView === 'edit'} onClick={() => setActiveView('edit')} icon={<Edit3 size={18} />} label="Records" isDarkMode={isDarkMode} />
                <NavButton active={activeView === 'admin'} onClick={() => setActiveView('admin')} icon={<Settings size={18} />} label="Partners" isDarkMode={isDarkMode} />
              </div>

              <button 
                onClick={toggleTheme}
                className={`w-12 h-12 flex items-center justify-center rounded-2xl border transition-all hover:scale-105 active:scale-95 ${
                  isDarkMode ? 'bg-slate-900 border-slate-800 text-yellow-400' : 'bg-white border-slate-200 text-slate-600'
                }`}
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </nav>

            <div className="lg:hidden flex items-center gap-3">
               <button onClick={toggleTheme} className={`w-10 h-10 rounded-full flex items-center justify-center border ${isDarkMode ? 'bg-slate-900 border-slate-800 text-yellow-400' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>{isDarkMode ? <Sun size={18} /> : <Moon size={18} />}</button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-6 lg:py-12">
        {activeView === 'booking' && (
          <div className="space-y-8 lg:space-y-12 animate-in fade-in zoom-in-95 duration-500">
            <div className={`grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 lg:p-10 rounded-[2.5rem] shadow-sm border transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
              <div className="lg:col-span-5 space-y-2">
                <h2 className={`text-2xl lg:text-3xl font-black tracking-tighter uppercase ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Active Tour Manifest</h2>
                <p className={`text-sm font-medium font-bangla ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>তালিকাবদ্ধ ভ্রমণের জন্য সিট ম্যাপ এবং বোর্ডিং লিস্ট পরিচালনা করুন।</p>
              </div>
              
              <div className="lg:col-span-7 flex flex-wrap lg:flex-nowrap items-center justify-end gap-4">
                <div className={`flex-1 lg:flex-none flex items-center gap-4 px-6 py-4 rounded-3xl border ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                  <div className="relative min-w-[240px]">
                    <p className={`text-[10px] font-black uppercase tracking-widest leading-none mb-1.5 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Trip Selection</p>
                    <select 
                      value={activeTourName}
                      onChange={(e) => setActiveTourName(e.target.value)}
                      className={`w-full appearance-none bg-transparent font-black text-sm lg:text-base outline-none cursor-pointer pr-8 font-bangla ${isDarkMode ? 'text-white' : 'text-slate-900'}`}
                    >
                      {tours.map(t => <option key={t.name} value={t.name} className={isDarkMode ? 'bg-slate-900 text-white' : ''}>{t.name}</option>)}
                    </select>
                    <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FF6B00] pointer-events-none" />
                  </div>
                </div>

                <div className="flex-1 lg:flex-none flex items-center gap-4 bg-[#003B95] px-6 py-4 rounded-3xl text-white shadow-lg shadow-blue-900/20">
                   <div className="text-right">
                     <p className="text-[10px] font-black text-blue-300 uppercase tracking-widest leading-none mb-1">Fill Rate</p>
                     <p className="text-lg font-black">{Math.round((currentOccupancy/totalSeats)*100)}% <span className="text-xs font-bold text-blue-200 font-bangla">বুকড</span></p>
                   </div>
                   <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20"><Bus size={20} /></div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-8 overflow-hidden">
                <SeatMap 
                  busNo={0}
                  activeTourName={activeTourName}
                  bookedSeats={responses.filter(r => r.tourName === activeTourName).map(r => r.seatNo)}
                  onSeatClick={handleSeatClick}
                  isDarkMode={isDarkMode}
                />
              </div>
              
              <div className="lg:col-span-4 space-y-8">
                <div className={`p-8 rounded-[2.5rem] shadow-sm border space-y-6 transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
                  <h3 className={`font-black uppercase tracking-tighter text-sm ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>Status Key</h3>
                  <div className="space-y-4">
                    <LegendItem color={isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'} label="Available" desc="Open Seat" isDarkMode={isDarkMode} />
                    <LegendItem color="bg-[#003B95] border-[#003B95]" label="Occupied" desc="Guest Confirmed" isDarkMode={isDarkMode} />
                    <LegendItem color={isDarkMode ? 'bg-slate-900 border-[#FF6B00] animate-pulse' : 'bg-white border-[#FF6B00] animate-pulse'} label="Selecting" desc="In-Progress" isDarkMode={isDarkMode} />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-[#003B95] to-[#002B6B] text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-5 -mr-10 -mt-10 rotate-12 group-hover:rotate-0 transition-transform duration-1000"><Database size={240} /></div>
                  <h3 className="font-black text-3xl mb-4 relative z-10 leading-none tracking-tighter uppercase">Support</h3>
                  <p className="text-blue-200/80 text-sm font-medium mb-10 relative z-10 leading-relaxed font-bangla">যেকোনো টেকনিক্যাল সমস্যায় আমাদের সাথে যোগাযোগ করুন।</p>
                  <div className="flex items-center gap-5 bg-white/10 p-5 rounded-3xl backdrop-blur-xl relative z-10 border border-white/20">
                    <div className="bg-white p-3 rounded-2xl text-[#003B95] shadow-lg"><Phone size={24} /></div>
                    <div><span className="text-[10px] font-black uppercase text-blue-200 tracking-widest">Ops Hotline</span><p className="font-black text-xl">+880 1XXX-XXXXXX</p></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeView === 'dashboard' && <Dashboard responses={responses} expenses={expenses} isDarkMode={isDarkMode} tours={tours} />}
        {activeView === 'edit' && <EditSection responses={responses} onUpdate={handleUpdate} onDelete={handleDelete} bookers={bookers} isDarkMode={isDarkMode} />}
        {activeView === 'expenses' && <ExpensesView expenses={expenses} setExpenses={setExpenses} tours={tours} isDarkMode={isDarkMode} bookers={bookers} />}
        {activeView === 'admin' && (
          <AdminPanel 
            tours={tours} setTours={setTours}
            bookers={bookers} setBookers={setBookers}
            customerTypes={customerTypes} setCustomerTypes={setCustomerTypes}
            expenses={expenses} setExpenses={setExpenses}
            isDarkMode={isDarkMode}
          />
        )}
      </main>

      <nav className={`lg:hidden fixed bottom-0 left-0 right-0 border-t px-6 py-3 pb-6 flex justify-between items-center z-[70] shadow-2xl transition-colors ${isDarkMode ? 'bg-slate-950/90 border-slate-800 backdrop-blur-2xl' : 'bg-white/90 border-slate-100 backdrop-blur-2xl'}`}>
        <MobileNavBtn active={activeView === 'booking'} onClick={() => setActiveView('booking')} icon={<Bus />} label="Book" />
        <MobileNavBtn active={activeView === 'dashboard'} onClick={() => setActiveView('dashboard')} icon={<LayoutDashboard />} label="Stats" />
        <MobileNavBtn active={activeView === 'expenses'} onClick={() => setActiveView('expenses')} icon={<Receipt />} label="Cost" />
        <MobileNavBtn active={activeView === 'edit'} onClick={() => setActiveView('edit')} icon={<Edit3 />} label="Records" />
        <MobileNavBtn active={activeView === 'admin'} onClick={() => setActiveView('admin')} icon={<Settings />} label="Admin" />
      </nav>

      {selectedSeat && (
        <BookingModal 
          seatNo={selectedSeat}
          busNo={0}
          fixedTourName={activeTourName}
          onClose={() => setSelectedSeat(null)}
          onSubmit={handleBooking}
          tours={tours}
          customerTypes={customerTypes}
          bookers={bookers}
          isDarkMode={isDarkMode}
        />
      )}

      {selectedPassenger && (
        <PassengerDetailsModal
          passenger={selectedPassenger}
          onClose={() => setSelectedPassenger(null)}
          onUpdateDue={handleUpdate}
          bookers={bookers}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  );
};

const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string; isDarkMode: boolean }> = ({ active, onClick, icon, label, isDarkMode }) => (
  <button 
    onClick={onClick} 
    className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-all font-black text-sm uppercase tracking-tighter ${
      active 
        ? 'bg-[#FF6B00] text-white shadow-xl shadow-orange-500/20 scale-105' 
        : `text-slate-500 hover:text-slate-900 dark:hover:text-white ${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-200/50'}`
    }`}
  >
    {icon}{label}
  </button>
);

const MobileNavBtn: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex flex-col items-center justify-center gap-1.5 p-2 transition-all ${active ? 'text-[#FF6B00]' : 'text-slate-400'}`}>
    <div className={`transition-all duration-300 ${active ? 'scale-125 translate-y-[-4px]' : 'scale-100'}`}>{React.cloneElement(icon as any, { size: 22, strokeWidth: active ? 3 : 2 })}</div>
    <span className={`text-[10px] font-black uppercase tracking-tighter ${active ? 'opacity-100' : 'opacity-60'}`}>{label}</span>
  </button>
);

const LegendItem: React.FC<{ color: string; label: string; desc: string; isDarkMode: boolean }> = ({ color, label, desc, isDarkMode }) => (
  <div className="flex items-center gap-4 group">
    <div className={`w-10 h-10 rounded-2xl border-2 shadow-sm ${color} transition-all group-hover:scale-110`}></div>
    <div>
      <h4 className={`text-xs lg:text-sm font-black leading-none mb-1 ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>{label}</h4>
      <p className={`text-[10px] font-bold uppercase tracking-tighter ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{desc}</p>
    </div>
  </div>
);

export default App;
