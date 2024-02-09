from rest_framework import serializers
from .models import Order, OrderItem
from ..product.serializers import ProductSerializer

class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = '__all__'

class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer()
    order = OrderSerializer()
    class Meta:
        model = OrderItem
        fields = '__all__'