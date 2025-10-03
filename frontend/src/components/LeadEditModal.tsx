'use client';

import { useState, useEffect } from 'react';
import { API_URL, API_KEY } from '@/config/api';

interface LeadEditData {
    name: string;
    email: string;
    phone: string;
    role: string;
    birthDate: string;
    message: string;
}

interface ModalProps {
    leadToEditId: number | null;
    onClose: () => void;
    onLeadUpdated: () => void;
}

export default function LeadEditModal({ leadToEditId, onClose, onLeadUpdated }: ModalProps) {
    const [formData, setFormData] = useState<LeadEditData>({
        name: '', email: '', phone: '',
        role: '', birthDate: '', message: ''
    });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        if (!leadToEditId) return;

        setLoading(true);
        setMessage(null);

        async function fetchLeadData() {
            try {
                const response = await fetch(`${API_URL}/leads/${leadToEditId}`, {
                    method: 'GET',
                    headers: { 'Authorization': API_KEY },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Falha ao carregar dados para edição.');
                }

                const data = await response.json();

                setFormData({
                    name: data.name || '',
                    email: data.email || '',
                    phone: data.phone || '',
                    role: data.role || '',
                    birthDate: data.birthDate ? new Date(data.birthDate).toISOString().split('T')[0] : '',
                    message: data.message || '',
                });
                setStatus('idle');
            } catch (e: any) {
                setMessage(e.message);
                setStatus('error');
            } finally {
                setLoading(false);
            }
        }
        fetchLeadData();
    }, [leadToEditId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!leadToEditId) return;

        setStatus('loading');
        setMessage(null);

        try {
            const response = await fetch(`${API_URL}/leads/${leadToEditId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': API_KEY,
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Erro ao atualizar lead: Status ${response.status}`);
            }

            setMessage('Lead atualizado com sucesso!');
            setStatus('success');
            onLeadUpdated();
            setTimeout(onClose, 1000);

        } catch (e: any) {
            setMessage(e.message);
            setStatus('error');
        }
    };

    if (!leadToEditId) return null;

    return (
        <div style={modalStyles.backdrop}>
            <div style={modalStyles.content}>
                <button onClick={onClose} style={modalStyles.closeButton} disabled={status === 'loading'}>×</button>
                <h2 style={formStyles.h2}>Editar Lead #{leadToEditId}</h2>

                {loading ? (
                    <p>Carregando dados...</p>
                ) : (
                    <form onSubmit={handleSubmit} style={formStyles.form}>

                        {/* ROW 1: Nome e Email */}
                        <div style={formStyles.row1}>
                            <div style={formStyles.fieldGroup}>
                                <label style={formStyles.label}>Nome:</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} style={formStyles.input} required />
                            </div>
                            <div style={formStyles.fieldGroup}>
                                <label style={formStyles.label}>Email:</label>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} style={formStyles.input} required />
                            </div>
                        </div>

                        {/* ROW 2: Telefone, Cargo, Data de Nascimento */}
                        <div style={formStyles.row2}>
                            <div style={formStyles.fieldGroup}>
                                <label style={formStyles.label}>Telefone:</label>
                                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} style={formStyles.input} />
                            </div>
                            <div style={formStyles.fieldGroup}>
                                <label style={formStyles.label}>Cargo/Função:</label>
                                <input type="text" name="role" value={formData.role} onChange={handleChange} style={formStyles.input} />
                            </div>
                            <div style={formStyles.fieldGroup}>
                                <label style={formStyles.label}>Data de Nascimento:</label>
                                <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} style={formStyles.input} />
                            </div>
                        </div>

                        {/* ROW 3: Mensagem */}
                        <div style={formStyles.fieldGroup}>
                            <label style={formStyles.label}>Mensagem:</label>
                            <textarea name="message" value={formData.message} onChange={handleChange} style={formStyles.textarea} rows={3} />
                        </div>

                        <button
                            type="submit"
                            disabled={status === 'loading'}
                            style={{ ...formStyles.button, backgroundColor: status === 'loading' ? '#aaa' : '#007bff' }}
                        >
                            {status === 'loading' ? 'Salvando...' : 'Salvar Alterações'}
                        </button>
                    </form>
                )}

                {message && (
                    <p style={{ marginTop: '10px', color: status === 'error' ? 'red' : 'green' }}>
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
}

// Estilos
const formStyles: Record<string, React.CSSProperties> = {
    form: { display: 'grid', gap: '15px' },

    row1: {
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '15px',
        flexWrap: 'wrap',
    },
    row2: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '15px',
        flexWrap: 'wrap',
    },

    fieldGroup: { display: 'flex', flexDirection: 'column' },
    input: { padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', color: 'black', backgroundColor: 'white' },
    textarea: { padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', resize: 'vertical', color: 'black', backgroundColor: 'white' },
    label: { fontSize: '12px', color: '#555', marginBottom: '2px', fontWeight: 'bold' },
    button: { padding: '10px 15px', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
    h2: { color: '#212529', paddingBottom:'10px' }
};

const modalStyles: Record<string, React.CSSProperties> = {
    backdrop: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
    content: { 
        backgroundColor: 'white', 
        padding: '30px', 
        borderRadius: '8px', 
        width: '90%', 
        maxWidth: '800px', 
        position: 'relative', 
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        maxHeight: '90vh',
        overflowY: 'auto',
    },
    closeButton: { position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: 'black' },
};