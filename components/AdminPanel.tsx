
import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Users, 
  Map, 
  CreditCard, 
  ShieldCheck, 
  Lock,
  ChevronRight,
  ShieldAlert,
  Save,
  Info,
  Crown,
  ReceiptText,
  Edit2,
  X
} from 'lucide-react';
import { TourOption, Booker, CustomerTypeOption, Expense } from '../types';

interface AdminPanelProps {
  tours: TourOption[];
  setTours: React.Dispatch<React.SetStateAction<TourOption[]>>;
  bookers: Booker[];
  setBookers: React.Dispatch<React.SetStateAction<Booker[]>>;
  customerTypes: CustomerTypeOption[];
  setCustomerTypes: React.Dispatch<React.SetStateAction<CustomerTypeOption[]>>;
  expenses: Expense[];
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
  isDarkMode: boolean;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  tours, setTours, 
  bookers, setBookers, 
  customerTypes, setCustomerTypes,
  expenses, setExpenses,
  isDarkMode
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authCode, setAuthCode] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'tours' | 'bookers' | 'customers' | 'expenses'>('tours');

  const [newTour, setNewTour] = useState({ name: '', fees: 0 });
  const [newBooker, setNewBooker] = useState({ code: '', name: '' });
  const [newCustType, setNewCustType] = useState({ type: '', fees: 0 });
  
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);
  const [newExpense, setNewExpense] = useState({ 
    tourName: tours[0]?.name || '', 
    description: '', 
    amount: 0, 
    category: 'Food',
    date: new Date().toISOString().split('T')[0]
  });

  const handleAuth = () => {
    if (authCode === '@Rana&01625@') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Unauthorized access. Admin password incorrect.');
    }
  };

  const addItem = (type: string) => {
    if (type === 'tours') {
      if (!newTour.name) return;
      setTours([...tours, { ...newTour }]);
      setNewTour({ name: '', fees: 0 });
    } else if (type === 'bookers') {
      if (!newBooker.code) return;
      setBookers([...bookers, { ...newBooker }]);
      setNewBooker({ code: '', name: '' });
    } else if (type === 'customers') {
      if (!newCustType.type) return;
      setCustomerTypes([...customerTypes, { ...newCustType }]);
      setNewCustType({ type: '', fees: 0 });
    } else if (type === 'expenses') {
      if (!newExpense.description || newExpense.amount <= 0) return;
      
      if (editingExpenseId) {
        setExpenses(prev => prev.map(e => e.id === editingExpenseId ? {
          ...e,
          tourName: newExpense.tourName,
          description: newExpense.description,
          amount: newExpense.amount,
          category: newExpense.category,
          date: newExpense.date
        } : e));
        setEditingExpenseId(null);
      } else {
        const expenseToAdd: Expense = {
          id: Math.random().toString(36).substr(2, 9),
          ...newExpense
        };
        setExpenses([...expenses, expenseToAdd]);
      }
      
      setNewExpense({ 
        tourName: tours[0]?.name || '', 
        description: '', 
        amount: 0, 
        category: 'Food',
        date: new Date().toISOString().split('T')[0]
      });
    }
  };

  const startEditExpense = (expense: Expense) => {
    setEditingExpenseId(expense.id);
    setNewExpense({
      tourName: expense.tourName,
      description: expense.description,
      amount: expense.amount,
      category: expense.category,
      date: expense.date
    });
    setActiveTab('expenses'); // Ensure tab is active
  };

  const cancelExpenseEdit = () => {
    setEditingExpenseId(null);
    setNewExpense({ 
      tourName: tours[0]?.name || '', 
      description: '', 
      amount: 0, 
      category: 'Food',
      date: new Date().toISOString().split('T')[0]
    });
  };

  const removeItem = (type: string, id: string) => {
    if (type === 'tours') setTours(tours.filter(t => t.name !== id));
    else if (type === 'bookers') setBookers(bookers.filter(b => b.code !== id));
    else if (type === 'customers') setCustomerTypes(customerTypes.filter(c => c.type !== id));
    else if (type === 'expenses') setExpenses(expenses.filter(e => e.id !== id));
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-20 text-center animate-in zoom-in-95">
        <div className={`p-10 rounded-[2.5rem] shadow-2xl border-4 transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-50'}`}>
          <div className="bg-[#003B95]/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
            <Lock className="w-12 h-12 text-[#003B95]" />
          </div>
          <h2 className={`text-3xl font-black mb-2 uppercase tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Admin Command</h2>
          <p className={`mb-10 font-medium font-bangla ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>মাস্টার লিস্ট এবং কনফিগারেশন পরিবর্তন করতে সিস্টেম এক্সেস কোড লিখুন।</p>
          
          <div className="space-y-6">
            <input 
              type="password"
              value={authCode}
              onChange={(e) => setAuthCode(e.target.value)}
              placeholder="ENTER ADMIN PASSWORD"
              className={`w-full px-8 py-5 border-2 rounded-3xl outline-none text-center font-black tracking-widest transition-all ${
                isDarkMode ? 'bg-slate-950 border-slate-800 text-white focus:border-[#FF6B00]' : 'bg-slate-50 border-slate-100 text-slate-800 focus:border-[#FF6B00]'
              }`}
            />
            {error && <p className="text-red-500 text-sm font-bold flex items-center justify-center gap-2"><ShieldAlert className="w-4 h-4" /> {error}</p>}
            <button onClick={handleAuth} className="w-full bg-[#FF6B00] text-white py-5 rounded-[2rem] font-black shadow-xl shadow-orange-500/30 hover:bg-[#e66000] transition-all flex items-center justify-center gap-3 active:scale-95 text-lg uppercase tracking-widest">
              UNLOCK PANEL <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
        <div>
          <h2 className={`text-4xl font-black tracking-tight uppercase ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Master Control</h2>
          <p className="text-[#FF6B00] font-bold uppercase tracking-[0.2em] text-xs flex items-center gap-2 mt-2">
            <ShieldCheck className="w-4 h-4" /> Authorized System Access Only
          </p>
        </div>
        
        <div className={`flex flex-wrap items-center p-2 rounded-[2rem] shadow-sm border-2 transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-50'}`}>
          <TabBtn active={activeTab === 'tours'} onClick={() => setActiveTab('tours')} icon={<Map className="w-4 h-4" />} label="Tours" />
          <TabBtn active={activeTab === 'bookers'} onClick={() => setActiveTab('bookers')} icon={<Users className="w-4 h-4" />} label="Partners" />
          <TabBtn active={activeTab === 'customers'} onClick={() => setActiveTab('customers')} icon={<CreditCard className="w-4 h-4" />} label="Policies" />
          <TabBtn active={activeTab === 'expenses'} onClick={() => setActiveTab('expenses')} icon={<ReceiptText className="w-4 h-4" />} label="Expenses" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-6">
          <div className={`rounded-[2.5rem] shadow-sm border-2 overflow-hidden transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-50'}`}>
            <div className={`p-8 border-b flex justify-between items-center ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50/50 border-slate-50'}`}>
              <h3 className={`font-black text-lg uppercase tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{activeTab} Manifest</h3>
              <span className="bg-[#003B95] text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                {activeTab === 'tours' ? tours.length : activeTab === 'bookers' ? bookers.length : activeTab === 'customers' ? customerTypes.length : expenses.length} Active
              </span>
            </div>
            
            <div className="p-4 space-y-2 max-h-[600px] overflow-y-auto custom-scrollbar">
              {activeTab === 'tours' && tours.map(t => <ItemRow isDarkMode={isDarkMode} key={t.name} label={t.name} subLabel={`Base: ৳${t.fees.toLocaleString()}`} isTour onRemove={() => removeItem('tours', t.name)} />)}
              {activeTab === 'bookers' && bookers.map(b => <ItemRow isDarkMode={isDarkMode} key={b.code} label={b.name} subLabel={`Partner Code: ${b.code}`} isBooker onRemove={() => removeItem('bookers', b.code)} />)}
              {activeTab === 'customers' && customerTypes.map(c => <ItemRow isDarkMode={isDarkMode} key={c.type} label={c.type} subLabel={`Surcharge: ৳${c.fees.toLocaleString()}`} onRemove={() => removeItem('customers', c.type)} />)}
              {activeTab === 'expenses' && expenses.map(e => <ItemRow isDarkMode={isDarkMode} key={e.id} label={`${e.description} (${e.tourName})`} subLabel={`৳${e.amount.toLocaleString()} • ${e.category}`} onEdit={() => startEditExpense(e)} onRemove={() => removeItem('expenses', e.id)} isEditing={editingExpenseId === e.id} />)}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className={`p-8 rounded-[2.5rem] shadow-sm border-2 transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-50'}`}>
            <h3 className={`font-black mb-6 flex items-center gap-3 uppercase tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
              {editingExpenseId ? <><Edit2 className="w-6 h-6 text-[#FF6B00]" /> Update Expense</> : <><Plus className="w-6 h-6 text-[#FF6B00]" /> New Entry</>}
            </h3>
            
            <div className="space-y-4">
              {activeTab === 'tours' && (
                <>
                  <Input isDarkMode={isDarkMode} label="Tour Name" value={newTour.name} onChange={v => setNewTour({...newTour, name: v})} placeholder="Ex: Coxs Relax" />
                  <Input isDarkMode={isDarkMode} label="Base Fees" type="number" value={newTour.fees} onChange={v => setNewTour({...newTour, fees: Number(v)})} placeholder="8500" />
                </>
              )}
              {activeTab === 'bookers' && (
                <>
                  <Input isDarkMode={isDarkMode} label="Agency Name" value={newBooker.name} onChange={v => setNewBooker({...newBooker, name: v})} placeholder="Ex: Dhaka Travels" />
                  <Input isDarkMode={isDarkMode} label="Unique Code" value={newBooker.code} onChange={v => setNewBooker({...newBooker, code: v.toUpperCase()})} placeholder="BC-01" />
                </>
              )}
              {activeTab === 'customers' && (
                <>
                  <Input isDarkMode={isDarkMode} label="Type Name" value={newCustType.type} onChange={v => setNewCustType({...newCustType, type: v})} placeholder="Ex: Solo" />
                  <Input isDarkMode={isDarkMode} label="Extra Fee" type="number" value={newCustType.fees} onChange={v => setNewCustType({...newCustType, fees: Number(v)})} placeholder="1500" />
                </>
              )}
              {activeTab === 'expenses' && (
                <>
                  <div className="space-y-1.5">
                    <label className={`text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Select Trip</label>
                    <select value={newExpense.tourName} onChange={e => setNewExpense({...newExpense, tourName: e.target.value})} className={`w-full px-4 py-3 rounded-xl border-2 font-bold outline-none ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white focus:border-[#FF6B00]' : 'bg-slate-50 border-slate-100 text-slate-800 focus:border-[#FF6B00]'}`}>
                      {tours.map(t => <option key={t.name} value={t.name}>{t.name}</option>)}
                    </select>
                  </div>
                  <Input isDarkMode={isDarkMode} label="Expense Description" value={newExpense.description} onChange={v => setNewExpense({...newExpense, description: v})} placeholder="Fuel, Hotel, etc." />
                  <Input isDarkMode={isDarkMode} label="Amount (৳)" type="number" value={newExpense.amount} onChange={v => setNewExpense({...newExpense, amount: Number(v)})} placeholder="5000" />
                  <Input isDarkMode={isDarkMode} label="Date" type="date" value={newExpense.date} onChange={v => setNewExpense({...newExpense, date: v})} placeholder="Select Date" />
                  <div className="space-y-1.5">
                    <label className={`text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Category</label>
                    <select value={newExpense.category} onChange={e => setNewExpense({...newExpense, category: e.target.value})} className={`w-full px-4 py-3 rounded-xl border-2 font-bold outline-none ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white focus:border-[#FF6B00]' : 'bg-slate-50 border-slate-100 text-slate-800 focus:border-[#FF6B00]'}`}>
                      <option>Fuel</option><option>Food</option><option>Hotel</option><option>Transport</option><option>Other</option>
                    </select>
                  </div>
                </>
              )}

              <div className="flex gap-3">
                {editingExpenseId && (
                   <button 
                    onClick={cancelExpenseEdit}
                    className={`flex-1 py-4 rounded-2xl font-black uppercase text-xs ${isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-200 text-slate-600'}`}
                   >
                     Cancel
                   </button>
                )}
                <button 
                  onClick={() => addItem(activeTab)}
                  className={`flex-[2] bg-[#003B95] text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-blue-800 transition-all active:scale-95 shadow-lg shadow-blue-900/10 uppercase tracking-widest text-xs`}
                >
                  {editingExpenseId ? <><Save className="w-4 h-4" /> Update Record</> : <><Save className="w-4 h-4" /> Save Record</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TabBtn: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl transition-all font-black text-xs uppercase tracking-tighter ${active ? 'bg-[#FF6B00] text-white shadow-lg shadow-orange-500/20' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'}`}>
    {icon} {label}
  </button>
);

const ItemRow: React.FC<{ 
  label: string; 
  subLabel: string; 
  isTour?: boolean; 
  isBooker?: boolean; 
  isDarkMode: boolean; 
  onRemove: () => void; 
  onEdit?: () => void;
  isEditing?: boolean;
}> = ({ label, subLabel, isTour, isBooker, isDarkMode, onRemove, onEdit, isEditing }) => (
  <div className={`flex items-center justify-between p-4 border rounded-2xl transition-all group ${
    isEditing ? 'border-[#FF6B00] bg-orange-500/5' : 
    isDarkMode ? 'bg-slate-950 border-slate-800 hover:border-blue-500/30' : 'bg-white border-slate-100 hover:border-[#FF6B00]/30'
  }`}>
    <div className="flex items-center gap-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
        isTour ? 'bg-emerald-500/10 text-emerald-500' : 
        isBooker ? 'bg-blue-500/10 text-blue-500' : 
        isEditing ? 'bg-orange-500/10 text-orange-500' : 'bg-slate-500/10 text-slate-400'
      }`}>
        {isBooker ? <Crown size={20} /> : <ShieldCheck size={20} />}
      </div>
      <div>
        <h4 className={`font-bold text-sm font-bangla ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>{label}</h4>
        <p className={`text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{subLabel}</p>
      </div>
    </div>
    <div className="flex items-center gap-2">
      {onEdit && (
        <button onClick={onEdit} className={`p-2 rounded-lg transition-colors opacity-0 group-hover:opacity-100 ${isDarkMode ? 'text-blue-400 hover:bg-blue-400/10' : 'text-blue-600 hover:bg-blue-50'}`}>
          <Edit2 size={16} />
        </button>
      )}
      <button onClick={onRemove} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
        <Trash2 size={16} />
      </button>
    </div>
  </div>
);

const Input: React.FC<{ label: string; value: string | number; onChange: (v: string) => void; placeholder: string; type?: string; isDarkMode: boolean }> = ({ label, value, onChange, placeholder, type = "text", isDarkMode }) => (
  <div className="space-y-1.5">
    <label className={`text-[10px] font-black uppercase tracking-widest leading-none ml-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{label}</label>
    <input 
      type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      className={`w-full px-4 py-3 rounded-xl border-2 font-bold outline-none transition-all ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white focus:border-[#FF6B00]' : 'bg-slate-50 border-slate-100 text-slate-800 focus:border-[#FF6B00]'} font-bangla`}
    />
  </div>
);

export default AdminPanel;
