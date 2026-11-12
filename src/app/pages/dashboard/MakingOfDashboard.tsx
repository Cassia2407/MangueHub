import { useNavigate } from "react-router";
import { MakingOf } from "../../components/making-of";

export function MakingOfDashboard() {
  const navigate = useNavigate();
  return <MakingOf onBack={() => navigate("/dashboard")} />;
}
