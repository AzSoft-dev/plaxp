import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaArrowLeft,
  FaArrowRight,
  FaUser,
  FaCreditCard,
  FaCalendarAlt,
  FaCheck,
  FaSearch,
  FaCheckCircle,
  FaChevronLeft,
  FaChevronRight,
  FaClipboardList,
} from 'react-icons/fa';
import { CgSpinner } from 'react-icons/cg';
import { listarEstudiantesApi } from '../../estudiantes/api/estudiantesApi';
import { listarPlanesPagoApi, obtenerPlanPagoPorIdApi } from '../../planesPago/api/planesPagoApi';
import { listarPeriodosLectivosApi } from '../../periodosLectivos/api/periodosLectivosApi';
import { crearMatriculaApi, validarMatriculaDuplicadaApi } from '../api/matriculasApi';
import { crearMatriculaPagoApi, crearAbonoApi } from '../../matriculasPagos/api/matriculasPagosApi';
import type { Estudiante } from '../../estudiantes/types/estudiante.types';
import type { PlanPago, TipoPago, PeriodicidadUnidad } from '../../planesPago/types/planPago.types';
import type { PeriodoLectivo } from '../../periodosLectivos/types/periodoLectivo.types';
import { UserAvatar } from '../../users/components/UserAvatar';

const STEPS = [
  { id: 1, title: 'Estudiante', icon: FaUser },
  { id: 2, title: 'Plan de Pago', icon: FaCreditCard },
  { id: 3, title: 'Configuración', icon: FaCalendarAlt },
  { id: 4, title: 'Confirmar', icon: FaCheck },
];

const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return 'N/A';
  // Extraer solo la parte de fecha para evitar problemas de zona horaria
  const [year, month, day] = dateString.split('T')[0].split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const formatCurrency = (amount: number, simbolo?: string): string => {
  return `${simbolo || '$'}${amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;
};

const getTipoPagoLabel = (tipo: TipoPago): string => {
  switch (tipo) {
    case 1: return 'Pago Único';
    case 2: return 'Recurrente';
    case 3: return 'Cuotas';
    default: return 'Desconocido';
  }
};

const addPeriod = (date: Date, valor: number, unidad: PeriodicidadUnidad): Date => {
  const result = new Date(date);
  switch (unidad) {
    case 1: result.setDate(result.getDate() + valor); break;
    case 2: result.setDate(result.getDate() + (valor * 7)); break;
    case 3: result.setMonth(result.getMonth() + valor); break;
    case 4: result.setFullYear(result.getFullYear() + valor); break;
  }
  return result;
};

export const CreateMatriculaPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estados del proceso de creación
  const [creatingMatricula, setCreatingMatricula] = useState(false);
  const [createdMatriculaId, setCreatedMatriculaId] = useState<string | null>(null);
  const [generatingPagos, setGeneratingPagos] = useState(false);
  const [pagosGenerados, setPagosGenerados] = useState<{ id: string; numeroPago: number; total: number }[]>([]);

  // Estado para abono
  const [showAbonoModal, setShowAbonoModal] = useState(false);
  const [montoAbono, setMontoAbono] = useState<number>(0);
  const [metodoPago, setMetodoPago] = useState('efectivo');
  const [referenciaAbono, setReferenciaAbono] = useState('');
  const [registrandoAbono, setRegistrandoAbono] = useState(false);

  // Datos del formulario
  const [selectedEstudiante, setSelectedEstudiante] = useState<Estudiante | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<PlanPago | null>(null);
  const [selectedPeriodo, setSelectedPeriodo] = useState<PeriodoLectivo | null>(null);
  const [controlFinalizacion, setControlFinalizacion] = useState(false);
  const [fechaMatricula, setFechaMatricula] = useState(new Date().toISOString().split('T')[0]);
  const [fechaProximoPago, setFechaProximoPago] = useState(new Date().toISOString().split('T')[0]);

  // Estados para estudiantes paginados
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [estudiantesPage, setEstudiantesPage] = useState(1);
  const [estudiantesTotalPages, setEstudiantesTotalPages] = useState(1);
  const [estudiantesTotal, setEstudiantesTotal] = useState(0);
  const [loadingEstudiantes, setLoadingEstudiantes] = useState(false);
  const [estudianteSearch, setEstudianteSearch] = useState('');

  // Listas
  const [planesPago, setPlanesPago] = useState<PlanPago[]>([]);
  const [periodosLectivos, setPeriodosLectivos] = useState<PeriodoLectivo[]>([]);
  const [loadingPlanes, setLoadingPlanes] = useState(false);
  const [loadingPeriodos, setLoadingPeriodos] = useState(false);

  // Cargar estudiantes paginados
  const fetchEstudiantes = useCallback(async (page: number, search?: string) => {
    setLoadingEstudiantes(true);
    try {
      const response = await listarEstudiantesApi({
        page,
        limit: 8,
        q: search || undefined,
        estado: true,
      });
      if (response.success) {
        setEstudiantes(response.data.estudiantes);
        setEstudiantesTotalPages(response.data.totalPages);
        setEstudiantesTotal(response.data.total);
      }
    } catch (err) {
      console.error('Error al cargar estudiantes:', err);
    } finally {
      setLoadingEstudiantes(false);
    }
  }, []);

  useEffect(() => {
    if (currentStep === 1) {
      const timer = setTimeout(() => {
        fetchEstudiantes(estudiantesPage, estudianteSearch);
      }, estudianteSearch ? 300 : 0);
      return () => clearTimeout(timer);
    }
  }, [currentStep, estudiantesPage, estudianteSearch, fetchEstudiantes]);

  useEffect(() => {
    const fetchPlanes = async () => {
      setLoadingPlanes(true);
      try {
        const response = await listarPlanesPagoApi({ activo: true, limit: 100 });
        if (response.success) {
          setPlanesPago(response.data.planesPago);
        }
      } catch (err) {
        console.error('Error al cargar planes de pago:', err);
      } finally {
        setLoadingPlanes(false);
      }
    };
    fetchPlanes();
  }, []);

  useEffect(() => {
    const fetchPeriodos = async () => {
      setLoadingPeriodos(true);
      try {
        const response = await listarPeriodosLectivosApi({ estado: 1, limit: 100 });
        if (response.success) {
          setPeriodosLectivos(response.data.periodosLectivos);
        }
      } catch (err) {
        console.error('Error al cargar períodos lectivos:', err);
      } finally {
        setLoadingPeriodos(false);
      }
    };
    fetchPeriodos();
  }, []);

  useEffect(() => {
    setEstudiantesPage(1);
  }, [estudianteSearch]);

  const canProceed = (): boolean => {
    switch (currentStep) {
      case 1: return selectedEstudiante !== null;
      case 2: return selectedPlan !== null;
      case 3:
        if (controlFinalizacion && !selectedPeriodo) return false;
        return fechaMatricula !== '' && fechaProximoPago !== '';
      case 4: return true;
      default: return false;
    }
  };

  const handleNext = () => {
    if (canProceed() && currentStep < 4) {
      setCurrentStep(currentStep + 1);
      setError(null);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError(null);
    }
  };

  const generarPagos = async (matriculaId: string, plan: PlanPago) => {
    setGeneratingPagos(true);
    const pagosCreados: { id: string; numeroPago: number; total: number }[] = [];

    try {
      const planCompleto = await obtenerPlanPagoPorIdApi(plan.id);
      const planData = planCompleto.data;
      let fechaBase = new Date(fechaProximoPago);

      if (planData.tipoPago === 1 || planData.tipoPago === 2) {
        const pago = await crearMatriculaPagoApi({
          matriculaId,
          numeroPago: 1,
          subtotal: planData.subtotal,
          total: planData.total,
          fechaVencimiento: fechaBase.toISOString().split('T')[0],
        });
        if (pago.success) {
          pagosCreados.push({ id: pago.data.id, numeroPago: 1, total: pago.data.total });
        }
      } else if (planData.tipoPago === 3 && planData.numeroCuotas) {
        const subtotalCuota = planData.subtotalFinal ? planData.subtotalFinal / planData.numeroCuotas : planData.subtotal;
        const totalCuota = planData.totalFinal ? planData.totalFinal / planData.numeroCuotas : planData.total;

        for (let i = 1; i <= planData.numeroCuotas; i++) {
          const fechaVenc = i === 1
            ? fechaBase
            : addPeriod(fechaBase, (i - 1) * (planData.periodicidadValor || 1), planData.idPeriodicidadUnidad || 3);

          const pago = await crearMatriculaPagoApi({
            matriculaId,
            numeroPago: i,
            subtotal: Math.round(subtotalCuota * 100) / 100,
            total: Math.round(totalCuota * 100) / 100,
            fechaVencimiento: fechaVenc.toISOString().split('T')[0],
          });

          if (pago.success) {
            pagosCreados.push({ id: pago.data.id, numeroPago: i, total: pago.data.total });
          }
        }
      }

      setPagosGenerados(pagosCreados);
    } catch (err) {
      console.error('Error al generar pagos:', err);
      throw err;
    } finally {
      setGeneratingPagos(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedEstudiante || !selectedPlan) return;

    setLoading(true);
    setCreatingMatricula(true);
    setError(null);

    try {
      if (controlFinalizacion && selectedPeriodo) {
        const existeMatricula = await validarMatriculaDuplicadaApi(selectedEstudiante.id, selectedPeriodo.id);
        if (existeMatricula) {
          setError('Ya existe una matrícula para este estudiante en el período seleccionado');
          setLoading(false);
          setCreatingMatricula(false);
          return;
        }
      }

      const matriculaData = {
        estudianteId: selectedEstudiante.id,
        planPagoId: selectedPlan.id,
        fechaMatricula,
        fechaProximoPago,
        controlFinalizacion,
        periodoLectivoId: controlFinalizacion && selectedPeriodo ? selectedPeriodo.id : undefined,
        estado: 1 as const,
      };

      const matriculaRes = await crearMatriculaApi(matriculaData);

      if (!matriculaRes.success) {
        throw new Error(matriculaRes.message || 'Error al crear la matrícula');
      }

      const matriculaId = matriculaRes.data.id;
      setCreatedMatriculaId(matriculaId);

      await generarPagos(matriculaId, selectedPlan);
      setShowAbonoModal(true);

    } catch (err: any) {
      console.error('Error al crear matrícula:', err);
      setError(err.message || 'Error al crear la matrícula');
    } finally {
      setLoading(false);
      setCreatingMatricula(false);
    }
  };

  const handleRegistrarAbono = async () => {
    if (!pagosGenerados.length || montoAbono <= 0) return;

    setRegistrandoAbono(true);
    try {
      await crearAbonoApi({
        matriculaPagoId: pagosGenerados[0].id,
        metodoPago,
        monto: montoAbono,
        referencia: referenciaAbono || undefined,
        nota: 'Abono inicial al momento de matrícula',
      });

      setShowAbonoModal(false);
      navigate(`/matriculas/view/${createdMatriculaId}`);
    } catch (err: any) {
      console.error('Error al registrar abono:', err);
      setError(err.message || 'Error al registrar el abono');
    } finally {
      setRegistrandoAbono(false);
    }
  };

  const handleSkipAbono = () => {
    setShowAbonoModal(false);
    navigate(`/matriculas/view/${createdMatriculaId}`);
  };

  const getEstudianteNombreCompleto = (est: Estudiante) =>
    `${est.nombre} ${est.primerApellido} ${est.segundoApellido || ''}`.trim();

  // Modal de Abono
  const renderAbonoModal = () => {
    if (!showAbonoModal) return null;

    const primerPago = pagosGenerados[0];
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

        {/* Modal */}
        <div className="relative bg-white dark:bg-dark-card rounded-2xl shadow-xl border border-neutral-200 dark:border-dark-border max-w-md w-full max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="px-5 py-4 flex items-center justify-between border-b border-neutral-200 dark:border-dark-border">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-green-600 shadow-md shadow-green-500/30">
                <FaCheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                  Matrícula Creada
                </h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  {pagosGenerados.length} pago(s) generado(s)
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-5 space-y-4 overflow-y-auto flex-1">
            {/* Resumen */}
            <div className="p-3 bg-neutral-50 dark:bg-dark-hover rounded-xl border border-neutral-200 dark:border-dark-border">
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-600 dark:text-neutral-400">Primer pago:</span>
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                  {formatCurrency(primerPago?.total || 0, selectedPlan?.moneda?.simbolo)}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Monto del Abono
                </label>
                <input
                  type="number"
                  value={montoAbono || ''}
                  onChange={(e) => setMontoAbono(parseFloat(e.target.value) || 0)}
                  max={primerPago?.total}
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className="w-full px-3 py-2.5 border-2 border-neutral-200 dark:border-dark-border rounded-xl bg-white dark:bg-dark-bg text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-500 text-lg font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Método de Pago
                  </label>
                  <select
                    value={metodoPago}
                    onChange={(e) => setMetodoPago(e.target.value)}
                    className="w-full px-3 py-2.5 border-2 border-neutral-200 dark:border-dark-border rounded-xl bg-white dark:bg-dark-bg text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-500"
                  >
                    <option value="efectivo">Efectivo</option>
                    <option value="transferencia">Transferencia</option>
                    <option value="tarjeta">Tarjeta</option>
                    <option value="sinpe">SINPE Móvil</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Referencia
                  </label>
                  <input
                    type="text"
                    value={referenciaAbono}
                    onChange={(e) => setReferenciaAbono(e.target.value)}
                    placeholder="Opcional"
                    className="w-full px-3 py-2.5 border-2 border-neutral-200 dark:border-dark-border rounded-xl bg-white dark:bg-dark-bg text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-500"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-5 py-4 border-t border-neutral-200 dark:border-dark-border">
            <div className="flex gap-3">
              <button
                onClick={handleSkipAbono}
                disabled={registrandoAbono}
                className="flex-1 px-4 py-2.5 border border-neutral-200 dark:border-dark-border bg-white dark:bg-dark-bg text-neutral-700 dark:text-neutral-300 font-semibold rounded-xl hover:bg-neutral-50 dark:hover:bg-dark-hover transition-all disabled:opacity-50"
              >
                Omitir
              </button>
              <button
                onClick={handleRegistrarAbono}
                disabled={registrandoAbono || montoAbono <= 0}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-neutral-700 to-neutral-800 dark:from-neutral-600 dark:to-neutral-700 text-white font-semibold rounded-xl hover:from-neutral-800 hover:to-neutral-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md"
              >
                {registrandoAbono ? (
                  <>
                    <CgSpinner className="w-5 h-5 animate-spin" />
                    Registrando...
                  </>
                ) : (
                  'Registrar Abono'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 dark:bg-dark-bg">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/matriculas')}
          disabled={loading}
          className="flex items-center gap-2 text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 mb-4 transition-colors disabled:opacity-50 font-medium"
        >
          <FaArrowLeft className="w-4 h-4" />
          <span className="text-sm">Volver a Matrículas</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="p-2 md:p-3 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/30">
            <FaClipboardList className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-neutral-900 dark:text-neutral-100">
              Nueva Matrícula
            </h1>
            <p className="text-xs md:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
              Registra una nueva matrícula de estudiante
            </p>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white dark:bg-dark-card rounded-xl border border-neutral-200 dark:border-dark-border p-4 md:p-5 mb-6 shadow-sm">
        <div className="flex items-center justify-between">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;

            return (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all ${
                      isActive
                        ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30'
                        : isCompleted
                          ? 'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg shadow-green-500/30'
                          : 'bg-neutral-100 dark:bg-dark-hover text-neutral-400'
                    }`}
                  >
                    {isCompleted ? <FaCheck className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <span className={`text-[10px] md:text-xs mt-2 font-medium text-center ${
                    isActive
                      ? 'text-orange-600 dark:text-orange-400'
                      : isCompleted
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-neutral-400'
                  }`}>
                    {step.title}
                  </span>
                </div>
                {index < STEPS.length - 1 && (
                  <div className={`flex-1 h-1 mx-2 md:mx-4 rounded-full ${
                    isCompleted ? 'bg-green-500' : 'bg-neutral-200 dark:bg-dark-hover'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-dark-card rounded-xl border border-neutral-200 dark:border-dark-border shadow-sm overflow-hidden">
        {error && (
          <div className="m-4 md:m-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <div className="p-4 md:p-6">
          {/* Step 1: Seleccionar Estudiante */}
          {currentStep === 1 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
                  Seleccionar Estudiante
                </h2>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Elige el estudiante que deseas matricular
                </p>
              </div>

              {/* Búsqueda */}
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  value={estudianteSearch}
                  onChange={(e) => setEstudianteSearch(e.target.value)}
                  placeholder="Buscar por nombre o apellido..."
                  className="w-full pl-11 pr-4 py-3 border border-neutral-300 dark:border-dark-border rounded-xl bg-white dark:bg-dark-bg text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>

              {/* Estudiante seleccionado */}
              {selectedEstudiante && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <UserAvatar
                        nombre={getEstudianteNombreCompleto(selectedEstudiante)}
                        pathFoto={selectedEstudiante.pathFoto}
                        size="md"
                      />
                      <div>
                        <p className="font-medium text-green-800 dark:text-green-300">
                          {getEstudianteNombreCompleto(selectedEstudiante)}
                        </p>
                        <p className="text-sm text-green-600 dark:text-green-400">
                          {selectedEstudiante.correo}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedEstudiante(null)}
                      className="text-sm text-red-600 hover:text-red-700 font-medium px-3 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      Cambiar
                    </button>
                  </div>
                </div>
              )}

              {/* Lista de estudiantes */}
              {!selectedEstudiante && (
                <>
                  {loadingEstudiantes ? (
                    <div className="flex justify-center py-12">
                      <CgSpinner className="w-8 h-8 text-orange-600 animate-spin" />
                    </div>
                  ) : (
                    <>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {estudiantes.length === 0 ? (
                          <div className="col-span-2 py-12 text-center text-neutral-500">
                            No se encontraron estudiantes
                          </div>
                        ) : (
                          estudiantes.map((estudiante) => (
                            <button
                              key={estudiante.id}
                              onClick={() => setSelectedEstudiante(estudiante)}
                              className="p-3 md:p-4 text-left rounded-xl border border-neutral-200 dark:border-dark-border hover:border-orange-300 dark:hover:border-orange-700 hover:bg-orange-50 dark:hover:bg-orange-900/10 transition-all flex items-center gap-3"
                            >
                              <UserAvatar
                                nombre={getEstudianteNombreCompleto(estudiante)}
                                pathFoto={estudiante.pathFoto}
                                size="md"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-neutral-900 dark:text-neutral-100 truncate">
                                  {getEstudianteNombreCompleto(estudiante)}
                                </p>
                                <p className="text-sm text-neutral-500 dark:text-neutral-400 truncate">
                                  {estudiante.correo}
                                </p>
                              </div>
                            </button>
                          ))
                        )}
                      </div>

                      {/* Paginación */}
                      {estudiantesTotalPages > 1 && (
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-neutral-200 dark:border-dark-border">
                          <span className="text-sm text-neutral-500 dark:text-neutral-400">
                            {estudiantesTotal} estudiantes encontrados
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => setEstudiantesPage(p => Math.max(1, p - 1))}
                              disabled={estudiantesPage === 1}
                              className="p-2.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-dark-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                              <FaChevronLeft className="w-4 h-4" />
                            </button>
                            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300 px-4 py-2 bg-neutral-100 dark:bg-dark-hover rounded-lg">
                              {estudiantesPage} / {estudiantesTotalPages}
                            </span>
                            <button
                              onClick={() => setEstudiantesPage(p => Math.min(estudiantesTotalPages, p + 1))}
                              disabled={estudiantesPage === estudiantesTotalPages}
                              className="p-2.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-dark-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                              <FaChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          )}

          {/* Step 2: Seleccionar Plan de Pago */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
                  Seleccionar Plan de Pago
                </h2>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Elige el plan de pago para esta matrícula
                </p>
              </div>

              {loadingPlanes ? (
                <div className="flex justify-center py-12">
                  <CgSpinner className="w-8 h-8 text-orange-600 animate-spin" />
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {planesPago.map((plan) => (
                    <button
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan)}
                      className={`p-4 md:p-5 text-left rounded-xl border-2 transition-all ${
                        selectedPlan?.id === plan.id
                          ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 shadow-lg shadow-orange-500/10'
                          : 'border-neutral-200 dark:border-dark-border hover:border-orange-300 dark:hover:border-orange-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                              selectedPlan?.id === plan.id
                                ? 'bg-orange-500 text-white'
                                : 'bg-neutral-100 dark:bg-dark-hover text-neutral-500'
                            }`}>
                              <FaCreditCard className="w-4 h-4" />
                            </div>
                            <p className="font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                              {plan.nombre}
                            </p>
                          </div>
                          <p className="text-sm text-neutral-500 dark:text-neutral-400 ml-10">
                            {getTipoPagoLabel(plan.tipoPago)}
                            {plan.numeroCuotas && ` • ${plan.numeroCuotas} cuotas`}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                            {formatCurrency(plan.total, plan.moneda?.simbolo)}
                          </p>
                          {plan.tipoPago === 3 && plan.totalFinal && (
                            <p className="text-xs text-neutral-500">
                              Total: {formatCurrency(plan.totalFinal, plan.moneda?.simbolo)}
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 3: Configuración */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
                  Configuración de Matrícula
                </h2>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Define las fechas y configuración adicional
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Fecha de Matrícula
                  </label>
                  <input
                    type="date"
                    value={fechaMatricula}
                    onChange={(e) => setFechaMatricula(e.target.value)}
                    className="w-full px-4 py-3 border border-neutral-300 dark:border-dark-border rounded-xl bg-white dark:bg-dark-bg text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Fecha Primer Pago
                  </label>
                  <input
                    type="date"
                    value={fechaProximoPago}
                    onChange={(e) => setFechaProximoPago(e.target.value)}
                    className="w-full px-4 py-3 border border-neutral-300 dark:border-dark-border rounded-xl bg-white dark:bg-dark-bg text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="p-5 bg-neutral-50 dark:bg-dark-hover rounded-xl border border-neutral-200 dark:border-dark-border">
                <label className="flex items-start gap-4 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={controlFinalizacion}
                    onChange={(e) => {
                      setControlFinalizacion(e.target.checked);
                      if (!e.target.checked) setSelectedPeriodo(null);
                    }}
                    className="mt-1 w-5 h-5 rounded border-neutral-300 text-orange-600 focus:ring-orange-500"
                  />
                  <div>
                    <p className="font-medium text-neutral-900 dark:text-neutral-100">
                      Control de Finalización
                    </p>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
                      Vincular la matrícula a un período lectivo específico
                    </p>
                  </div>
                </label>
              </div>

              {controlFinalizacion && (
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Período Lectivo
                  </label>
                  {loadingPeriodos ? (
                    <div className="flex justify-center py-6">
                      <CgSpinner className="w-6 h-6 text-orange-600 animate-spin" />
                    </div>
                  ) : (
                    <div className="grid gap-2 sm:grid-cols-2">
                      {periodosLectivos.map((periodo) => (
                        <button
                          key={periodo.id}
                          onClick={() => setSelectedPeriodo(periodo)}
                          className={`p-4 text-left rounded-xl border-2 transition-all ${
                            selectedPeriodo?.id === periodo.id
                              ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                              : 'border-neutral-200 dark:border-dark-border hover:border-orange-300'
                          }`}
                        >
                          <p className="font-medium text-neutral-900 dark:text-neutral-100">
                            {periodo.nombre}
                          </p>
                          <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            {formatDate(periodo.fechaInicio)} - {formatDate(periodo.fechaFin)}
                          </p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Step 4: Confirmar */}
          {currentStep === 4 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
                  Confirmar Matrícula
                </h2>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Revisa los datos antes de crear la matrícula
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {/* Estudiante */}
                <div className="p-5 bg-gradient-to-br from-indigo-50 to-indigo-100/50 dark:from-indigo-900/20 dark:to-indigo-800/10 rounded-xl border border-indigo-100 dark:border-indigo-900/30">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                      <FaUser className="w-4 h-4" />
                    </div>
                    <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">Estudiante</h3>
                  </div>
                  {selectedEstudiante && (
                    <div className="flex items-center gap-3">
                      <UserAvatar
                        nombre={getEstudianteNombreCompleto(selectedEstudiante)}
                        pathFoto={selectedEstudiante.pathFoto}
                        size="sm"
                      />
                      <div className="min-w-0">
                        <p className="font-medium text-neutral-800 dark:text-neutral-200 truncate text-sm">
                          {getEstudianteNombreCompleto(selectedEstudiante)}
                        </p>
                        <p className="text-xs text-neutral-500 truncate">
                          {selectedEstudiante.correo}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Plan de Pago */}
                <div className="p-5 bg-gradient-to-br from-rose-50 to-rose-100/50 dark:from-rose-900/20 dark:to-rose-800/10 rounded-xl border border-rose-100 dark:border-rose-900/30">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-rose-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-rose-500/30">
                      <FaCreditCard className="w-4 h-4" />
                    </div>
                    <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">Plan de Pago</h3>
                  </div>
                  <p className="font-medium text-neutral-800 dark:text-neutral-200 text-sm">
                    {selectedPlan?.nombre}
                  </p>
                  <p className="text-xs text-neutral-500 mt-1">
                    {getTipoPagoLabel(selectedPlan?.tipoPago || 1)} - {formatCurrency(selectedPlan?.total || 0, selectedPlan?.moneda?.simbolo)}
                  </p>
                </div>

                {/* Configuración */}
                <div className="p-5 bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-900/20 dark:to-emerald-800/10 rounded-xl border border-emerald-100 dark:border-emerald-900/30 sm:col-span-2 lg:col-span-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
                      <FaCalendarAlt className="w-4 h-4" />
                    </div>
                    <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">Fechas</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-xs text-neutral-500">Matrícula</p>
                      <p className="font-medium text-neutral-800 dark:text-neutral-200">{formatDate(fechaMatricula)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500">Primer Pago</p>
                      <p className="font-medium text-neutral-800 dark:text-neutral-200">{formatDate(fechaProximoPago)}</p>
                    </div>
                    {controlFinalizacion && selectedPeriodo && (
                      <div className="col-span-2 mt-1">
                        <p className="text-xs text-neutral-500">Período</p>
                        <p className="font-medium text-neutral-800 dark:text-neutral-200">{selectedPeriodo.nombre}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-between gap-3 p-4 md:p-6 border-t border-neutral-200 dark:border-dark-border bg-neutral-50 dark:bg-dark-hover">
          <button
            onClick={handlePrev}
            disabled={currentStep === 1 || loading}
            className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-medium transition-colors order-2 sm:order-1 ${
              currentStep === 1 || loading
                ? 'text-neutral-300 dark:text-neutral-600 cursor-not-allowed'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-dark-border border border-neutral-300 dark:border-dark-border'
            }`}
          >
            <FaArrowLeft className="w-4 h-4" />
            Anterior
          </button>

          {currentStep < 4 ? (
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all order-1 sm:order-2 ${
                canProceed()
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg shadow-orange-500/25'
                  : 'bg-neutral-200 dark:bg-dark-border text-neutral-400 cursor-not-allowed'
              }`}
            >
              Siguiente
              <FaArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-medium transition-all shadow-lg shadow-green-500/25 disabled:opacity-50 order-1 sm:order-2"
            >
              {loading ? (
                <>
                  <CgSpinner className="w-5 h-5 animate-spin" />
                  {creatingMatricula ? 'Creando matrícula...' : generatingPagos ? 'Generando pagos...' : 'Procesando...'}
                </>
              ) : (
                <>
                  <FaCheck className="w-4 h-4" />
                  Crear Matrícula
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Modal de Abono */}
      {renderAbonoModal()}
    </div>
  );
};
