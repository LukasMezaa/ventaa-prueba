import { Plus, CheckCircle, XCircle, Clock, FileText, X, Calendar, Upload, Wrench } from 'lucide-react';
import { useState, useEffect } from 'react';
// import { mockTickets } from '../lib/mockData'; // Ocultado - descomentar si se necesita restaurar tickets mock
import { Ticket as TicketType, mockPropertyOwners } from '../lib/mockData';
import { useAuth } from '../contexts/AuthContext';

export default function TicketsPanel() {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<TicketType | null>(null);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [createdTicketNumber, setCreatedTicketNumber] = useState<string>('');
  const [appointmentDate, setAppointmentDate] = useState<string>('');
  const [appointmentShift, setAppointmentShift] = useState<string>('');
  const [appointmentTime, setAppointmentTime] = useState<string>('');
  const [selectedTechnician, setSelectedTechnician] = useState<string>('');
  const [editableArea, setEditableArea] = useState<string>(''); // Área editable por admin
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string | null>(null); // Filtro de estado para propietarios
  
  // Cargar tickets desde localStorage o usar array vacío
  const loadTickets = (): TicketType[] => {
    const stored = localStorage.getItem('tickets');
    if (stored) {
      try {
        return JSON.parse(stored) as TicketType[];
      } catch {
        localStorage.removeItem('tickets');
      }
    }
    // Si no hay localStorage, inicializar con array vacío (mockTickets están ocultos)
    // Para restaurar tickets mock, cambiar [] por mockTickets
    const emptyTickets: TicketType[] = [];
    localStorage.setItem('tickets', JSON.stringify(emptyTickets));
    return emptyTickets;
  };
  
  const [tickets, setTickets] = useState<TicketType[]>(loadTickets());
  
  // Sincronizar con localStorage cuando se actualiza el estado
  useEffect(() => {
    localStorage.setItem('tickets', JSON.stringify(tickets));
    // Disparar evento personalizado para notificar a TrazabilityPanel
    window.dispatchEvent(new CustomEvent('ticketsUpdated', { detail: tickets }));
  }, [tickets]);

  // Escuchar eventos de actualización de tickets desde otros componentes (como TrackingPanel)
  useEffect(() => {
    const handleTicketsUpdate = (event: CustomEvent) => {
      const updatedTickets = event.detail;
      // Solo actualizar si los tickets realmente cambiaron (evitar bucles infinitos)
      setTickets(prevTickets => {
        // Comparar si hay cambios en las fechas de estado
        const hasChanges = updatedTickets.some((updatedTicket: TicketType) => {
          const prevTicket = prevTickets.find(t => t.id === updatedTicket.id);
          if (!prevTicket) return true;
          return prevTicket.statusChangedToAprobado !== updatedTicket.statusChangedToAprobado ||
                 prevTicket.statusChangedToEjecucion !== updatedTicket.statusChangedToEjecucion ||
                 prevTicket.statusChangedToTerminada !== updatedTicket.statusChangedToTerminada ||
                 prevTicket.status !== updatedTicket.status;
        });
        
        if (hasChanges) {
          // Si hay un ticket seleccionado, actualizarlo también
          if (selectedTicket) {
            const updatedSelectedTicket = updatedTickets.find((t: TicketType) => t.id === selectedTicket.id);
            if (updatedSelectedTicket) {
              setSelectedTicket(updatedSelectedTicket);
            }
          }
          return updatedTickets;
        }
        return prevTickets;
      });
    };

    window.addEventListener('ticketsUpdated', handleTicketsUpdate as EventListener);
    
    return () => {
      window.removeEventListener('ticketsUpdated', handleTicketsUpdate as EventListener);
    };
  }, [selectedTicket]);
  const [formData, setFormData] = useState({
    description: '',
    area: '',
    preferredShift: '', // 'AM' o 'PM'
    // Campos para administrador (creación manual)
    ownerName: '',
    ownerEmail: '',
    ownerRut: '',
    phone: '',
    tower: '',
    municipalNumber: '',
  });

  const isAdmin = user?.role === 'admin';
  const isTecnico = user?.role === 'tecnico';
  const isPropietario = user?.role === 'propietario';
  
  // Mapeo de técnicos a sus áreas de especialización
  const technicianAreas: { [key: string]: string[] } = {
    '11111111-1': ['Carpintería'], // Técnico Carpintería
    '22222222-2': ['Gasfitería'], // Técnico Gasfitería
    '33333333-3': [], // Técnico General - sin restricciones de área (array vacío significa todas las áreas)
  };
  
  // Verificar si es técnico general
  const isGeneralTechnician = (): boolean => {
    if (isTecnico && user?.rut) {
      const normalizeRut = (rut: string) => {
        return rut.replace(/\./g, '').replace(/\s/g, '').toLowerCase().trim();
      };
      const userRut = normalizeRut(user.rut);
      return userRut === '33333333-3';
    }
    return false;
  };
  
  // Obtener área del técnico actual
  const getTechnicianArea = (): string[] | null => {
    if (isTecnico && user?.rut) {
      const normalizeRut = (rut: string) => {
        return rut.replace(/\./g, '').replace(/\s/g, '').toLowerCase().trim();
      };
      const userRut = normalizeRut(user.rut);
      // Si es técnico general, retornar null para que vea todos los tickets
      if (userRut === '33333333-3') {
        return null;
      }
      return technicianAreas[userRut] || null;
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar campos requeridos
    if (!formData.description.trim()) {
      alert('Por favor, ingresa una descripción del problema');
      return;
    }
    
    if (!formData.area) {
      alert('Por favor, selecciona un área');
      return;
    }
    
    if (!formData.preferredShift) {
      alert('Por favor, selecciona una jornada de preferencia');
      return;
    }
    
    // Validar campos requeridos para administrador
    if (isAdmin) {
      if (!formData.ownerName.trim()) {
        alert('Por favor, ingresa el nombre del propietario');
        return;
      }
      if (!formData.phone.trim()) {
        alert('Por favor, ingresa el teléfono');
        return;
      }
      if (!formData.tower.trim()) {
        alert('Por favor, ingresa la torre');
        return;
      }
      if (!formData.municipalNumber.trim()) {
        alert('Por favor, ingresa el número municipal');
        return;
      }
    }
    
    // Convertir foto a base64 si existe
    let photoBase64: string | undefined = undefined;
    if (selectedPhoto && photoPreview) {
      photoBase64 = photoPreview; // photoPreview ya es base64
    }
    
    // Si es propietario, buscar su información completa en mockPropertyOwners
    let ownerInfo = {
      name: user?.name || 'Propietario',
      email: user?.email || '',
      rut: user?.rut || '',
      phone: '+56912345678',
      tower: 'Torre A',
      municipalNumber: '101',
    };
    
    if (!isAdmin && user?.rut) {
      // Función para normalizar RUT (eliminar puntos, espacios y convertir a minúsculas)
      const normalizeRut = (rut: string) => {
        return rut.replace(/\./g, '').replace(/\s/g, '').toLowerCase().trim();
      };
      
      const normalizedUserRut = normalizeRut(user.rut);
      
      // Buscar información del propietario por RUT
      const propertyOwner = mockPropertyOwners.find(po => {
        const normalizedOwnerRut = normalizeRut(po.rut);
        return normalizedOwnerRut === normalizedUserRut;
      });
      
      if (propertyOwner) {
        ownerInfo = {
          name: propertyOwner.name,
          email: propertyOwner.email || user.email,
          rut: propertyOwner.rut,
          phone: propertyOwner.phone,
          tower: propertyOwner.tower,
          municipalNumber: propertyOwner.municipal_number,
        };
      }
    }
    
    const ticketBase: TicketType = {
      id: String(tickets.length + 1),
      ticketNumber: `TKT-2024-${String(tickets.length + 1).padStart(3, '0')}`,
      ownerName: isAdmin ? formData.ownerName : ownerInfo.name,
      ownerEmail: isAdmin ? formData.ownerEmail : ownerInfo.email,
      ownerRut: isAdmin ? formData.ownerRut : ownerInfo.rut,
      phone: isAdmin ? formData.phone : ownerInfo.phone,
      tower: isAdmin ? formData.tower : ownerInfo.tower,
      municipalNumber: isAdmin ? formData.municipalNumber : ownerInfo.municipalNumber,
      description: formData.description.trim(),
      area: formData.area,
      scheduledDate: null,
      status: 'Pendiente',
      approvedBy: null,
      approvedDate: null,
      createdDate: new Date().toISOString(),
      orderNumber: null,
    };

    const newTicket: TicketType = {
      ...ticketBase,
      ...(formData.preferredShift ? { preferredShift: formData.preferredShift } : {}),
      ...(photoBase64 ? { photo: photoBase64 } : {}),
    };
    
    try {
      setTickets([...tickets, newTicket]);
      setShowModal(false);
      setFormData({ 
        description: '', 
        area: '', 
        preferredShift: '',
        ownerName: '',
        ownerEmail: '',
        ownerRut: '',
        phone: '',
        tower: '',
        municipalNumber: '',
      });
      setSelectedPhoto(null);
      setPhotoPreview(null);
      
      // Mostrar notificación de éxito
      setCreatedTicketNumber(newTicket.ticketNumber);
      setShowSuccessNotification(true);
      
      // Ocultar notificación después de 5 segundos
      setTimeout(() => {
        setShowSuccessNotification(false);
      }, 5000);
    } catch (error) {
      console.error('Error al crear el ticket:', error);
      alert('Hubo un error al crear el ticket. Por favor intenta de nuevo.');
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar que sea una imagen
      if (file.type.startsWith('image/')) {
        setSelectedPhoto(file);
        // Crear preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setPhotoPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        alert('Por favor, selecciona un archivo de imagen válido');
      }
    }
  };

  const handleRemovePhoto = () => {
    setSelectedPhoto(null);
    setPhotoPreview(null);
    // Resetear el input file
    const fileInput = document.getElementById('photo-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleApprove = (ticketId: string, approve: boolean) => {
    if (approve && (!appointmentDate || !appointmentShift || !appointmentTime)) {
      alert('Debes seleccionar una fecha, jornada y hora antes de aprobar');
      return;
    }

    if (approve && !editableArea) {
      alert('Debes seleccionar un área antes de aprobar');
      return;
    }

    if (approve && !selectedTechnician) {
      alert('Debes seleccionar un técnico antes de aprobar');
      return;
    }

    let approvedTicket: TicketType | null = null;

    const updatedTickets = tickets.map((ticket) => {
      if (ticket.id !== ticketId) {
        return ticket;
      }

      const now = new Date().toISOString();
      const updates: Partial<TicketType> = {
        status: approve ? 'Aprobado' : 'Rechazado',
        approvedBy: approve ? user?.email ?? '' : null,
        approvedDate: approve ? now : null,
        orderNumber: approve ? `ORD-2024-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}` : null,
        ...(approve ? {} : { scheduledDate: null }),
      };

      if (approve) {
        if (editableArea.trim()) {
          updates.area = editableArea;
        }

        if (selectedTechnician) {
          updates.assignedTechnician = selectedTechnician;
        }

        if (appointmentDate && appointmentTime) {
          updates.scheduledDate = `${appointmentDate}T${appointmentTime}:00`;
        }

        if (appointmentShift) {
          updates.preferredShift = appointmentShift;
        }

        if (ticket.status !== 'Aprobado') {
          updates.statusChangedToAprobado = now;
        }
      }

      const updatedTicket: TicketType = {
        ...ticket,
        ...updates,
      };

      if (approve) {
        approvedTicket = updatedTicket;
      }

      return updatedTicket;
    });

    setTickets(updatedTickets);

    // Si se aprobó el ticket, crear un registro en Seguimiento de Trabajos
    if (approve) {
      if (hasOrderNumber(approvedTicket)) {
        const ticketForWork = approvedTicket as TicketType & { orderNumber: string };
      const toDateOnly = (value: string) => value.slice(0, 10);
      const workStartDate =
        ticketForWork.scheduledDate?.slice(0, 10) ??
        (ticketForWork.approvedDate ? toDateOnly(ticketForWork.approvedDate) : new Date().toISOString().slice(0, 10));

      const baseWork: WorkTrackingRecord = {
        id: `work-${ticketForWork.id}`,
        orderNumber: ticketForWork.orderNumber,
        ownerName: ticketForWork.ownerName,
        property: `${ticketForWork.tower} - ${ticketForWork.municipalNumber}`,
        area: (editableArea && editableArea.trim()) ? editableArea : ticketForWork.area,
        status: 'Pendiente de Visita',
        workDetails: [],
        startDate: workStartDate,
        updateDate: workStartDate,
      };

      const newWork: WorkTrackingRecord = ticketForWork.assignedTechnician
        ? { ...baseWork, assignedTechnician: ticketForWork.assignedTechnician }
        : baseWork;

      const existingWorks = localStorage.getItem('workTracking');
      let works: WorkTrackingRecord[] = [];
      if (existingWorks) {
        try {
          const parsed = JSON.parse(existingWorks) as unknown;
          if (Array.isArray(parsed)) {
            works = parsed.filter(isWorkTrackingRecord);
          }
        } catch {
          works = [];
        }
      }

      const exists = works.some((w) => w.orderNumber === newWork.orderNumber);
      if (!exists) {
        works.push(newWork);
        localStorage.setItem('workTracking', JSON.stringify(works));
        window.dispatchEvent(new CustomEvent('newWorkCreated', { detail: newWork }));
      }
      }
    }

    setSelectedTicket(null);
    setAppointmentDate('');
    setAppointmentShift('');
    setAppointmentTime('');
    setSelectedTechnician('');
    setEditableArea('');
  };

  const statusConfig: Record<string, { color: string; icon: any; bgColor: string; textColor: string; borderColor: string }> = {
    'Pendiente': {
      color: 'text-yellow-800',
      icon: Clock,
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-800',
      borderColor: 'border-yellow-300',
    },
    'Aprobado': {
      color: 'text-green-800',
      icon: CheckCircle,
      bgColor: 'bg-green-100',
      textColor: 'text-green-800',
      borderColor: 'border-green-300',
    },
    'Rechazado': {
      color: 'text-red-800',
      icon: XCircle,
      bgColor: 'bg-red-100',
      textColor: 'text-red-800',
      borderColor: 'border-red-300',
    },
    'Finalizado': {
      color: 'text-purple-800',
      icon: CheckCircle,
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-800',
      borderColor: 'border-purple-300',
    },
  };

const fallbackStatusConfig = {
  color: 'text-gray-700',
  icon: Clock,
  bgColor: 'bg-gray-100',
  textColor: 'text-gray-700',
  borderColor: 'border-gray-200',
};

const getStatusConfig = (status: string) => statusConfig[status] ?? fallbackStatusConfig;

  // Filtrar tickets según el rol y ordenarlos por fecha de creación (más reciente primero)
  const filteredTickets = (() => {
    let filtered: TicketType[] = [];
    
    if (isAdmin) {
      // Admin ve todos los tickets
      filtered = tickets;
    } else if (isTecnico && user?.rut) {
      // Técnico solo ve tickets asignados a él y de su área (excepto técnico general que ve todos)
      const normalizeRut = (rut: string) => {
        return rut.replace(/\./g, '').replace(/\s/g, '').toLowerCase().trim();
      };
      const userRut = normalizeRut(user.rut);
      const technicianArea = getTechnicianArea();
      const isGeneral = isGeneralTechnician();
      
      filtered = tickets.filter(t => {
        // Verificar que el ticket tenga técnico asignado
        if (!t.assignedTechnician) return false;
        
        // Verificar que el técnico asignado sea el mismo que el logueado
        const ticketRut = normalizeRut(t.assignedTechnician);
        if (ticketRut !== userRut) return false;
        
        // Si es técnico general, no filtrar por área (ve todos los tickets asignados a él)
        if (isGeneral) {
          return true;
        }
        
        // Verificar que el área del ticket coincida con la especialidad del técnico
        if (technicianArea && !technicianArea.includes(t.area)) {
          return false;
        }
        
        return true;
      });
    } else {
      // Propietario solo ve sus tickets (por RUT o email)
      filtered = tickets.filter(t => {
        // Comparar por RUT si está disponible (más confiable)
        if (user?.rut && t.ownerRut) {
          const normalizeRut = (rut: string) => {
            return rut.replace(/\./g, '').replace(/\s/g, '').toLowerCase().trim();
          };
          return normalizeRut(t.ownerRut) === normalizeRut(user.rut);
        }
        // Fallback: comparar por email si no hay RUT
        return t.ownerEmail === user?.email;
      });
      
      // Aplicar filtro de estado si está seleccionado (solo para propietarios)
      if (selectedStatusFilter) {
        filtered = filtered.filter(t => t.status === selectedStatusFilter);
      }
    }
    
    // Aplicar filtro de estado si está seleccionado (para administradores)
    if (isAdmin && selectedStatusFilter) {
      filtered = filtered.filter(t => t.status === selectedStatusFilter);
    }
    
    // Ordenar por fecha de creación descendente (más reciente primero)
    return filtered.sort((a, b) => {
      const dateA = new Date(a.createdDate).getTime();
      const dateB = new Date(b.createdDate).getTime();
      return dateB - dateA; // Orden descendente
    });
  })();

type WorkTrackingRecord = {
  id: string;
  orderNumber: string;
  ownerName: string;
  property: string;
  area: string;
  status: string;
  workDetails: Array<{ text: string; image?: string; date: string }>;
  startDate: string;
  updateDate: string;
  assignedTechnician?: string;
};

const isWorkTrackingRecord = (value: unknown): value is WorkTrackingRecord => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const record = value as Partial<WorkTrackingRecord>;

  return (
    typeof record.id === 'string' &&
    typeof record.orderNumber === 'string' &&
    typeof record.ownerName === 'string' &&
    typeof record.property === 'string' &&
    typeof record.area === 'string' &&
    typeof record.status === 'string' &&
    typeof record.startDate === 'string' &&
    typeof record.updateDate === 'string' &&
    Array.isArray(record.workDetails)
  );
};

const hasOrderNumber = (
  ticket: TicketType | null
): ticket is TicketType & { orderNumber: string } => {
  return !!ticket && typeof ticket.orderNumber === 'string' && ticket.orderNumber.length > 0;
};

  return (
    <div className="space-y-6">
      {/* Estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Tickets</p>
              <p className="text-3xl font-bold text-gray-800">{filteredTickets.length}</p>
            </div>
            <FileText className="w-10 h-10 text-[#2B5F7F] opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pendientes</p>
              <p className="text-3xl font-bold text-yellow-600">
                {filteredTickets.filter((t) => t.status === 'Pendiente').length}
              </p>
            </div>
            <Clock className="w-10 h-10 text-yellow-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Aprobados</p>
              <p className="text-3xl font-bold text-green-600">
                {filteredTickets.filter((t) => t.status === 'Aprobado').length}
              </p>
            </div>
            <CheckCircle className="w-10 h-10 text-green-500 opacity-20" />
          </div>
        </div>
      </div>

      {/* Panel de Tickets */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <h3 className="text-lg font-semibold text-gray-800">
            {isAdmin ? 'Tickets de Propietarios' : isTecnico ? 'Tickets' : 'Mis Tickets'}
          </h3>
          {!isTecnico && (
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-[#2B5F7F] text-white rounded-lg hover:bg-[#1a4968] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Nuevo Ticket
            </button>
          )}
        </div>

        {/* Filtro de estado para propietarios y administradores */}
        {(isPropietario || isAdmin) && (
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-gray-700 mr-2">Filtrar por estado:</span>
              <button
                onClick={() => setSelectedStatusFilter(null)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  selectedStatusFilter === null
                    ? 'bg-gray-800 text-white shadow-md'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                }`}
              >
                Todos
              </button>
              {Object.entries(statusConfig).map(([status, config]) => {
                const Icon = config.icon;
                const count = tickets.filter(t => {
                  // Para propietarios, filtrar primero por propietario
                  if (isPropietario) {
                    if (user?.rut && t.ownerRut) {
                      const normalizeRut = (rut: string) => {
                        return rut.replace(/\./g, '').replace(/\s/g, '').toLowerCase().trim();
                      };
                      if (normalizeRut(t.ownerRut) !== normalizeRut(user.rut)) return false;
                    } else if (t.ownerEmail !== user?.email) {
                      return false;
                    }
                  }
                  // Para administradores, contar todos los tickets con ese estado
                  return t.status === status;
                }).length;
                return (
                  <button
                    key={status}
                    onClick={() => setSelectedStatusFilter(status === selectedStatusFilter ? null : status)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${
                      selectedStatusFilter === status
                        ? `${config.bgColor} ${config.textColor} ${config.borderColor} shadow-md`
                        : `bg-white ${config.textColor} border-gray-300 ${
                            status === 'Pendiente' ? 'hover:bg-yellow-50' :
                            status === 'Aprobado' ? 'hover:bg-green-50' :
                            status === 'Rechazado' ? 'hover:bg-red-50' :
                            'hover:bg-purple-50'
                          }`
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{status}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                      selectedStatusFilter === status
                        ? `${config.textColor} bg-white/50`
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">N° Ticket</th>
                {(isAdmin || isTecnico) && <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Propietario</th>}
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Descripción</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Área</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Fecha de Creación</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Preferencia</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Estado</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTickets.map((ticket) => {
                const config = getStatusConfig(ticket.status);
                const Icon = config.icon;
                return (
                  <tr key={ticket.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{ticket.ticketNumber}</td>
                    {(isAdmin || isTecnico) && <td className="px-4 py-3 text-sm text-gray-700">{ticket.ownerName}</td>}
                    <td className="px-4 py-3 text-sm text-gray-700 max-w-xs truncate">{ticket.description}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{ticket.area}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {new Date(ticket.createdDate).toLocaleDateString('es-CL')}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {ticket.preferredShift || '-'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${config.bgColor} ${config.textColor}`}>
                        <Icon className="w-3 h-3" />
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => {
                          setSelectedTicket(ticket);
                          // Inicializar campos de agendamiento
                          setAppointmentDate('');
                          setAppointmentShift(ticket.preferredShift || '');
                          setAppointmentTime('');
                          setSelectedTechnician('');
                          setEditableArea(ticket.area); // Inicializar área editable con el área actual
                        }}
                        className="px-3 py-1 text-sm bg-[#2B5F7F] text-white rounded-lg hover:bg-[#1a4968] transition-colors flex items-center gap-1"
                      >
                        {isAdmin && !isTecnico ? (
                          <>
                            <Calendar className="w-4 h-4" />
                            Agenda/detalle
                          </>
                        ) : (
                          <>
                            <FileText className="w-4 h-4" />
                            Ver Detalle
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Nueva Solicitud (Propietario) */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => {
          setShowModal(false);
          setSelectedPhoto(null);
          setPhotoPreview(null);
          setFormData({ 
            description: '', 
            area: '', 
            preferredShift: '',
            ownerName: '',
            ownerEmail: '',
            ownerRut: '',
            phone: '',
            tower: '',
            municipalNumber: '',
          });
        }}>
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            {/* Header fijo */}
            <div className="p-6 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
              <h3 className="text-xl font-bold text-gray-800">Nuevo Ticket</h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedPhoto(null);
                  setPhotoPreview(null);
                  setFormData({ 
                    description: '', 
                    area: '', 
                    preferredShift: '',
                    ownerName: '',
                    ownerEmail: '',
                    ownerRut: '',
                    phone: '',
                    tower: '',
                    municipalNumber: '',
                  });
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Formulario con contenido scrolleable */}
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
              {/* Contenido scrolleable */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {/* Campos de propietario solo para administrador */}
                {isAdmin && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Propietario *</label>
                        <input
                          type="text"
                          value={formData.ownerName}
                          onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B5F7F] focus:border-transparent"
                          placeholder="Ej: Juan Pérez"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">RUT del Propietario</label>
                        <input
                          type="text"
                          value={formData.ownerRut}
                          onChange={(e) => setFormData({ ...formData, ownerRut: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B5F7F] focus:border-transparent"
                          placeholder="Ej: 12345678-9 (opcional)"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email del Propietario</label>
                        <input
                          type="email"
                          value={formData.ownerEmail}
                          onChange={(e) => setFormData({ ...formData, ownerEmail: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B5F7F] focus:border-transparent"
                          placeholder="ejemplo@email.com (opcional)"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono *</label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B5F7F] focus:border-transparent"
                          placeholder="+56912345678"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Torre *</label>
                        <input
                          type="text"
                          value={formData.tower}
                          onChange={(e) => setFormData({ ...formData, tower: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B5F7F] focus:border-transparent"
                          placeholder="Ej: Torre 1"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">N° Municipal *</label>
                      <input
                        type="text"
                        value={formData.municipalNumber}
                        onChange={(e) => setFormData({ ...formData, municipalNumber: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B5F7F] focus:border-transparent"
                        placeholder="Ej: 101"
                        required
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descripción del Problema</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B5F7F] focus:border-transparent"
                    placeholder="Describe el problema que necesitas resolver..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Área</label>
                  <select
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B5F7F] focus:border-transparent"
                    required
                  >
                    <option value="">Seleccionar...</option>
                    <option value="Plomería">Plomería</option>
                    <option value="Electricidad">Electricidad</option>
                    <option value="Carpintería">Carpintería</option>
                    <option value="Pintura">Pintura</option>
                    <option value="Gasfitería">Gasfitería</option>
                    <option value="Albañilería">Albañilería</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Adjuntar Foto</label>
                  <div className="space-y-2">
                    {!photoPreview ? (
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600">Haz clic para seleccionar una foto</p>
                          <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF hasta 10MB</p>
                        </div>
                        <input
                          id="photo-upload"
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoChange}
                          className="hidden"
                        />
                      </label>
                    ) : (
                      <div className="relative">
                        <div className="border-2 border-gray-300 rounded-lg p-2">
                          <img
                            src={photoPreview}
                            alt="Vista previa"
                            className="w-full h-48 object-cover rounded-lg"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleRemovePhoto}
                          className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Jornada Preferencial Visita Tecnico</label>
                  <div className="flex gap-3 mt-2">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, preferredShift: 'AM' })}
                      className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors ${
                        formData.preferredShift === 'AM'
                          ? 'bg-[#2B5F7F] text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      AM
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, preferredShift: 'PM' })}
                      className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors ${
                        formData.preferredShift === 'PM'
                          ? 'bg-[#2B5F7F] text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      PM
                    </button>
                  </div>
                  {!formData.preferredShift && (
                    <p className="text-xs text-red-600 mt-1">Debes seleccionar una jornada</p>
                  )}
                </div>
              </div>

              {/* Botones fijos en la parte inferior */}
              <div className="p-6 border-t border-gray-200 flex gap-3 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setSelectedPhoto(null);
                    setPhotoPreview(null);
                    setFormData({ 
                      description: '', 
                      area: '', 
                      preferredShift: '',
                      ownerName: '',
                      ownerEmail: '',
                      ownerRut: '',
                      phone: '',
                      tower: '',
                      municipalNumber: '',
                    });
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!formData.preferredShift}
                  className="flex-1 px-4 py-2 bg-[#2B5F7F] text-white rounded-lg hover:bg-[#1a4968] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Crear Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Detalle y Aprobación (Admin) */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => {
          setSelectedTicket(null);
          setAppointmentDate('');
          setAppointmentShift('');
        }}>
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
              <h3 className="text-xl font-bold text-gray-800">
                {isAdmin && selectedTicket.status === 'Pendiente' ? 'Agendar y Aprobar Ticket' : 'Detalle del Ticket'}
              </h3>
              <button
                onClick={() => {
                  setSelectedTicket(null);
                  setAppointmentDate('');
                  setAppointmentShift('');
                  setAppointmentTime('');
                  setSelectedTechnician('');
                  setEditableArea('');
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Información del Propietario */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-800 mb-3">Información del Propietario</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-0.5">Nombre</label>
                    <p className="text-sm text-gray-900 font-medium">{selectedTicket.ownerName}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-0.5">RUT</label>
                    <p className="text-sm text-gray-900">{selectedTicket.ownerRut || 'No disponible'}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-0.5">Email</label>
                    <p className="text-sm text-gray-900">{selectedTicket.ownerEmail || 'No disponible'}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-0.5">Teléfono</label>
                    <p className="text-sm text-gray-900">{selectedTicket.phone}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-0.5">Propiedad</label>
                    <p className="text-sm text-gray-900">{selectedTicket.tower} - Dep. {selectedTicket.municipalNumber}</p>
                  </div>
                </div>
              </div>

              {/* Información del Ticket */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">N° Ticket</label>
                  <p className="text-gray-900 font-semibold">{selectedTicket.ticketNumber}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Estado</label>
                  {(() => {
                    const config = getStatusConfig(selectedTicket.status);
                    const Icon = config.icon;
                    return (
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${config.bgColor} ${config.textColor}`}>
                        <Icon className="w-4 h-4" />
                        {selectedTicket.status}
                      </span>
                    );
                  })()}
                </div>
                <div>
                  {isAdmin && selectedTicket.status === 'Pendiente' && !isTecnico ? (
                    <>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Área *</label>
                      <select
                        value={editableArea}
                        onChange={(e) => setEditableArea(e.target.value)}
                        className="w-full px-4 py-2 border-2 border-[#2B5F7F] rounded-lg focus:ring-2 focus:ring-[#2B5F7F] focus:border-transparent outline-none bg-white"
                        required
                      >
                        <option value="">Seleccionar...</option>
                        <option value="Plomería">Plomería</option>
                        <option value="Electricidad">Electricidad</option>
                        <option value="Carpintería">Carpintería</option>
                        <option value="Pintura">Pintura</option>
                        <option value="Gasfitería">Gasfitería</option>
                        <option value="Albañilería">Albañilería</option>
                      </select>
                      <p className="text-xs text-gray-500 mt-1">Puedes corregir el área si el propietario la seleccionó incorrectamente</p>
                    </>
                  ) : (
                    <>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Área</label>
                      <p className="text-gray-900">{selectedTicket.area}</p>
                    </>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Fecha de Creación</label>
                  <p className="text-gray-900">{new Date(selectedTicket.createdDate).toLocaleString('es-CL')}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Descripción del Problema</label>
                <p className="text-gray-900 bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">{selectedTicket.description}</p>
              </div>

              {selectedTicket.preferredShift && (
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Jornada de Preferencia del Propietario</label>
                  <p className="text-gray-900 font-semibold">{selectedTicket.preferredShift}</p>
                </div>
              )}

              {selectedTicket.photo && (
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Foto Adjunta por el Propietario</label>
                  <div className="border-2 border-gray-300 rounded-lg p-2 bg-gray-50">
                    <img
                      src={selectedTicket.photo}
                      alt="Foto del problema adjuntada por el propietario"
                      className="w-full max-h-96 object-contain rounded-lg"
                    />
                  </div>
                </div>
              )}

              {/* Historial de Cambios de Estado */}
              {(selectedTicket.statusChangedToAprobado || selectedTicket.statusChangedToEjecucion || selectedTicket.statusChangedToTerminada) && (
                <div className="pt-4 border-t border-gray-200">
                  <label className="block text-sm font-medium text-gray-600 mb-3">Historial de Cambios de Estado</label>
                  <div className="space-y-2">
                    {selectedTicket.statusChangedToTerminada && (
                      <div className="flex items-center gap-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                        <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center text-xs font-semibold flex-shrink-0">
                          <CheckCircle className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-800">Cambió a "Terminada"</p>
                          <p className="text-xs text-gray-600">{new Date(selectedTicket.statusChangedToTerminada).toLocaleString('es-CL')}</p>
                        </div>
                      </div>
                    )}
                    {selectedTicket.statusChangedToEjecucion && (
                      <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-semibold flex-shrink-0">
                          <Wrench className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-800">Cambió a "En Ejecución"</p>
                          <p className="text-xs text-gray-600">{new Date(selectedTicket.statusChangedToEjecucion).toLocaleString('es-CL')}</p>
                        </div>
                      </div>
                    )}
                    {selectedTicket.statusChangedToAprobado && (
                      <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-semibold flex-shrink-0">
                          <CheckCircle className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-800">Cambió a "Aprobado"</p>
                          <p className="text-xs text-gray-600">{new Date(selectedTicket.statusChangedToAprobado).toLocaleString('es-CL')}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {isAdmin && selectedTicket.status === 'Pendiente' && !isTecnico && (
                <div className="pt-4 border-t border-gray-200 space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-3">Agendar Cita (coordinada con el propietario):</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de la Cita *</label>
                        <input
                          type="date"
                          value={appointmentDate}
                          onChange={(e) => setAppointmentDate(e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B5F7F] focus:border-transparent outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Jornada *</label>
                        <div className="flex gap-3 mt-2">
                          <button
                            type="button"
                            onClick={() => {
                              setAppointmentShift('AM');
                              setAppointmentTime(''); // Resetear hora al cambiar jornada
                            }}
                            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                              appointmentShift === 'AM'
                                ? 'bg-[#2B5F7F] text-white shadow-md'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            AM
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setAppointmentShift('PM');
                              setAppointmentTime(''); // Resetear hora al cambiar jornada
                            }}
                            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                              appointmentShift === 'PM'
                                ? 'bg-[#2B5F7F] text-white shadow-md'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            PM
                          </button>
                        </div>
                        {!appointmentShift && (
                          <p className="text-xs text-red-600 mt-1">Debes seleccionar una jornada</p>
                        )}
                      </div>
                      {appointmentShift && (
                        <div className="sm:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Hora Acordada *</label>
                          <input
                            type="time"
                            value={appointmentTime}
                            onChange={(e) => setAppointmentTime(e.target.value)}
                            min={appointmentShift === 'AM' ? '08:00' : '13:00'}
                            max={appointmentShift === 'AM' ? '12:00' : '18:00'}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B5F7F] focus:border-transparent outline-none"
                            placeholder={appointmentShift === 'AM' ? '08:00 - 12:00' : '13:00 - 18:00'}
                            required
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Rango disponible: {appointmentShift === 'AM' ? '08:00 - 12:00' : '13:00 - 18:00'}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Asignar Técnico *</label>
                    <select
                      value={selectedTechnician}
                      onChange={(e) => setSelectedTechnician(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B5F7F] focus:border-transparent outline-none"
                      required
                    >
                      <option value="">Seleccionar técnico...</option>
                      {(() => {
                        // Mapeo de áreas a técnicos
                        const areaToTechnician: { [key: string]: { rut: string; name: string } } = {
                          'Carpintería': { rut: '11111111-1', name: 'Técnico (Carpintería)' },
                          'Gasfitería': { rut: '22222222-2', name: 'Técnico (Gasfitería)' },
                        };
                        
                        const currentArea = editableArea || selectedTicket.area;
                        const technician = currentArea ? areaToTechnician[currentArea] : null;
                        
                        // Técnico General siempre aparece primero
                        const generalTechnician = <option key="general" value="33333333-3">Técnico General</option>;
                        
                        if (technician) {
                          // Si hay un técnico específico para esta área, mostrarlo primero, luego general, luego otros
                          return (
                            <>
                              <option value={technician.rut}>{technician.name}</option>
                              {generalTechnician}
                              {currentArea !== 'Carpintería' && currentArea !== 'Gasfitería' && (
                                <>
                                  <option value="11111111-1">Técnico (Carpintería)</option>
                                  <option value="22222222-2">Técnico (Gasfitería)</option>
                                </>
                              )}
                            </>
                          );
                        }
                        
                        // Si no hay mapeo específico, mostrar general primero, luego todos
                        return (
                          <>
                            {generalTechnician}
                            <option value="11111111-1">Técnico (Carpintería)</option>
                            <option value="22222222-2">Técnico (Gasfitería)</option>
                          </>
                        );
                      })()}
                    </select>
                    {(editableArea || selectedTicket.area) && (
                      <p className="text-xs text-gray-500 mt-1">
                        Área del ticket: {editableArea || selectedTicket.area}
                      </p>
                    )}
                  </div>
                  
                  <div className="pt-2">
                    <p className="text-sm font-medium text-gray-700 mb-3">Acción del Administrador:</p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleApprove(selectedTicket.id, true)}
                        disabled={!appointmentDate || !appointmentShift || !appointmentTime || !selectedTechnician}
                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        Aprobar y Crear Orden
                      </button>
                      <button
                        onClick={() => handleApprove(selectedTicket.id, false)}
                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Rechazar
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Notificación de éxito */}
      {showSuccessNotification && (
        <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-5">
          <div className="bg-white rounded-lg shadow-xl border border-green-200 p-4 max-w-md">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1">¡Ticket creado exitosamente!</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Tu ticket <span className="font-semibold text-[#2B5F7F]">{createdTicketNumber}</span> ha sido creado correctamente.
                </p>
                <p className="text-sm text-gray-700 bg-yellow-50 border border-yellow-200 rounded px-3 py-2">
                  <Clock className="w-4 h-4 inline mr-1 text-yellow-600" />
                  Tu ticket está pendiente de revisión. Recibirás una notificación cuando sea aprobado o rechazado.
                </p>
              </div>
              <button
                onClick={() => setShowSuccessNotification(false)}
                className="flex-shrink-0 p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

