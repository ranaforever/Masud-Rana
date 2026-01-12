
import React, { useMemo, useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  CreditCard, 
  Clock, 
  Activity,
  ArrowUpRight,
  Target,
  Award,
  Truck,
  UserCheck,
  ShoppingBag,
  Trophy,
  Medal,
  Star,
  Crown,
  Wallet,
  ArrowDownCircle,
  ArrowUpCircle,
  PieChart as PieIcon,
  ChevronDown
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  Legend
} from 'recharts';
import { ResponseData, Expense, TourOption } from '../types';

interface DashboardProps {
  responses: ResponseData[];
  expenses: Expense[];
  isDarkMode: boolean;
  tours: TourOption[];
}

const COLORS = ['#003B95', '#FF6B00', '#22C55E', '#A855F7', '#F59E0B', '#6366F1', '#EC4899'];

const Dashboard: React.FC<DashboardProps> = ({ responses, expenses, isDarkMode, tours }) => {
  const [selectedTrip, setSelectedTrip] = useState<string>(tours[0]?.name || '');

  const tripFinancials = useMemo(() => {
    const tripBookings = responses.filter(r => r.tourName === selectedTrip);
    const tripExpenses = expenses.filter(e => e.tourName === selectedTrip);

    const revenue = tripBookings.reduce((acc, curr) => acc + curr.tourFees, 0);
    const collected = tripBookings.reduce((acc, curr) => acc + curr.advanceAmount, 0);
    const totalExpenses = tripExpenses.reduce((acc, curr) => acc + curr.amount, 0);
    const profit = revenue - totalExpenses;
    const margin = revenue > 0 ? (profit / revenue) * 100 : 0;

    return { revenue, collected, totalExpenses, profit, margin, count: tripBookings.length };
  }, [selectedTrip, responses, expenses]);

  const metrics = useMemo(() => {
    const totalRevenue = responses.reduce((acc, curr) => acc + curr.tourFees, 0);
    const totalCollected = responses.reduce((acc, curr) => acc + curr.advanceAmount, 0);
    const totalDue = responses.reduce((acc, curr) => acc + curr.dueAmount, 0);
    const totalPassengers = responses.length;

    // Tour Destination Analytics
    const tourDataMap: Record<string, number> = {};
    responses.forEach(r => {
      tourDataMap[r.tourName] = (tourDataMap[r.tourName] || 0) + 1;
    });
    const tourChartData = Object.entries(tourDataMap).map(([name, value]) => ({ name, value }));

    // Booker Ranking Logic
    const bookerMap: Record<string, { count: number, revenue: number }> = {};
    responses.forEach(r => {
      if (!bookerMap[r.bookedBy]) bookerMap[r.bookedBy] = { count: 0, revenue: 0 };
      bookerMap[r.bookedBy].count++;
      bookerMap[r.bookedBy].revenue += r.tourFees;
    });
    const bookerData = Object.entries(bookerMap)
      .map(([code, data]) => ({ code, ...data }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    const tourOccupancy = Object.entries(tourDataMap).map(([name, count]) => ({
      name,
      count,
      percent: (count / 45) * 100
    }));

    const collectionRate = totalRevenue > 0 ? (totalCollected / totalRevenue) * 100 : 0;
    const avgTicketValue = totalPassengers > 0 ? totalRevenue / totalPassengers : 0;

    return { 
      totalRevenue, totalCollected, totalDue, totalPassengers, 
      tourChartData, collectionRate, bookerData,
      tourOccupancy, avgTicketValue
    };
  }, [responses]);

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      {/* Trip-Specific Financial Report Section */}
      <div className={`p-10 lg:p-14 rounded-[4rem] shadow-sm border transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 mb-12">
          <div>
            <h3 className={`text-3xl font-[1000] tracking-tighter uppercase flex items-center gap-3 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
              <Wallet className="text-[#FF6B00] w-8 h-8" /> Trip Financial Report
            </h3>
            <p className={`text-[11px] font-black uppercase tracking-[0.2em] mt-2 font-bangla ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>একটি নির্দিষ্ট ট্রিপের আয় ও ব্যয়ের পূর্ণাঙ্গ চিত্র</p>
          </div>
          
          <div className={`flex items-center gap-4 px-6 py-4 rounded-3xl border ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <div className="relative min-w-[200px]">
              <p className={`text-[10px] font-black uppercase tracking-widest leading-none mb-1.5 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Select Trip</p>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FinancialCard label="Total Trip Revenue" value={`৳${tripFinancials.revenue.toLocaleString()}`} icon={<ArrowUpCircle />} color="text-emerald-500" bgColor={isDarkMode ? 'bg-emerald-500/10' : 'bg-emerald-50'} />
          <FinancialCard label="Total Trip Expense" value={`৳${tripFinancials.totalExpenses.toLocaleString()}`} icon={<ArrowDownCircle />} color="text-red-500" bgColor={isDarkMode ? 'bg-red-500/10' : 'bg-red-50'} />
          <FinancialCard label="Projected Profit" value={`৳${tripFinancials.profit.toLocaleString()}`} icon={<Star />} color="text-[#FF6B00]" bgColor={isDarkMode ? 'bg-orange-500/10' : 'bg-orange-50'} />
          <FinancialCard label="Profit Margin" value={`${Math.round(tripFinancials.margin)}%`} icon={<PieIcon />} color="text-blue-500" bgColor={isDarkMode ? 'bg-blue-500/10' : 'bg-blue-50'} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <MetricCard isDarkMode={isDarkMode} label="Gross Volume" value={`৳${metrics.totalRevenue.toLocaleString()}`} icon={<TrendingUp />} color="text-emerald-500" trend="Active Revenue" />
        <MetricCard isDarkMode={isDarkMode} label="Collected" value={`৳${metrics.totalCollected.toLocaleString()}`} icon={<CreditCard />} color="text-blue-500" trend="Cash In-Hand" />
        <MetricCard isDarkMode={isDarkMode} label="Outstanding" value={`৳${metrics.totalDue.toLocaleString()}`} icon={<Clock />} color="text-orange-500" trend="Pending Dues" />
        <MetricCard isDarkMode={isDarkMode} label="Total Guests" value={metrics.totalPassengers.toString()} icon={<Users />} color="text-purple-500" trend="Manifest Total" />
      </div>

      {/* Booker Ranking Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-12">
          <div className={`p-10 lg:p-14 rounded-[4rem] shadow-sm border transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
               <div>
                 <h3 className={`text-3xl font-[1000] tracking-tighter uppercase flex items-center gap-3 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                   <Crown className="text-[#FF6B00] w-8 h-8" /> Elite Booker Ranking
                 </h3>
                 <p className={`text-[11px] font-black uppercase tracking-[0.2em] mt-2 font-bangla ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>বুকিং পারফরম্যান্স এবং রাজস্ব অবদানের ভিত্তিতে সেরা পার্টনারদের তালিকা</p>
               </div>
               <div className="flex items-center gap-2 bg-[#003B95] px-6 py-3 rounded-2xl text-white shadow-xl shadow-blue-900/10">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-xs font-black uppercase tracking-widest">Partner Hall of Fame</span>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {metrics.bookerData.map((booker, idx) => (
                 <div key={booker.code} className="relative group">
                    {idx < 3 && (
                      <div className="absolute -top-4 -right-4 z-10 animate-bounce">
                         {idx === 0 && <div className="bg-yellow-400 text-white p-3 rounded-2xl shadow-lg border-2 border-white"><Trophy size={24} /></div>}
                         {idx === 1 && <div className="bg-slate-300 text-white p-3 rounded-2xl shadow-lg border-2 border-white"><Medal size={24} /></div>}
                         {idx === 2 && <div className="bg-orange-400 text-white p-3 rounded-2xl shadow-lg border-2 border-white"><Medal size={24} /></div>}
                      </div>
                    )}
                    
                    <div className={`h-full p-8 rounded-[3rem] border-2 transition-all hover:scale-[1.03] shadow-sm ${
                      idx === 0 ? (isDarkMode ? 'bg-yellow-500/5 border-yellow-500/20' : 'bg-yellow-50/50 border-yellow-100') : 
                      idx === 1 ? (isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-100') : 
                      idx === 2 ? (isDarkMode ? 'bg-orange-500/5 border-orange-500/20' : 'bg-orange-50/50 border-orange-100') : 
                      (isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-50')
                    }`}>
                       <div className="flex items-center gap-5 mb-6">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl ${
                            idx === 0 ? 'bg-yellow-400 text-white' : 
                            idx === 1 ? 'bg-slate-400 text-white' : 
                            idx === 2 ? 'bg-orange-400 text-white' : 
                            'bg-slate-100 dark:bg-slate-800 text-slate-400'
                          }`}>
                            {idx + 1}
                          </div>
                          <div>
                             <h4 className={`font-black text-xl tracking-tight uppercase leading-none ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{booker.code}</h4>
                             <span className={`text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Authorized Booker</span>
                          </div>
                       </div>

                       <div className="space-y-4">
                          <div className={`flex justify-between items-end pb-3 border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                             <div><p className={`text-[9px] font-black uppercase mb-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Total Revenue</p><p className="text-2xl font-[1000] text-[#003B95] dark:text-blue-400">৳{booker.revenue.toLocaleString()}</p></div>
                             <div className="text-right"><p className={`text-[9px] font-black uppercase mb-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Bookings</p><p className={`text-lg font-black ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{booker.count}</p></div>
                          </div>
                          <div className="pt-2">
                             <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter mb-1.5">
                                <span className={isDarkMode ? 'text-slate-500' : 'text-slate-400'}>Contribution Value</span>
                                <span className="text-emerald-500">{Math.round((booker.revenue/metrics.totalRevenue)*100)}% of Gross</span>
                             </div>
                             <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200/50'}`}>
                                <div className={`h-full rounded-full ${
                                  idx === 0 ? 'bg-yellow-400' : idx === 1 ? 'bg-slate-400' : idx === 2 ? 'bg-orange-400' : 'bg-[#003B95]'
                                }`} style={{ width: `${(booker.revenue/metrics.totalRevenue)*100}%` }}></div>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FinancialCard: React.FC<{ label: string; value: string; icon: React.ReactNode; color: string; bgColor: string }> = ({ label, value, icon, color, bgColor }) => (
  <div className={`${bgColor} p-8 rounded-[2.5rem] shadow-sm transition-all hover:scale-105`}>
    <div className={`p-4 rounded-2xl bg-white/20 inline-flex mb-6 ${color}`}>
      {React.cloneElement(icon as any, { size: 28 })}
    </div>
    <p className={`text-[10px] font-black uppercase tracking-widest mb-1.5 opacity-60 ${color}`}>{label}</p>
    <h4 className={`text-2xl lg:text-3xl font-black tracking-tighter leading-none ${color}`}>{value}</h4>
  </div>
);

const MetricCard: React.FC<{ label: string; value: string; icon: React.ReactNode; color: string; trend: string; isDarkMode: boolean }> = ({ label, value, icon, color, trend, isDarkMode }) => (
  <div className={`p-8 rounded-[2.5rem] border shadow-sm hover:translate-y-[-4px] transition-all group ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
    <div className="flex justify-between items-start mb-6">
      <div className={`p-4 rounded-2xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'} ${color} group-hover:scale-110 transition-transform`}>{React.cloneElement(icon as any, { size: 24 })}</div>
      <div className={`p-2 rounded-full ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'} text-slate-400`}><ArrowUpRight size={16} /></div>
    </div>
    <p className={`text-[10px] font-black uppercase tracking-widest mb-1.5 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{label}</p>
    <h4 className={`text-3xl font-black tracking-tighter leading-none mb-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{value}</h4>
    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-tight">{trend}</p>
  </div>
);

export default Dashboard;
