"use client";

import { ReactNode, useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import { AuthContext } from "@/contexts/auth-context";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Session } from "@supabase/supabase-js";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const queryClient = useQueryClient();
  const [session, setSession] = useState<Session | null>(null);
  const [isSessionLoading, setIsSessionLoading] = useState(true);
  const supabase = supabaseBrowser() as any;

  // 1. Busca o perfil completo
  const fetchProfile = async () => {
    const { data: { session: currentSession } } = await supabase.auth.getSession();
    if (!currentSession?.user) return null;

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", currentSession.user.id)
      .maybeSingle();
      
    return data;
  };

  // 2. Busca status de Admin na tabela user_roles (Logica original que funcionava)
  const fetchAdminStatus = async (): Promise<boolean> => {
    const { data: { session: currentSession } } = await supabase.auth.getSession();
    if (!currentSession?.user) return false;

    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", currentSession.user.id)
      .eq("role", "admin")
      .maybeSingle();
      
    return !!data;
  };

  // Queries separadas para manter performance
  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ["userProfile", session?.user?.id],
    queryFn: fetchProfile,
    enabled: !!session,
  });

  const { data: isAdmin, isLoading: isAdminLoading } = useQuery({
    queryKey: ["isAdminUser", session?.user?.id],
    queryFn: fetchAdminStatus,
    enabled: !!session,
  });

  useEffect(() => {
    const loadSession = async () => {
      try {
        const { data: { session: localSession } } = await supabase.auth.getSession();
        setSession(localSession);
      } catch (error) {
        console.error("Erro ao carregar sessão:", error);
      } finally {
        setIsSessionLoading(false);
      }
    };

    loadSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event: any, newSession: any) => {
      setSession(newSession);
      setIsSessionLoading(false);
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      queryClient.invalidateQueries({ queryKey: ["isAdminUser"] });
    });

    return () => listener.subscription.unsubscribe();
  }, [queryClient]);

  // Global loading considera o estado da sessão E das duas queries
  const globalLoading = isSessionLoading || (!!session && (isProfileLoading || isAdminLoading));

  return (
    <AuthContext.Provider
      value={{
        user: session?.user ?? null,
        session,
        profile,
        isAdmin: !!isAdmin,
        loading: globalLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}