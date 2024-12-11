import { notFound } from "next/navigation";
import ProjectTeamCard from "@/app/components/ProjectTeamCard";
import CreateTeamButton from "@/app/components/CreateTeamButtom";
import { auth } from '@clerk/nextjs/server'
import { getUserTeamNum } from '@/actions/GetTeamNum'
async function getUserParticipation(userId , project_id) {
    try {
        const res = await getUserTeamNum(userId , project_id);
        if (res.status == 200) {
            return res.message;
        }
        console.log("test function: " );
        console.log(res)
    } catch (error) {
        console.error("Error fetching user participation:", error);
    }
    return null;
}

export default async function projectPage({ params }) {
    const { projectID } = params;
    const {userId} = await auth(); 
    console.log(userId);
    let project = null;
    let Teams = null;
    let teamNumber = null;

    try {
        const [projectRes, participationRes] = await Promise.all([
            fetch(`${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}/api/projects/${projectID}`),
            getUserParticipation(userId , projectID)
        ]);

        if (!projectRes.ok) {
            throw new Error(`HTTP error! status: ${projectRes.status}`);
        }

        project = await projectRes.json();
        teamNumber = participationRes;
    } catch (err) {
        console.log(err);
        return <div>Error loading project data. Please try again later.</div>;
    }

    Teams = project.teams;
    console.log(Teams.length);
    if (!Teams) {
        return notFound();
    }
console.log("current team number " + teamNumber)
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-center gap-6 items-center mb-8">
                <h1 className="text-3xl font-bold">Project Teams</h1>
                {Teams.length < parseInt(project.max_teams) && !teamNumber ?
                    <CreateTeamButton projectID={projectID} userid={userId} TeamNum={Teams.length + 1} />
                    : null}
            </div>
            <div className="grid grid-cols-1 gap-8">
                {Teams.map((team) => (
                    <ProjectTeamCard 
                        key={team.team_num}
                        userid={userId} 
                        Team={team} 
                        projectID={projectID}
                        userTeamNumber={teamNumber}
                        currentRoute={`/projects/${projectID}`}
                    />
                ))}
            </div>
        </div>
    )
}

