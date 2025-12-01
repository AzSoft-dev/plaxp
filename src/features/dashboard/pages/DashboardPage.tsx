import React, { useEffect, useState, useMemo } from 'react';
import {
  Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadialBarChart, RadialBar, ComposedChart, Line
} from 'recharts';
import { obtenerDashboardApi } from '../api/dashboardApi';
import type { DashboardData, DashboardFilters } from '../types/dashboard.types';

// Paleta moderna
const COLORS = {
  primary: { main: '#8b5cf6', light: '#a78bfa', dark: '#7c3aed', gradient: 'from-violet-500 to-purple-600' },
  success: { main: '#10b981', light: '#34d399', dark: '#059669', gradient: 'from-emerald-400 to-teal-500' },
  info: { main: '#3b82f6', light: '#60a5fa', dark: '#2563eb', gradient: 'from-blue-400 to-indigo-500' },
  warning: { main: '#f59e0b', light: '#fbbf24', dark: '#d97706', gradient: 'from-amber-400 to-orange-500' },
  danger: { main: '#ef4444', light: '#f87171', dark: '#dc2626', gradient: 'from-rose-400 to-red-500' },
  cyan: { main: '#06b6d4', light: '#22d3ee', dark: '#0891b2', gradient: 'from-cyan-400 to-blue-500' },
};

// Tooltip personalizado elegante
const CustomTooltip = ({ active, payload, label, formatter }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-dark-card px-4 py-3 rounded-xl shadow-xl border border-neutral-100 dark:border-dark-border backdrop-blur-sm">
        {label && <p className="text-xs font-semibold text-neutral-900 dark:text-white mb-2">{label}</p>}
        {payload.map((entry: any, i: number) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
            <span className="text-xs text-neutral-500 dark:text-neutral-400">{entry.name}:</span>
            <span className="text-xs font-bold text-neutral-900 dark:text-white">
              {formatter ? formatter(entry.value) : entry.value?.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// Periodo tabs
const PERIODOS = [
  { value: 'hoy', label: 'Hoy' },
  { value: 'semana', label: 'Semana' },
  { value: 'mes', label: 'Mes' },
  { value: 'trimestre', label: 'Trimestre' },
  { value: 'anio', label: 'Año' },
  { value: 'todo', label: 'Todo' },
];

export const DashboardPage: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [periodo, setPeriodo] = useState<DashboardFilters['periodo']>('mes');

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await obtenerDashboardApi({ periodo });
      if (res.success) setData(res.data);
      else setError(res.message);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [periodo]);

  // Data para gráfico de tendencia con área
  const tendenciaData = useMemo(() => {
    if (!data?.financiero.tendenciaRecaudacion) return [];
    return data.financiero.tendenciaRecaudacion.map((t, _, arr) => ({
      mes: t.periodo.slice(-2),
      monto: t.total,
      promedio: arr.reduce((a, b) => a + b.total, 0) / arr.length
    }));
  }, [data]);

  // Data para donut de métodos de pago
  const metodosPagoData = useMemo(() => {
    if (!data?.financiero.porMetodoPago) return [];
    const colors = [COLORS.primary.main, COLORS.success.main, COLORS.info.main, COLORS.warning.main, COLORS.cyan.main];
    return data.financiero.porMetodoPago.map((m, i) => ({
      name: m.metodo,
      value: m.total,
      cantidad: m.cantidad,
      color: colors[i % colors.length]
    }));
  }, [data]);

  // Data para barras de estado de pagos
  const estadoPagosData = useMemo(() => {
    if (!data) return [];
    const total = data.financiero.pagosCompletados + data.financiero.cantidadPendientes + data.financiero.cantidadVencidos;
    return [
      { name: 'Completados', value: data.financiero.pagosCompletados, pct: (data.financiero.pagosCompletados / total * 100), color: COLORS.success.main },
      { name: 'Pendientes', value: data.financiero.cantidadPendientes, pct: (data.financiero.cantidadPendientes / total * 100), color: COLORS.warning.main },
      { name: 'Vencidos', value: data.financiero.cantidadVencidos, pct: (data.financiero.cantidadVencidos / total * 100), color: COLORS.danger.main },
    ];
  }, [data]);

  // Data para radial KPIs
  const kpisRadialData = useMemo(() => {
    if (!data) return [];
    return [
      { name: 'Conversión', value: data.kpis.tasaConversion, fill: COLORS.primary.main },
      { name: 'Asistencia', value: 100 - data.kpis.tasaDesercion, fill: COLORS.success.main },
      { name: 'Cobranza', value: 100 - data.kpis.tasaMorosidad, fill: COLORS.info.main },
    ];
  }, [data]);

  // Data para barras comparativas académico
  const academicoBarData = useMemo(() => {
    if (!data) return [];
    return [
      { name: 'Estudiantes', activos: data.academico.estudiantes.activos, total: data.academico.estudiantes.total },
      { name: 'Matrículas', activos: data.academico.matriculas.activas, total: data.academico.matriculas.total },
      { name: 'Cursos', activos: data.academico.cursos.activos, total: data.academico.cursos.total },
      { name: 'Profesores', activos: data.academico.profesores.activos, total: data.academico.profesores.total },
    ];
  }, [data]);

  const formatMoney = (n: number) => new Intl.NumberFormat('es-CR', {
    style: 'currency', currency: 'CRC', minimumFractionDigits: 0, maximumFractionDigits: 0
  }).format(n);

  const formatTime = (d: string) => {
    const mins = Math.floor((Date.now() - new Date(d).getTime()) / 60000);
    if (mins < 60) return `${mins}min`;
    if (mins < 1440) return `${Math.floor(mins/60)}h`;
    return `${Math.floor(mins/1440)}d`;
  };

  if (loading) return (
    <div className="flex items-center justify-center h-96">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
        <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-purple-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
      </div>
    </div>
  );

  if (error || !data) return (
    <div className="flex flex-col items-center justify-center h-96 gap-4">
      <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <p className="text-neutral-500 dark:text-neutral-400">{error || 'Sin datos disponibles'}</p>
      <button onClick={fetchData} className="px-5 py-2.5 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-violet-500/25 transition-all">
        Reintentar
      </button>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Dashboard</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">{data.filtros.periodoDescripcion}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex p-1 bg-neutral-100 dark:bg-dark-card rounded-xl border border-neutral-200 dark:border-dark-border">
            {PERIODOS.map(p => (
              <button
                key={p.value}
                onClick={() => setPeriodo(p.value as any)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  periodo === p.value
                    ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-md shadow-violet-500/25'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
          <button onClick={fetchData} className="p-2.5 rounded-xl bg-neutral-100 dark:bg-dark-card border border-neutral-200 dark:border-dark-border text-neutral-500 hover:text-violet-600 hover:border-violet-300 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-all">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {/* KPIs Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Tasa Conversión', value: `${data.kpis.tasaConversion.toFixed(1)}%`, gradient: 'from-violet-500 to-purple-600', shadow: 'shadow-violet-500/30', trend: data.kpis.tasaConversion >= 50 ? 'up' : 'down', good: data.kpis.tasaConversion >= 50 },
          { label: 'Tasa Morosidad', value: `${data.kpis.tasaMorosidad.toFixed(1)}%`, gradient: data.kpis.tasaMorosidad > 10 ? 'from-rose-500 to-red-600' : 'from-amber-500 to-orange-600', shadow: data.kpis.tasaMorosidad > 10 ? 'shadow-rose-500/30' : 'shadow-amber-500/30', trend: data.kpis.tasaMorosidad <= 10 ? 'down' : 'up', good: data.kpis.tasaMorosidad <= 10 },
          { label: 'Ticket Promedio', value: formatMoney(data.kpis.ticketPromedio), gradient: 'from-emerald-500 to-teal-600', shadow: 'shadow-emerald-500/30', trend: 'up', good: true },
          { label: 'Tasa Deserción', value: `${data.kpis.tasaDesercion.toFixed(1)}%`, gradient: data.kpis.tasaDesercion > 15 ? 'from-rose-500 to-red-600' : 'from-cyan-500 to-blue-600', shadow: data.kpis.tasaDesercion > 15 ? 'shadow-rose-500/30' : 'shadow-cyan-500/30', trend: data.kpis.tasaDesercion <= 15 ? 'down' : 'up', good: data.kpis.tasaDesercion <= 15 },
        ].map((kpi, i) => (
          <div key={i} className={`bg-gradient-to-br ${kpi.gradient} rounded-2xl p-5 text-white shadow-lg ${kpi.shadow} hover:scale-105 transition-transform cursor-default`}>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium opacity-90">{kpi.label}</p>
              <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${kpi.good ? 'bg-white/20' : 'bg-black/20'}`}>
                {kpi.trend === 'up' ? (
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                ) : (
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                )}
              </div>
            </div>
            <p className="text-2xl font-bold mt-2">{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Recaudado', value: formatMoney(data.financiero.totalRecaudado), sub: `+${data.financiero.pagosCompletados} pagos`, color: 'emerald', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
          { label: 'Estudiantes', value: data.academico.estudiantes.activos.toLocaleString(), sub: `+${data.academico.estudiantes.nuevosEnPeriodo} nuevos`, color: 'violet', icon: 'M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z' },
          { label: 'Matrículas', value: data.academico.matriculas.activas.toLocaleString(), sub: `+${data.academico.matriculas.nuevasEnPeriodo} nuevas`, color: 'blue', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
          { label: 'Cursos', value: data.academico.cursos.activos.toString(), sub: `${data.academico.cursos.sincronizadosMoodle} en Moodle`, color: 'cyan', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
        ].map((stat, i) => (
          <div key={i} className="group bg-white dark:bg-dark-card rounded-2xl p-5 border border-neutral-200 dark:border-dark-border shadow-sm hover:shadow-lg hover:shadow-neutral-200/50 dark:hover:shadow-none transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-2.5 rounded-xl bg-gradient-to-br from-${stat.color}-500 to-${stat.color}-600 shadow-lg shadow-${stat.color}-500/30 group-hover:scale-110 transition-transform`}>
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                </svg>
              </div>
              <span className={`text-xs font-medium text-${stat.color}-600 dark:text-${stat.color}-400 bg-${stat.color}-50 dark:bg-${stat.color}-900/20 px-2 py-0.5 rounded-full`}>
                {stat.sub}
              </span>
            </div>
            <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">{stat.label}</p>
            <p className="text-2xl font-bold text-neutral-900 dark:text-white mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tendencia de Recaudación - Área con gradiente */}
        <div className="lg:col-span-2 bg-white dark:bg-dark-card rounded-2xl border border-neutral-200 dark:border-dark-border shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-neutral-100 dark:border-dark-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/30">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900 dark:text-white">Tendencia de Recaudación</h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">Últimos 6 meses vs promedio</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500" />
                  <span className="text-neutral-500">Recaudado</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-0.5 bg-violet-500 rounded-full" />
                  <span className="text-neutral-500">Promedio</span>
                </div>
              </div>
            </div>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={280}>
              <ComposedChart data={tendenciaData}>
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="50%" stopColor="#14b8a6" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#10b981" floodOpacity="0.3"/>
                  </filter>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis
                  dataKey="mes"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#9ca3af', fontWeight: 500 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#9ca3af' }}
                  tickFormatter={(v) => `₡${(v/1000000).toFixed(1)}M`}
                  width={70}
                />
                <Tooltip content={<CustomTooltip formatter={formatMoney} />} />
                <Area
                  type="monotone"
                  dataKey="monto"
                  stroke="#10b981"
                  strokeWidth={3}
                  fill="url(#areaGradient)"
                  filter="url(#shadow)"
                  name="Recaudado"
                  dot={{ fill: '#10b981', strokeWidth: 2, stroke: '#fff', r: 4 }}
                  activeDot={{ r: 6, fill: '#10b981', stroke: '#fff', strokeWidth: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="promedio"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  strokeDasharray="8 4"
                  dot={false}
                  name="Promedio"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* KPIs Radiales */}
        <div className="bg-white dark:bg-dark-card rounded-2xl border border-neutral-200 dark:border-dark-border shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-neutral-100 dark:border-dark-border">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/30">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900 dark:text-white">Indicadores Clave</h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Rendimiento general</p>
              </div>
            </div>
          </div>
          <div className="p-4">
            <ResponsiveContainer width="100%" height={180}>
              <RadialBarChart cx="50%" cy="50%" innerRadius="30%" outerRadius="90%" data={kpisRadialData} startAngle={180} endAngle={-180}>
                <RadialBar
                  background={{ fill: '#f3f4f6' }}
                  dataKey="value"
                  cornerRadius={10}
                />
                <Tooltip content={<CustomTooltip />} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {kpisRadialData.map((kpi, i) => (
                <div key={i} className="text-center p-2 rounded-lg bg-neutral-50 dark:bg-dark-bg">
                  <div className="w-2 h-2 rounded-full mx-auto mb-1" style={{ background: kpi.fill }} />
                  <p className="text-lg font-bold text-neutral-900 dark:text-white">{kpi.value.toFixed(1)}%</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">{kpi.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Estado de Pagos - Barras horizontales bonitas */}
        <div className="bg-white dark:bg-dark-card rounded-2xl border border-neutral-200 dark:border-dark-border shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-neutral-100 dark:border-dark-border">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900 dark:text-white">Estado de Pagos</h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Distribución actual</p>
              </div>
            </div>
          </div>
          <div className="p-6 space-y-5">
            {estadoPagosData.map((item, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ background: item.color }} />
                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-neutral-900 dark:text-white">{item.value}</span>
                    <span className="text-xs text-neutral-400">({item.pct.toFixed(1)}%)</span>
                  </div>
                </div>
                <div className="h-3 bg-neutral-100 dark:bg-dark-bg rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{
                      width: `${item.pct}%`,
                      background: `linear-gradient(90deg, ${item.color}dd, ${item.color})`,
                      boxShadow: `0 0 12px ${item.color}50`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Métodos de Pago - Donut elegante */}
        <div className="bg-white dark:bg-dark-card rounded-2xl border border-neutral-200 dark:border-dark-border shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-neutral-100 dark:border-dark-border">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/30">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900 dark:text-white">Métodos de Pago</h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Por monto recaudado</p>
              </div>
            </div>
          </div>
          <div className="p-4">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <defs>
                  {metodosPagoData.map((entry, i) => (
                    <linearGradient key={i} id={`pieGradient${i}`} x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor={entry.color} stopOpacity={1} />
                      <stop offset="100%" stopColor={entry.color} stopOpacity={0.7} />
                    </linearGradient>
                  ))}
                </defs>
                <Pie
                  data={metodosPagoData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                >
                  {metodosPagoData.map((_, i) => (
                    <Cell key={i} fill={`url(#pieGradient${i})`} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip formatter={formatMoney} />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {metodosPagoData.map((m, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-neutral-50 dark:bg-dark-bg">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: m.color }} />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-neutral-700 dark:text-neutral-300 truncate">{m.name}</p>
                    <p className="text-xs text-neutral-400">{m.cantidad} pagos</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Comparativa Académica */}
        <div className="bg-white dark:bg-dark-card rounded-2xl border border-neutral-200 dark:border-dark-border shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-neutral-100 dark:border-dark-border">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/30">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900 dark:text-white">Resumen Académico</h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Activos vs Total</p>
              </div>
            </div>
          </div>
          <div className="p-4">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={academicoBarData} layout="vertical" barGap={8}>
                <defs>
                  <linearGradient id="barGradientActive" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280', fontWeight: 500 }} width={75} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="total" fill="#e5e7eb" radius={[0, 6, 6, 0]} barSize={16} name="Total" />
                <Bar dataKey="activos" fill="url(#barGradientActive)" radius={[0, 6, 6, 0]} barSize={16} name="Activos" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Activity Section - Linear/Notion Style */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Últimos Pagos */}
        <div className="bg-white dark:bg-dark-card rounded-xl border border-neutral-200/60 dark:border-dark-border/60 overflow-hidden">
          <div className="px-4 py-3 border-b border-neutral-100 dark:border-dark-border/60 bg-neutral-50/50 dark:bg-neutral-900/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200">Pagos</span>
              </div>
              <span className="text-xs font-medium text-neutral-400 dark:text-neutral-500 tabular-nums">{data.actividadReciente.ultimosPagos.length}</span>
            </div>
          </div>
          <div className="max-h-[320px] overflow-y-auto scrollbar-thin">
            {data.actividadReciente.ultimosPagos.length > 0 ? (
              <div className="py-1">
                {data.actividadReciente.ultimosPagos.map((p) => (
                  <div key={p.id} className="px-3 py-2.5 mx-1 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30 border border-emerald-100 dark:border-emerald-800/30 flex items-center justify-center">
                        <span className="text-emerald-700 dark:text-emerald-300 text-xs font-semibold">{p.estudianteNombre.split(' ').map(n => n[0]).slice(0, 2).join('')}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">{p.estudianteNombre}</span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-xs text-neutral-500 dark:text-neutral-400">{p.metodoPago}</span>
                          <span className="text-neutral-300 dark:text-neutral-600">·</span>
                          <span className="text-xs text-neutral-400 dark:text-neutral-500">{formatTime(p.fechaAbono)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/30">
                        <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 tabular-nums">{formatMoney(p.monto)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 px-4">
                <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-2">
                  <svg className="w-5 h-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                  </svg>
                </div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Sin pagos recientes</p>
              </div>
            )}
          </div>
        </div>

        {/* Últimas Matrículas */}
        <div className="bg-white dark:bg-dark-card rounded-xl border border-neutral-200/60 dark:border-dark-border/60 overflow-hidden">
          <div className="px-4 py-3 border-b border-neutral-100 dark:border-dark-border/60 bg-neutral-50/50 dark:bg-neutral-900/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200">Matrículas</span>
              </div>
              <span className="text-xs font-medium text-neutral-400 dark:text-neutral-500 tabular-nums">{data.actividadReciente.ultimasMatriculas.length}</span>
            </div>
          </div>
          <div className="max-h-[320px] overflow-y-auto scrollbar-thin">
            {data.actividadReciente.ultimasMatriculas.length > 0 ? (
              <div className="py-1">
                {data.actividadReciente.ultimasMatriculas.map((m) => {
                  const estados: Record<number, { label: string; bg: string; text: string; border: string }> = {
                    1: { label: 'Activa', bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-200 dark:border-emerald-800/40' },
                    2: { label: 'Retirada', bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-700 dark:text-red-300', border: 'border-red-200 dark:border-red-800/40' },
                    3: { label: 'Congelada', bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-700 dark:text-amber-300', border: 'border-amber-200 dark:border-amber-800/40' },
                    4: { label: 'Finalizada', bg: 'bg-sky-50 dark:bg-sky-900/20', text: 'text-sky-700 dark:text-sky-300', border: 'border-sky-200 dark:border-sky-800/40' },
                  };
                  const estado = estados[m.estado] || estados[1];
                  return (
                    <div key={m.id} className="px-3 py-2.5 mx-1 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer group">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border border-blue-100 dark:border-blue-800/30 flex items-center justify-center">
                          <span className="text-blue-700 dark:text-blue-300 text-xs font-semibold">{m.estudianteNombre.split(' ').map(n => n[0]).slice(0, 2).join('')}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">{m.estudianteNombre}</span>
                            <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border ${estado.bg} ${estado.text} ${estado.border}`}>
                              {estado.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-xs text-neutral-500 dark:text-neutral-400 truncate">{m.planPagoNombre}</span>
                            <span className="text-neutral-300 dark:text-neutral-600">·</span>
                            <span className="text-xs text-neutral-400 dark:text-neutral-500">{formatTime(m.fechaMatricula)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 px-4">
                <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-2">
                  <svg className="w-5 h-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                </div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Sin matrículas recientes</p>
              </div>
            )}
          </div>
        </div>

        {/* Nuevos Estudiantes */}
        <div className="bg-white dark:bg-dark-card rounded-xl border border-neutral-200/60 dark:border-dark-border/60 overflow-hidden">
          <div className="px-4 py-3 border-b border-neutral-100 dark:border-dark-border/60 bg-neutral-50/50 dark:bg-neutral-900/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-violet-500/10 dark:bg-violet-500/20 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200">Estudiantes</span>
              </div>
              <span className="text-xs font-medium text-neutral-400 dark:text-neutral-500 tabular-nums">{data.actividadReciente.ultimosEstudiantes.length}</span>
            </div>
          </div>
          <div className="max-h-[320px] overflow-y-auto scrollbar-thin">
            {data.actividadReciente.ultimosEstudiantes.length > 0 ? (
              <div className="py-1">
                {data.actividadReciente.ultimosEstudiantes.map((e) => (
                  <div key={e.id} className="px-3 py-2.5 mx-1 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/30 dark:to-purple-900/30 border border-violet-100 dark:border-violet-800/30 flex items-center justify-center">
                          <span className="text-violet-700 dark:text-violet-300 text-xs font-semibold">{e.nombreCompleto.split(' ').map(n => n[0]).slice(0, 2).join('')}</span>
                        </div>
                        <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-dark-card ${e.estado ? 'bg-emerald-500' : 'bg-neutral-300 dark:bg-neutral-600'}`}></span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">{e.nombreCompleto}</span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-xs text-neutral-500 dark:text-neutral-400 truncate">{e.correo}</span>
                        </div>
                      </div>
                      <span className="text-xs text-neutral-400 dark:text-neutral-500 tabular-nums">{formatTime(e.fechaCreacion)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 px-4">
                <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-2">
                  <svg className="w-5 h-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                  </svg>
                </div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Sin estudiantes recientes</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-neutral-400 dark:text-neutral-500 pt-2 pb-4">
        <span>{data.empresa.nombre}</span>
        <span>Actualizado: {new Date(data.fechaGeneracion).toLocaleString('es-CR')}</span>
      </div>
    </div>
  );
};
