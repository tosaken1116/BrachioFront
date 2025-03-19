import { Background } from "@/components/ui/background";
import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { CreditCardIcon, GiftIcon, Home, Swords, Wallet2 } from "lucide-react";

export const Route = createRootRoute({
  component: () => (
    <Background>
      <Outlet />
      {import.meta.env.DEV && <TanStackRouterDevtools />}
      <footer className="flex flex-row w-full absolute bottom-0 left-0  items-center justify-center mx-auto gap-12">
        <Link to="/home">
          <Home className="w-12 h-12" />
        </Link>
        <Link to="/decks">
          <Wallet2 className="w-12 h-12" />
        </Link>
        <Link to="/cards">
          <CreditCardIcon className="w-12 h-12" />
        </Link>
        <Link to="/battle">
          <Swords className="w-12 h-12" />
        </Link>
        <Link to="/presents">
          <GiftIcon className="w-12 h-12" />
        </Link>
      </footer>
    </Background>
  ),
});
