import { useQuery } from '@tanstack/react-query';
import { DateRange } from 'react-day-picker';
import { reportsApi, formatDateRange, ReportDateRange } from '@/lib/api/reports';

export const useSalesReport = (dateRange: DateRange | undefined) => {
    const formattedDateRange = formatDateRange(dateRange);

    return useQuery({
        queryKey: ['sales-report', formattedDateRange],
        queryFn: () => reportsApi.getSalesReport(formattedDateRange!),
        enabled: !!formattedDateRange,
    });
};

export const useExpenseReport = (dateRange: DateRange | undefined) => {
    const formattedDateRange = formatDateRange(dateRange);

    return useQuery({
        queryKey: ['expense-report', formattedDateRange],
        queryFn: () => reportsApi.getExpenseReport(formattedDateRange!),
        enabled: !!formattedDateRange,
    });
};

export const useInventoryReport = () => {
    return useQuery({
        queryKey: ['inventory-report'],
        queryFn: reportsApi.getInventoryReport,
    });
};

export const useCustomerReport = (dateRange: DateRange | undefined) => {
    const formattedDateRange = formatDateRange(dateRange);

    return useQuery({
        queryKey: ['customer-report', formattedDateRange],
        queryFn: () => reportsApi.getCustomerReport(formattedDateRange!),
        enabled: !!formattedDateRange,
    });
};

export const useCategoryReport = () => {
    return useQuery({
        queryKey: ['category-report'],
        queryFn: reportsApi.getCategoryReport,
    });
};

export const useProfitLossReport = (dateRange: DateRange | undefined) => {
    const formattedDateRange = formatDateRange(dateRange);

    return useQuery({
        queryKey: ['profit-loss-report', formattedDateRange],
        queryFn: () => reportsApi.getProfitLossReport(formattedDateRange!),
        enabled: !!formattedDateRange,
    });
};

export const useProductPerformanceReport = (dateRange: DateRange | undefined) => {
    const formattedDateRange = formatDateRange(dateRange);

    return useQuery({
        queryKey: ['product-performance-report', formattedDateRange],
        queryFn: () => reportsApi.getProductPerformanceReport(formattedDateRange!),
        enabled: !!formattedDateRange,
    });
}; 