import axios from 'axios';
import React, { useState } from 'react';
import Swal from 'sweetalert2'
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

const StripeCheckout = ({
    full_name,
    address_line_1,
    address_line_2,
    city,
    state_province_region,
    telephone_number
}) => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [mostrarTooltip, setMostrarTooltip] = useState(false);

    const handlePago = async () => {

        const body = JSON.stringify({
            full_name,
            address_line_1,
            address_line_2,
            city,
            state_province_region,
            telephone_number
        })

        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`
            }
        };
        setLoading(true);
        // Lógica para llamar a tu backend y obtener el clientSecret

        const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/api/payment/make-payment`, body, config);
        const { clientSecret } = data;

        const result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement),
            },
        });

        if (result.error) {
            console.error(result.error.message);
            Swal.fire({
                title: '¡Algo salió mal!',
                icon: 'error',
                timer: 2000, // 2 segundos
                showConfirmButton: false,
              }).then(() => {
                // Redirige a la pantalla principal
                window.location.href = '/';
              });
        } else if (result.paymentIntent.status === 'succeeded') {
            console.log('Pago exitoso')
            Swal.fire({
                title: '¡Gracias por tu compra!',
                text: 'Revisa tu correo electrónico para más información',
                icon: 'success',
                timer: 4000, // 2 segundos
                showConfirmButton: false,
              }).then(() => {
                // Redirige a la pantalla principal
                window.location.href = '/';
              });
        }

        setLoading(false);
    };

    return (
        <div>
            <div className='flex'>
            <p className='text-green-600 font-bold'>Tarjeta de credito</p>
            <div className="ml-2 relative inline-block">
                <button
                    className="bg-blue-500 text-white px-2  rounded hover:bg-blue-700"
                    onMouseEnter={() => setMostrarTooltip(true)}
                    onMouseLeave={() => setMostrarTooltip(false)}
                >
                    ?
                </button>
                {mostrarTooltip && (
                    <div className="absolute bottom-full w-72 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded">
                        Tranquil@! Tu información esta resguardada por Stripe ;)
                    </div>
                )}
            </div>
            </div>

            <div className='mb-4 mt-2 bg-gray-100 p-4'>
                <CardElement />
            </div>


            <button
                type="submit"
                onClick={handlePago} disabled={loading}
                className="w-full bg-green-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-green-500"
            >
                Realizar pedido
            </button>

        </div>
    );
};

export default StripeCheckout;