import { Challenger } from "@/domains/battle/components/Challenger";
import { PasswordInput } from "@/domains/battle/components/PasswordInput";
import { useBattle } from "@/domains/battle/hooks/useBattle";
import { client } from "@/lib/api/client";
import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "react-oidc-context";

function App() {
  const auth = useAuth();
  const signOutRedirect = () => {
    const clientId = import.meta.env.VITE_COGNITO_CLIENT_ID;
    const logoutUri = import.meta.env.VITE_REDIRECT_URI;
    const cognitoDomain = import.meta.env.VITE_COGNITO_AUTH_DOMAIN;
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(
      logoutUri
    )}`;
  };
  const {
    handleConnect,
    isConnected,
    state: { otherId },
  } = useBattle();

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    return <div>Encountering error... {auth.error.message}</div>;
  }

  if (auth.isAuthenticated) {
    return (
      <div>
        <pre> Hello: {auth.user?.profile.email} </pre>
        <pre> ID Token: {auth.user?.id_token} </pre>
        <pre> Access Token: {auth.user?.access_token} </pre>
        <pre> Refresh Token: {auth.user?.refresh_token} </pre>

        <button onClick={() => auth.removeUser()}>Sign out</button>
        <button onClick={() => client.GET("/")}>request </button>
        <button onClick={handleConnect}>connect!!!</button>
        {isConnected && <PasswordInput />}
        {otherId && <Challenger id={otherId} />}
      </div>
    );
  }

  return (
    <div>
      <button onClick={() => auth.signinRedirect()}>Sign in</button>
      <button onClick={() => signOutRedirect()}>Sign out</button>
      <button onClick={() => client.GET("/")}>request </button>
    </div>
  );
}

export const Route = createFileRoute("/")({
  component: App,
});
