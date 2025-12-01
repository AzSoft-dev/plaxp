import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  FaArrowLeft,
  FaUser,
  FaCreditCard,
  FaCalendarAlt,
  FaCheckCircle,
  FaSignOutAlt,
  FaPause,
  FaFlagCheckered,
  FaClock,
  FaExclamationTriangle,
  FaBan,
  FaEye,
  FaClipboardList,
} from 'react-icons/fa';
import { CgSpinner } from 'react-icons/cg';
import { obtenerMatriculaPorIdApi, obtenerPagosDeMatriculaApi } from '../api/matriculasApi';
import type { Matricula } from '../types/matricula.types';
import { EstadoMatricula } from '../types/matricula.types';
import type { MatriculaPago } from '../../matriculasPagos/types/matriculaPago.types';
import { EstadoPago } from '../../matriculasPagos/types/matriculaPago.types';

const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return 'N/A';
  const [year, month, day] = dateString.split('T')[0].split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const formatCurrency = (amount: number): string => {
  return `$${amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;
};

const getEstadoMatriculaBadge = (estado: EstadoMatricula) => {
  const config: Record<EstadoMatricula, { icon: typeof FaCheckCircle; label: string; classes: string }> = {
    [EstadoMatricula.ACTIVA]: {
      icon: FaCheckCircle,
      label: 'Activa',
      classes: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-300 dark:border-green-700',
    },
    [EstadoMatricula.RETIRADA]: {
      icon: FaSignOutAlt,
      label: 'Retirada',
      classes: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-300 dark:border-red-700',
    },
    [EstadoMatricula.CONGELADA]: {
      icon: FaPause,
      label: 'Congelada',
      classes: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-300 dark:border-yellow-700',
    },
    [EstadoMatricula.FINALIZADA]: {
      icon: FaFlagCheckered,
      label: 'Finalizada',
      classes: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-300 dark:border-blue-700',
    },
  };
  const { icon: Icon, label, classes } = config[estado];
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold border ${classes}`}>
      <Icon className="w-4 h-4" />
      {label}
    </span>
  );
};

const getEstadoPagoBadge = (estado: EstadoPago) => {
  const config = {
    [EstadoPago.PENDIENTE]: { icon: FaClock, label: 'Pendiente', bg: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' },
    [EstadoPago.PAGADO]: { icon: FaCheckCircle, label: 'Pagado', bg: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' },
    [EstadoPago.VENCIDO]: { icon: FaExclamationTriangle, label: 'Vencido', bg: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' },
    [EstadoPago.ANULADO]: { icon: FaBan, label: 'Anulado', bg: 'bg-neutral-100 dark:bg-neutral-900/30 text-neutral-700 dark:text-neutral-400' },
  };
  const { icon: Icon, label, bg } = config[estado];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${bg}`}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
};

export const ViewMatriculaPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [matricula, setMatricula] = useState<Matricula | null>(null);
  const [pagos, setPagos] = useState<MatriculaPago[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const [matriculaRes, pagosRes] = await Promise.all([
          obtenerMatriculaPorIdApi(id),
          obtenerPagosDeMatriculaApi(id),
        ]);
        if (!matriculaRes.success) throw new Error('No se pudo cargar la matrícula');
        setMatricula(matriculaRes.data);
        setPagos(pagosRes.data || []);
      } catch (err: any) {
        setError(err.message || 'Error al cargar la información');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <CgSpinner className="w-8 h-8 text-orange-600 animate-spin" />
      </div>
    );
  }

  if (error || !matricula) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
        <p className="text-red-600 dark:text-red-400">{error || 'Matrícula no encontrada'}</p>
        <button onClick={() => navigate('/matriculas')} className="mt-4 text-sm text-red-600 hover:underline">
          Volver a la lista
        </button>
      </div>
    );
  }

  const totalPagos = pagos.length;
  const pagosPagados = pagos.filter(p => p.estado === EstadoPago.PAGADO).length;
  const pagosPendientes = pagos.filter(p => p.estado === EstadoPago.PENDIENTE).length;
  const pagosVencidos = pagos.filter(p => p.estado === EstadoPago.VENCIDO).length;
  const totalMonto = pagos.reduce((sum, p) => sum + p.total, 0);
  const montoPagado = pagos.filter(p => p.estado === EstadoPago.PAGADO).reduce((sum, p) => sum + p.total, 0);
  const porcentajePagado = totalMonto > 0 ? Math.round((montoPagado / totalMonto) * 100) : 0;

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <button
          onClick={() => navigate('/matriculas')}
          className="self-start p-2 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-dark-hover rounded-lg transition-colors"
        >
          <FaArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/30">
            <FaClipboardList className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
              Detalle de Matrícula
            </h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Información completa de la matrícula
            </p>
          </div>
        </div>
      </div>

      {/* Grid Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna Izquierda - Info */}
        <div className="lg:col-span-1 space-y-4">
          {/* Información del Estudiante */}
          <div className="bg-white dark:bg-dark-card rounded-xl border border-neutral-200 dark:border-dark-border p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FaUser className="w-4 h-4 text-indigo-500" />
                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm">Estudiante</h3>
              </div>
              {getEstadoMatriculaBadge(matricula.estado)}
            </div>
            <p className="font-semibold text-neutral-900 dark:text-neutral-100">
              {matricula.estudianteNombre} {matricula.estudianteApellidos}
            </p>
          </div>

          {/* Plan de Pago */}
          <div className="bg-white dark:bg-dark-card rounded-xl border border-neutral-200 dark:border-dark-border p-4">
            <div className="flex items-center gap-2 mb-3">
              <FaCreditCard className="w-4 h-4 text-rose-500" />
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm">Plan de Pago</h3>
            </div>
            <p className="font-medium text-neutral-900 dark:text-neutral-100">{matricula.planPagoNombre}</p>
          </div>

          {/* Período y Fechas */}
          <div className="bg-white dark:bg-dark-card rounded-xl border border-neutral-200 dark:border-dark-border p-4">
            <div className="flex items-center gap-2 mb-3">
              <FaCalendarAlt className="w-4 h-4 text-emerald-500" />
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm">Período y Fechas</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-500 dark:text-neutral-400">Período:</span>
                <span className="font-medium text-neutral-900 dark:text-neutral-100">
                  {matricula.periodoLectivoNombre || 'Sin período'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500 dark:text-neutral-400">Matrícula:</span>
                <span className="font-medium text-neutral-900 dark:text-neutral-100">{formatDate(matricula.fechaMatricula)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500 dark:text-neutral-400">Próximo pago:</span>
                <span className="font-medium text-neutral-900 dark:text-neutral-100">{formatDate(matricula.fechaProximoPago)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500 dark:text-neutral-400">Control finalización:</span>
                <span className="font-medium text-neutral-900 dark:text-neutral-100">{matricula.controlFinalizacion ? 'Sí' : 'No'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Columna Derecha - Pagos */}
        <div className="lg:col-span-2 space-y-4">
          {/* Resumen de Pagos */}
          <div className="bg-white dark:bg-dark-card rounded-xl border border-neutral-200 dark:border-dark-border p-4">
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Resumen de Pagos</h3>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              <div className="text-center p-3 bg-neutral-50 dark:bg-dark-hover rounded-lg">
                <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{totalPagos}</p>
                <p className="text-xs text-neutral-500">Total</p>
              </div>
              <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{pagosPagados}</p>
                <p className="text-xs text-neutral-500">Pagados</p>
              </div>
              <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{pagosPendientes}</p>
                <p className="text-xs text-neutral-500">Pendientes</p>
              </div>
              <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">{pagosVencidos}</p>
                <p className="text-xs text-neutral-500">Vencidos</p>
              </div>
            </div>

            {/* Progreso */}
            {totalMonto > 0 && (
              <div className="p-3 bg-neutral-50 dark:bg-dark-hover rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">Progreso</span>
                  <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                    {formatCurrency(montoPagado)} / {formatCurrency(totalMonto)}
                  </span>
                </div>
                <div className="w-full h-2.5 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all"
                    style={{ width: `${porcentajePagado}%` }}
                  />
                </div>
                <p className="text-right text-xs text-neutral-500 mt-1">{porcentajePagado}% completado</p>
              </div>
            )}
          </div>

          {/* Tabla de Pagos */}
          <div className="bg-white dark:bg-dark-card rounded-xl border border-neutral-200 dark:border-dark-border overflow-hidden">
            <div className="px-4 py-3 border-b border-neutral-200 dark:border-dark-border">
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">Cronograma de Pagos</h3>
            </div>

            {pagos.length === 0 ? (
              <div className="p-8 text-center text-neutral-500">No hay pagos registrados</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-neutral-50 dark:bg-dark-hover">
                    <tr>
                      <th className="px-4 py-2.5 text-left font-semibold text-neutral-500 dark:text-neutral-400">N°</th>
                      <th className="px-4 py-2.5 text-left font-semibold text-neutral-500 dark:text-neutral-400">Vencimiento</th>
                      <th className="px-4 py-2.5 text-right font-semibold text-neutral-500 dark:text-neutral-400">Monto</th>
                      <th className="px-4 py-2.5 text-center font-semibold text-neutral-500 dark:text-neutral-400">Estado</th>
                      <th className="px-4 py-2.5 text-center font-semibold text-neutral-500 dark:text-neutral-400"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 dark:divide-dark-border">
                    {pagos.map((pago) => (
                      <tr key={pago.id} className="hover:bg-neutral-50 dark:hover:bg-dark-hover transition-colors">
                        <td className="px-4 py-2.5">
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-semibold text-xs">
                            {pago.numeroPago}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-neutral-700 dark:text-neutral-300">
                          {formatDate(pago.fechaVencimiento)}
                        </td>
                        <td className="px-4 py-2.5 text-right font-semibold text-neutral-900 dark:text-neutral-100">
                          {formatCurrency(pago.total)}
                        </td>
                        <td className="px-4 py-2.5 text-center">
                          {getEstadoPagoBadge(pago.estado)}
                        </td>
                        <td className="px-4 py-2.5 text-center">
                          <Link
                            to={`/pagos/view/${pago.id}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors"
                          >
                            <FaEye className="w-3 h-3" />
                            Ver
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
