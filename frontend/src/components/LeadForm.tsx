'use client';

import { useState } from 'react';
import { API_URL } from '@/config/api';
import { InputMask } from '@react-input/mask';

interface FormData {
    name: string;
    email: string;
    phone: string;
    role: string;
    birthDate: string;
    message: string;
}

const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const isValidBrazilianPhone = (phone: string): boolean => {
    const numericPhone = phone.replace(/\D/g, '');
    const phoneRegex = /^\d{10,11}$/;
    return phoneRegex.test(numericPhone);
};

const isValidDate = (dateString: string): boolean => {
    if (!dateString) return false;

    const parts = dateString.trim().split('-');

    if (parts.length !== 3) {
        console.log("❌ Formato inválido. Esperado: YYYY-MM-DD");
        return false;
    }

    const [yearStr, monthStr, dayStr] = parts;

    const year = Number(yearStr);
    const month = Number(monthStr);
    const day = Number(dayStr);

    if (isNaN(year) || isNaN(month) || isNaN(day)) {
        console.log("❌ Partes da data não são números.");
        return false;
    }
    const date = new Date(year, month - 1, day);
    if (
        date.getFullYear() !== year ||
        date.getMonth() + 1 !== month ||
        date.getDate() !== day
    ) {
        console.log("❌ Data inconsistente (Ex: dia 32 ou mês 13).");
        return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const result = date <= today;

    if (!result) {
        console.log("❌ Data futura detectada.");
    }

    return result;
};

export default function LeadForm({ onLeadCreated }: { onLeadCreated: () => void }) {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        phone: '',
        role: '',
        birthDate: '',
        message: '',
    });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement> | any) => {
        const value = e.target ? e.target.value : e.value;
        const name = e.target ? e.target.name : 'phone';

        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const validateForm = (): boolean => {
        if (!formData.name || !formData.email || !formData.phone || !formData.role || !formData.birthDate) {
            setMessage('Todos os campos marcados com * são obrigatórios.');
            return false;
        }

        if (!isValidEmail(formData.email)) {
            setMessage('Por favor, insira um endereço de email válido.');
            return false;
        }

        if (!isValidBrazilianPhone(formData.phone)) {
            setMessage('Por favor, insira um Telefone Completo (DDD + 8/9 dígitos).');
            return false;
        }

        if (!isValidDate(formData.birthDate)) {
            setMessage('Por favor, insira uma Data de Nascimento válida e que não seja futura.');
            return false;
        }

        return true;
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setMessage(null);

        if (!validateForm()) {
            setStatus('error');
            return;
        }

        const leadDataToSend = {
            ...formData,
            phone: formData.phone.replace(/\D/g, ''),
        }

        const utms = { utm_source: 'website', utm_medium: 'organic' };

        try {
            const response = await fetch(
                `${API_URL}/leads?utm_source=${utms.utm_source}&utm_medium=${utms.utm_medium}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(leadDataToSend),
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Erro ao salvar lead: Status ${response.status}`);
            }

            setMessage('Lead cadastrado com sucesso!');
            setStatus('success');
            setFormData({ name: '', email: '', phone: '', role: '', birthDate: '', message: '' });
            onLeadCreated();

            setTimeout(() => {
                setMessage(null);
                setStatus('idle');
            }, 5000);

        } catch (e: any) {
            setMessage(e.message);
            setStatus('error');
            console.error('Erro no envio do formulário:', e);
        }
    };

    return (
        <div style={formStyles.container}>
            <h2 style={formStyles.h2}>Cadastrar Novo Lead</h2>
            <form onSubmit={handleSubmit} style={formStyles.form}>
                <div style={formStyles.row1} className="row1">
                    <div style={formStyles.fieldGroup}>
                        <label style={formStyles.label}>Nome *</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Nome completo"
                            value={formData.name}
                            onChange={handleChange}
                            disabled={status === 'loading'}
                            style={formStyles.input}
                            required
                        />
                    </div>
                    <div style={formStyles.fieldGroup}>
                        <label style={formStyles.label}>Email *</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="email@exemplo.com"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={status === 'loading'}
                            style={formStyles.input}
                            required
                        />
                    </div>
                </div>

                <div style={formStyles.row2} className="row2">
                    <div style={formStyles.fieldGroup}>
                        <label style={formStyles.label}>Telefone *</label>
                        <InputMask
                            mask="(__) 9____-____"
                            replacement={{ _: /\d/ }}
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            disabled={status === 'loading'}
                            style={formStyles.input}
                            required
                        />
                    </div>
                    <div style={formStyles.fieldGroup}>
                        <label style={formStyles.label}>Cargo/Função *</label>
                        <input
                            type="text"
                            name="role"
                            placeholder="Ex: Gerente de Vendas"
                            value={formData.role}
                            onChange={handleChange}
                            disabled={status === 'loading'}
                            style={formStyles.input}
                            required
                        />
                    </div>
                    <div style={formStyles.fieldGroup}>
                        <label style={formStyles.label}>Data de Nascimento *</label>
                        <input
                            type="date"
                            name="birthDate"
                            value={formData.birthDate}
                            onChange={handleChange}
                            disabled={status === 'loading'}
                            style={formStyles.input}
                            required
                        />
                    </div>
                </div>

                <div style={formStyles.fieldGroup}>
                    <label style={formStyles.label}>Mensagem (Opcional)</label>
                    <textarea
                        name="message"
                        placeholder="Mensagem (Opcional)"
                        value={formData.message}
                        onChange={handleChange}
                        disabled={status === 'loading'}
                        style={formStyles.textarea}
                        rows={3}
                    />
                </div>

                <button
                    type="submit"
                    disabled={status === 'loading'}
                    style={{
                        ...formStyles.button,
                        backgroundColor: status === 'loading' ? '#aaa' : '#0070f3',
                    }}
                    className="form-button"
                >
                    {status === 'loading' ? 'Cadastrando...' : 'Cadastrar Lead'}
                </button>
            </form>

            {message && (
                <p style={{ marginTop: '10px', color: status === 'error' ? 'red' : 'green' }}>
                    {message}
                </p>
            )}

            <style jsx>{`
        @media (max-width: 768px) {
          .row1 {
            grid-template-columns: 1fr !important;
          }
          .row2 {
            grid-template-columns: 1fr !important;
          }
          .form-button {
            width: 100% !important;
          }
        }
      `}</style>
        </div>
    );
}

const formStyles: Record<string, React.CSSProperties> = {
    container: {
        padding: '20px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        marginBottom: '20px',
        backgroundColor: '#f9f9f9',
    },
    form: { display: 'grid', gap: '15px', width: '100%', marginTop: '10px' },
    fieldGroup: { display: 'flex', flexDirection: 'column' },

    row1: { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '15px' },
    row2: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' },

    input: {
        padding: '10px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        boxSizing: 'border-box',
        backgroundColor: 'white',
        color: 'black',
    },
    textarea: {
        padding: '10px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        boxSizing: 'border-box',
        resize: 'vertical',
        backgroundColor: 'white',
        color: 'black',
    },
    label: { fontSize: '12px', color: '#555', marginBottom: '2px', fontWeight: 'bold' },
    button: {
        padding: '10px 15px',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: 'bold',
        width: '200px',
    },
    h2: { color: '#212529' },
};