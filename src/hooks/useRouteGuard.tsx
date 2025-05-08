import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAgentStore } from "../store/agentStore";

export function useRouteGuard() {
  const router = useRouter();
  const pathname = usePathname();
  const { agent, agentLoading } = useAgentStore();

  useEffect(() => {
    if (agentLoading) return; // Wait for agent initialization

    if (agent && pathname === "/") {
      router.push("/dashboard");
    } else if (!agent && pathname !== "/") {
      router.push("/");
    }
  }, [agent, agentLoading, pathname, router]);
}
