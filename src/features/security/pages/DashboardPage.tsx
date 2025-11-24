import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
} from 'recharts';
import {
  FaChalkboardTeacher,
  FaBook,
  FaDollarSign,
  FaUserGraduate,
  FaChartLine,
  FaCalendarCheck,
  FaCertificate,
  FaTrophy,
  FaFileInvoiceDollar,
} from 'react-icons/fa';

// Generar datos realistas con variaciones naturales
const generateRealisticData = () => {
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

  // Datos de estudiantes matriculados (con tendencia creciente y variaciones)
  const estudiantesData = months.map((mes, i) => {
    const base = 120 + i * 15;
    const variation = Math.floor(Math.random() * 30) - 15;
    return {
      mes,
      estudiantes: base + variation,
      nuevos: Math.floor(Math.random() * 25) + 10,
      activos: base + variation - Math.floor(Math.random() * 10),
    };
  });

  // Datos de ingresos mensuales (con picos realistas)
  const ingresosData = months.map((mes, i) => {
    const base = 15000 + i * 2000;
    const variation = Math.floor(Math.random() * 5000) - 2500;
    const pico = [2, 5, 8].includes(i) ? 8000 : 0; // Picos en algunos meses
    return {
      mes,
      ingresos: base + variation + pico,
      proyectado: base + 3000,
      cursos: Math.floor((base + variation) / 500),
    };
  });

  // Datos de asistencia semanal
  const asistenciaData = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'].map((semana) => ({
    semana,
    asistencia: 85 + Math.floor(Math.random() * 12) - 3,
    promedio: 88,
    ausencias: 12 - Math.floor(Math.random() * 8),
  }));

  // Distribución de cursos por categoría
  const categoriasData = [
    { name: 'Programación', value: 42, color: '#8b5cf6' }, // violet
    { name: 'Diseño', value: 28, color: '#f59e0b' }, // amber
    { name: 'Marketing', value: 18, color: '#06b6d4' }, // cyan
    { name: 'Idiomas', value: 35, color: '#6366f1' }, // indigo
    { name: 'Negocios', value: 23, color: '#10b981' }, // emerald
  ];

  // Profesores más activos
  const profesoresData = [
    { nombre: 'Dr. García', cursos: 8, estudiantes: 247 },
    { nombre: 'Dra. Martínez', cursos: 7, estudiantes: 198 },
    { nombre: 'Ing. López', cursos: 6, estudiantes: 176 },
    { nombre: 'Lic. Rodríguez', cursos: 5, estudiantes: 143 },
    { nombre: 'Prof. Hernández', cursos: 5, estudiantes: 132 },
  ];

  // Calificaciones promedio por curso
  const calificacionesData = [
    { curso: 'React Avanzado', calificacion: 8.7, aprobados: 92 },
    { curso: 'Python Básico', calificacion: 9.1, aprobados: 96 },
    { curso: 'Diseño UX/UI', calificacion: 8.3, aprobados: 88 },
    { curso: 'Marketing Digital', calificacion: 8.9, aprobados: 94 },
    { curso: 'Excel Empresarial', calificacion: 9.3, aprobados: 98 },
    { curso: 'Inglés B2', calificacion: 7.8, aprobados: 85 },
  ];

  // Pagos y facturación
  const pagosData = months.slice(0, 6).map((mes) => ({
    mes,
    completados: Math.floor(Math.random() * 80) + 120,
    pendientes: Math.floor(Math.random() * 30) + 10,
    atrasados: Math.floor(Math.random() * 15) + 5,
  }));

  // Rendimiento por materia
  const rendimientoData = [
    { materia: 'Matemáticas', promedio: 85 },
    { materia: 'Física', promedio: 78 },
    { materia: 'Química', promedio: 82 },
    { materia: 'Literatura', promedio: 91 },
    { materia: 'Historia', promedio: 88 },
  ];

  return {
    estudiantesData,
    ingresosData,
    asistenciaData,
    categoriasData,
    profesoresData,
    calificacionesData,
    pagosData,
    rendimientoData,
  };
};

// Componente KPI Card con animación
const KPICard: React.FC<{
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  gradient: string;
  shadowColor: string;
  trend?: number;
  delay: number;
}> = ({ title, value, subtitle, icon, gradient, shadowColor, trend, delay }) => {
  const [animated, setAnimated] = useState(false);
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    setTimeout(() => setAnimated(true), delay);

    // Animar el número
    const numValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.]/g, '')) : value;
    if (!isNaN(numValue)) {
      const duration = 1500;
      const steps = 60;
      const increment = numValue / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= numValue) {
          setDisplayValue(numValue);
          clearInterval(timer);
        } else {
          setDisplayValue(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [value, delay]);

  const formattedValue = typeof value === 'string' && value.includes('$')
    ? `$${displayValue.toLocaleString()}`
    : typeof value === 'string' && value.includes('%')
    ? `${displayValue}%`
    : displayValue.toLocaleString();

  return (
    <div
      className={`
        relative bg-white dark:bg-dark-card rounded-2xl p-6
        border border-neutral-100 dark:border-dark-border
        transition-all duration-700 hover:scale-105 hover:shadow-2xl
        ${animated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
      `}
      style={{
        boxShadow: animated ? `0 20px 60px -15px ${shadowColor}` : 'none',
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
            {typeof value === 'number' || !isNaN(parseFloat(value.toString()))
              ? formattedValue
              : value}
          </h3>
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}>
          {icon}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-neutral-500 dark:text-neutral-400">{subtitle}</p>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-semibold ${trend >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            <svg className={`w-4 h-4 ${trend < 0 ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
            </svg>
            {Math.abs(trend)}%
          </div>
        )}
      </div>

      {/* Barra de progreso animada */}
      <div className="mt-4 h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${gradient} transition-all duration-1000 ease-out`}
          style={{ width: animated ? '100%' : '0%' }}
        />
      </div>
    </div>
  );
};

// Tooltip personalizado
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-dark-card border border-neutral-200 dark:border-dark-border rounded-xl p-4 shadow-xl">
        <p className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: <span className="font-bold">{entry.value.toLocaleString()}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const DashboardPage = () => {
  const [animated, setAnimated] = useState(false);
  const data = generateRealisticData();

  useEffect(() => {
    setAnimated(true);
  }, []);

  return (
    <div className="w-full min-h-full">
      {/* Header */}
      {/* <div className={`mb-8 transition-all duration-700 ${animated ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-violet-600 mb-2">
          Dashboard Analítico
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400">Vista general del sistema educativo</p>
      </div> */}

      {/* KPIs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard
          title="Estudiantes Activos"
          value={1247}
          subtitle="Total matriculados"
          icon={<FaUserGraduate className="w-6 h-6 text-white" />}
          gradient="from-indigo-500 to-indigo-600"
          shadowColor="rgba(99, 102, 241, 0.3)"
          trend={12.5}
          delay={100}
        />
        <KPICard
          title="Profesores"
          value={87}
          subtitle="Activos este mes"
          icon={<FaChalkboardTeacher className="w-6 h-6 text-white" />}
          gradient="from-cyan-500 to-cyan-600"
          shadowColor="rgba(6, 182, 212, 0.3)"
          trend={5.2}
          delay={200}
        />
        <KPICard
          title="Cursos Activos"
          value={156}
          subtitle="En progreso"
          icon={<FaBook className="w-6 h-6 text-white" />}
          gradient="from-violet-500 to-violet-600"
          shadowColor="rgba(139, 92, 246, 0.3)"
          trend={8.7}
          delay={300}
        />
        <KPICard
          title="Ingresos Mensuales"
          value="$247,890"
          subtitle="Diciembre 2024"
          icon={<FaDollarSign className="w-6 h-6 text-white" />}
          gradient="from-emerald-500 to-emerald-600"
          shadowColor="rgba(16, 185, 129, 0.3)"
          trend={15.3}
          delay={400}
        />
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <KPICard
          title="Tasa de Asistencia"
          value="89%"
          subtitle="Promedio mensual"
          icon={<FaCalendarCheck className="w-5 h-5 text-white" />}
          gradient="from-blue-500 to-blue-600"
          shadowColor="rgba(59, 130, 246, 0.3)"
          trend={3.1}
          delay={500}
        />
        <KPICard
          title="Certificados Emitidos"
          value={342}
          subtitle="Este trimestre"
          icon={<FaCertificate className="w-5 h-5 text-white" />}
          gradient="from-amber-500 to-amber-600"
          shadowColor="rgba(245, 158, 11, 0.3)"
          trend={18.9}
          delay={600}
        />
        <KPICard
          title="Tasa de Aprobación"
          value="92%"
          subtitle="Promedio general"
          icon={<FaTrophy className="w-5 h-5 text-white" />}
          gradient="from-orange-500 to-orange-600"
          shadowColor="rgba(249, 115, 22, 0.3)"
          trend={2.4}
          delay={700}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Estudiantes Matriculados - LineChart */}
        <div className={`bg-white dark:bg-dark-card rounded-2xl p-6 border border-neutral-100 dark:border-dark-border shadow-lg transition-all duration-700 delay-100 ${animated ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-lg">
              <FaUserGraduate className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">Estudiantes Matriculados</h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Evolución mensual 2024</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.estudiantesData}>
              <defs>
                <linearGradient id="colorEstudiantes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
              <XAxis dataKey="mes" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line type="monotone" dataKey="estudiantes" stroke="#6366f1" strokeWidth={3} dot={{ fill: '#6366f1', r: 5 }} activeDot={{ r: 7 }} name="Total" />
              <Line type="monotone" dataKey="nuevos" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: '#8b5cf6', r: 4 }} name="Nuevos" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Ingresos Mensuales - AreaChart */}
        <div className={`bg-white dark:bg-dark-card rounded-2xl p-6 border border-neutral-100 dark:border-dark-border shadow-lg transition-all duration-700 delay-200 ${animated ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg">
              <FaDollarSign className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">Ingresos Mensuales</h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Comparativa con proyección</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data.ingresosData}>
              <defs>
                <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorProyectado" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.5}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
              <XAxis dataKey="mes" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area type="monotone" dataKey="ingresos" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorIngresos)" name="Ingresos Reales" />
              <Area type="monotone" dataKey="proyectado" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorProyectado)" name="Proyectado" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Second Row Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Distribución por Categoría - PieChart */}
        <div className={`bg-white dark:bg-dark-card rounded-2xl p-6 border border-neutral-100 dark:border-dark-border shadow-lg transition-all duration-700 delay-300 ${animated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 shadow-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">Cursos por Categoría</h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Distribución actual</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.categoriasData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${percent ? (percent * 100).toFixed(0) : 0}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {data.categoriasData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Asistencia Semanal - BarChart */}
        <div className={`bg-white dark:bg-dark-card rounded-2xl p-6 border border-neutral-100 dark:border-dark-border shadow-lg transition-all duration-700 delay-400 ${animated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
              <FaCalendarCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">Asistencia Semanal</h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Último mes</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.asistenciaData}>
              <defs>
                <linearGradient id="colorAsistencia" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={1}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.8}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
              <XAxis dataKey="semana" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="asistencia" fill="url(#colorAsistencia)" radius={[8, 8, 0, 0]} name="Asistencia %" />
              <Bar dataKey="promedio" fill="#93c5fd" radius={[8, 8, 0, 0]} name="Promedio %" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Third Row Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Profesores Más Activos */}
        <div className={`bg-white dark:bg-dark-card rounded-2xl p-6 border border-neutral-100 dark:border-dark-border shadow-lg transition-all duration-700 delay-500 ${animated ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-600 shadow-lg">
              <FaChalkboardTeacher className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">Top Profesores</h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Más activos</p>
            </div>
          </div>
          <div className="space-y-4">
            {data.profesoresData.map((profesor, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-cyan-50 to-transparent dark:from-cyan-900/10 dark:to-transparent border border-cyan-100 dark:border-cyan-900/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center text-white font-bold shadow-lg">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm">{profesor.nombre}</p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">{profesor.cursos} cursos</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-cyan-600 dark:text-cyan-400">{profesor.estudiantes}</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">estudiantes</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Calificaciones por Curso - Horizontal Bars */}
        <div className={`lg:col-span-2 bg-white dark:bg-dark-card rounded-2xl p-6 border border-neutral-100 dark:border-dark-border shadow-lg transition-all duration-700 delay-600 ${animated ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-gradient-to-br from-violet-500 to-violet-600 shadow-lg">
              <FaTrophy className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">Rendimiento por Curso</h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Calificaciones promedio</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data.calificacionesData} layout="vertical">
              <defs>
                <linearGradient id="colorCalif" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={1}/>
                  <stop offset="95%" stopColor="#c084fc" stopOpacity={0.8}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
              <XAxis type="number" domain={[0, 10]} stroke="#9ca3af" fontSize={12} />
              <YAxis type="category" dataKey="curso" stroke="#9ca3af" fontSize={11} width={120} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="calificacion" fill="url(#colorCalif)" radius={[0, 8, 8, 0]} name="Calificación" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Fourth Row - Pagos y Facturación */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className={`bg-white dark:bg-dark-card rounded-2xl p-6 border border-neutral-100 dark:border-dark-border shadow-lg transition-all duration-700 delay-700 ${animated ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-2'}`}>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg">
              <FaFileInvoiceDollar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">Estado de Pagos</h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Últimos 6 meses</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.pagosData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
              <XAxis dataKey="mes" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="completados" stackId="a" fill="#10b981" radius={[8, 8, 0, 0]} name="Completados" />
              <Bar dataKey="pendientes" stackId="a" fill="#f59e0b" name="Pendientes" />
              <Bar dataKey="atrasados" stackId="a" fill="#ef4444" name="Atrasados" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Rendimiento Académico - RadialBar */}
        <div className={`bg-white dark:bg-dark-card rounded-2xl p-6 border border-neutral-100 dark:border-dark-border shadow-lg transition-all duration-700 delay-800 ${animated ? 'opacity-100 rotate-0' : 'opacity-0 rotate-2'}`}>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg">
              <FaChartLine className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">Rendimiento Académico</h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Por materia</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="10%"
              outerRadius="90%"
              data={data.rendimientoData}
              startAngle={180}
              endAngle={0}
            >
              <RadialBar
                label={{ position: 'insideStart', fill: '#fff', fontSize: 12 }}
                background
                dataKey="promedio"
              />
              <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" />
              <Tooltip content={<CustomTooltip />} />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Footer Stats */}
      <div className={`grid grid-cols-2 sm:grid-cols-4 gap-4 transition-all duration-700 delay-900 ${animated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white shadow-lg">
          <p className="text-xs opacity-90 mb-1">Nuevo hoy</p>
          <p className="text-2xl font-bold">23</p>
          <p className="text-xs opacity-75">Estudiantes</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white shadow-lg">
          <p className="text-xs opacity-90 mb-1">En curso</p>
          <p className="text-2xl font-bold">67</p>
          <p className="text-xs opacity-75">Clases activas</p>
        </div>
        <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl p-4 text-white shadow-lg">
          <p className="text-xs opacity-90 mb-1">Promedio</p>
          <p className="text-2xl font-bold">4.8</p>
          <p className="text-xs opacity-75">Rating cursos</p>
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-4 text-white shadow-lg">
          <p className="text-xs opacity-90 mb-1">Certificados</p>
          <p className="text-2xl font-bold">89</p>
          <p className="text-xs opacity-75">Este mes</p>
        </div>
      </div>
    </div>
  );
};
