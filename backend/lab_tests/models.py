from django.db import models

class TestCategory(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, default='activity')

    class Meta:
        verbose_name_plural = 'Test Categories'

    def __str__(self):
        return self.name

class LabTest(models.Model):
    name = models.CharField(max_length=200)
    code = models.CharField(max_length=50, unique=True)
    category = models.ForeignKey(TestCategory, on_delete=models.CASCADE, related_name='tests')
    price = models.DecimalField(max_digits=10, decimal_places=2)
    discount_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    sample_type = models.CharField(max_length=100, default='Blood')
    fasting_required = models.BooleanField(default=False)
    fasting_hours = models.IntegerField(default=0)
    turnaround_hours = models.IntegerField(default=12)
    parameters_included = models.TextField(blank=True, help_text="Comma-separated parameters tested")
    preparation_instructions = models.TextField(blank=True)
    description = models.TextField(blank=True)
    is_popular = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} (₹{self.discount_price or self.price})"

    @property
    def final_price(self):
        return self.discount_price if self.discount_price else self.price
