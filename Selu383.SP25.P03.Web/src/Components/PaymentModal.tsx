import { useEffect, useState } from 'react';
import { SuccessModal } from './SuccessModal';
import { useNavigate } from 'react-router';
import { useCart } from "../hooks/cartContext"; // ✅

type GuestInfo = {
    name: string;
    email: string;
    phone: string;
};

type PaymentModalProps = {
    guestInfo?: GuestInfo; 
};

export function PaymentModal({ guestInfo }: PaymentModalProps) {
    const navigate = useNavigate();
    const { items, clearCart } = useCart();
    const [purchaseType,setPurchaseType]=useState<string>("Seat");

    useEffect(() => {
        if (guestInfo?.name) {
          sessionStorage.setItem('guestName', guestInfo.name);
        }
    }, [guestInfo]);

    const [formData, setFormData] = useState({
        name: '',
        cardNumber: '',
        expiration: '',
        cvc: '',
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [showSuccessModal, setShowSuccessModal] = useState(false);



    const validate = () => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required.';
        }
        if (!/^(\d{4}\s){3}\d{4}$/.test(formData.cardNumber)) {
            newErrors.cardNumber = 'Card number must be 16 digits.';
        }
        if (!/^\d{2}\/\d{2}$/.test(formData.expiration)) {
            newErrors.expiration = 'Expiration must be in MM/YY format.';
        } else {
            const [monthStr, yearStr] = formData.expiration.split('/');
            const month = parseInt(monthStr, 10);
            const year = parseInt(`20${yearStr}`, 10);
            const now = new Date();
            const currentYear = now.getFullYear();
            const currentMonth = now.getMonth() + 1;

            if (month < 1 || month > 12) {
                newErrors.expiration = 'Invalid month.';
            } else if (year < currentYear || (year === currentYear && month < currentMonth)) {
                newErrors.expiration = 'Card is expired.';
            }
        }
        if (!/^\d{3,4}$/.test(formData.cvc)) {
            newErrors.cvc = 'CVC must be 3 or 4 digits.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const createOrder = async () => {
        const seatData = sessionStorage.getItem("selectedSeats");
        const showingIdString = sessionStorage.getItem("showingId");

        const guestName = guestInfo?.name ?? null;

        let body: any = {
          guestName,
        };

        if (seatData && showingIdString) {
            // 🎟 Tickets checkout
            const showingId = parseInt(showingIdString, 10);
            const selectedSeats = JSON.parse(seatData) as { id: string; ticketType: string }[];
            const seats = selectedSeats.map(seat => ({
              id: parseInt(seat.id, 10),
              ticketType: seat.ticketType,
            }));

            body = { showingId, seats, guestName };
        } else {
            // 🍿 Food checkout
            const foodItems = items
              .map(food => ({
                id: parseInt(food.id, 10),
                name: food.name,
                quantity: food.quantity,
                price: food.price,
              }));

            body = { foodItems, guestName };
        }

        try {

          if(body.seats){
            setPurchaseType("Seat");
          const response = await fetch("/api/orders/checkout", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          });
    
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to create order: ${errorText}`);
          }
    
          const data = await response.json();
          console.log("✅ Order created:", data);
    
          return data;
        }
        else if(body.foodItems){
          setPurchaseType("Food");
          const response = await fetch("/api/orders/checkout-food", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          });
    
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to create order: ${errorText}`);
          }
    
          const data = await response.json();
          console.log("✅ Order created:", data);
    
          return data;

        }
        } catch (err) {
          console.error("❌ Order creation error:", err);
          alert("Something went wrong creating your order.");
        }
        
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const isValid = validate();
        if (!isValid) return;

        const result = await createOrder();
        if (result) {
            setShowSuccessModal(true);
            clearCart(); // ✅ Clear food cart if needed
            sessionStorage.removeItem("selectedSeats");
            sessionStorage.removeItem("showingId");
        }
    };

    const handleViewTickets = () => {
      if(purchaseType=="Seat"){
        navigate("/viewTickets");
      }
else{navigate("/home")}    };

  
    return (
        <>
          <form onSubmit={handleSubmit} style={styles.form}>
            <h2 style={styles.heading}>Payment Info</h2>

            {/* Name */}
            <label style={styles.label}>
              Name on Card
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                style={styles.input}
              />
              {errors.name && <div style={{ color: 'red', fontSize: '0.9rem' }}>{errors.name}</div>}
            </label>

            {/* Card Number */}
            <label style={styles.label}>
              Card Number
              <input
                type="text"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleChange}
                style={styles.input}
              />
              {errors.cardNumber && <div style={{ color: 'red', fontSize: '0.9rem' }}>{errors.cardNumber}</div>}
            </label>

            {/* Expiration */}
            <label style={styles.label}>
              Expiration Date (MM/YY)
              <input
                type="text"
                name="expiration"
                value={formData.expiration}
                onChange={handleChange}
                style={styles.input}
              />
              {errors.expiration && <div style={{ color: 'red', fontSize: '0.9rem' }}>{errors.expiration}</div>}
            </label>

            {/* CVC */}
            <label style={styles.label}>
              CVC
              <input
                type="text"
                name="cvc"
                value={formData.cvc}
                onChange={handleChange}
                style={styles.input}
              />
              {errors.cvc && <div style={{ color: 'red', fontSize: '0.9rem' }}>{errors.cvc}</div>}
            </label>

            <button type="submit" className='btn-orange' style={{ width: '100%', padding: '0.75rem' }}>
              Submit Payment
            </button>
          </form>

          {showSuccessModal && (
            <SuccessModal
              onClose={() => setShowSuccessModal(false)}
              onAction={ handleViewTickets}
              actionLabel={purchaseType==="Seat"? "View Tickets": "Back to home"}
            />
          )}
        </>
    );
}

const styles = {
  form: {
    maxWidth: '400px',
    margin: '0 auto',
    padding: '1rem',
    border: '1px solid #ccc',
    borderRadius: '12px',
    background: '#f9f9f9',
  } as React.CSSProperties,

  heading: {
    marginBottom: '1rem',
    textAlign: 'center',
  } as React.CSSProperties,

  label: {
    display: 'block',
    marginBottom: '1rem',
  } as React.CSSProperties,

  input: {
    display: 'block',
    width: '95%',
    padding: '0.5rem',
    fontSize: '1rem',
    marginTop: '0.5rem',
  } as React.CSSProperties,
};
