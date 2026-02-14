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
    queryset = Reservations.objects.select_related("shows").all().order_by("-id")
    serializer_class = ReservationsSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ["shows"]
    search_fields = ["customer_name", "seats", "status"]
    ordering_fields = ["id", "customer_name", "seats", "status", "created_at"]

    def get_queryset(self):
        qs = super().get_queryset()
        anio_min = self.request.query_params.get("anio_min")
        anio_max = self.request.query_params.get("anio_max")
        if anio_min:
            qs = qs.filter(anio__gte=int(anio_min))
        if anio_max:
            qs = qs.filter(anio__lte=int(anio_max))
        return qs

    def get_permissions(self):
        # Público: SOLO listar vehículos
        if self.action == "list":
            return [AllowAny()]
        return super().get_permissions()