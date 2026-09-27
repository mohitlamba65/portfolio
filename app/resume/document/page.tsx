import { PortfolioService } from "@/services/portfolio-service";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ResumeDocumentPage() {
  const data = await PortfolioService.getPortfolio();
  const url = data.profile.resumeUrl;
  if (!url) redirect("/#resume");

  return (
    <div className="resume-doc-view">
      <iframe title="Resume PDF" src={url} className="resume-doc-frame" />
    </div>
  );
}
