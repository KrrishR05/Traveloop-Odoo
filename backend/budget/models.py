from django.db import models


class BudgetCategory(models.Model):
    """Budget category for organizing expenses."""
    CATEGORY_CHOICES = [
        ('accommodation', 'Accommodation'),
        ('transportation', 'Transportation'),
        ('food', 'Food & Dining'),
        ('activities', 'Activities & Tours'),
        ('shopping', 'Shopping'),
        ('insurance', 'Insurance'),
        ('visa', 'Visa & Documents'),
        ('miscellaneous', 'Miscellaneous'),
    ]

    trip     = models.ForeignKey('trips.Trip', on_delete=models.CASCADE, related_name='budget_categories')
    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES)
    planned  = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    color    = models.CharField(max_length=7, default='#14b8a6')

    class Meta:
        unique_together = ['trip', 'category']
        ordering = ['category']

    def __str__(self):
        return f"{self.get_category_display()} — {self.trip.title}"

    @property
    def spent(self):
        return self.items.aggregate(total=models.Sum('amount'))['total'] or 0

    @property
    def remaining(self):
        return float(self.planned) - float(self.spent)


class BudgetItem(models.Model):
    """Individual expense entry."""
    category    = models.ForeignKey(BudgetCategory, on_delete=models.CASCADE, related_name='items')
    title       = models.CharField(max_length=200)
    amount      = models.DecimalField(max_digits=10, decimal_places=2)
    date        = models.DateField()
    notes       = models.TextField(blank=True, default='')
    created_at  = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date', '-created_at']

    def __str__(self):
        return f"{self.title} — ${self.amount}"
