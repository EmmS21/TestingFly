from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from .models import Order, OrderItem
from django.shortcuts import get_object_or_404
from.serializers import *
from django.db.models import Q


class ListOrdersView(APIView):
    def get(self, request, format=None):
        user = self.request.user
        try:
            orders = Order.objects.order_by('-date_issued').filter(user=user)
            result = []

            for order in orders:
                item = {}
                item['status'] = order.status
                item['transaction_id'] = order.transaction_id
                item['amount'] = order.amount
                item['shipping_price'] = order.shipping_price
                item['date_issued'] = order.date_issued
                item['address_line_1'] = order.address_line_1
                item['address_line_2'] = order.address_line_2

                result.append(item)

            return Response(
                {'orders': result},
                status=status.HTTP_200_OK
            )
        except:
            return Response(
                {'error': 'Something went wrong when retrieving orders'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class ListOrderDetailView(APIView):
    def get(self, request, transactionId, format=None):
        user = self.request.user

        try:
            if Order.objects.filter(user=user, transaction_id=transactionId).exists():
                order = Order.objects.get(user=user, transaction_id=transactionId)
                result = {}
                result['status'] = order.status
                result['transaction_id'] = order.transaction_id
                result['amount'] = order.amount
                result['full_name'] = order.full_name
                result['address_line_1'] = order.address_line_1
                result['address_line_2'] = order.address_line_2
                result['city'] = order.city
                result['state_province_region'] = order.state_province_region
                result['postal_zip_code'] = order.postal_zip_code
                result['country_region'] = order.country_region
                result['telephone_number'] = order.telephone_number
                result['shipping_name'] = order.shipping_name
                result['shipping_time'] = order.shipping_time
                result['shipping_price'] = order.shipping_price
                result['date_issued'] = order.date_issued

                order_items = OrderItem.objects.order_by('-date_added').filter(order=order)
                result['order_items'] = []

                for order_item in order_items:
                    sub_item = {}

                    sub_item['name'] = order_item.name
                    sub_item['price'] = order_item.price
                    sub_item['count'] = order_item.count

                    result['order_items'].append(sub_item)
                return Response(
                    {'order': result},
                    status=status.HTTP_200_OK
                )
            else:
                return Response(
                    {'error': 'Order with this transaction ID does not exist'},
                    status=status.HTTP_404_NOT_FOUND
                )
        except:
            return Response(
                {'error': 'Something went wrong when retrieving order detail'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    

class AdminOrder(APIView):
    permission_classes = (permissions.AllowAny, )

    def patch(self, request, transactionId, format=None):

        if not Order.objects.filter(transaction_id=transactionId).exists():
            return Response(
                {'error': 'Product with this product ID does not exist'},
                status=status.HTTP_404_NOT_FOUND)

        try:

            order = get_object_or_404(Order,transaction_id=transactionId)
            serializer = OrderSerializer(order, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response({'order':serializer.data}, status=status.HTTP_200_OK)
        except:
            return Response({'error': 'Product could not be updated'}, status=status.HTTP_204_NO_CONTENT)


class GetAllItems(APIView):

    def get(self, request, format=None):
        try:

            items = OrderItem.objects.all()
            serializer = OrderItemSerializer(items,many=True)
            return Response({'items':serializer.data}, status=status.HTTP_200_OK)

        except:
            return Response({'error': 'Items cannot be brought '}, status=status.HTTP_204_NO_CONTENT)


class GetAllOrders(APIView):

    def get(self, request, format=None):
            productos = Order.objects.all()
            serializer = OrderSerializer(productos, many=True)
            return Response({'orders':serializer.data}, status=status.HTTP_200_OK)


class LsitSearchOrder(APIView):
    permission_classes = (permissions.AllowAny, )

    def post(self, request, format=None):
        data = self.request.data


        search = data['search']

        # Chequear si algo input ocurrio en la busqueda
        if len(search) == 0:
            # mostrar todos los productos si no hay input en la busqueda
            search_results = Order.objects.order_by('-date_created').all()
        else:
            # Si hay criterio de busqueda, filtramos con dicho criterio usando Q
            search_results = Order.objects.filter(
                Q(full_name__icontains=search) |  Q(state_province_region__icontains=search)
                | Q(city__icontains=search)
            )

                   
        search_results = OrderSerializer(search_results, many=True)
        return Response({'search_orders': search_results.data}, status=status.HTTP_200_OK)