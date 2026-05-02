import { Dashboard } from "./features/dashboard/Dashboard";
import { KdbProvider } from "./context/KdbProvider";

export default function App() {
  return (
    <KdbProvider>
      <Dashboard />
    </KdbProvider>
  );
}
