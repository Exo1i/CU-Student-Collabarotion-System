
import { notFound } from "next/navigation";
import ProjectTeamCard from "@/app/components/ProjectTeamCard";
import CreateTeamButton from "@/app/components/CreateTeamButtom";

export default async function projectPage({ params }) {
    const { projectID } = await params
    let project = null;
    let Teams = null;
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/${projectID}`);
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        project = await res.json();
    } catch (err) {
        console.log(err);
        return <div>Error loading course. Please try again later.</div>;
    }
    Teams = project.teams;
    console.log(Teams)
    if (!Teams) {
        return notFound();
    }
    return (

        <div className="container mx-auto px-4 py-8">
            {Teams.length < parseInt(project.maxSize) ? <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Project Teams</h1>
                <CreateTeamButton projectID={projectID} TeamNum={Teams.length + 1} />
            </div> : null}
            <div className="grid grid-cols-1 gap-8">
                {Teams.map((team) => (
                    <ProjectTeamCard key={team.team_num} Team={team} />
                ))}
            </div>
        </div>
        // add Buttom "create team" when click it pop-up appear include input to take team name and buttom to create then pop-up if created successfully or error 
    )
}



