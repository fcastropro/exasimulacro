from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

class Shows(models.Model):
    movie_title = models.CharField(max_length=120, unique=True)
    room = models.CharField(max_length=20, unique=True)
    price = models.DecimalField(
        max_digits=10,  # total de dígitos
        decimal_places=2,  # decimales
        default=0
    )
    available_seats = models.IntegerField(
        null=True, blank=True,
        validators=[MinValueValidator(0), MaxValueValidator(120)]
    )
    def __str__(self):
        return self.movie_title

class Reservations(models.Model):
    show = models.ForeignKey(Shows, on_delete=models.PROTECT, related_name="reservaciones")
    customer_name = models.CharField(max_length=120)
    seats = models.IntegerField()
    status = models.CharField(max_length=20) 
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.customer_name} ({self.status})"