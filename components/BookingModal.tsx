
import React, { useState, useMemo, useEffect } from 'react';
import { X, User, Phone, MapPin, Calculator, ShieldCheck, CreditCard, ChevronRight, UserPlus, Info, AlertCircle, MessageSquare } from 'lucide-react';
import { ResponseData, TourOption, CustomerTypeOption, Booker } from '../types';

interface BookingModalProps {
  seatNo: string;
  busNo: number;
  fixedTourName?: string;
  onClose: () => void;
  onSubmit: (data: ResponseData) => void;
  tours: TourOption[];
  customerTypes: CustomerTypeOption[];
  bookers: Booker[];
  // Added isDarkMode to satisfy component requirements
  isDarkMode: boolean;
}

const BookingModal: React.FC<BookingModalProps> = ({ 
  seatNo, 
  fixedTourName,
  onClose, 
  onSubmit, 
  tours, 
  customerTypes, 
  bookers,
  isDarkMode 
}) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    address: '',
    gender: 'Male',
    religion: 'Muslim',
    tourName: fixedTourName || '',
    customerType: 'General',
    advanceAmount: 0,
    discountAmount: 0,
    soloExtraFee: 0,
    bookedByCode: '',
    message: ''
  });

  const [error, setError] = useState('');

  // Sync with fixed tour name if provided
  useEffect(() => {
    if (fixedTourName) {
      setFormData(prev => ({ ...prev, tourName: fixedTourName }));
    }
  }, [fixedTourName]);

  const calculations = useMemo(() => {
    const selectedTour = tours.find(t => t.name === formData.tourName);
    const baseTourFee = selectedTour?.fees || 0;
    
    // Check if Relex word is present
    const isRelex = formData.tourName.toLowerCase().includes('relex') || formData.tourName.toLowerCase().includes('relax');
    
    // Find customer type fee (only if Relex or explicit logic)
    const selectedCType = customerTypes.find(c => c.type === formData.customerType);
    const customerTypeFee = isRelex ? (selectedCType?.fees || 0) : 0;
    
    // Solo logic: If customer type is Solo, add extra fee
    const isSolo = formData.customerType === 'Solo';
    const soloFee = isSolo ? (formData.soloExtraFee || 0) : 0;
    
    const subTotal = baseTourFee + customerTypeFee + soloFee;
    const finalTotal = subTotal - formData.discountAmount;
    const due = Math.max(0, finalTotal - formData.advanceAmount);
    
    let status: 'Paid' | 'Partial' | 'Unpaid' = 'Unpaid';
    if (due === 0 && finalTotal > 0) status = 'Paid';
    else if (formData.advanceAmount > 0) status = 'Partial';
    
    return { baseTourFee, customerTypeFee, soloFee, finalTotal, due, status };
  }, [formData, tours, customerTypes]);

  const validateStep1 = () => {
    if (!formData.fullName || !formData.mobile || !formData.address) {
      setError("Please fill in all personal details.");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const booker = bookers.find(b => b.code === formData.bookedByCode);
    if (!booker) {
      setError(`Authentication Failure: Invalid Booker Code.`);
      return;
    }

    const payload: ResponseData = {
      id: Math.random().toString(36).substr(2, 9),
      fullName: formData.fullName,
      mobile: '+880' + formData.mobile,
      address: formData.address,
      gender: formData.gender,
      religion: formData.religion,
      tourFees: calculations.finalTotal,
      advanceAmount: formData.advanceAmount,
      dueAmount: calculations.due,
      paymentStatus: calculations.status,
      busNo: 0, // Obsolete
      seatNo: seatNo,
      tourName: formData.tourName,
      customerType: formData.customerType,
      bookedBy: formData.bookedByCode,
      discountAmount: formData.discountAmount,
      soloExtraFee: formData.soloExtraFee,
      message: formData.message
    };
    onSubmit(payload);
  };

  const isRelexTour = formData.tourName.toLowerCase().includes('relex') || formData.tourName.toLowerCase().includes('relax');
  const isSoloCustomer = formData.customerType === 'Solo';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center lg:p-4">
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xl hidden lg:block" onClick={onClose}></div>
      
      <div className={`relative w-full max-w-4xl lg:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col h-full lg:h-auto lg:max-h-[90vh] animate-in slide-in-from-bottom duration-500 ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-white text-slate-800'}`}>
        <div className={`px-8 py-6 flex justify-between items-center border-b shrink-0 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
          <div className="flex items-center gap-4">
            <div className="bg-[#FF6B00]/10 p-3 rounded-2xl text-[#FF6B00]"><UserPlus size={24} /></div>
            <div>
              <h3 className="font-black text-xl tracking-tighter uppercase">GUEST REGISTRATION</h3>
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">
                <span>SEAT {seatNo}</span>
                <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                <span>{formData.tourName}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full text-slate-400"><X size={24} /></button>
        </div>

        <div className={`px-8 py-4 border-b flex gap-10 ${isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50/50 border-slate-100'}`}>
           <StepIndicator active={step === 1} number={1} label="Passenger Info" />
           <StepIndicator active={step === 2} number={2} label="Trip & Payment" />
        </div>

        <div className={`overflow-y-auto flex-1 ${isDarkMode ? 'bg-slate-950' : 'bg-white'}`}>
          <div className="p-8 lg:p-12">
            {error && (
              <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center gap-3 text-xs font-black uppercase tracking-tight animate-in shake duration-300">
                <AlertCircle size={18} /> {error}
              </div>
            )}

            {step === 1 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-in fade-in slide-in-from-left-4 duration-500">
                <div className="space-y-6">
                  <InputWrapper label="Full Name (As per NID)">
                    <input required autoFocus type="text" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} placeholder="e.g. Arif Ahmed" className={`modern-input ${isDarkMode ? 'dark-mode' : ''}`} />
                  </InputWrapper>
                  <InputWrapper label="Mobile Number (Primary)">
                    <div className="flex group">
                      <span className={`inline-flex items-center px-4 rounded-l-2xl border border-r-0 font-black text-sm transition-all group-focus-within:border-[#FF6B00] group-focus-within:bg-[#FF6B00] group-focus-within:text-white ${isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>+880</span>
                      <input required type="tel" pattern="[0-9]{10}" value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} placeholder="1712345678" className={`modern-input rounded-l-none ${isDarkMode ? 'dark-mode' : ''}`} />
                    </div>
                  </InputWrapper>
                  <div className="grid grid-cols-2 gap-4">
                    <InputWrapper label="Gender">
                      <select value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})} className={`modern-input ${isDarkMode ? 'dark-mode' : ''}`}>
                        <option value="Male">Male</option><option value="Female">Female</option><option value="Others">Others</option>
                      </select>
                    </InputWrapper>
                    <InputWrapper label="Religion">
                      <select value={formData.religion} onChange={e => setFormData({...formData, religion: e.target.value})} className={`modern-input ${isDarkMode ? 'dark-mode' : ''}`}>
                        <option value="Muslim">Muslim</option><option value="Hinduism">Hinduism</option><option value="Buddhism">Buddhism</option><option value="Christianity">Christianity</option><option value="Others">Others</option>
                      </select>
                    </InputWrapper>
                  </div>
                </div>
                <div className="space-y-6">
                  <InputWrapper label="Residential Address">
                    <textarea required rows={3} value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} placeholder="Detailed address..." className={`modern-input py-4 resize-none h-[100px] ${isDarkMode ? 'dark-mode' : ''}`} />
                  </InputWrapper>
                  <InputWrapper label="Special Message / Instructions (Optional)">
                    <div className="relative">
                      <MessageSquare className="absolute left-4 top-4 text-slate-400 w-5 h-5 pointer-events-none" />
                      <textarea rows={3} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} placeholder="Any special needs, medical info or pickup notes..." className={`modern-input py-4 pl-12 resize-none h-[100px] border-dashed ${isDarkMode ? 'dark-mode bg-slate-900/50' : 'bg-slate-50/50'}`} />
                    </div>
                  </InputWrapper>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="space-y-6">
                  <InputWrapper label="Current Tour Manifest">
                    <input disabled type="text" value={formData.tourName} className={`modern-input opacity-60 cursor-not-allowed ${isDarkMode ? 'dark-mode bg-slate-800' : 'bg-slate-100'}`} />
                  </InputWrapper>
                  
                  {isRelexTour && (
                    <InputWrapper label="Customer Type (Relex Tour Option)">
                      <select value={formData.customerType} onChange={e => setFormData({...formData, customerType: e.target.value})} className={`modern-input ${isDarkMode ? 'dark-mode bg-[#003B95]/10 border-[#003B95]/20' : 'bg-[#003B95]/5 border-[#003B95]/10'}`}>
                        <option value="General">General (Standard)</option>
                        {customerTypes.map(c => <option key={c.type} value={c.type}>{c.type}</option>)}
                      </select>
                    </InputWrapper>
                  )}

                  {isSoloCustomer && (
                    <InputWrapper label="Solo Occupancy Surcharge">
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-black">৳</span>
                        <input type="number" value={formData.soloExtraFee || ''} onChange={e => setFormData({...formData, soloExtraFee: Number(e.target.value)})} placeholder="0.00" className={`modern-input pl-10 ${isDarkMode ? 'dark-mode bg-orange-500/10 border-orange-500/20' : 'bg-orange-50 border-orange-100'}`} />
                      </div>
                    </InputWrapper>
                  )}

                  <InputWrapper label="System Access: Booker Code">
                    <input required type="text" value={formData.bookedByCode} onChange={e => setFormData({...formData, bookedByCode: e.target.value.toUpperCase()})} placeholder="ENTER AUTH CODE" className={`modern-input font-black tracking-[0.3em] text-center uppercase border-2 ${isDarkMode ? 'dark-mode border-[#003B95]/30 focus:border-[#003B95]' : 'border-[#003B95]/20 focus:border-[#003B95]'}`} />
                  </InputWrapper>
                </div>

                <div className="space-y-6">
                  <div className={`p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-slate-900 text-white'}`}>
                    <div className="absolute top-0 right-0 p-8 opacity-5 -mr-10 -mt-10"><Calculator size={140} /></div>
                    <div className="relative z-10 space-y-6">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Financial Summary</h4>
                      <div className="space-y-3">
                         <div className="flex justify-between items-center text-sm font-bold opacity-60"><span>Base Tour Fee</span><span>৳{calculations.baseTourFee.toLocaleString()}</span></div>
                         {calculations.customerTypeFee !== 0 && <div className="flex justify-between items-center text-sm font-bold opacity-60"><span>Add-on Fees</span><span>৳{calculations.customerTypeFee.toLocaleString()}</span></div>}
                         {calculations.soloFee > 0 && <div className="flex justify-between items-center text-sm font-bold opacity-60"><span>Solo Surcharge</span><span>৳{calculations.soloFee.toLocaleString()}</span></div>}
                         <PriceAdjuster label="Discount Applied" value={formData.discountAmount} onChange={v => setFormData({...formData, discountAmount: v})} minus />
                      </div>
                      <div className="pt-6 border-t border-white/10 flex justify-between items-end">
                        <div><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Grand Total</p><p className="text-4xl font-black tracking-tighter text-[#FF6B00]">৳{calculations.finalTotal.toLocaleString()}</p></div>
                        <div className="text-right"><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Remaining Due</p><p className={`text-xl font-black ${calculations.due > 0 ? 'text-red-400' : 'text-green-400'}`}>৳{calculations.due.toLocaleString()}</p></div>
                      </div>
                      <div className="pt-4">
                        <InputWrapper label="Initial Deposit / Advance Payment">
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-black">৳</span>
                            <input type="number" value={formData.advanceAmount || ''} onChange={e => setFormData({...formData, advanceAmount: Number(e.target.value)})} placeholder="0" className={`modern-input pl-10 bg-white/10 border-white/20 text-white placeholder:text-slate-600 focus:bg-white/20`} />
                          </div>
                        </InputWrapper>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className={`px-8 py-6 border-t flex gap-4 shrink-0 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
          <button type="button" onClick={onClose} className={`hidden lg:block px-8 py-4 border rounded-2xl font-black uppercase tracking-tight transition-colors ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>CANCEL</button>
          <div className="flex-1 flex gap-4">
            {step === 2 && <button type="button" onClick={() => setStep(1)} className={`flex-1 px-8 py-4 rounded-2xl font-black uppercase tracking-tight ${isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-700'}`}>BACK</button>}
            <button type="button" onClick={step === 1 ? () => validateStep1() && setStep(2) : handleSubmit} className="flex-[2] px-8 py-4 bg-[#FF6B00] text-white rounded-2xl font-[1000] shadow-xl shadow-orange-500/20 flex items-center justify-center gap-3 uppercase tracking-tighter text-lg hover:scale-[1.02] active:scale-95 transition-all">
              {step === 1 ? <>{'NEXT STEP: FINANCIALS'} <ChevronRight size={20} /></> : <>{'CONFIRM BOOKING'} <ShieldCheck size={20} /></>}
            </button>
          </div>
        </div>
      </div>
      <style>{`
        .modern-input { width: 100%; padding: 1rem 1.25rem; background-color: #F8FAFC; border: 2px solid #F1F5F9; border-radius: 1.25rem; font-weight: 800; color: #1e293b; outline: none; font-size: 0.9375rem; transition: all 0.2s; }
        .modern-input:focus { border-color: #FF6B00; background-color: white; box-shadow: 0 10px 20px -5px rgba(255, 107, 0, 0.1); }
        .modern-input::placeholder { color: #94A3B8; font-weight: 600; }
        .modern-input.dark-mode { background-color: #0f172a; border-color: #1e293b; color: white; }
        .modern-input.dark-mode:focus { border-color: #FF6B00; background-color: #1e293b; }
        .modern-input.dark-mode::placeholder { color: #475569; }
      `}</style>
    </div>
  );
};

const StepIndicator: React.FC<{ active: boolean; number: number; label: string }> = ({ active, number, label }) => (
  <div className={`flex items-center gap-3 transition-opacity ${active ? 'opacity-100' : 'opacity-30'}`}>
     <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm ${active ? 'bg-[#FF6B00] text-white' : 'bg-slate-200 text-slate-500'}`}>{number}</div>
     <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400">{label}</span>
  </div>
);

const PriceAdjuster: React.FC<{ label: string; value: number; onChange: (v: number) => void; minus?: boolean }> = ({ label, value, onChange, minus }) => (
  <div className="flex justify-between items-center text-sm font-bold">
    <span className="opacity-60">{label}</span>
    <div className="flex items-center gap-2">
      {minus && <span className="text-red-400">-</span>}
      <input type="number" value={value || ''} onChange={e => onChange(Number(e.target.value))} className="w-20 bg-transparent text-right outline-none border-b border-white/20 focus:border-[#FF6B00] font-black" placeholder="0" />
    </div>
  </div>
);

const InputWrapper: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    {children}
  </div>
);

export default BookingModal;
