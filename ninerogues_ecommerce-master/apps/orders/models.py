from django.db import models
from apps.product.models import Product
from .countries import Countries
from datetime import datetime
from django.contrib.auth import get_user_model
User = get_user_model()


class Order(models.Model):
    class OrderStatus(models.TextChoices):
        no_procesado = 'no_procesado'
        procesado = 'procesado'
        enviado = 'enviado'
        entregada = 'entregada'
        cancelada = 'cancelada'
    
    status = models.CharField(
        max_length=50, choices=OrderStatus.choices, default=OrderStatus.no_procesado)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    transaction_id = models.CharField(max_length=255, unique=True)
    amount = models.DecimalField(max_digits=5, decimal_places=2)
    full_name = models.CharField(max_length=255)
    address_line_1 = models.CharField(max_length=255)
    address_line_2 = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=255)
    state_province_region = models.CharField(max_length=255)
    postal_zip_code = models.CharField(max_length=20)
    country_region = models.CharField(
        max_length=255, choices=Countries.choices, default=Countries.Ecuador)
    telephone_number = models.CharField(max_length=255)
    shipping_name = models.CharField(max_length=255,default="...")
    shipping_time = models.CharField(max_length=255,default="...")
    shipping_price = models.DecimalField(max_digits=5, decimal_places=2,default=0)
    date_issued = models.DateTimeField(default=datetime.now)

    def __str__(self):
        return self.transaction_id


class OrderItem(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=5, decimal_places=2)
    count = models.IntegerField()
    date_added = models.DateTimeField(default=datetime.now)

    def __str__(self):
        return self.name