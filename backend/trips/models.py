from django.db import models


class Trip(models.Model):
    """A travel trip planned by a user."""

    TRIP_TYPE_CHOICES = [
        ('adventure', 'Adventure'),
        ('relaxation', 'Relaxation'),
        ('cultural', 'Cultural'),
        ('romantic', 'Romantic'),
        ('family', 'Family'),
        ('business', 'Business'),
    ]

    STATUS_CHOICES = [
        ('upcoming', 'Upcoming'),
        ('ongoing', 'Ongoing'),
        ('completed', 'Completed'),
    ]

    title       = models.CharField(max_length=200)
    destination = models.CharField(max_length=200)
    start_date  = models.DateField()
    end_date    = models.DateField()
    description = models.TextField(blank=True, default='')
    trip_type   = models.CharField(max_length=20, choices=TRIP_TYPE_CHOICES, default='adventure')
    budget      = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    cover_image = models.URLField(blank=True, default='')
    status      = models.CharField(max_length=20, choices=STATUS_CHOICES, default='upcoming')
    rating      = models.IntegerField(null=True, blank=True)
    created_at  = models.DateTimeField(auto_now_add=True)
    updated_at  = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} — {self.destination}"

    @property
    def duration_days(self):
        return (self.end_date - self.start_date).days + 1


class ItineraryDay(models.Model):
    """A single day within a trip itinerary."""
    trip  = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name='itinerary_days')
    day   = models.PositiveIntegerField()
    title = models.CharField(max_length=200, blank=True, default='')
    notes = models.TextField(blank=True, default='')

    class Meta:
        ordering = ['day']
        unique_together = ['trip', 'day']

    def __str__(self):
        return f"Day {self.day} of {self.trip.title}"


class ItineraryItem(models.Model):
    """An activity item within a day."""
    itinerary_day = models.ForeignKey(ItineraryDay, on_delete=models.CASCADE, related_name='items')
    time          = models.CharField(max_length=20, blank=True, default='')
    title         = models.CharField(max_length=200)
    description   = models.TextField(blank=True, default='')
    location      = models.CharField(max_length=200, blank=True, default='')
    cost          = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    order         = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.title
