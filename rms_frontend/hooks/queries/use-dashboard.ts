import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { DashboardStats } from "@/types/dashboard";

export function useDashboard() {
    return useQuery<DashboardStats>({
        queryKey: ["dashboard-stats"],
        queryFn: async () => {
            const response = await api.get("/dashboard/stats/");
            return response.data;
        },
        refetchInterval: 300000, // Refetch every 5 minutes
    });
} 