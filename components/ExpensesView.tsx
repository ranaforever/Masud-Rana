
import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Trash2, 
  Receipt, 
  ChevronDown, 
  Wallet, 
  ArrowDownCircle, 
  Search,
  Lock,
  Unlock,
  ShieldCheck,
  Edit2,
  X,
  Save,
  ShieldAlert,
  User
} from 'lucide-react';
import { Expense, TourOption, Booker } from '../types';

interface ExpensesViewProps {
  expenses: Expense[];
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
  tours: TourOption[];
  bookers: Booker[];
  isDarkMode: boolean;
}

const CATEGORIES = ['Food', 'Fuel', 'Hotel', 'Transport', 'Medical', 'Other'];

const ExpensesView: React.FC<ExpensesViewProps> = ({ expenses, setExpenses, tours, bookers, isDarkMode }) => {
  const [selectedTrip, setSelectedTrip] = useState<string>(tours[0]?.name || '');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authType, setAuthType] = useState<'admin' | 'booker' | null>(null);
  const [activeUser, setActiveUser] = useState<string>('');
  const [password, setPassword] = useState('');
  const [showAuth, setShowAuth] = useState(false);
  const [authError, setAuthError] = useState('');
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newExpense, setNewExpense] = useState({ 
    description: '', 
    amount: 0, 
    category: 'Food',
    date: new Date().toISOString().split('T')[0]
  });
  
  const [searchQuery, setSearchQuery] = useState('');

  const filteredExpenses = useMemo(() => {
    return expenses.filter(e => 
      e.tourName === selectedTrip && 
      e.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [expenses, selectedTrip, searchQuery]);

  const tripTotal = useMemo(() => {
    return filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  }, [filteredExpenses]);

  const handleAuth = () => {
    const input = password.trim();
    const booker = bookers.find(b => b.code === input.toUpperCase());
    
    if (input === '@Rana&01625@') {
      setIsAuthorized(true);
      setAuthType('admin');
      setActiveUser('Super Admin');
      setShowAuth(false);
      setAuthError('');
      setPassword('');
    } else if (booker) {
      setIsAuthorized(true);
      setAuthType('booker');
      setActiveUser(booker.name);
      setShowAuth(false);
      setAuthError('');
      setPassword('');
    } else {
      setAuthError('পাসওয়ার্ড বা বুকার কোড ভুল! আবার চেষ্টা করুন।');
    }
  };

  const handleAddOrUpdate = () => {
    if (!newExpense.description || newExpense.amount <= 0) return;
    
    if (editingId) {
      setExpenses(prev => prev.map(e => e.id === editingId ? {
        ...e,
        description: newExpense.description,
        amount: newExpense.amount,
        category: newExpense.category,
        date: newExpense.date
      } : e));
      setEditingId(null);
    } else {
      const expense: Expense = {
        id: Math.random().toString(36).substr(2, 9),
        tourName: selectedTrip,
        description: newExpense.description,
        amount: newExpense.amount,
        category: newExpense.category,
        date: newExpense.date
      };
      setExpenses(prev => [...prev, expense]);
    }
    
    setNewExpense({ 
      description: '', 
      amount: 0, 
      category: 'Food', 
      date: new Date().toISOString().split('T')[0] 
    });
  };

  const startEdit = (expense: Expense) => {
    setEditingId(expense.id);
    setNewExpense({
      description: expense.description,
      amount: expense.amount,
      category: expense.category,
      date: expense.date
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setNewExpense({ 
      description: '', 
      amount: 0, 
      category: 'Food', 
      date: new Date().toISOString().split('T')[0] 
    });
  };

  const deleteExpense = (id: string) => {
    if (window.confirm("আপনি কি নিশ্চিত যে আপনি এই খরচটি মুছে ফেলতে চান?")) {
      setExpenses(prev => prev.filter(e => e.id !== id));
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className={`p-8 lg:p-12 rounded-[3.5rem] border shadow-sm transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 mb-10">
          <div className="flex items-center gap-6">
            <div>
              <h3 className={`text-3xl font-[1000] tracking-tighter uppercase flex items-center gap-3 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                <Receipt className="text-[#FF6B00] w-8 h-8" /> Expense Manager
              </h3>
              <div className="flex items-center gap-2 mt-2">
                <p className={`text-[11px] font-black uppercase tracking-[0.2em] font-bangla ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>ট্রিপ ভিত্তিক খরচ ব্যবস্থাপনা</p>
                {isAuthorized && (
                  <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                    authType === 'admin' 
                    ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                    : 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                  }`}>
                    <ShieldCheck size={10} /> {authType === 'admin' ? 'Admin Mode' : 'Booker Access'}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             {!isAuthorized && !showAuth && (
               <button 
                onClick={() => setShowAuth(true)}
                className={`flex items-center gap-2 px-6 py-4 rounded-3xl font-black text-xs uppercase tracking-widest transition-all shadow-sm ${
                  isDarkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
               >
                 <Lock size={16} className="text-[#FF6B00]" /> Unlock Management
               </button>
             )}
             
             {isAuthorized && (
               <div className="flex items-center gap-3">
                 <div className="text-right hidden sm:block">
                   <p className={`text-[9px] font-black uppercase tracking-tighter ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Active Session</p>
                   <p className={`text-[11px] font-black uppercase ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{activeUser}</p>
                 </div>
                 <button 
                  onClick={() => setIsAuthorized(false)}
                  className={`flex items-center gap-2 px-6 py-4 rounded-3xl font-black text-xs uppercase tracking-widest transition-all ${
                    isDarkMode ? 'bg-slate-800 text-emerald-500 border border-emerald-500/30' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                  }`}
                 >
                   <Unlock size={16} /> Log Out
                 </button>
               </div>
             )}

            <div className={`flex items-center gap-4 px-6 py-4 rounded-3xl border transition-all ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <div className="relative min-w-[200px]">
                <p className={`text-[10px] font-black uppercase tracking-widest leading-none mb-1.5 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Active Trip</p>
                <select 
                  value={selectedTrip}
                  onChange={(e) => setSelectedTrip(e.target.value)}
                  className={`w-full appearance-none bg-transparent font-black text-sm lg:text-base outline-none cursor-pointer pr-8 font-bangla ${isDarkMode ? 'text-white' : 'text-slate-900'}`}
                >
                  {tours.map(t => <option key={t.name} value={t.name} className={isDarkMode ? 'bg-slate-900' : ''}>{t.name}</option>)}
                </select>
                <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FF6B00]" />
              </div>
            </div>
          </div>
        </div>

        {showAuth && (
          <div className={`mb-10 p-8 rounded-[2.5rem] border-2 animate-in slide-in-from-top duration-300 ${isDarkMode ? 'bg-slate-950 border-slate-800 shadow-2xl shadow-blue-900/10' : 'bg-white border-slate-100 shadow-xl shadow-slate-200/50'}`}>
            <div className="max-w-md mx-auto space-y-4">
              <div className="flex flex-col items-center gap-2 mb-2">
                 <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-[#FF6B00]">
                    <Lock size={24} />
                 </div>
                 <h4 className={`text-center font-black uppercase tracking-tighter text-sm ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>অ্যাডমিন পাসওয়ার্ড বা বুকার কোড লিখুন</h4>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">ব্যবস্থাপনা টুলগুলো ব্যবহারের জন্য প্রমাণীকরণ প্রয়োজন।</p>
              </div>
              <div className="relative">
                <input 
                  autoFocus
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAuth()}
                  placeholder="CODE / PASSWORD"
                  className={`w-full p-4 rounded-2xl border-2 outline-none text-center font-black tracking-widest transition-all ${
                    isDarkMode ? 'bg-slate-900 border-slate-800 text-white focus:border-[#FF6B00]' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-[#FF6B00]'
                  }`}
                />
              </div>
              {authError && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest text-center flex items-center justify-center gap-2"><ShieldAlert size={12} /> {authError}</p>}
              <div className="flex gap-3">
                <button onClick={() => setShowAuth(false)} className={`flex-1 py-4 rounded-2xl font-black uppercase text-xs tracking-tight ${isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>Cancel</button>
                <button onClick={handleAuth} className="flex-[2] bg-[#003B95] text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-blue-800 shadow-lg shadow-blue-900/20 active:scale-95 transition-all">Verify & Unlock</button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4 space-y-6">
            <div className="relative group">
              {!isAuthorized && (
                <div className="absolute inset-0 z-20 backdrop-blur-[2px] bg-slate-900/5 rounded-[2.5rem] flex items-center justify-center p-8 text-center transition-all duration-300">
                   <div className={`p-6 rounded-[2rem] shadow-2xl border transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-50'}`}>
                      <Lock size={32} className="mx-auto mb-3 text-[#FF6B00] animate-pulse" />
                      <p className={`text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>System Locked</p>
                      <p className={`text-xs font-bold mt-1 font-bangla ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>নতুন খরচ যোগ করতে আনলক করুন।</p>
                      <button 
                        onClick={() => setShowAuth(true)}
                        className="mt-4 w-full bg-[#003B95] text-white py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-800"
                      >
                        Click to Unlock
                      </button>
                   </div>
                </div>
              )}
              
              <div className={`p-8 rounded-[2.5rem] border shadow-sm transition-all ${
                isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-100'
              } ${!isAuthorized ? 'opacity-40 blur-[1.5px] scale-[0.98]' : ''}`}>
                <h4 className={`font-black uppercase tracking-widest text-[10px] mb-6 ${isDarkMode ? 'text-blue-400' : 'text-[#003B95]'}`}>
                  {editingId ? 'Edit Trip Expense' : 'Add New Expense'}
                </h4>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-400">Description</label>
                    <input 
                      disabled={!isAuthorized}
                      type="text" value={newExpense.description} 
                      onChange={e => setNewExpense({...newExpense, description: e.target.value})} 
                      placeholder="e.g. Fuel for Bus 01"
                      className={`w-full p-4 rounded-2xl border-2 outline-none font-bold transition-all ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white focus:border-[#FF6B00]' : 'bg-white border-slate-200 text-slate-800 focus:border-[#FF6B00]'}`}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-slate-400">Amount (৳)</label>
                      <input 
                        disabled={!isAuthorized}
                        type="number" value={newExpense.amount || ''} 
                        onChange={e => setNewExpense({...newExpense, amount: Number(e.target.value)})} 
                        placeholder="0"
                        className={`w-full p-4 rounded-2xl border-2 outline-none font-bold transition-all ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white focus:border-[#FF6B00]' : 'bg-white border-slate-200 text-slate-800 focus:border-[#FF6B00]'}`}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-slate-400">Category</label>
                      <select 
                        disabled={!isAuthorized}
                        value={newExpense.category} 
                        onChange={e => setNewExpense({...newExpense, category: e.target.value})}
                        className={`w-full p-4 rounded-2xl border-2 outline-none font-bold transition-all ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white focus:border-[#FF6B00]' : 'bg-white border-slate-200 text-slate-800 focus:border-[#FF6B00]'}`}
                      >
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    {editingId && (
                      <button 
                        onClick={cancelEdit}
                        className={`flex-1 py-4 rounded-[2rem] font-black uppercase text-xs tracking-widest transition-all ${isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-200 text-slate-600'}`}
                      >
                        Cancel
                      </button>
                    )}
                    <button 
                      disabled={!isAuthorized}
                      onClick={handleAddOrUpdate}
                      className={`flex-[2] bg-[#FF6B00] text-white py-4 rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-xl shadow-orange-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2`}
                    >
                      {editingId ? <><Save size={16} /> Update Record</> : <><Plus size={16} /> Confirm Expense</>}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className={`p-8 rounded-[2.5rem] border shadow-sm transition-all duration-700 ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-[#003B95] text-white shadow-xl shadow-blue-900/10'}`}>
               <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-2">Trip Outflow Total</p>
               <h5 className="text-5xl font-[1000] tracking-tighter">৳{tripTotal.toLocaleString()}</h5>
               <div className="mt-6 p-4 rounded-2xl bg-white/10 border border-white/20">
                 <p className="text-[10px] font-bold uppercase tracking-widest leading-relaxed font-bangla opacity-80">এই ট্রিপের আয় ও ব্যয়ের পূর্ণাঙ্গ হিসাব ফাইন্যান্সিয়ালস ট্যাবে পাবেন।</p>
               </div>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-6">
            <div className="relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" placeholder="Search expenses by description..." 
                value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                className={`w-full pl-16 pr-6 py-5 rounded-[2rem] border-2 outline-none font-bold transition-all ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white focus:border-[#003B95]' : 'bg-slate-50 border-slate-100 text-slate-800 focus:border-[#003B95]'}`}
              />
            </div>

            <div className="grid grid-cols-1 gap-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
               {filteredExpenses.map(e => (
                 <div key={e.id} className={`p-5 rounded-3xl border flex items-center justify-between group transition-all ${
                   editingId === e.id ? 'border-[#FF6B00] bg-orange-500/5 ring-1 ring-[#FF6B00]' : 
                   isDarkMode ? 'bg-slate-950 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-100 hover:border-slate-200'
                 }`}>
                    <div className="flex items-center gap-5">
                       <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDarkMode ? 'bg-slate-900 text-slate-500' : 'bg-slate-50 text-slate-400'}`}>
                          <Receipt size={22} />
                       </div>
                       <div>
                          <h6 className={`font-black text-sm uppercase tracking-tight ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>{e.description}</h6>
                          <div className="flex items-center gap-3 mt-1">
                             <span className="text-[10px] font-black text-[#FF6B00] uppercase">{e.category}</span>
                             <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                             <span className={`text-[10px] font-bold ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{e.date}</span>
                          </div>
                       </div>
                    </div>
                    <div className="flex items-center gap-4">
                       <p className={`text-lg font-black mr-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>৳{e.amount.toLocaleString()}</p>
                       
                       {isAuthorized && (
                         <div className="flex items-center gap-2 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => startEdit(e)}
                              className={`p-3 rounded-xl transition-all ${isDarkMode ? 'text-blue-400 hover:bg-blue-400/10' : 'text-blue-600 hover:bg-blue-50'}`}
                            >
                              <Edit2 size={18} />
                            </button>
                            <button 
                              onClick={() => deleteExpense(e.id)}
                              className="p-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                            >
                              <Trash2 size={18} />
                            </button>
                         </div>
                       )}
                    </div>
                 </div>
               ))}
               {filteredExpenses.length === 0 && (
                 <div className="text-center py-20 opacity-20">
                    <ArrowDownCircle size={48} className="mx-auto mb-4" />
                    <p className="font-black uppercase tracking-widest text-xs">No records found</p>
                 </div>
               )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpensesView;
