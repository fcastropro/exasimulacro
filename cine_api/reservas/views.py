from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Shows, Reservations
from .serializers import ShowsSerializer, ReservationsSerializer
from .permissions import IsAdminOrReadOnly

class ShowsViewSet(viewsets.ModelViewSet):
    queryset = Shows.objects.all().order_by("id")
    serializer_class = ShowsSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ["movie_title"]
    ordering_fields = ["id", "movie_title"]

class ReservationsViewSet(viewsets.ModelViewSet):
    queryset = Reservations.objects.select_related("show").all().order_by("-id")
    serializer_class = ReservationsSerializer
   
    filterset_fields = ["show", "status"] 
    search_fields = ["customer_name"]

    def get_queryset(self):
     
        return super().get_queryset()

    def get_permissions(self):
        if self.action == "list" or self.action == "create":
            return [AllowAny()]
        return [IsAdminUser()]