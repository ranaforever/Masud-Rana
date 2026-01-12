
import React, { useState } from 'react';
import { 
  X, 
  User, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  CreditCard, 
  Calendar,
  Bus,
  CheckCircle2,
  Lock,
  ArrowRight,
  Ticket,
  Download,
  Printer,
  ChevronLeft,
  MessageSquareText
} from 'lucide-react';
import { ResponseData, Booker } from '../types';

interface PassengerDetailsModalProps {
  passenger: ResponseData;
  onClose: () => void;
  onUpdateDue: (updated: ResponseData) => void;
  bookers: Booker[];
  // Added isDarkMode to satisfy component requirements
  isDarkMode: boolean;
}

const PassengerDetailsModal: React.FC<PassengerDetailsModalProps> = ({ 
  passenger, 
  onClose, 
  onUpdateDue, 
  bookers,
  isDarkMode
}) => {
  const [isPayingDue, setIsPayingDue] = useState(false);
  const [viewMode, setViewMode] = useState<'details' | 'ticket'>('details');
  const [bookerCode, setBookerCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleDuePayment = () => {
    const booker = bookers.find(b => b.code === bookerCode);
    if (!booker) {
      setError('Invalid Booker Code. Verification failed.');
      return;
    }

    const updatedPassenger: ResponseData = {
      ...passenger,
      advanceAmount: passenger.tourFees,
      dueAmount: 0,
      paymentStatus: 'Paid'
    };

    onUpdateDue(updatedPassenger);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setIsPayingDue(false);
    }, 1500);
  };

  const printTicket = () => {
    window.print();
  };

  if (viewMode === 'ticket') {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-md" onClick={onClose}></div>
        <div className="relative bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 duration-500">
          <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <button 
              onClick={() => setViewMode('details')}
              className="flex items-center gap-2 text-slate-500 font-black text-xs uppercase hover:text-[#FF6B00] transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Back to Details
            </button>
            <div className="flex gap-2">
              <button onClick={printTicket} className="p-3 bg-[#003B95] text-white rounded-xl hover:bg-blue-800 transition-all flex items-center gap-2 font-black text-[10px] uppercase">
                <Printer className="w-4 h-4" /> Print
              </button>
              <button onClick={onClose} className="p-3 bg-slate-200 text-slate-500 rounded-xl hover:bg-slate-300">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="p-10" id="printable-ticket">
            <div className="border-4 border-slate-900 p-8 rounded-[2rem] relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                 <Bus className="w-40 h-40" />
              </div>
              
              <div className="flex justify-between items-start mb-10">
                <div>
                   <h2 className="text-3xl font-black text-[#FF6B00] tracking-tighter">Tour লাগবে</h2>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Official Travel Ticket</p>
                </div>
                <div className="text-right">
                   <p className="text-xs font-black text-slate-500 uppercase">Boarding Pass</p>
                   <p className="text-xl font-black text-slate-900">#{passenger.id.slice(-6).toUpperCase()}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-10 mb-10">
                <div className="space-y-4">
                  <TicketInfo label="Passenger Name" value={passenger.fullName} />
                  <TicketInfo label="Tour Destination" value={passenger.tourName} />
                  <TicketInfo label="Contact Number" value={passenger.mobile} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <TicketInfo label="Bus No" value={`B-${passenger.busNo.toString().padStart(2, '0')}`} highlight />
                  <TicketInfo label="Seat No" value={passenger.seatNo} highlight />
                  <TicketInfo label="Status" value={passenger.paymentStatus} />
                  <TicketInfo label="Booked By" value={passenger.bookedBy} />
                </div>
              </div>

              {passenger.message && (
                <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Notes / Instructions</p>
                  <p className="text-[10px] font-bold text-slate-700 italic">"{passenger.message}"</p>
                </div>
              )}

              <div className="bg-slate-50 rounded-2xl p-6 flex justify-between items-center border-2 border-slate-100">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase">Verification QR Code</p>
                  <div className="mt-2 w-16 h-16 bg-white border-4 border-white shadow-sm flex items-center justify-center">
                    <div className="grid grid-cols-3 gap-1 w-full h-full opacity-50">
                       {Array.from({length: 9}).map((_, i) => <div key={i} className="bg-slate-900"></div>)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase">Paid Amount</p>
                  <p className="text-3xl font-black text-slate-900">৳{passenger.advanceAmount.toLocaleString()}</p>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t-2 border-slate-100 border-dashed text-center">
                <p className="text-[9px] font-black text-slate-400 uppercase leading-relaxed max-w-xs mx-auto">
                  Please arrive at the boarding point at least 30 minutes before departure. This ticket is electronically generated.
                </p>
              </div>
            </div>
          </div>
        </div>
        <style>{`
          @media print {
            body * { visibility: hidden; }
            #printable-ticket, #printable-ticket * { visibility: visible; }
            #printable-ticket { position: absolute; left: 0; top: 0; width: 100%; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={onClose}></div>
      
      <div className={`relative w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 h-full lg:h-auto overflow-y-auto ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
        {/* Header */}
        <div className={`px-8 py-6 flex justify-between items-center text-white shrink-0 ${
          passenger.dueAmount > 0 ? 'bg-[#003B95]' : 'bg-green-600'
        }`}>
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-2.5 rounded-xl">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-xl tracking-tight">Passenger Details</h3>
              <p className="text-xs text-white/80 font-bold uppercase tracking-widest">Seat {passenger.seatNo} • {passenger.tourName}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-all">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8 space-y-6">
          {success ? (
            <div className="py-10 text-center space-y-4 animate-in fade-in zoom-in">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <h4 className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Payment Verified!</h4>
              <p className={`${isDarkMode ? 'text-slate-400' : 'text-slate-500'} font-medium`}>Due amount has been cleared successfully.</p>
            </div>
          ) : (
            <>
              {/* Profile Card */}
              <div className={`flex items-start gap-6 pb-6 border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                <div className={`w-20 h-20 rounded-3xl flex items-center justify-center text-[#FF6B00] shrink-0 border-2 ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-50'}`}>
                   <User className="w-10 h-10" />
                </div>
                <div className="space-y-1">
                  <h4 className={`text-2xl font-black leading-tight ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{passenger.fullName}</h4>
                  <p className="text-[#FF6B00] font-black text-sm uppercase tracking-tighter flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Trip ID: {passenger.id.slice(-6).toUpperCase()}
                  </p>
                  <div className="flex items-center gap-3 pt-2">
                    <span className={`text-[10px] font-black px-2 py-1 rounded-md uppercase ${isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>{passenger.gender}</span>
                    <span className={`text-[10px] font-black px-2 py-1 rounded-md uppercase ${isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>{passenger.religion}</span>
                  </div>
                </div>
              </div>

              {/* Special Message Box */}
              {passenger.message && (
                <div className={`border p-5 rounded-3xl flex gap-4 ${isDarkMode ? 'bg-orange-500/5 border-orange-500/20' : 'bg-orange-50 border-orange-100'}`}>
                  <div className="w-10 h-10 bg-orange-500 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-orange-500/20">
                    <MessageSquareText size={20} />
                  </div>
                  <div>
                    <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`}>Customer Message</p>
                    <p className={`text-sm font-bold leading-relaxed italic ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>"{passenger.message}"</p>
                  </div>
                </div>
              )}

              {/* Info Grid */}
              <div className="grid grid-cols-1 gap-4 text-sm">
                <DetailRow icon={<Phone className="w-4 h-4 text-[#FF6B00]" />} label="Contact" value={passenger.mobile} isDarkMode={isDarkMode} />
                <DetailRow icon={<MapPin className="w-4 h-4 text-[#003B95] dark:text-blue-400" />} label="Address" value={passenger.address} isDarkMode={isDarkMode} />
                <DetailRow icon={<ShieldCheck className="w-4 h-4 text-purple-500" />} label="Booked By" value={passenger.bookedBy} isDarkMode={isDarkMode} />
              </div>

              {/* Financial Status */}
              <div className={`p-6 rounded-[2rem] border-2 space-y-4 shadow-inner ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Total Trip Fee</span>
                  <span className={`text-lg font-black ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>৳{passenger.tourFees.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Paid Amount</span>
                  <span className="text-lg font-black text-green-600">৳{passenger.advanceAmount.toLocaleString()}</span>
                </div>
                <div className={`pt-3 border-t-2 border-dashed flex justify-between items-center ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                  <div>
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Due Amount</span>
                    <p className={`text-2xl font-black ${passenger.dueAmount > 0 ? 'text-red-500' : 'text-green-500'}`}>
                      ৳{passenger.dueAmount.toLocaleString()}
                    </p>
                  </div>
                  <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase ${
                    passenger.paymentStatus === 'Paid' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                  }`}>
                    {passenger.paymentStatus}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <button 
                  onClick={() => setViewMode('ticket')}
                  className={`flex-1 py-4 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-2 uppercase tracking-widest ${isDarkMode ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-slate-900 text-white hover:bg-black'}`}
                >
                  <Ticket className="w-4 h-4" /> View Ticket
                </button>
                {passenger.dueAmount > 0 && !isPayingDue && (
                  <button 
                    onClick={() => setIsPayingDue(true)}
                    className="flex-[1.5] bg-[#FF6B00] text-white py-4 rounded-2xl font-black text-xs shadow-xl shadow-orange-500/20 hover:bg-[#e66000] transition-all flex items-center justify-center gap-2 uppercase tracking-widest"
                  >
                    <CreditCard className="w-4 h-4" /> Clear Due
                  </button>
                )}
              </div>

              {/* Due Payment UI */}
              {isPayingDue && (
                <div className="space-y-4 animate-in slide-in-from-bottom-2 bg-slate-900 p-6 rounded-[2rem] text-white shadow-2xl">
                  <div className="flex items-center gap-3 text-sm font-bold text-slate-400 mb-2">
                     <Lock className="w-4 h-4 text-[#FF6B00]" />
                     AUTHORIZATION REQUIRED
                  </div>
                  {error && <p className="text-red-400 text-xs font-bold mb-2 flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> {error}</p>}
                  <div className="relative">
                    <input 
                      autoFocus
                      type="text"
                      value={bookerCode}
                      onChange={(e) => setBookerCode(e.target.value.toUpperCase())}
                      placeholder="ENTER BOOKER CODE"
                      className="w-full bg-slate-800 border-2 border-slate-700 rounded-2xl px-6 py-4 text-center font-black tracking-widest text-white placeholder:text-slate-600 focus:border-[#FF6B00] outline-none transition-all"
                    />
                  </div>
                  <div className="flex gap-3">
                     <button 
                      onClick={() => setIsPayingDue(false)}
                      className="flex-1 bg-slate-800 text-slate-400 py-4 rounded-2xl font-black text-xs hover:bg-slate-700 transition-all uppercase"
                     >
                       Cancel
                     </button>
                     <button 
                      onClick={handleDuePayment}
                      className="flex-[2] bg-[#FF6B00] text-white py-4 rounded-2xl font-black text-xs hover:bg-[#e66000] transition-all flex items-center justify-center gap-2 uppercase"
                     >
                       Verify & Pay <ArrowRight className="w-4 h-4" />
                     </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const TicketInfo: React.FC<{ label: string; value: string; highlight?: boolean }> = ({ label, value, highlight }) => (
  <div>
    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
    <p className={`font-black ${highlight ? 'text-2xl text-[#003B95]' : 'text-sm text-slate-800'}`}>{value}</p>
  </div>
);

const DetailRow: React.FC<{ icon: React.ReactNode; label: string; value: string; isDarkMode?: boolean }> = ({ icon, label, value, isDarkMode }) => (
  <div className="flex items-start gap-4">
    <div className="mt-1">{icon}</div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
      <p className={`font-bold leading-snug ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{value}</p>
    </div>
  </div>
);

export default PassengerDetailsModal;
