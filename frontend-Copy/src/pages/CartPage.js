import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './CartPage.css';
import { purchaseTicket, verifyPayment } from '../services/api';

function CartPage({ cart, setCart }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [verifiedTickets, setVerifiedTickets] = useState([]);
  const [isVerifying, setIsVerifying] = useState(false);

  const calculateCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleRemoveItem = (index) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.filter((_, i) => i !== index);
      localStorage.setItem('cart', JSON.stringify(updatedCart)); // Sync with localStorage
      return updatedCart;
    });
  };

  const handlePurchaseCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert(t('cart.loginRequired'));
      navigate('/login');
      return;
    }

    // Extract event IDs and tickets from the cart
    const eventIds = [...new Set(cart.map((item) => item.eventId))];
    const tickets = cart.map(({ eventId, ticketClass, quantity }) => ({
      eventId,
      ticketClass,
      quantity,
    }));

    try {
      const response = await purchaseTicket(eventIds, tickets);

      if (response.paymentUrl) {
        // Redirect to payment gateway for paid tickets
        window.location.href = response.paymentUrl;
      } else if (response.tickets) {
        // Handle free tickets issuance
        alert(t('cart.successFreeTickets'));
        setCart([]); // Clear cart state
        localStorage.setItem('cart', JSON.stringify([])); // Clear localStorage
        setVerifiedTickets(response.tickets); // Show tickets directly
      } else {
        alert(t('cart.noTickets'));
      }
    } catch (err) {
      console.error('Error purchasing tickets:', err);
      alert(t('cart.purchaseError'));
    }
  };

  // Handle payment verification from URL
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tap_id = queryParams.get('tap_id');

    if (tap_id) {
      setIsVerifying(true);
      verifyPayment(tap_id)
        .then((response) => {
          if (response.status === 'success') {
            setVerifiedTickets(response.tickets); // Display verified tickets
            setCart([]); // Clear cart after successful purchase
            localStorage.setItem('cart', JSON.stringify([])); // Clear localStorage
          } else {
            alert(t('payment.error'));
          }
        })
        .catch((err) => {
          console.error('Error verifying payment:', err);
          alert(t('payment.error'));
        })
        .finally(() => {
          setIsVerifying(false);
        });
    }
  }, [location.search, t, setCart]);

  if (isVerifying) {
    return <p className="loading">{t('cart.verifyingPayment')}</p>;
  }

  if (verifiedTickets.length > 0) {
    return (
      <div className="cart-page-container">
        <h2>{t('cart.paymentSuccess')}</h2>
        <div className="ticket-list">
          {verifiedTickets.map((ticket, index) => (
            <div key={index} className="ticket-item">
              <p>
                {t('cart.ticketClass')}: {ticket.ticketClass}
              </p>
              <p>
                {t('cart.quantity')}: {ticket.quantity}
              </p>
              <p>
                {t('cart.price')}: {ticket.price} {ticket.currency}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return <p className="cart-empty-message">{t('cart.empty')}</p>;
  }

  return (
    <div className="cart-page-container">
      <h2>{t('cart.title')}</h2>
      <div className="cart-list">
        {cart.map((item, index) => (
          <div key={index} className="cart-item">
            <p>
              {t('cart.ticket')}: {item.ticketClass}
            </p>
            <p>
              {t('cart.quantity')}: {item.quantity}
            </p>
            <p>
              {t('cart.price')}: {item.price} {item.currency}
            </p>
            <button onClick={() => handleRemoveItem(index)}>
              {t('cart.remove')}
            </button>
          </div>
        ))}
      </div>
      <div className="cart-total">
        <p>
          {t('cart.total')}: {calculateCartTotal()} {cart[0]?.currency || ''}
        </p>
      </div>
      <button className="purchase-button" onClick={handlePurchaseCart}>
        {t('cart.purchase')}
      </button>
    </div>
  );
}

export default CartPage;
