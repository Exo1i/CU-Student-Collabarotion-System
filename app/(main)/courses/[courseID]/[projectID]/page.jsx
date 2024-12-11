import { notFound } from "next/navigation";
import ProjectTeamCard from "@/app/components/ProjectTeamCard";
import CreateTeamButton from "@/app/components/CreateTeamButtom";
import { auth } from '@clerk/nextjs/server'
import { getUserTeamNum } from '@/actions/GetTeamNum'
import { getRole } from "@/actions/GetRole";
import CustomLink from "@/app/components/MyCustomLink";
async function getUserParticipation(userId, project_id) {
    try {
        const res = await getUserTeamNum(userId, project_id);
        if (res.status == 200) {
            return res.student;
        }
        console.log("test function: ");
        console.log(res)
    } catch (error) {
        console.error("Error fetching user participation:", error);
    }
    return null;
}

export default async function projectPage({ params }) {
    const role = await getRole();
    const { projectID } = params;
    const {courseID} = params;
    const { userId } = await auth();
    console.log(userId);
    let project = null;
    let Teams = null;
    let currentuserdata = null;

    try {
        const [projectRes, participationRes] = await Promise.all([
            fetch(`${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}/api/projects/${projectID}`),
            getUserParticipation(userId , projectID)
        ]);

        if (!projectRes.ok) {
            throw new Error(`HTTP error! status: ${projectRes.status}`);
        }

        project = await projectRes.json();
        currentuserdata = participationRes;
    } catch (err) {
        console.log(err);
        return <div>Error loading project data. Please try again later.</div>;
    }

    Teams = project.teams;
    console.log(Teams.length);
    if (!Teams) {
        return notFound();
    }
    console.log("currentuserdata " + currentuserdata)
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-center gap-6 items-center mb-8">
                <h1 className="text-3xl font-bold">Project Teams</h1>
                {Teams.length < parseInt(project.max_teams) && !currentuserdata && role === 'student' ?
                    <CreateTeamButton projectID={projectID} userid={userId} TeamNum={Teams.length + 1} />
                    : <CustomLink className="text-center" href={`/courses/${courseID}/${projectID}/phases`}>
                        View phases
                    </CustomLink>}
            </div>
            <div className="grid grid-cols-1 gap-8">
                {Teams.map((team) => (
                    <ProjectTeamCard
                        key={team.team_num}
                        userid={userId}
                        Team={team}
                        projectID={projectID}
                        currentuserdata={currentuserdata}
                        currentRoute={`/projects/${projectID}`}
                    />
                ))}
            </div>
        </div>
    )
}

