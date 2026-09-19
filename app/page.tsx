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
import ControlRoomFooter from "@/components/sections/ControlRoomFooter";

export const dynamic = "force-dynamic";

export default async function Home() {
  const data = await PortfolioService.getPortfolio();

  return (
    <div className="relative min-h-screen text-[var(--text)] bg-[var(--bg)] font-sans selection:bg-[var(--cyan)] selection:text-[#04120F] overflow-x-hidden">
      <ControlRoomCursor />
      <ControlRoomNav avatarUrl={data.profile.navbarAvatarUrl} />

      <main className="md:ml-[80px] w-full md:w-[calc(100%-80px)] min-h-screen overflow-x-hidden pt-16 md:pt-0">
        <ControlRoomHero profile={data.profile} />
        <ControlRoomAbout profile={data.profile} />
        <MarqueeTicker />
        <ControlRoomSkills skills={data.skills} />
        <ControlRoomProjects projects={data.projects} />
        <ControlRoomExperience experiences={data.experiences} />
        <ControlRoomContact profile={data.profile} />
        <ControlRoomFooter />
      </main>
    </div>
  );
}

