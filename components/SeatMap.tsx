
import React from 'react';
import { BusFront } from 'lucide-react';
import { ResponseData } from '../types';

interface SeatMapProps {
  busNo: number;
  activeTourName: string;
  responses: ResponseData[];
  onSeatClick: (seat: string) => void;
  isDarkMode: boolean;
}

const SeatMap: React.FC<SeatMapProps> = ({ activeTourName, responses, onSeatClick, isDarkMode }) => {
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

  const getSeatColor = (seatId: string) => {
    const passenger = responses.find(r => r.seatNo === seatId);
    if (!passenger) return null;

    const isFemale = passenger.gender === 'Female';
    const isMuslim = passenger.religion === 'Muslim';

    // Female and non-muslim -> Gold
    if (isFemale && !isMuslim) {
      return 'bg-[#FFD700] border-[#DAA520] text-slate-900';
    }
    // Male and non-muslim -> Red
    if (!isFemale && !isMuslim) {
      return 'bg-[#FF0000] border-[#B22222] text-white';
    }
    // Female -> Pink
    if (isFemale) {
      return 'bg-[#FF69B4] border-[#C71585] text-white';
    }
    // Normal booking -> Blue
    return 'bg-[#003B95] border-[#002B6B] text-white';
  };

  return (
    <div className={`p-4 lg:p-10 rounded-[1.5rem] lg:rounded-[2.5rem] shadow-xl border-2 lg:border-4 transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-50'}`}>
      <div className="max-w-[400px] mx-auto">
        <div className="mb-8 lg:mb-12 relative">
          <div className="w-full h-16 lg:h-20 bg-slate-900 rounded-t-[2rem] lg:rounded-t-[3rem] border-b-4 lg:border-b-8 border-slate-800 flex flex-col items-center justify-center shadow-lg px-4">
            <BusFront className="text-white w-6 h-6 lg:w-8 lg:h-8 mb-0.5 lg:mb-1" />
            <div className="bg-[#FF6B00] px-3 py-0.5 rounded-full w-full text-center overflow-hidden">
              <span className="text-[8px] lg:text-[10px] font-black text-white uppercase tracking-tighter truncate block font-bangla">
                {activeTourName}
              </span>
            </div>
          </div>
          
          <div className="absolute -bottom-6 lg:-bottom-8 flex justify-between w-full px-8 lg:px-12">
            <div className="flex flex-col items-center gap-1">
              <div className={`w-8 h-8 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl flex items-center justify-center border-2 shadow-sm ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
                 <div className="w-6 h-6 lg:w-8 lg:h-8 rounded-full border-2 lg:border-4 border-slate-300 border-t-[#FF6B00] animate-spin-slow"></div>
              </div>
              <span className={`text-[7px] lg:text-[9px] font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Pilot</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className={`w-8 h-8 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl flex items-center justify-center border-2 shadow-sm ${isDarkMode ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-green-50 border-green-100 text-green-600'}`}>
                 <span className="font-black text-[9px] lg:text-xs">ENTRY</span>
              </div>
              <span className={`text-[7px] lg:text-[9px] font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Gate</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-y-3 lg:gap-y-4 mt-12 lg:mt-16 px-2 lg:px-4">
          {rows.map((row) => (
            <React.Fragment key={row}>
              <SeatButton id={`${row}1`} colorClass={getSeatColor(`${row}1`)} onClick={onSeatClick} isDarkMode={isDarkMode} />
              <SeatButton id={`${row}2`} colorClass={getSeatColor(`${row}2`)} onClick={onSeatClick} isDarkMode={isDarkMode} />
              <div className="flex items-center justify-center">
                <span className={`text-[8px] lg:text-[10px] font-black ${isDarkMode ? 'text-slate-700' : 'text-slate-300'}`}>{row}</span>
              </div>
              <SeatButton id={`${row}3`} colorClass={getSeatColor(`${row}3`)} onClick={onSeatClick} isDarkMode={isDarkMode} />
              <SeatButton id={`${row}4`} colorClass={getSeatColor(`${row}4`)} onClick={onSeatClick} isDarkMode={isDarkMode} />
            </React.Fragment>
          ))}
        </div>

        <div className="grid grid-cols-5 gap-2 mt-4 px-2 lg:px-4">
           {['K1','K2','K3','K4','K5'].map(id => (
              <SeatButton key={id} id={id} colorClass={getSeatColor(id)} onClick={onSeatClick} isDarkMode={isDarkMode} />
           ))}
        </div>
      </div>
      <style>{`
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
      `}</style>
    </div>
  );
};

const SeatButton: React.FC<{ id: string; colorClass: string | null; onClick: (s: string) => void; isDarkMode: boolean }> = ({ id, colorClass, onClick, isDarkMode }) => (
  <button
    onClick={() => onClick(id)}
    className={`
      aspect-square rounded-xl lg:rounded-2xl flex flex-col items-center justify-center transition-all duration-300 active:scale-75 relative
      min-h-[44px] min-w-[44px] border shadow-sm
      ${colorClass 
        ? `${colorClass} cursor-pointer border-b-2 lg:border-b-4 hover:brightness-110 shadow-lg` 
        : `${isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-[#FF6B00] hover:text-white' : 'bg-slate-50 border-slate-100 text-slate-700 hover:bg-[#FF6B00] hover:text-white'}`
      }
    `}
  >
    <span className="text-[10px] lg:text-xs font-black tracking-tighter">{id}</span>
    {colorClass && (
      <div className="absolute top-1 right-1">
        <div className="w-1 lg:w-1.5 h-1 lg:h-1.5 bg-white/40 rounded-full animate-pulse"></div>
      </div>
    )}
  </button>
);

export default SeatMap;
