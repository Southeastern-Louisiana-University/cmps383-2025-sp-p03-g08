import React from 'react';
type SuccessModalProps = {
  onClose: () => void;
  onAction: () => void;
  title?: string;
  message?: string;
  actionLabel?: string;
};

export function SuccessModal({
  onClose,
  onAction,
  title = '🎉 Payment Successful!',
  message = 'Thank you for your purchase.',
  actionLabel = 'View Tickets',
}: SuccessModalProps) {
  return (
    <div style={backdropStyle}>
      <div style={modalStyle}>
        <h2 style={{ marginBottom: '1rem' }}>{title}</h2>
        <p style={{ marginBottom: '2rem' }}>{message}</p>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button onClick={onClose} style={buttonStyle}>
            Close
          </button>
          <button onClick={onAction} className='btn-orange'>
            {actionLabel}
          </button>
        </div>
      </div>
    </div>
  );
}


const backdropStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
};

const modalStyle: React.CSSProperties = {
  backgroundColor: 'white',
  padding: '2rem',
  borderRadius: '12px',
  maxWidth: '400px',
  textAlign: 'center',
  boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
};

const buttonStyle: React.CSSProperties = {
  padding: '0.5rem 1rem',
  fontSize: '1rem',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  backgroundColor: '#ccc',
};
