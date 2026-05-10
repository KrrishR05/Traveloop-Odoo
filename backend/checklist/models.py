from django.db import models


class PackingItem(models.Model):
    """An item on the packing checklist."""
    CATEGORY_CHOICES = [
        ('clothing', 'Clothing'),
        ('toiletries', 'Toiletries'),
        ('electronics', 'Electronics'),
        ('documents', 'Documents'),
        ('essentials', 'Essentials'),
        ('miscellaneous', 'Miscellaneous'),
    ]

    trip       = models.ForeignKey('trips.Trip', on_delete=models.CASCADE, related_name='packing_items')
    name       = models.CharField(max_length=200)
    category   = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='essentials')
    is_packed  = models.BooleanField(default=False)
    quantity   = models.PositiveIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['category', 'name']

    def __str__(self):
        status = '✓' if self.is_packed else '○'
        return f"{status} {self.name}"
