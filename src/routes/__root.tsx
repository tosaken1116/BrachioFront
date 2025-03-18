import { Background } from "@/components/ui/background";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export const Route = createRootRoute({
  component: () => (
    <Background>
      <Outlet />
      {import.meta.env.DEV && <TanStackRouterDevtools />}
    </Background>
  ),
});
