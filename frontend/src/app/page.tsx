'use client';

import { useState, useEffect, useCallback } from 'react';
import LeadForm from '@/components/LeadForm';
import LeadDetailsModal from '@/components/LeadDetailsModal';
import LeadEditModal from '@/components/LeadEditModal';
import { API_URL, API_KEY } from '@/config/api';
import debounce from 'lodash.debounce';
import { useAuth, AuthProvider } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { colors, componentStyles } from '@/styles/theme';

interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string | null;
  birthDate: string | null;
  createdAt: string;
  utm_source: string | null;
}

const listStyles: Record<string, React.CSSProperties> = {
  pageContainer: {
    padding: '30px',
    backgroundColor: colors.background,
    minHeight: '100vh',
    fontFamily: 'Arial, sans-serif'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '25px',
  },

  controlsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    ...componentStyles.cardContainer,
    padding: '15px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
    ...componentStyles.cardContainer,
    padding: '0',
    overflow: 'hidden',
    fontSize: "14px",
  },
  headerRow: { backgroundColor: colors.background },
  headerCell: {
    padding: '12px',
    textAlign: 'left',
    borderBottom: `2px solid ${colors.border}`,
    color: colors.primaryText,
    fontWeight: '700'
  },
  dataRow: { transition: 'background-color 0.2s' },
  dataCell: { padding: '12px', textAlign: 'left', borderBottom: `1px solid ${colors.border}`, color: colors.primaryText },
};

function LeadsList() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shouldRefetch, setShouldRefetch] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [exportLoading, setExportLoading] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState<number | null>(null);
  const [leadToEditId, setLeadToEditId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalLeads, setTotalLeads] = useState(0);
  const leadsPerPage = 10;
  const sortField = 'id';
  const sortOrder = 'desc';

  const { logout, authToken } = useAuth();

  const totalPages = Math.ceil(totalLeads / leadsPerPage);

  const handleRefetch = () => setShouldRefetch(prev => prev + 1);
  const handleViewDetails = (id: number) => setSelectedLeadId(id);
  const handleCloseModal = () => setSelectedLeadId(null);
  const handleEdit = (id: number) => setLeadToEditId(id);
  const handleCloseEditModal = () => setLeadToEditId(null);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    handleRefetch();
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm(`Tem certeza que deseja DELETAR o Lead ID ${id}? Esta ação é irreversível.`)) { return; }
    if (!API_URL || !authToken) { window.alert("Erro de autenticação ou configuração de API."); return; }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/leads/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'Authorization': authToken, },
      });
      if (!response.ok) {
        let errorDetail = `Status ${response.status}`;
        if (response.headers.get('content-type')?.includes('application/json')) {
          const errorData = await response.json();
          errorDetail = errorData.error || errorDetail;
        }
        throw new Error(`Falha ao deletar lead: ${errorDetail}`);
      }
      window.alert(`Lead ID ${id} deletado com sucesso!`);
      if (leads.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
      handleRefetch();
    } catch (error: any) {
      window.alert(error.message);
      console.error("Erro ao deletar lead:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    async function fetchLeads() {
      if (!API_URL || !authToken) {
        setError("Autenticação necessária.");
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);

      try {
        let fullUrl = `${API_URL}/leads?_page=${currentPage}&_limit=${leadsPerPage}&_sort=${sortField}&_order=${sortOrder}`;

        // 💡 CORREÇÃO: Usar 'searchTerm' no lugar de 'search'
        if (searchTerm) {
          fullUrl += `&searchTerm=${encodeURIComponent(searchTerm)}`;
        }

        const response = await fetch(fullUrl, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', 'Authorization': authToken, },
        });

        if (!response.ok) {
          if (response.headers.get('content-type')?.includes('application/json')) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Erro na API: Status ${response.status}`);
          }
          throw new Error(`Erro na API: Status ${response.status} - ${response.statusText}`);
        }

        const data: Lead[] = await response.json();

        const totalCountHeader = response.headers.get('X-Total-Count');
        if (totalCountHeader) {
          setTotalLeads(parseInt(totalCountHeader, 10));
        }

        setLeads(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchLeads();
  }, [shouldRefetch, searchTerm, authToken, currentPage, leadsPerPage]);

  const debouncedSearch = useCallback(
    debounce((nextValue: string) => {
      setCurrentPage(1);
      setSearchTerm(nextValue);
    }, 300),
    []
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(event.target.value);
  };

  const handleExportCSV = async () => {
    if (!API_URL || !authToken) { window.alert("Erro de autenticação ou configuração de API."); return; }
    setExportLoading(true);

    try {
      const response = await fetch(`${API_URL}/leads/export/csv`, {
        method: 'GET',
        headers: { 'Authorization': authToken, },
      });
      if (!response.ok) {
        let errorDetail = `Status ${response.status}`;
        if (response.headers.get('content-type')?.includes('application/json')) {
          const errorData = await response.json();
          errorDetail = errorData.error || errorDetail;
        }
        throw new Error(`Falha na exportação: ${errorDetail}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'leads.csv';
      document.body.appendChild(a);
      a.click();

      window.URL.revokeObjectURL(url);
      a.remove();

    } catch (error: any) {
      window.alert(error.message);
    } finally {
      setExportLoading(false);
    }
  };


  if (error && leads.length === 0) return <div style={{ color: colors.deleteButton, padding: 20 }}>Erro ao carregar leads: {error}</div>;

  return (
    <div style={listStyles.pageContainer}>

      <div style={listStyles.header}>
        <h1 style={componentStyles.h1}>Painel Administrativo de Leads</h1>
        <button
          onClick={logout}
          style={{ ...componentStyles.buttonBase, backgroundColor: colors.secondaryText }}
        >
          Logout
        </button>
      </div>

      <div style={{ marginBottom: '25px' }}>
        <LeadForm onLeadCreated={() => { setCurrentPage(1); handleRefetch(); }} />
      </div>


      <h2 style={{ ...componentStyles.h2, marginBottom: '15px' }}>
        Lista de Leads ({totalLeads} no total)
      </h2>

      <div style={{ display: "flex", alignItems: "center" }}>
        <input
          type="text"
          placeholder="Buscar por Nome e Email"
          onChange={handleSearchChange}
          style={{
            ...componentStyles.inputBase,
            flex: 1,
            marginRight: "30%"
          } as React.CSSProperties}
        />

        <button
          onClick={handleExportCSV}
          style={{
            ...componentStyles.buttonBase,
            backgroundColor: exportLoading ? colors.secondaryText : colors.successButton
          }}
          title="Exporta todos os leads em um arquivo CSV"
          disabled={exportLoading}
        >
          {exportLoading ? 'Baixando...' : 'Exportar CSV'}
        </button>
      </div>

      {loading && <div style={{ marginTop: '10px', color: colors.secondaryText }}>Carregando leads...</div>}

      {leads.length > 0 && (
        <div style={{ overflowX: "auto" }}>
          <table style={listStyles.table}>
            <thead>
              <tr style={listStyles.headerRow}>
                <th style={{ ...listStyles.headerCell, width: '5%' }}>ID</th>
                <th style={{ ...listStyles.headerCell, width: '20%' }}>Nome</th>
                <th style={{ ...listStyles.headerCell, width: '20%' }}>Email</th>
                <th style={{ ...listStyles.headerCell, width: '15%' }}>Telefone</th>
                <th style={{ ...listStyles.headerCell, width: '15%' }}>Cargo</th>
                <th style={{ ...listStyles.headerCell, width: '10%' }}>Fonte (UTM)</th>
                <th style={{ ...listStyles.headerCell, width: '15%', textAlign: 'center' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} style={listStyles.dataRow}>
                  <td style={listStyles.dataCell}>{lead.id}</td>
                  <td style={listStyles.dataCell}>{lead.name}</td>
                  <td style={listStyles.dataCell}>{lead.email}</td>
                  <td style={listStyles.dataCell}>{lead.phone}</td>
                  <td style={listStyles.dataCell}>{lead.role || '-'}</td>
                  <td style={listStyles.dataCell}>{lead.utm_source || 'Direto'}</td>
                  <td style={{ ...listStyles.dataCell, textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>

                      <button
                        onClick={() => handleViewDetails(lead.id)}
                        style={{ ...componentStyles.buttonBase, backgroundColor: colors.primaryButton }}
                        title="Ver Detalhes (View)"
                      >
                        Detalhes
                      </button>

                      <button
                        onClick={() => handleEdit(lead.id)}
                        style={{ ...componentStyles.buttonBase, backgroundColor: colors.warningButton, color: colors.primaryText }}
                        title="Editar (PUT)"
                      >
                        Editar
                      </button>

                      <button
                        onClick={() => handleDelete(lead.id)}
                        style={{ ...componentStyles.buttonBase, backgroundColor: colors.deleteButton }}
                        title="Deletar (DELETE)"
                      >
                        Deletar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {totalPages > 1 && (
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}

        </div>
      )}

      <LeadDetailsModal
        leadId={selectedLeadId}
        onClose={handleCloseModal}
      />
      <LeadEditModal
        leadToEditId={leadToEditId}
        onClose={handleCloseEditModal}
        onLeadUpdated={handleRefetch}
      />
    </div>
  );
}


interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const getPaginationRange = (currentPage: number, totalPages: number, maxVisible: number = 5): (number | '...')[] => {

  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const half = Math.floor(maxVisible / 2);
  let start = currentPage - half;
  let end = currentPage + half;

  if (start < 1) {
    start = 1;
    end = maxVisible;
  }

  if (end > totalPages) {
    end = totalPages;
    start = totalPages - maxVisible + 1;
    if (start < 1) start = 1;
  }

  let range: (number | '...')[] = [];

  for (let i = start; i <= end; i++) {
    range.push(i);
  }

  if (end < totalPages) {
    range.push('...');
    range.push(totalPages);
  }

  if (start > 1) {
    if (range[0] !== 1) {
      range.unshift('...');
    }
    if (range[0] !== 1) {
      range.unshift(1);
    }
  }

  const finalRange = range.filter((item, index, arr) => !(item === '...' && arr[index - 1] === '...'));

  return finalRange.filter((item, index, arr) => !(item === '...' && arr[index - 1] === 1 && arr[index] === '...' && arr[index + 1] !== 2));

};


const PaginationControls: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {

  const pageRange = getPaginationRange(currentPage, totalPages);


  const paginationStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '20px',
    gap: '5px'
  };

  const buttonStyle: React.CSSProperties = {
    padding: '8px 12px',
    margin: '0 4px',
    borderRadius: '4px',
    border: `1px solid ${colors.border}`,
    cursor: 'pointer',
    backgroundColor: colors.background,
    color: colors.primaryText,
    transition: 'background-color 0.2s'
  };

  const activeButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: colors.primaryButton,
    color: 'white',
    fontWeight: 'bold',
    borderColor: colors.primaryButton
  };

  const dotsStyle: React.CSSProperties = {

    ...buttonStyle,
    cursor: 'default',
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    boxShadow: 'none',
    transition: 'none',

  };

  return (
    <div style={paginationStyle}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        style={buttonStyle}
      >
        Anterior
      </button>
      {pageRange.map((page, index) => {
        if (page === '...') {
          return <span key={index} style={dotsStyle}>...</span>;
        }

        return (
          <button
            key={page}
            onClick={() => onPageChange(page as number)}
            style={page === currentPage ? activeButtonStyle : buttonStyle}
          >
            {page}
          </button>
        );
      })}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={buttonStyle}
      >
        Próximo
      </button>
      <span style={{ marginLeft: '10px', color: colors.secondaryText }}>
        Página {currentPage} de {totalPages}
      </span>
    </div>
  );
};

function AuthChecker() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  if (loading || !isAuthenticated) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: colors.background }}>
        <h1 style={componentStyles.h1}>Carregando autenticação...</h1>
      </div>
    );
  }

  return <LeadsList />;
}

export default function LeadsPageWrapper() {
  return (
    <AuthProvider>
      <AuthChecker />
    </AuthProvider>
  );
}