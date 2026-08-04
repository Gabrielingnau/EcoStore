"use client";

import { Bell, Loader2, Trash2, X } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { toast } from "sonner";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabaseBrowser } from "@/lib/supabase/client";
import { formatBRL } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function NotificationBell({ userId }: { userId?: string }) {
  const queryClient = useQueryClient();

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ["notifications", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data } = await supabaseBrowser()
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .eq("read", false)
        .order("created_at", { ascending: false });
      return data || [];
    },
    enabled: !!userId,
    refetchInterval: 30000,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await supabaseBrowser().from("notifications").delete().eq("id", id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", userId] });
    },
  });

  const deleteAllMutation = useMutation({
    mutationFn: async () => {
      if (!userId) return;
      await supabaseBrowser().from("notifications").delete().eq("user_id", userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", userId] });
      toast.success("Todas as notificações foram limpas");
    },
  });

  useEffect(() => {
    if (!userId) return;

    if (
      Notification.permission !== "granted" &&
      Notification.permission !== "denied"
    ) {
      Notification.requestPermission();
    }

    const channel = supabaseBrowser()
      .channel("notifications-channel")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const newNotification = payload.new;

          queryClient.invalidateQueries({
            queryKey: ["notifications", userId],
          });

          toast.info(newNotification.title || "Nova notificação!");

          if (Notification.permission === "granted") {
            new Notification(newNotification.title || "EcoStore", {
              body: newNotification.message,
              icon: "/icon-192.png",
            });
          }
        },
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [userId, queryClient]);

  return (
    <Popover>
      {/* CORRIGIDO: Adicionado aria-label para o botão de notificações */}
      <PopoverTrigger 
        aria-label="Abrir notificações"
        className="relative h-10 w-10 rounded-xl hover:bg-secondary transition-all flex items-center justify-center"
      >
        <Bell className="h-5 w-5" />
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-background">
            {notifications.length > 99 ? "99+" : notifications.length}
          </span>
        )}
      </PopoverTrigger>

      <PopoverContent
        className="w-80 p-0 overflow-hidden shadow-xl"
        align="end"
      >
        <div className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <h4 className="font-semibold text-sm">Notificações</h4>
          {isLoading && (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          )}
        </div>

        <ScrollArea className="max-h-75">
          <div className="flex flex-col overflow-auto max-h-75">
            {notifications.length > 0 ? (
              notifications.map((n: any) => (
                <div
                  key={n.id}
                  className="relative flex flex-col gap-0.5 p-4 pr-10 border-b hover:bg-secondary/50 transition-colors"
                >
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      deleteMutation.mutate(n.id);
                    }}
                    aria-label="Excluir notificação"
                    className="absolute top-3 right-3 p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all"
                    title="Excluir notificação"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <Link href={n.link || "#"} className="block">
                    <p className="text-sm font-semibold leading-none">
                      {n.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1.5 whitespace-pre-line leading-relaxed">
                      {n.message.replace(/R\$ \d+\.\d{2}/, (match: any) => {
                        const val = parseFloat(match.replace("R$ ", ""));
                        return formatBRL(val);
                      })}
                    </p>
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

        {notifications.length > 0 && (
          <div className="p-2 border-t bg-muted/30">
            <button
              onClick={() => deleteAllMutation.mutate()}
              disabled={deleteAllMutation.isPending}
              className="w-full py-2 px-3 text-xs font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all flex items-center justify-center gap-2"
            >
              {deleteAllMutation.isPending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Trash2 className="h-3.5 w-3.5" />
              )}
              Limpar todas as notificações
            </button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}