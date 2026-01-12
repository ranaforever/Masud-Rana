
import React, { useState } from 'react';
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
  MessageSquare
} from 'lucide-react';
import { ResponseData, Booker } from '../types';

interface EditSectionProps {
  responses: ResponseData[];
  onUpdate: (data: ResponseData) => void;
  onDelete: (id: string) => void;
  bookers: Booker[];
  // Added isDarkMode to satisfy component requirements
  isDarkMode: boolean;
}

const EditSection: React.FC<EditSectionProps> = ({ responses, onUpdate, onDelete, bookers, isDarkMode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authCode, setAuthCode] = useState('');
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<ResponseData | null>(null);

  const handleAuth = () => {
    const booker = bookers.find(b => b.code === authCode);
    if (booker) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Unauthorized access. Booker code invalid.');
    }
  };

  const exportToCSV = () => {
    const headers = ["ID", "Name", "Mobile", "Address", "Bus", "Seat", "Tour", "Fees", "Paid", "Due", "Status", "BookedBy", "Message"];
    const csvContent = [
      headers.join(","),
      ...responses.map(r => [
        r.id,
        `"${r.fullName}"`,
        r.mobile,
        `"${r.address}"`,
        r.busNo,
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
    r.seatNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const startEditing = (record: ResponseData) => {
    setEditingId(record.id);
    setEditValues({ ...record });
  };

  const saveEdit = () => {
    if (editValues) {
      onUpdate(editValues);
      setEditingId(null);
      setEditValues(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-20 text-center animate-in zoom-in-95">
        <div className={`p-10 rounded-3xl shadow-xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
          <div className="bg-[#003B95]/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-10 h-10 text-[#003B95]" />
          </div>
          <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Secure Access Required</h2>
          <p className={`${isDarkMode ? 'text-slate-400' : 'text-slate-500'} mb-8`}>Enter your unique Booker Code to manage records and edit booking information.</p>
          
          <div className="space-y-4">
            <div className="relative">
              <input 
                type="password"
                value={authCode}
                onChange={(e) => setAuthCode(e.target.value.toUpperCase())}
                placeholder="Enter Booker Code (e.g., B001)"
                className={`w-full px-6 py-4 border rounded-2xl focus:ring-2 focus:ring-[#FF6B00] outline-none text-center font-black tracking-[0.5em] uppercase ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}`}
              />
            </div>
            {error && <p className="text-red-500 text-sm font-medium flex items-center justify-center gap-2"><ShieldAlert className="w-4 h-4" /> {error}</p>}
            <button 
              onClick={handleAuth}
              className="w-full bg-[#FF6B00] text-white py-4 rounded-2xl font-bold shadow-lg shadow-orange-500/20 hover:bg-[#e66000] transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              Verify Identity
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header & Search */}
      <div className={`p-6 rounded-3xl border shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
        <div className="flex items-center gap-4">
          <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Booking Management</h2>
          <button 
            onClick={exportToCSV}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-black text-[10px] uppercase transition-all border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'}`}
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text"
            placeholder="Search by name, phone or seat..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-12 pr-4 py-3 border rounded-2xl focus:ring-2 focus:ring-[#003B95] outline-none ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}`}
          />
        </div>
      </div>

      {/* Records Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredResponses.map(record => (
          <div key={record.id} className={`rounded-3xl border shadow-sm overflow-hidden group transition-all ${isDarkMode ? 'bg-slate-900 border-slate-800 hover:border-[#FF6B00]/30' : 'bg-white border-slate-100 hover:border-[#FF6B00]/30'}`}>
            <div className="p-6 flex flex-col lg:flex-row gap-6 items-start lg:items-center">
              {/* Profile/Seat Section */}
              <div className="flex items-center gap-4 min-w-[200px]">
                <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center border shrink-0 ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Seat</span>
                  <span className="text-lg font-black text-[#003B95] dark:text-blue-400">{record.seatNo}</span>
                </div>
                <div>
                  {editingId === record.id ? (
                    <input 
                      className={`text-lg font-bold border-b outline-none w-40 ${isDarkMode ? 'bg-transparent border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-800'}`}
                      value={editValues?.fullName}
                      onChange={(e) => setEditValues({...editValues!, fullName: e.target.value})}
                    />
                  ) : (
                    <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{record.fullName}</h3>
                  )}
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>{record.tourName}</p>
                </div>
              </div>

              {/* Contact Section */}
              <div className="flex flex-wrap gap-4 text-sm flex-1">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${isDarkMode ? 'bg-slate-950 text-slate-300' : 'bg-slate-50 text-slate-600'}`}>
                  <PhoneCall className="w-4 h-4 text-[#FF6B00]" />
                  <span>{record.mobile}</span>
                </div>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-xl max-w-xs truncate ${isDarkMode ? 'bg-slate-950 text-slate-300' : 'bg-slate-50 text-slate-600'}`}>
                  <MapPinned className="w-4 h-4 text-blue-500" />
                  <span>{record.address}</span>
                </div>
                {record.message && !editingId && (
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${isDarkMode ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 'bg-orange-50 text-orange-700 border-orange-100'}`}>
                    <MessageSquare className="w-4 h-4" />
                    <span className="max-w-[120px] truncate text-[10px] font-black uppercase">Has Message</span>
                  </div>
                )}
              </div>

              {/* Editing Message Section */}
              {editingId === record.id && (
                <div className="flex-1 min-w-[200px]">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Edit Message</p>
                   <textarea 
                    className={`w-full p-3 border rounded-xl text-xs font-bold focus:border-[#FF6B00] outline-none ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}`}
                    value={editValues?.message || ''}
                    rows={2}
                    onChange={(e) => setEditValues({...editValues!, message: e.target.value})}
                    placeholder="Update message..."
                   />
                </div>
              )}

              {/* Financial Section */}
              <div className="flex items-center gap-4 min-w-[150px]">
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Outstanding</p>
                  <p className="text-lg font-black text-red-500">৳{record.dueAmount.toLocaleString()}</p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    record.paymentStatus === 'Paid' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                  }`}>
                    {record.paymentStatus}
                  </span>
                </div>
              </div>

              {/* Actions Section */}
              <div className={`flex items-center gap-2 border-t lg:border-t-0 lg:border-l pt-4 lg:pt-0 lg:pl-6 w-full lg:w-auto ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                {editingId === record.id ? (
                  <>
                    <button 
                      onClick={saveEdit}
                      className="flex-1 lg:flex-none p-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors shadow-sm"
                    >
                      <Check className="w-5 h-5 mx-auto" />
                    </button>
                    <button 
                      onClick={() => setEditingId(null)}
                      className={`flex-1 lg:flex-none p-3 rounded-xl transition-colors ${isDarkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    >
                      <ChevronRight className="w-5 h-5 rotate-180 mx-auto" />
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={() => startEditing(record)}
                      className={`flex-1 lg:flex-none p-3 rounded-xl transition-colors ${isDarkMode ? 'text-blue-400 hover:bg-blue-500/10' : 'text-[#003B95] hover:bg-blue-50'}`}
                    >
                      <Edit2 className="w-5 h-5 mx-auto" />
                    </button>
                    <button 
                      onClick={() => onDelete(record.id)}
                      className="flex-1 lg:flex-none p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <Trash2 className="w-5 h-5 mx-auto" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
        {filteredResponses.length === 0 && (
          <div className="text-center py-20 text-slate-400">
            <Search className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="text-lg font-medium">No matching bookings found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditSection;
