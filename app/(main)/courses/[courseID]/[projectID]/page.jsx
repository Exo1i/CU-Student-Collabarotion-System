'use client'
import { notFound } from "next/navigation";
import ProjectTeamCard from "@/app/components/ProjectTeamCard";
import CreateTeamButton from "@/app/components/CreateTeamButtom";
import { getUserTeamNum } from '@/actions/GetTeamNum'
import { getRole } from "@/actions/GetRole";
import CustomLink from "@/app/components/MyCustomLink";
import { useEffect, useState } from "react";
import { useUser } from '@clerk/nextjs';
import Loading from "@/app/(main)/loading";
async function getUserParticipation(userId, project_id) {
    if(userId != null && project_id != null) {
        try {
            console.log(userId + project_id);
            const res = await getUserTeamNum(userId, project_id);
            if (res.status == 200) {
                return res.student;
            }
            console.log("test function: ");
            console.log(res)
        } catch (error) {
            console.error("Error fetching user participation:", error);
        }
    }
    return null;
}

export default function ProjectPage({ params }) {
    const [refreshKey, setRefreshKey] = useState(0);
    const handleRefresh = () => {
        console.log("handleRefresh");
        setRefreshKey((prev) => prev + 1); 
    };
    const [role , setrole] = useState(null);
    const [projectID, setprojectID] = useState(null);
    const [courseID, setcourseID] = useState(null);
    const [project, setproject] = useState(null);
    const [Teams, setTeams] = useState(null);
    const [currentuserdata, setcurrentuserdata] = useState(null);
    const [loading, setloading] = useState(true);
    const [error, seterror] = useState(null);
    useEffect(() => {
        const getparams = async () => {
            params.then(((resolvedparams) => {
                setprojectID(resolvedparams.projectID);
                setcourseID(resolvedparams.courseID);
            }))
        }
        getparams();
    }, [params, projectID, courseID])
    const { user  , isLoaded , isSignedIn } = useUser();
    useEffect(() => {
        const fetchdata = async () => {
            try {
                const [projectRes, participationRes , fetchedrole] = await Promise.all([
                    fetch(
                        `/api/projects/${projectID}`
                    ),
                    getUserParticipation(user.id, projectID),
                    getRole()
                ]);
                if (!projectRes.ok) {
                    throw new Error(`HTTP error! status: ${projectRes.status}`);

                }
                const fetchedproject = await projectRes.json();
                setproject(fetchedproject);
                setTeams(fetchedproject.teams)
                setrole(fetchedrole)
                console.log("fetched project :" + JSON.stringify(fetchedproject.teams));
                setcurrentuserdata(participationRes);
            } catch (err) {
                seterror(err.message);
                console.log(err);
            } finally {
                setloading(false);
            }
        }
        if(isLoaded && isSignedIn && projectID) {
            fetchdata();
        }
    }, [projectID , isSignedIn , isLoaded , refreshKey])

    if (loading || !isLoaded || !isSignedIn) {
        return <Loading />
    }

    if (error) {
        return <div className="text-center text-red-500">Error: {error}</div>
    }
    if (!Teams) {
        return notFound();
    }
    console.log("currentuserdata " + currentuserdata)
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-center gap-6 items-center mb-8">
                <h1 className="text-3xl font-bold">Project Teams</h1>
                {Teams.length < parseInt(project.max_teams) && !currentuserdata && role === 'student' ?
                    <CreateTeamButton projectID={projectID} userid={user.id} TeamNum={Teams.length === 0 ? 1 : Teams[Teams.length - 1].team_num + 1} onRefresh={handleRefresh} />
                    : null}
                {role !== 'student' ?
                    <CustomLink className="text-center" href={`/courses/${courseID}/${projectID}/phases`}>
                        View phases
                    </CustomLink> : null
                }
            </div>
            <div className="grid grid-cols-1 gap-8">
                {Teams.map((team) => (
                    <ProjectTeamCard
                        key={team.team_num}
                        userid={user.id}
                        Team={team}
                        projectID={projectID}
                        currentuserdata={currentuserdata}
                        currentRoute={`/projects/${projectID}`}
                        onRefresh={handleRefresh}
                    />
                ))}
            </div>
        </div>
    )
}
