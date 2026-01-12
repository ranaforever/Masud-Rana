
import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Lock, 
  Trash2, 
  Edit2, 
  Check, 
  ChevronRight, 
  ShieldAlert, 
  UserCircle2,
  PhoneCall,
  MapPinned,
  Download,
  Filter,
  MessageSquare,
  X,
  CreditCard,
  User,
  ShieldCheck,
  Unlock,
  AlertTriangle
} from 'lucide-react';
import { ResponseData, Booker } from '../types';

interface EditSectionProps {
  responses: ResponseData[];
  onUpdate: (data: ResponseData) => void;
  onDelete: (id: string) => void;
  bookers: Booker[];
  isDarkMode: boolean;
}

const EditSection: React.FC<EditSectionProps> = ({ responses, onUpdate, onDelete, bookers, isDarkMode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeUser, setActiveUser] = useState<string>('');
  const [authCode, setAuthCode] = useState('');
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<ResponseData | null>(null);

  const handleAuth = () => {
    const booker = bookers.find(b => b.code === authCode.toUpperCase());
    if (authCode === '@Rana&01625@') {
      setIsAuthenticated(true);
      setActiveUser('System Admin');
      setError('');
    } else if (booker) {
      setIsAuthenticated(true);
      setActiveUser(booker.name);
      setError('');
    } else {
      setError('Unauthorized access. Invalid code.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveUser('');
    setAuthCode('');
    setEditingId(null);
  };

  const exportToCSV = () => {
    const headers = ["ID", "Name", "Mobile", "Address", "Seat", "Tour", "Fees", "Paid", "Due", "Status", "BookedBy", "Message"];
    const csvContent = [
      headers.join(","),
      ...responses.map(r => [
        r.id,
        `"${r.fullName}"`,
        r.mobile,
        `"${r.address}"`,
        r.seatNo,
        `"${r.tourName}"`,
        r.tourFees,
        r.advanceAmount,
        r.dueAmount,
        r.paymentStatus,
        r.bookedBy,
        `"${r.message || ''}"`
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `TourLagbe_Records_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredResponses = responses.filter(r => 
    r.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.mobile.includes(searchQuery) ||
    r.seatNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.tourName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const startEditing = (record: ResponseData) => {
    setEditingId(record.id);
    setEditValues({ ...record });
  };

  const updateEditFinancials = (field: keyof ResponseData, value: any) => {
    if (!editValues) return;
    
    const newValues = { ...editValues, [field]: value };
    
    // Recalculate Due Amount
    // Note: This is a simplified recalculation. In a production app, we'd reference the baseTourFee again.
    // For this UI, we assume tourFees is the Total, so we just recalculate Due.
    const finalTotal = newValues.tourFees;
    const advance = newValues.advanceAmount;
    newValues.dueAmount = Math.max(0, finalTotal - advance);
    
    if (newValues.dueAmount === 0 && finalTotal > 0) newValues.paymentStatus = 'Paid';
    else if (newValues.advanceAmount > 0) newValues.paymentStatus = 'Partial';
    else newValues.paymentStatus = 'Unpaid';

    setEditValues(newValues);
  };

  const saveEdit = () => {
    if (editValues) {
      onUpdate(editValues);
      setEditingId(null);
      setEditValues(null);
    }
  };

  const handleDelete = (id: string) => {
    onDelete(id);
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-20 text-center animate-in zoom-in-95">
        <div className={`p-10 rounded-[2.5rem] shadow-2xl border-4 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-50'}`}>
          <div className="bg-[#003B95]/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
            <Lock className="w-12 h-12 text-[#003B95]" />
          </div>
          <h2 className={`text-3xl font-black mb-2 uppercase tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Records Access</h2>
          <p className={`font-medium font-bangla mb-8 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>প্যাসেঞ্জার লিস্ট এবং বুকিং তথ্য এডিট করতে বুকার কোড ব্যবহার করুন।</p>
          
          <div className="space-y-6">
            <div className="relative">
              <input 
                type="password"
                value={authCode}
                onChange={(e) => setAuthCode(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAuth()}
                placeholder="ENTER BOOKER CODE"
                className={`w-full px-8 py-5 border-2 rounded-3xl outline-none text-center font-black tracking-widest uppercase transition-all ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white focus:border-[#FF6B00]' : 'bg-slate-50 border-slate-100 text-slate-800 focus:border-[#FF6B00]'}`}
              />
            </div>
            {error && <p className="text-red-500 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2"><ShieldAlert size={14} /> {error}</p>}
            <button 
              onClick={handleAuth}
              className="w-full bg-[#FF6B00] text-white py-5 rounded-[2rem] font-black shadow-xl shadow-orange-500/20 hover:bg-[#e66000] transition-all flex items-center justify-center gap-2 active:scale-95 uppercase tracking-widest"
            >
              Verify & Unlock
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header & Search */}
      <div className={`p-8 rounded-[2.5rem] border-2 shadow-sm flex flex-col lg:flex-row gap-6 items-center justify-between ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className={`text-2xl font-black uppercase tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Passenger Database</h2>
              <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 text-emerald-500 rounded-full text-[9px] font-black uppercase tracking-widest border border-emerald-500/20">
                <ShieldCheck size={10} /> {activeUser}
              </span>
            </div>
            <p className={`text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{responses.length} Confirmed Entries</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={exportToCSV}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-[10px] uppercase transition-all border-2 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}
            >
              <Download className="w-4 h-4" /> Export List
            </button>
            <button 
              onClick={handleLogout}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-[10px] uppercase transition-all border-2 ${isDarkMode ? 'bg-slate-950 border-slate-800 text-red-400 hover:bg-red-400/10' : 'bg-white border-slate-200 text-red-600 hover:bg-red-50'}`}
            >
              <Unlock className="w-4 h-4" /> Log Out
            </button>
          </div>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text"
            placeholder="Search name, phone, seat or trip..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-16 pr-6 py-4 border-2 rounded-[2rem] focus:ring-2 focus:ring-[#003B95] outline-none font-bold transition-all ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}`}
          />
        </div>
      </div>

      {/* Records Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredResponses.map(record => (
          <div key={record.id} className={`rounded-[2.5rem] border-2 shadow-sm overflow-hidden group transition-all ${
            editingId === record.id ? 'border-[#FF6B00] ring-4 ring-orange-500/10' : 
            isDarkMode ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-100 hover:border-slate-200'
          }`}>
            <div className="p-8">
              {editingId === record.id ? (
                <div className="space-y-6 animate-in slide-in-from-top-2 duration-300">
                  <div className="flex flex-col md:flex-row items-center justify-between border-b pb-6 mb-2 gap-4">
                    <h3 className={`text-xl font-black uppercase tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Edit Booking: Seat {record.seatNo}</h3>
                    <div className="flex gap-3 w-full md:w-auto">
                       <button onClick={saveEdit} className="flex-1 md:flex-none bg-emerald-500 text-white px-8 py-3 rounded-xl font-black uppercase text-xs shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"><Check size={16} /> Save Changes</button>
                       <button onClick={() => setEditingId(null)} className={`flex-1 md:flex-none px-8 py-3 rounded-xl font-black uppercase text-xs transition-all ${isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>Cancel</button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <EditField label="Full Name">
                       <input type="text" value={editValues?.fullName} onChange={e => setEditValues({...editValues!, fullName: e.target.value})} className={`modern-edit-input ${isDarkMode ? 'dark' : ''}`} />
                    </EditField>
                    <EditField label="Mobile Number">
                       <input type="text" value={editValues?.mobile} onChange={e => setEditValues({...editValues!, mobile: e.target.value})} className={`modern-edit-input ${isDarkMode ? 'dark' : ''}`} />
                    </EditField>
                    <EditField label="Paid Amount (৳)">
                       <input type="number" value={editValues?.advanceAmount} onChange={e => updateEditFinancials('advanceAmount', Number(e.target.value))} className={`modern-edit-input text-emerald-500 ${isDarkMode ? 'dark' : ''}`} />
                    </EditField>
                    <EditField label="Discount (৳)">
                       <input type="number" value={editValues?.discountAmount} onChange={e => setEditValues({...editValues!, discountAmount: Number(e.target.value)})} className={`modern-edit-input text-orange-500 ${isDarkMode ? 'dark' : ''}`} />
                    </EditField>
                    
                    <EditField label="Gender">
                       <select value={editValues?.gender} onChange={e => setEditValues({...editValues!, gender: e.target.value})} className={`modern-edit-input ${isDarkMode ? 'dark' : ''}`}>
                          <option value="Male">Male</option><option value="Female">Female</option><option value="Others">Others</option>
                       </select>
                    </EditField>
                    <EditField label="Religion">
                       <select value={editValues?.religion} onChange={e => setEditValues({...editValues!, religion: e.target.value})} className={`modern-edit-input ${isDarkMode ? 'dark' : ''}`}>
                          <option value="Muslim">Muslim</option><option value="Hinduism">Hinduism</option><option value="Buddhism">Buddhism</option><option value="Christianity">Christianity</option><option value="Others">Others</option>
                       </select>
                    </EditField>
                    <EditField label="Payment Status (Auto)">
                       <input disabled value={editValues?.paymentStatus} className={`modern-edit-input opacity-50 cursor-not-allowed ${isDarkMode ? 'dark' : ''}`} />
                    </EditField>
                    <EditField label="Balance Due">
                       <div className={`p-4 rounded-2xl border-2 font-black ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-100'} ${editValues!.dueAmount > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                          ৳{editValues?.dueAmount.toLocaleString()}
                       </div>
                    </EditField>

                    <EditField label="Address" fullWidth>
                       <textarea rows={2} value={editValues?.address} onChange={e => setEditValues({...editValues!, address: e.target.value})} className={`modern-edit-input resize-none ${isDarkMode ? 'dark' : ''}`} />
                    </EditField>
                    <EditField label="Special Message" fullWidth>
                       <textarea rows={2} value={editValues?.message || ''} onChange={e => setEditValues({...editValues!, message: e.target.value})} className={`modern-edit-input resize-none h-[100px] border-dashed ${isDarkMode ? 'dark' : ''}`} />
                    </EditField>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center">
                  {/* Seat Badge */}
                  <div className={`w-20 h-20 rounded-3xl flex flex-col items-center justify-center border-2 shrink-0 ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Seat</span>
                    <span className="text-2xl font-black text-[#003B95] dark:text-blue-400">{record.seatNo}</span>
                  </div>

                  {/* Primary Info */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                       <h3 className={`text-xl font-[1000] tracking-tight uppercase ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{record.fullName}</h3>
                       <span className={`text-[9px] font-black px-3 py-1 rounded-full border uppercase ${
                         record.paymentStatus === 'Paid' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                         record.paymentStatus === 'Partial' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'
                       }`}>
                         {record.paymentStatus}
                       </span>
                    </div>
                    <p className={`text-xs font-bold uppercase tracking-widest flex items-center gap-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                       <MapPinned size={14} className="text-[#FF6B00]" /> {record.tourName}
                    </p>
                    <div className="flex flex-wrap gap-4 pt-2">
                       <div className="flex items-center gap-2">
                          <PhoneCall size={14} className="text-[#003B95] dark:text-blue-400" />
                          <span className={`text-xs font-black ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{record.mobile}</span>
                       </div>
                       <div className="flex items-center gap-2">
                          <UserCircle2 size={14} className="text-slate-400" />
                          <span className={`text-xs font-black uppercase tracking-tighter ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>Agent: {record.bookedBy}</span>
                       </div>
                    </div>
                  </div>

                  {/* Financials Summary */}
                  <div className="text-right hidden sm:block shrink-0 px-8 border-x border-slate-200 dark:border-slate-800">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Due Amount</p>
                    <p className={`text-2xl font-[1000] tracking-tighter ${record.dueAmount > 0 ? 'text-red-500' : 'text-emerald-500'}`}>৳{record.dueAmount.toLocaleString()}</p>
                    <p className="text-[10px] font-bold text-slate-500">Paid: ৳{record.advanceAmount.toLocaleString()}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 w-full lg:w-auto shrink-0">
                    <button 
                      onClick={() => startEditing(record)}
                      className={`flex-1 lg:flex-none p-4 rounded-2xl transition-all flex items-center justify-center gap-2 font-black text-xs uppercase tracking-widest ${
                        isDarkMode ? 'bg-slate-800 text-blue-400 hover:bg-blue-400/10' : 'bg-blue-50 text-[#003B95] hover:bg-blue-100'
                      }`}
                    >
                      <Edit2 size={18} /> Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(record.id)}
                      className="flex-1 lg:flex-none p-4 bg-red-500/5 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2 font-black text-xs uppercase tracking-widest"
                    >
                      <Trash2 size={18} /> Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {filteredResponses.length === 0 && (
          <div className="text-center py-32 space-y-4 opacity-30">
            <Search className="w-20 h-20 mx-auto text-slate-400" />
            <p className="text-xl font-black uppercase tracking-[0.2em]">No matching records found</p>
          </div>
        )}
      </div>
      <style>{`
        .modern-edit-input { width: 100%; padding: 1rem; border-radius: 1.25rem; border: 2px solid #F1F5F9; font-weight: 800; outline: none; transition: all 0.2s; font-size: 0.875rem; background-color: #F8FAFC; }
        .modern-edit-input:focus { border-color: #FF6B00; background-color: white; }
        .modern-edit-input.dark { background-color: #0f172a; border-color: #1e293b; color: white; }
        .modern-edit-input.dark:focus { background-color: #1e293b; border-color: #FF6B00; }
      `}</style>
    </div>
  );
};

const EditField: React.FC<{ label: string; children: React.ReactNode; fullWidth?: boolean }> = ({ label, children, fullWidth }) => (
  <div className={fullWidth ? "md:col-span-2 lg:col-span-4" : ""}>
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block ml-1">{label}</label>
    {children}
  </div>
);

export default EditSection;
