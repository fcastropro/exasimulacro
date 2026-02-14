from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import ShowsViewSet, ReservationsViewSet
from .vehicle_services_views import movie_catalog_list_create, movie_catalog_detail
from .service_types_views import reservation_events_list_create, reservation_events_detail

router = DefaultRouter()
router.register(r"shows", ShowsViewSet, basename="shows")
router.register(r"reservations", ReservationsViewSet, basename="reservations")

urlpatterns = [
    path("movie-catalog/", movie_catalog_list_create),
    path("movie-catalog/<str:id>/", movie_catalog_detail),
    

    path("reservation-events/", reservation_events_list_create),
    path("reservation-events/<str:id>/", reservation_events_detail),
]

urlpatterns += router.urls
