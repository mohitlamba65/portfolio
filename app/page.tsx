import { PortfolioService } from "@/services/portfolio-service";
import ControlRoomNav from "@/components/ControlRoomNav";
import ControlRoomCursor from "@/components/ControlRoomCursor";
import ControlRoomHero from "@/components/sections/ControlRoomHero";
import ControlRoomAbout from "@/components/sections/ControlRoomAbout";
import MarqueeTicker from "@/components/MarqueeTicker";
import ControlRoomSkills from "@/components/sections/ControlRoomSkills";
import ControlRoomProjects from "@/components/sections/ControlRoomProjects";
import ControlRoomExperience from "@/components/sections/ControlRoomExperience";
import ControlRoomContact from "@/components/sections/ControlRoomContact";

export const dynamic = "force-dynamic";

export default async function Home() {
  const data = await PortfolioService.getPortfolio();

  return (
    <div className="relative min-h-screen text-[var(--text)] bg-[var(--bg)] font-sans selection:bg-[var(--cyan)] selection:text-[#04120F]">
      <ControlRoomCursor />
      <ControlRoomNav avatarUrl={data.profile.avatarUrl} />

      <main className="md:ml-[280px] max-w-5xl mx-auto px-6 md:px-12 w-full pb-32">
        <ControlRoomHero profile={data.profile} />
        <ControlRoomAbout profile={data.profile} />
        <MarqueeTicker />
        <ControlRoomSkills skills={data.skills} />
        <ControlRoomProjects projects={data.projects} />
        <ControlRoomExperience experience={data.experience} />
        <ControlRoomContact profile={data.profile} />
      </main>
    </div>
  );
}
