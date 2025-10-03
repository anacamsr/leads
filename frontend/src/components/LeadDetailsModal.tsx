'use client';

import { useState, useEffect } from 'react';
import { API_URL, API_KEY } from '@/config/api';

interface FullLead {
    id: number;
    name: string;
    email: string;
    phone: string;
    role: string | null;
    birthDate: string | null;
    message: string | null;
    createdAt: string;
    utm_source: string | null;
    utm_medium: string | null;
    utm_campaign: string | null;
    utm_term: string | null;
    utm_content: string | null;
    gclid: string | null;
    fbclid: string | null;
}

interface ModalProps {
    leadId: number | null;
    onClose: () => void;
}

export default function LeadDetailsModal({ leadId, onClose }: ModalProps) {
    const [lead, setLead] = useState<FullLead | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!leadId) {
            setLead(null);
            return;
        }

        async function fetchDetails() {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(`${API_URL}/leads/${leadId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': API_KEY,
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || `Erro ao buscar detalhes: Status ${response.status}`);
                }

                const data: FullLead = await response.json();
                setLead(data);
            } catch (e: any) {
                setError(e.message);
                console.error("Erro ao carregar detalhes do lead:", e);
            } finally {
                setLoading(false);
            }
        }
        fetchDetails();
    }, [leadId]);

    if (!leadId) return null;

    return (
        <div style={modalStyles.backdrop}>
            <div style={modalStyles.content}>
                <button onClick={onClose} style={modalStyles.closeButton}>×</button>

                {loading && <p>Carregando detalhes...</p>}
                {error && <p style={{ color: 'red' }}>Erro: {error}</p>}

                {lead && (
                    <div style={{ maxHeight: 'calc(100vh - 120px)', overflowY: 'auto', paddingRight: '15px' }}>
                        <h2 style={{ borderBottom: '2px solid #ddd', paddingBottom: '10px' }}>Detalhes do Lead #{lead.id}</h2>

                        <div style={modalStyles.section}>
                            <h3 style={modalStyles.subHeading}>Dados do Contato</h3>
                            <p><strong>Nome:</strong> {lead.name}</p>
                            <p><strong>Email:</strong> {lead.email}</p>
                            <p><strong>Telefone:</strong> {lead.phone}</p>
                            <p><strong>Função/Cargo:</strong> {lead.role || 'N/A'}</p>
                            <p><strong>Mensagem:</strong> {lead.message || 'N/A'}</p>
                            <p><strong>Criado em:</strong> {new Date(lead.createdAt).toLocaleString()}</p>
                        </div>

                        <div style={modalStyles.section}>
                            <h3 style={modalStyles.subHeading}>Dados de Tracking (UTMs)</h3>
                            <p><strong>Fonte (utm_source):</strong> {lead.utm_source || 'N/A'}</p>
                            <p><strong>Mídia (utm_medium):</strong> {lead.utm_medium || 'N/A'}</p>
                            <p><strong>Campanha (utm_campaign):</strong> {lead.utm_campaign || 'N/A'}</p>
                            <p><strong>Termo (utm_term):</strong> {lead.utm_term || 'N/A'}</p>
                            <p><strong>Conteúdo (utm_content):</strong> {lead.utm_content || 'N/A'}</p>
                            <p><strong>Google Click ID (gclid):</strong> {lead.gclid || 'N/A'}</p>
                            <p><strong>Facebook Click ID (fbclid):</strong> {lead.fbclid || 'N/A'}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// Estilos do Modal
const modalStyles: Record<string, React.CSSProperties> = {
    backdrop: {
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000,
    },
    content: {
        backgroundColor: 'white', padding: '30px', borderRadius: '8px', color: 'black',
        width: '90%', maxWidth: '600px', position: 'relative',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    },
    closeButton: {
        position: 'absolute', top: '10px', right: '10px',
        background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: 'black',
    },
    section: {
        border: '1px solid #eee', padding: '15px', borderRadius: '4px', marginTop: '15px',
    },
    subHeading: {
        marginTop: 0, paddingTop: 0, borderBottom: '1px dotted #ccc', paddingBottom: '5px',
    }
};