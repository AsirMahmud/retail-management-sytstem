from django.contrib import admin
from .models import Report, ReportMetric, ReportDataPoint, SavedReport

@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    list_display = ('name', 'report_type', 'date_from', 'date_to', 'is_saved', 'created_at')
    list_filter = ('report_type', 'is_saved', 'created_at')
    search_fields = ('name', 'notes')
    date_hierarchy = 'created_at'

@admin.register(ReportMetric)
class ReportMetricAdmin(admin.ModelAdmin):
    list_display = ('metric_name', 'metric_value', 'metric_type', 'report', 'created_at')
    list_filter = ('metric_type', 'created_at')
    search_fields = ('metric_name',)
    date_hierarchy = 'created_at'

@admin.register(ReportDataPoint)
class ReportDataPointAdmin(admin.ModelAdmin):
    list_display = ('label', 'value', 'date', 'category', 'report', 'created_at')
    list_filter = ('category', 'created_at')
    search_fields = ('label', 'category')
    date_hierarchy = 'date'

@admin.register(SavedReport)
class SavedReportAdmin(admin.ModelAdmin):
    list_display = ('name', 'report', 'is_favorite', 'created_at', 'updated_at')
    list_filter = ('is_favorite', 'created_at')
    search_fields = ('name', 'description')
    date_hierarchy = 'created_at' 