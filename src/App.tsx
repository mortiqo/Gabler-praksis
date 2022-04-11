import { KeycloakProvider } from "providers/KeycloakProvider";
import { ToastContainer } from "react-toastify";
import { keycloakService } from "services/keycloakService";
import { UserWithLinkedContactRoutes } from "./pages/userWithLinkedContact/routes";
import { APILanguageProvider } from "./providers/APILanguageProvider/APILanguageProvider";
import { PersistedApolloProvider } from "./providers/PersistedApolloProvider";
import { ServiceWorkerRegistrationProvider } from "./providers/ServiceWorkerRegistrationProvider";
import "react-toastify/dist/ReactToastify.css";
import "styles/fonts.css";

function App() {
  return (
    <div>
      <KeycloakProvider keycloak={keycloakService}>
        <PersistedApolloProvider>
          <APILanguageProvider>
            <ServiceWorkerRegistrationProvider>
              <UserWithLinkedContactRoutes />
            </ServiceWorkerRegistrationProvider>
          </APILanguageProvider>
        </PersistedApolloProvider>
      </KeycloakProvider>
      <ToastContainer />
    </div>
  );
}

export default App;
