from django.db import models

class InventoryItem(models.Model):
    CATEGORY_CHOICES = (
        ('TUBES', 'Collection Tubes (EDTA, Serum, Fluoride)'),
        ('SYRINGES', 'Syringes & Needles'),
        ('PPE', 'Gloves, Masks & PPE'),
        ('CONTAINERS', 'Sample Collection Containers'),
        ('REAGENTS', 'Diagnostic Reagents & Strips'),
        ('MISC', 'Other Consumables'),
    )

    name = models.CharField(max_length=150)
    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES, default='TUBES')
    sku = models.CharField(max_length=50, unique=True)
    quantity = models.IntegerField(default=0)
    unit = models.CharField(max_length=50, default='Pieces', help_text="e.g., Pieces, Boxes, Vials, Packs")
    reorder_level = models.IntegerField(default=20, help_text="Threshold to trigger low-stock warning")
    cost_per_unit = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    supplier = models.CharField(max_length=150, blank=True, default='MedSupply Healthcare Jamshedpur')
    last_restocked = models.DateTimeField(auto_now=True)

    @property
    def is_low_stock(self):
        return self.quantity <= self.reorder_level

    def __str__(self):
        return f"{self.name} ({self.quantity} {self.unit})"
