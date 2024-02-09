from django.urls import path
from .views import ListOrdersView, ListOrderDetailView,AdminOrder,GetAllOrders,GetAllItems,LsitSearchOrder

app_name="orders"

urlpatterns = [
    path('get-orders', ListOrdersView.as_view()),
    path('get-order/<transactionId>', ListOrderDetailView.as_view()),
    path('admin-orders/<transactionId>', AdminOrder.as_view()),
    path('get-all-orders/', GetAllOrders.as_view()),
    path('get-all-items/', GetAllItems.as_view()),
    path('search', LsitSearchOrder.as_view()),

]