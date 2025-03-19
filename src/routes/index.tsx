import { Button } from "@/components/ui/button";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuth } from "react-oidc-context";

function App() {
  const auth = useAuth();

  const navigate = useNavigate();
  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    return <div>Encountering error... {auth.error.message}</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center gap-12 w-fit mx-auto my-auto h-screen">
      <Title />
      <Button
        variant="outline"
        onClick={() => {
          auth.isAuthenticated
            ? navigate({ to: "/home" })
            : auth.signinRedirect();
        }}
        className="text-4xl rounded-full px-12 py-8"
      >
        {auth.isAuthenticated ? "ログイン" : "始める"}
      </Button>
    </div>
  );
}

export const Title = () => {
  return (
    <div className="flex flex-col">
      <strong className=" font-pokemon font-bold text-9xl text-yellow-400  drop-shadow-[0_5.20px_1.10px_rgba(0,0,0,0.8)]">
        Pokemon
      </strong>
      <div className="border-8 rounded-sm bg-gradient-to-b from-red-500 to-red-800 border-blue-950 text-white flex w-fit mx-auto  px-8">
        <strong className="text-2xl font-bold text-center">
          TRADING CARD GAME
        </strong>
      </div>
      <div className="mx-auto">
        <p className="text-5xl">Pocket</p>
      </div>
    </div>
  );
};

export const Route = createFileRoute("/")({
  component: App,
});
