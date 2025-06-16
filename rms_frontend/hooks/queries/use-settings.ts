import { useMutation } from '@tanstack/react-query';
import { flushDatabase } from '@/lib/api/settings';
import { useToast } from '@/hooks/use-toast';

export const useFlushDatabase = () => {
    const { toast } = useToast();

    return useMutation({
        mutationFn: (databaseType: string) => flushDatabase(databaseType),
        onSuccess: (data) => {
            toast({
                title: 'Success',
                description: data.message,
                variant: 'default',
            });
        },
        onError: (error: any) => {
            toast({
                title: 'Error',
                description: error.response?.data?.error || 'Failed to flush database',
                variant: 'destructive',
            });
        },
    });
}; 