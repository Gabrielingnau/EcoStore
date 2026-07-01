"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Bell, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { supabaseBrowser } from "@/lib/supabase/client";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export function NotificationBell({ userId }: { userId?: string }) {
  const queryClient = useQueryClient();

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications', userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data } = await supabaseBrowser()
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .eq('read', false)
        .order('created_at', { ascending: false });
      return data || [];
    },
    enabled: !!userId,
    refetchInterval: 30000, 
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await supabaseBrowser().from('notifications').delete().eq('id', id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
    }
  });

  useEffect(() => {
  if (!userId) return;

  // Solicita permissão ao carregar o componente se ainda não tiver
  if (Notification.permission !== "granted" && Notification.permission !== "denied") {
    Notification.requestPermission();
  }

  const channel = supabaseBrowser()
    .channel('notifications-channel')
    .on('postgres_changes', { 
      event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` 
    }, (payload) => {
      const newNotification = payload.new;
      
      // 1. Atualiza o React Query
      queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
      
      // 2. Dispara o toast do site
      toast.info(newNotification.title || "Nova notificação!");

      // 3. Dispara a notificação do Sistema Operacional (Celular/Desktop)
      if (Notification.permission === "granted") {
        new Notification(newNotification.title || "EcoStore", {
          body: newNotification.message,
          icon: '/icon-192.png', // Coloque o caminho do seu ícone na pasta public
        });
      }
    })
    .subscribe();

  return () => { channel.unsubscribe(); };
}, [userId, queryClient]);

  return (
    <Popover>
      <PopoverTrigger className="relative h-10 w-10 rounded-xl hover:bg-secondary transition-all flex items-center justify-center">
        <Bell className="h-5 w-5" />
        {notifications.length > 0 && (
          <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-red-500 rounded-full border border-background" />
        )}
      </PopoverTrigger>
      
      <PopoverContent className="w-80 p-0 overflow-hidden shadow-xl" align="end">
        <div className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <h4 className="font-semibold text-sm">Notificações</h4>
          {isLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
        </div>
        
        {/* ScrollArea melhorado */}
        <ScrollArea className="max-h-75">
          <div className="flex flex-col overflow-auto max-h-75">
            {notifications.length > 0 ? (
              notifications.map((n: any) => (
                <div key={n.id} className="group relative flex flex-col gap-0.5 p-4 border-b hover:bg-secondary/50 transition-colors">
                  <button 
                    onClick={(e) => { e.preventDefault(); deleteMutation.mutate(n.id); }}
                    className="absolute top-3 right-3 p-1 rounded-md opacity-0 group-hover:opacity-100 hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                  <Link href={n.link || "#"} className="block pr-6">
                    <p className="text-sm font-semibold leading-none">{n.title}</p>
                    <p className="text-xs text-muted-foreground mt-1.5 whitespace-pre-line leading-relaxed">{n.message}</p>
                  </Link>
                </div>
              ))
            ) : (
              <div className="p-8 text-sm text-muted-foreground text-center">
                Tudo limpo por aqui!
              </div>
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}