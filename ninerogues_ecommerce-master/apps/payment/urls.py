from django.urls import path
from .views import GenerateTokenView, GetPaymentTotalView, ProcessPaymentView,PaymentIntentStripe

app_name="payment"

urlpatterns = [
    path('get-payment-total', GetPaymentTotalView.as_view()),
    path('get-token', GenerateTokenView.as_view()),
    path('make-payment', ProcessPaymentView.as_view()),
    path('stripe-payment', PaymentIntentStripe.as_view()),
]