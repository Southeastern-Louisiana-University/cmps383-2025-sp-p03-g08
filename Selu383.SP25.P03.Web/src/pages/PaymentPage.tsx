import React, { useState } from 'react';
import { PaymentModal } from '../Components/PaymentModal';
import { TextInput, Button, Stack } from '@mantine/core';
import { useLocation, useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';

export default function PaymentPage() {
  const [mode, setMode] = useState<'select' | 'guest' | 'authenticated'>('select');
  const { user } = useAuth();
  const [guestInfo, setGuestInfo] = useState({ name: '', email: '', phone: '' });
  const navigate = useNavigate();
  const location = useLocation();

  // Check for authentication — example logic, replace with your real auth check
  const isAuthenticated = user; // or get from context/store

  React.useEffect(() => {
    if (isAuthenticated || location.state?.fromLogin) {
      setMode('authenticated');
    }
  }, [isAuthenticated, location.state]);
  

  const handleGuestContinue = () => {
    setMode('authenticated');
  };

  const handleLoginRedirect = () => {
    navigate('/login', {
        state: {
          redirectTo: location.pathname,
          redirectedFromPayment: true, // 👈 NEW
        },
      });
      
  };

  return (
    <div style={{ paddingTop: "120px", display: 'flex', justifyContent: 'center' }}>
      <div style={{ padding: '2rem', width: '80%' }}>
        <h1 style={{ textAlign: 'center' }}>Checkout</h1>

        {mode === 'select' && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
            <button className="btn-orange" onClick={() => setMode('guest')}>Checkout as Guest</button>
            <button className="btn-orange" onClick={handleLoginRedirect}>Log In</button>
          </div>
        )}

        {mode === 'guest' && (
          <form onSubmit={(e) => { e.preventDefault(); handleGuestContinue(); }} name="guestCheckout" autoComplete="on">
          <Stack ta="center" maw={500} mx="auto">
            <TextInput
              label="Name"
              value={guestInfo.name}
              onChange={(e) => setGuestInfo({ ...guestInfo, name: e.currentTarget.value })}
              required
            />
        
            <TextInput
              label="Email"
              value={guestInfo.email}
              onChange={(e) => setGuestInfo({ ...guestInfo, email: e.currentTarget.value })}
            />
        
            <TextInput
              label="Phone"
              value={guestInfo.phone}
              onChange={(e) => setGuestInfo({ ...guestInfo, phone: e.currentTarget.value })}
            />
        
            <button
              type="submit"
              className="btn-orange"
              style={{ marginTop: '10px' }}
            >
              Continue to Payment
            </button>
          </Stack>
        </form>
        
      )}

{mode === 'authenticated' && (
  <>
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      <h2>Enter Payment Details</h2>
    </div>
    <PaymentModal guestInfo={guestInfo} /> {/* 👈 Pass it here */}
  </>
)}
      </div>
    </div>
  );
}
