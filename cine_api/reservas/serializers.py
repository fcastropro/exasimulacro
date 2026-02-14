from rest_framework import serializers
from .models import Shows, Reservations

class ShowsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shows
        fields = ["id", "movie_title","room","price","available_seats"]

class ReservationsSerializer(serializers.ModelSerializer):
    show_name = serializers.CharField(source="show.movie_title", read_only=True)

    class Meta:
        model = Reservations
        fields = ['id', 'show', 'show_name', 'customer_name', 'seats', 'status', 'created_at']