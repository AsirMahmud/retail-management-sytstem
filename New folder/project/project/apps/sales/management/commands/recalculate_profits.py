from django.core.management.base import BaseCommand
from django.db import transaction
from apps.sales.models import Sale, SaleItem
from decimal import Decimal

class Command(BaseCommand):
    help = 'Recalculate profit values for all sales to fix discount calculation issues'

    def add_arguments(self, parser):
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Show what would be updated without making changes',
        )

    def handle(self, *args, **options):
        dry_run = options['dry_run']
        
        if dry_run:
            self.stdout.write(self.style.WARNING('DRY RUN MODE - No changes will be made'))
        
        # Get all completed sales
        sales = Sale.objects.filter(status='completed')
        total_sales = sales.count()
        
        self.stdout.write(f'Found {total_sales} completed sales to process')
        
        updated_count = 0
        error_count = 0
        
        for sale in sales:
            try:
                if dry_run:
                    # Just calculate what the new values would be
                    old_total_profit = sale.total_profit
                    old_total_loss = sale.total_loss
                    
                    # Recalculate totals
                    sale.calculate_totals()
                    
                    new_total_profit = sale.total_profit
                    new_total_loss = sale.total_loss
                    
                    if old_total_profit != new_total_profit or old_total_loss != new_total_loss:
                        self.stdout.write(
                            f'Sale {sale.invoice_number}: '
                            f'Profit: {old_total_profit} → {new_total_profit}, '
                            f'Loss: {old_total_loss} → {new_total_loss}'
                        )
                        updated_count += 1
                else:
                    # Actually update the sale
                    with transaction.atomic():
                        sale.calculate_totals()
                        updated_count += 1
                        
                        if updated_count % 100 == 0:
                            self.stdout.write(f'Processed {updated_count} sales...')
                            
            except Exception as e:
                error_count += 1
                self.stdout.write(
                    self.style.ERROR(f'Error processing sale {sale.invoice_number}: {str(e)}')
                )
        
        if dry_run:
            self.stdout.write(
                self.style.SUCCESS(
                    f'DRY RUN COMPLETE: Would update {updated_count} sales, {error_count} errors'
                )
            )
        else:
            self.stdout.write(
                self.style.SUCCESS(
                    f'COMPLETE: Updated {updated_count} sales, {error_count} errors'
                )
            ) 