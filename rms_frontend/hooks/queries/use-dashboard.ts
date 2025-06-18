import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { DashboardStats } from "@/types/dashboard";

export function useDashboard() {
    return useQuery<DashboardStats>({
        queryKey: ["dashboard-stats"],
        queryFn: async () => {
            try {
                const response = await api.get("/dashboard/stats/");
                return response.data;
            } catch (error) {
                console.error("Dashboard data fetch error:", error);
                throw error;
            }
        },
        refetchInterval: 300000, // Refetch every 5 minutes
        retry: 3, // Retry failed requests up to 3 times
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
        staleTime: 60000, // Consider data stale after 1 minute
        gcTime: 300000, // Keep data in cache for 5 minutes
    });
} 