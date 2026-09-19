import { PortfolioService } from "@/services/portfolio-service";
import AdminDashboard from "@/components/admin/AdminDashboard";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin Control Center | Mohit Lamba Portfolio",
  description: "Manage portfolio content, photos, resume, projects, and systems experience.",
};

export default async function AdminPage() {
  const data = await PortfolioService.getPortfolio();

  return <AdminDashboard initialData={data} />;
}
