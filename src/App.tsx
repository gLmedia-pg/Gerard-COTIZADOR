/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  ChevronRight, 
  MessageCircle, 
  Download, 
  Plus, 
  Trash2, 
  Building2, 
  MapPin, 
  Maximize2,
  Calendar,
  Wallet,
  PieChart,
  LayoutDashboard,
  Settings,
  Bell,
  Search,
  User,
  ArrowUpRight
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import { COLORS, INITIAL_VALUES } from './constants';

// --- Components ---

const Logo = ({ collapsed }: { collapsed?: boolean }) => (
  <div className="flex items-center gap-3">
    <div className="w-10 h-10 bg-innova-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-innova-primary/30 shrink-0">
      <Building2 size={22} />
    </div>
    {!collapsed && (
      <div className="overflow-hidden">
        <h1 className="font-display font-black text-xl leading-none tracking-tighter text-white">
          INNOVA
        </h1>
        <p className="text-[9px] font-bold text-innova-primary uppercase tracking-[0.2em] leading-none mt-1">Inversiones</p>
      </div>
    )}
  </div>
);

const IconButton = ({ icon: Icon, active, label }: { icon: any; active?: boolean; label?: string }) => (
  <button className={cn(
    "w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group",
    active 
      ? "bg-innova-primary text-white shadow-lg shadow-innova-primary/20" 
      : "text-slate-400 hover:bg-white/5 hover:text-white"
  )}>
    <Icon size={20} className={cn("shrink-0", active ? "text-white" : "group-hover:scale-110 transition-transform")} />
    {label && <span className="text-sm font-bold tracking-tight">{label}</span>}
  </button>
);

const StatCard = ({ label, value, icon: Icon, trend }: { label: string; value: string; icon: any; trend?: string }) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 border border-slate-100">
        <Icon size={20} />
      </div>
      {trend && (
        <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
          <TrendingUp size={10} />
          {trend}
        </span>
      )}
    </div>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
    <h4 className="text-2xl font-black text-slate-900 tracking-tight">{value}</h4>
  </div>
);

// --- Main App ---

export default function App() {
  // State
  const [months, setMonths] = useState(36);
  const [initialPayment, setInitialPayment] = useState(INITIAL_VALUES.minInitial);
  const [activePlan, setActivePlan] = useState<'regular' | 'promo'>('regular');

  // Constants for calculations
  const totalPrice = 44234;
  const promoPrice = 42734;
  const separationFee = 500;
  
  const currentPrice = activePlan === 'regular' ? totalPrice : promoPrice;
  const financeableAmount = currentPrice - initialPayment - separationFee;
  const monthlyPayment = financeableAmount / months;

  // Plusvalía Projection Data (4 years)
  const plusvaliaData = useMemo(() => {
    const data = [];
    const baseValue = totalPrice;
    const rate = INITIAL_VALUES.appreciationRate;
    
    for (let i = 0; i <= 4; i++) {
      const year = new Date().getFullYear() + i;
      const value = baseValue * Math.pow(1 + rate, i);
      data.push({
        year: i === 0 ? 'Hoy' : `Año ${i}`,
        fullName: i === 0 ? 'Hoy' : `${year}`,
        value: Math.round(value),
        growth: Math.round(((value - baseValue) / baseValue) * 100)
      });
    }
    return data;
  }, [totalPrice]);

  const currentPlusvalia = plusvaliaData[plusvaliaData.length - 1];

  return (
    <div className="min-h-screen bg-innova-bg flex font-sans overflow-hidden">
      
      {/* Sidebar - Desktop Only */}
      <aside className="hidden lg:flex w-72 bg-innova-secondary flex-col shrink-0 overflow-hidden">
        <div className="p-8">
          <Logo />
        </div>
        
        <nav className="flex-1 px-4 space-y-2 py-4">
          <IconButton icon={LayoutDashboard} label="Dashboard" active />
          <IconButton icon={Building2} label="Proyectos" />
          <IconButton icon={TrendingUp} label="Proyecciones" />
          <IconButton icon={Wallet} label="Cobranzas" />
          <IconButton icon={User} label="Clientes" />
        </nav>

        <div className="p-6 border-t border-white/5 space-y-4">
          <IconButton icon={Settings} label="Configuración" />
          <div className="bg-gradient-to-br from-innova-primary/20 to-transparent p-6 rounded-2xl border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-10">
              <Building2 size={60} className="rotate-12" />
            </div>
            <p className="text-[10px] font-black text-innova-primary uppercase tracking-widest mb-1">Tu cuenta</p>
            <p className="text-white font-bold text-sm">Plan Premium</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        
        {/* Top Header */}
        <header className="h-20 bg-white/50 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center gap-6">
            <div className="lg:hidden shrink-0">
               <Logo collapsed />
            </div>
            <div className="relative group hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-innova-primary transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Buscar proyectos..." 
                className="bg-slate-100/50 border border-transparent focus:border-innova-primary focus:bg-white rounded-xl pl-10 pr-4 py-2.5 text-xs font-medium focus:outline-none w-64 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="w-10 h-10 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center hover:bg-slate-200 transition-all relative">
              <Bell size={20} />
              <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 border-2 border-white rounded-full" />
            </button>
            <div className="h-10 w-px bg-slate-100" />
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Inversionista</p>
                <p className="text-sm font-black text-slate-900 mt-1">Gerardo L.</p>
              </div>
              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black text-sm border-2 border-white shadow-sm">
                GL
              </div>
            </div>
          </div>
        </header>

        {/* Dash Body */}
        <div className="p-6 md:p-10 max-w-7xl w-full mx-auto space-y-8">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Mi Inversión</h2>
              <p className="text-sm font-bold text-slate-400 mt-1 flex items-center gap-2">
                <MapPin size={14} className="text-innova-primary" />
                Arenas Malabrigo, La Libertad
              </p>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <button className="flex-1 md:flex-none px-6 py-3 bg-white border border-slate-100 rounded-2xl shadow-sm text-xs font-black text-slate-900 hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                <Download size={16} />
                EXCEL
              </button>
              <button className="flex-1 md:flex-none px-6 py-3 bg-innova-primary text-white rounded-2xl shadow-xl shadow-innova-primary/20 text-xs font-black hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
                <Plus size={16} />
                NUEVA COMPRA
              </button>
            </div>
          </div>

          {/* Top Stats Bento */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard label="Precio Total" value={`S/ ${currentPrice.toLocaleString()}`} icon={Wallet} trend="+2.4%" />
            <StatCard label="Mensualidad" value={`S/ ${monthlyPayment.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} icon={Calendar} />
            <StatCard label="Tasa Aplicada" value="0.0%" icon={TrendingUp} />
            <StatCard label="Plusvalía Final" value={`S/ ${currentPlusvalia.value.toLocaleString()}`} icon={PieChart} trend={`${currentPlusvalia.growth}%`} />
          </div>

          {/* Main Bento Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-auto">
            
            {/* Project Details Cell (4 cols) */}
            <div className="lg:col-span-4 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 flex flex-col justify-between group overflow-hidden relative">
              <div className="absolute -bottom-8 -right-8 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
                <Building2 size={240} />
              </div>
              <div className="relative z-10">
                <h3 className="text-[11px] font-black text-innova-primary uppercase tracking-[0.3em] mb-6">Detalles del Lote</h3>
                <div className="space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                      <LayoutDashboard size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Identificador</p>
                      <p className="text-sm font-black text-slate-900">MZ X - LOTE 04</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                      <Maximize2 size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Área Total</p>
                      <p className="text-sm font-black text-slate-900">130.10 m²</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                      <TrendingUp size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Precio por m²</p>
                      <p className="text-sm font-black text-slate-900">S/ 340.00</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-12 pt-8 border-t border-slate-50 relative z-10 flex items-center justify-between text-xs font-bold text-slate-400">
                <span>ESTADO: DISPONIBLE</span>
                <span className="text-emerald-500 animate-pulse flex items-center gap-1.5 uppercase text-[9px] font-black">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                  Alta demanda
                </span>
              </div>
            </div>

            {/* Growth & Simulation Cell (8 cols) */}
            <div className="lg:col-span-8 bg-innova-secondary rounded-[2.5rem] shadow-2xl p-8 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-96 h-96 bg-innova-primary/20 rounded-full blur-[120px] -mr-48 -mt-48 group-hover:bg-innova-primary/30 transition-all duration-700" />
              
              <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                <div>
                  <h3 className="text-[11px] font-black text-innova-primary uppercase tracking-[0.4em] mb-2">Curva de Plusvalía</h3>
                  <div className="flex items-baseline gap-3">
                    <span className="text-6xl font-black tracking-tighter">+{currentPlusvalia.growth}%</span>
                    <div className="flex items-center gap-1.5 text-innova-primary font-black uppercase text-[10px] tracking-widest bg-white/5 px-3 py-1 rounded-full">
                       <ArrowUpRight size={14} />
                       EXCELENTE
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                   <div className="flex-1 md:flex-none border border-white/5 backdrop-blur-xl bg-white/5 rounded-3xl p-5">
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Hoy</p>
                      <p className="text-lg font-black font-mono">S/ {totalPrice.toLocaleString()}</p>
                   </div>
                   <div className="flex-1 md:flex-none border border-white/10 backdrop-blur-xl bg-white/10 rounded-3xl p-5 ring-4 ring-innova-primary/20">
                      <p className="text-[9px] font-black text-innova-primary uppercase tracking-widest mb-1">Año 4 (Est.)</p>
                      <p className="text-lg font-black font-mono text-innova-primary">S/ {currentPlusvalia.value.toLocaleString()}</p>
                   </div>
                </div>
              </div>

              <div className="h-72 w-full relative z-10 -ml-4 md:ml-0">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={plusvaliaData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.4}/>
                        <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.02)" />
                    <XAxis 
                      dataKey="year" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)', fontWeight: 'black' }} 
                    />
                    <YAxis hide />
                    <Tooltip 
                      contentStyle={{ 
                        borderRadius: '20px', 
                        border: 'none', 
                        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                        fontSize: '12px',
                        fontWeight: 'black',
                        backgroundColor: '#1e293b',
                        color: '#fff',
                        padding: '16px'
                      }}
                      itemStyle={{ color: '#14B8A6' }}
                      cursor={{ stroke: 'rgba(20, 184, 166, 0.4)', strokeWidth: 3 }}
                      formatter={(value: number) => [`S/ ${value.toLocaleString()}`, 'PRECIO']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke={COLORS.primary} 
                      strokeWidth={5} 
                      fillOpacity={1} 
                      fill="url(#colorValue)" 
                      animationDuration={2500}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Calculator Control Bento (8 cols) */}
            <div className="lg:col-span-8 bg-white rounded-[2.5rem] border border-slate-100 border-b shadow-sm p-8 md:p-12">
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                  <div>
                    <h3 className="text-[11px] font-black text-innova-primary uppercase tracking-[0.4em] mb-2">Simulador de Pago</h3>
                    <p className="text-xs font-bold text-slate-400">Ajusta los plazos para encontrar tu cuota ideal</p>
                  </div>
                  <div className="flex gap-2">
                    {[36, 48, 60].map(m => (
                      <button 
                        key={m}
                        onClick={() => setMonths(m)}
                        className={cn(
                          "px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
                          months === m ? "bg-slate-900 text-white shadow-lg" : "bg-slate-50 text-slate-400 hover:bg-slate-100"
                        )}
                      >
                        {m} Meses
                      </button>
                    ))}
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-10">
                    <div className="space-y-4">
                      <div className="flex justify-between items-end">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Plazo ({months}m)</label>
                        <span className="font-mono text-2xl font-black text-slate-900">{months}</span>
                      </div>
                      <input 
                        type="range" min={12} max={60} step={12} value={months}
                        onChange={(e) => setMonths(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-innova-primary"
                      />
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-end">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cuota Inicial</label>
                        <span className="font-mono text-2xl font-black text-slate-900">S/ {initialPayment.toLocaleString()}</span>
                      </div>
                      <input 
                        type="range" min={6000} max={20000} step={1000} value={initialPayment}
                        onChange={(e) => setInitialPayment(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-innova-primary"
                      />
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-[2rem] p-8 flex flex-col justify-center items-center text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4">Pago Mensual</p>
                    <div className="font-mono text-5xl font-black text-slate-900 leading-none">
                      <span className="text-xl align-top mr-1 font-bold">S/</span>
                      {monthlyPayment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <p className="text-[10px] font-bold text-innova-primary mt-6 bg-innova-primary/5 px-4 py-2 rounded-full uppercase tracking-widest">
                       Tasa fija 0% intereses
                    </p>
                  </div>
               </div>
            </div>

            {/* Plan Choice (4 cols) */}
            <div className="lg:col-span-4 flex flex-col gap-6">
               <button 
                onClick={() => setActivePlan('regular')}
                className={cn(
                  "flex-1 p-8 rounded-[2rem] border-2 transition-all relative group overflow-hidden",
                  activePlan === 'regular' 
                    ? "bg-white border-slate-900 shadow-2xl scale-[1.02]" 
                    : "bg-slate-50 border-transparent text-slate-400 grayscale hover:grayscale-0"
                )}
               >
                 <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-black uppercase tracking-widest">Precio Real</span>
                    <div className={cn("w-3 h-3 rounded-full", activePlan === 'regular' ? "bg-slate-900" : "bg-slate-300")} />
                 </div>
                 <p className="text-3xl font-black text-slate-900 text-left">S/ {totalPrice.toLocaleString()}</p>
                 <div className="mt-8 space-y-2 text-[10px] font-bold text-left">
                    <div className="flex justify-between text-slate-400"><span>Separación</span><span className="text-slate-900">S/ 500</span></div>
                    <div className="flex justify-between text-slate-400"><span>Financiable</span><span className="text-slate-900">S/ {(totalPrice - initialPayment - 500).toLocaleString()}</span></div>
                 </div>
               </button>

               <button 
                onClick={() => setActivePlan('promo')}
                className={cn(
                  "flex-1 p-8 rounded-[2rem] border-2 transition-all relative group overflow-hidden",
                  activePlan === 'promo' 
                    ? "bg-innova-primary border-innova-primary shadow-2xl scale-[1.02] text-white" 
                    : "bg-teal-50/50 border-transparent text-teal-600 grayscale hover:grayscale-0"
                )}
               >
                 <div className="absolute top-0 right-0 p-4 rotate-12 opacity-10">
                    <TrendingUp size={100} />
                 </div>
                 <div className="flex justify-between items-start mb-4 relative z-10">
                    <span className="text-[10px] font-black uppercase tracking-widest text-inherit/60">Precio Preventa</span>
                    <div className={cn("w-3 h-3 rounded-full", activePlan === 'promo' ? "bg-white" : "bg-teal-300")} />
                 </div>
                 <p className="text-3xl font-black text-left relative z-10">S/ {promoPrice.toLocaleString()}</p>
                 <div className="mt-8 space-y-2 text-[10px] font-bold text-left relative z-10">
                    <div className="flex justify-between text-inherit/60"><span>Ahorro Directo</span><span className="text-inherit">S/ 1,500</span></div>
                    <div className="flex justify-between text-inherit/60"><span>Beneficio Extra</span><span className="bg-white/20 px-1.5 rounded uppercase">Alta Rentabilidad</span></div>
                 </div>
               </button>
            </div>

          </div>

          <div className="bg-white border border-slate-200 rounded-[2rem] p-8 flex flex-col md:flex-row justify-between items-center gap-8 bg-slate-900">
            <div className="space-y-1 text-center md:text-left">
              <h4 className="text-2xl font-black text-white tracking-tight">¿Listo para asegurar tu futuro?</h4>
              <p className="text-sm font-bold text-slate-400">Nuestros asesores están listos para ayudarte a elegir el mejor lote.</p>
            </div>
            <div className="flex gap-4 w-full md:w-auto">
              <button className="flex-1 md:flex-none px-8 py-5 bg-white text-slate-900 rounded-2xl font-black text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-white/5">
                HABLAR CON ASESOR
              </button>
              <button className="flex-1 md:flex-none px-8 py-5 bg-innova-primary text-white rounded-2xl font-black text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-innova-primary/20">
                RESERVAR AHORA
              </button>
            </div>
          </div>

          {/* Detailed Bottom Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] pt-8 border-t border-slate-100">
             <div className="space-y-1">
                <p>PROYECTADO POR INNOVA INVERSIONES © 2024</p>
                <p>HOLA TRUJILLO S.A.C. | RUC 20606633131</p>
             </div>
             <div className="md:text-right space-y-1">
                <p>PREDIO LA PAMPA, RÁZURI, ASCOPE, LA LIBERTAD</p>
                <p>WWW.INNOVAINVERSIONES.COM</p>
             </div>
          </div>
        </div>

        {/* Footer Filler for Scroll */}
        <div className="h-24 shrink-0" />
      </main>

      {/* Floating Elements */}
      <div className="fixed bottom-8 right-8 z-[60] flex flex-col gap-4">
        <button className="w-16 h-16 bg-innova-primary text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all group relative">
          <MessageCircle size={32} />
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-400 border-4 border-innova-bg rounded-full animate-ping" />
        </button>
      </div>

    </div>
  );
}
