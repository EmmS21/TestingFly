from django.shortcuts import render
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from apps.cart.models import Cart, CartItem
from apps.coupons.models import FixedPriceCoupon, PercentageCoupon
from apps.orders.models import Order, OrderItem
from apps.product.models import Product
from apps.shipping.models import Shipping
from django.core.mail import send_mail
import braintree
import stripe
import os
import uuid


stripe.api_key = os.environ.get('STRIPE_SECRET_KEY')

gateway = braintree.BraintreeGateway(
    braintree.Configuration(
        environment=braintree.Environment.Sandbox,
        merchant_id='bnvn8y9q5thz72dd',
        public_key='6cx38y297fggb738',
        private_key='a945554c6b0b3da315ff58d73d1b7b93'
    )
)
class GenerateTokenView(APIView):
    def get(self, request, format=None):
        try:

            token = gateway.client_token.generate( )

            #token = gateway.client_token.create_token_from_refresh_token()   
                        

            return Response(
                {'braintree_token': token},
                status=status.HTTP_200_OK
            )
        except:
            return Response(
                {'error': 'Something went wrong when retrieving braintree token'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class GetPaymentTotalView(APIView):
    def get(self, request, format=None):
        user = self.request.user
        # cart = Cart.objects.get(user=user)
        # cart_items = CartItem.objects.filter(cart=cart)
        tax = 0

        # for cart_item in cart_items:
        #     print(cart_item.product.price)

        # return Response(
        #     {'error': 'Need to have items in cart'},
        #         status=status.HTTP_404_NOT_FOUND
        #     )

        shipping_id = request.query_params.get('shipping_id')
        shipping_id = str(shipping_id)

        coupon_name = request.query_params.get('coupon_name')
        coupon_name = str(coupon_name)

        try:
            cart = Cart.objects.get(user=user)

            #revisar si existen iitems
            if not CartItem.objects.filter(cart=cart).exists():
                return Response(
                    {'error': 'Need to have items in cart'},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            cart_items = CartItem.objects.filter(cart=cart)

            for cart_item in cart_items:
                if not Product.objects.filter(id=cart_item.product.id).exists():
                    return Response(
                        {'error': 'A proudct with ID provided does not exist'},
                        status=status.HTTP_404_NOT_FOUND
                    )
                if int(cart_item.count) > int(cart_item.product.quantity):
                    return Response(
                        {'error': 'Not enough items in stock'},
                        status=status.HTTP_200_OK
                    )
                
                total_amount = 0.0
                total_compare_amount = 0.0

                for cart_item in cart_items:
                    total_amount += (float(cart_item.product.price)
                                    * float(cart_item.count))
                    total_compare_amount += (float(cart_item.product.compare_price)
                                            * float(cart_item.count))

                total_compare_amount = round(total_compare_amount, 2)
                original_price = round(total_amount, 2)

                # Cupones
                #if coupon_name != '':
                    #Revisar si cupon de precio fijo es valido
                    # if FixedPriceCoupon.objects.filter(name__iexact=coupon_name).exists():
                    #     fixed_price_coupon = FixedPriceCoupon.objects.get(
                    #     name=coupon_name
                    # )
                    # discount_amount = float(fixed_price_coupon.discount_price)
                    # if discount_amount < total_amount:
                    #     total_amount -= discount_amount
                    #     total_after_coupon = total_amount

                    # elif PercentageCoupon.objects.filter(name__iexact=coupon_name).exists():
                    #     percentage_coupon = PercentageCoupon.objects.get(
                    #         name=coupon_name
                    #     )
                    #     discount_percentage = float(
                    #         percentage_coupon.discount_percentage)

                    #     if discount_percentage > 1 and discount_percentage < 100:
                    #         total_amount -= (total_amount *
                    #                         (discount_percentage / 100))
                    #         total_after_coupon = total_amount

                #Total despues del cupon 
                # total_after_coupon = round(total_after_coupon, 2)

                # Impuesto estimado
                estimated_tax = round(total_amount * tax, 2)

                total_amount += (total_amount * tax)

                shipping_cost = 0.0
                #verificar que el envio sea valido
                # if Shipping.objects.filter(id__iexact=shipping_id).exists():
                #     # agregar shipping a total amount
                #     shipping = Shipping.objects.get(id=shipping_id)
                #     shipping_cost = shipping.price
                #     total_amount += float(shipping_cost)
                

                total_amount = round(total_amount, 2)

                if total_amount <= 50:
                    total_amount += 10
                elif 50 < total_amount <= 100:  
                    total_amount += 15
                else:
                    total_amount += 20
                    
                return Response({
                    'original_price': f'{original_price:.2f}',
                    #'total_after_coupon': f'{total_after_coupon:.2f}',
                    'total_amount': f'{total_amount:.2f}',
                    'total_compare_amount': f'{total_compare_amount:.2f}',
                    'estimated_tax': f'{estimated_tax:.2f}',
                    'shipping_cost': f'{shipping_cost:.2f}'
                },
                    status=status.HTTP_200_OK
                )

        except:
            return Response(
                {'error': 'Something went wrong when retrieving payment total information'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )



# class PaymentStripe(APIView):
#     def post(self, request, format=None):
#         try:
#             intent = stripe.PaymentIntent.create(
#                 amount=1999,
#                 currency='EUR',
#                 automatic_payment_methods={
#                     'enabled': True,
#                 }
#             )

            
#             # Send PaymentIntent details to the front end.
#             return Response({'clientSecret': intent.client_secret})
#         except stripe.error.StripeError as e:
#             return Response({'error': {'message': str(e)}}), 400
#         except Exception as e:
#             return Response({'error': {'message': str(e)}}), 400

class ProcessPaymentView(APIView):
    def post(self, request, format=None):
        user = self.request.user
        data = self.request.data


        shipping_id = "1"
        coupon_name = ""

        full_name = data['full_name']
        address_line_1 = data['address_line_1']
        address_line_2 = data['address_line_2']
        city = data['city']
        state_province_region = data['state_province_region']
        postal_zip_code = "0000"
        country_region = "Ecuador"
        telephone_number = data['telephone_number']


         # revisar si datos de shipping son validos
        if not Shipping.objects.filter(id__iexact=shipping_id).exists():
            return Response(
                {'error': 'Invalid shipping option'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        cart = Cart.objects.get(user=user)

        # #revisar si usuario tiene items en carrito
        if not CartItem.objects.filter(cart=cart).exists():
            return Response(
                {'error': 'Need to have items in cart'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        cart_items = CartItem.objects.filter(cart=cart)

        # # revisar si hay stock

        for cart_item in cart_items:
            if not Product.objects.filter(id=cart_item.product.id).exists():
                return Response(
                    {'error': 'Transaction failed, a proudct ID does not exist'},
                    status=status.HTTP_404_NOT_FOUND
                )
            if int(cart_item.count) > int(cart_item.product.quantity):
                return Response(
                    {'error': 'Not enough items in stock'},
                    status=status.HTTP_200_OK
                )
            
        total_amount = 0.0

        for cart_item in cart_items:
            total_amount += (float(cart_item.product.price)
                             * float(cart_item.count))
            
        
        # Cupones
        if coupon_name != '':
            if FixedPriceCoupon.objects.filter(name__iexact=coupon_name).exists():
                fixed_price_coupon = FixedPriceCoupon.objects.get(
                    name=coupon_name
                )
                discount_amount = float(fixed_price_coupon.discount_price)

                if discount_amount < total_amount:
                    total_amount -= discount_amount
            
            elif PercentageCoupon.objects.filter(name__iexact=coupon_name).exists():
                percentage_coupon = PercentageCoupon.objects.get(
                    name=coupon_name
                )
                discount_percentage = float(
                    percentage_coupon.discount_percentage)

                if discount_percentage > 1 and discount_percentage < 100:
                    total_amount -= (total_amount *
                                     (discount_percentage / 100))

        print(total_amount)

        shipping = Shipping.objects.get(id=int(shipping_id))

        shipping_name = shipping.name
        shipping_time = shipping.time_to_delivery
        shipping_price = shipping.price
        
        if total_amount <= 50:
            total_amount += 10
        elif 50 < total_amount <= 100:  
            total_amount += 15
        else:
            total_amount += 20    
                    
        total_amount_cent = int(total_amount * 100)
    
        try:
            # Crear transaccion con Stripe

            intento_pago = stripe.PaymentIntent.create(
                amount=total_amount_cent,
                currency='usd',
            )

        except:
            return Response(
                {'error': 'Error processing the transaction'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


        for cart_item in cart_items:
            update_product = Product.objects.get(id=cart_item.product.id)

            #encontrar cantidad despues de coompra
            quantity = int(update_product.quantity) - int(cart_item.count)

            #obtener cantidad de producto por vender
            sold = int(update_product.sold) + int(cart_item.count)

            #actualizar el producto
            Product.objects.filter(id=cart_item.product.id).update(
                quantity=quantity, sold=sold
            )   
            
            #crear orden
            print(data)
            try:
                order = Order.objects.create(
                    user=user,
                    transaction_id=uuid.uuid4(),
                    amount=total_amount,
                    full_name=full_name,
                    address_line_1=address_line_1,
                    address_line_2=address_line_2,
                    city=city,
                    state_province_region=state_province_region,
                    postal_zip_code=postal_zip_code,
                    country_region=country_region,
                    telephone_number=telephone_number,
                    shipping_name=shipping_name,
                    shipping_time=shipping_time,
                    shipping_price=float(shipping_price)
                )
            except:
                return Response(
                    {'error': 'Transaction succeeded but failed to create the order'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
            
            for cart_item in cart_items:
                try:
                    # agarrar el producto
                    product = Product.objects.get(id=cart_item.product.id)

                    OrderItem.objects.create(
                        product=product,
                        order=order,
                        name=product.name,
                        price=cart_item.product.price,
                        count=cart_item.count
                    )
                except:
                    return Response(
                        {'error': 'Transaction succeeded and order created, but failed to create an order item'},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR
                    )

            try:
                send_mail(
                    'Detalles de tu oren',
                    'Hey ' + full_name + ','
                    + '\n\nRecibimos tu pedido!'
                    + '\n\nDanos tiempo para procesar tu pedido y enviarlo.'
                    + '\n\nPuedes ir a tu perfil para ver el estado de tu pedido.'
                    + '\n\nAtentamente,'
                    + '\nALIENGAMER',
                    'favian--1@hotmail.com',
                    ["johnny.gaona@espoch.edu.ec"],
                    fail_silently=False
                )
            except:
                return Response(
                    {'error': 'Transaction succeeded and order created, but failed to send email'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

            try:
                # Vaciar carrito de compras
                CartItem.objects.filter(cart=cart).delete()

                # Actualizar carrito
                Cart.objects.filter(user=user).update(total_items=0)
            except:
                return Response(
                    {'error': 'Transaction succeeded and order successful, but failed to clear cart'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
            
            return Response(
                {'clientSecret': intento_pago.client_secret}
            )
        else:
            return Response(
                {'error': 'Transaction failed'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
class PaymentIntentStripe(APIView): 

    def post(self, request, format=None):
        data = self.request.data
        try:
            
            # Puedes obtener el monto desde la solicitud del cliente o usar un monto fijo
            monto = data  # Ejemplo: $10.00 en centavos
            intento_pago = stripe.PaymentIntent.create(
                amount=1000,
                currency='usd',
            )
            exito_pago = intento_pago.status == 'succeeded'
            print(uuid.uuid4())


            return Response({'clientSecret': intento_pago.client_secret})
        except Exception as e:
            return Response({'error': str(e)}, status=403)