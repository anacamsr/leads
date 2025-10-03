export const colors = {
    
    background: '#f8f9fa',   
    card: '#ffffff',     
    primaryText: '#212529', 
    secondaryText: '#212529',

    primaryButton: '#007bff', 
    successButton: '#28a745', 
    deleteButton: '#dc3545',  
    warningButton: '#ffc107', 

    border: '#ced4da',       
    shadow: '0 2px 4px rgba(0,0,0,.05)', 
    shadowDeep: '0 10px 30px rgba(0, 0, 0, 0.1)',
};

export const componentStyles = {
    inputBase: {
        padding: '12px',
        borderRadius: '6px',
        border: `1px solid ${colors.border}`,
        boxSizing: 'border-box',
        width: '50%',
        backgroundColor:'white', 
        color:'black'

    },

    buttonBase: {
        padding: '10px 15px',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: '600',
        fontSize: '15px',
        transition: 'background-color 0.2s, opacity 0.2s',
    },

    cardContainer: {
        borderRadius: '8px',
        boxShadow: colors.shadow,
        padding: '20px',
    },

    h1: { fontSize: '32px', color: colors.primaryText, fontWeight: '700' },
    h2: { fontSize: '24px', color: colors.primaryText, fontWeight: '600' },
};

export const listStyles = {
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