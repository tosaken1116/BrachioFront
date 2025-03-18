import { RouterProvider, createRouter } from "@tanstack/react-router";
import ReactDOM from "react-dom/client";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

import { AuthProvider } from "react-oidc-context";
import "./index.css";

// Import the generated route tree

// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

async function enableMocking() {
  if (!import.meta.env.DEV) return;
  const { worker } = await import("./mocks/browser");
  return worker.start();
}
const cognitoAuthConfig = {
  authority: `${import.meta.env.VITE_COGNITO_AUTHORITY_URL}`,
  client_id: `${import.meta.env.VITE_COGNITO_CLIENT_ID}`,
  redirect_uri: `${import.meta.env.VITE_REDIRECT_URI}`,
  response_type: "code",
  scope: "email openid phone profile aws.cognito.signin.user.admin",
};
// Render the app
enableMocking().then(() => {
  // biome-ignore lint/style/noNonNullAssertion: <explanation>
  const rootElement = document.getElementById("root")!;
  if (!rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <AuthProvider {...cognitoAuthConfig}>
        <RouterProvider router={router} />
      </AuthProvider>
    );
  }
});
