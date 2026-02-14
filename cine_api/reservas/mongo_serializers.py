from rest_framework import serializers

class MovieCatalogSerializer(serializers.Serializer):
    movie_title = serializers.CharField(max_length=120)
    genre = serializers.CharField(max_length=120)
    duration_min = serializers.IntegerField()
    rating = serializers.CharField(max_length=10)
    is_active = serializers.BooleanField(default=True)


class ReservationEventsSerializer(serializers.Serializer):
    reservation_id = serializers.IntegerField()
    event_type = serializers.ChoiceField(choices=['CREATED', 'CONFIRMED', 'CANCELLED', 'CHECKED_IN'])
    source = serializers.ChoiceField(choices=['WEB', 'MOBILE', 'SYSTEM'])
    note = serializers.CharField(required=False, allow_blank=True)
    created_at = serializers.DateTimeField(read_only=True)
