import React, {useState} from 'react';
import {columns} from "@/app/admin/columns";
import {DataTable} from "@/app/admin/data-table";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [announcement, setAnnouncement] = useState('');
    const [loading, setLoading] = useState(false);

    // Statistics data
    const stats = {
        totalUsers: 2584, activeProjects: 156, activeCourses: 42, pendingApprovals: 18
    };

    const fetchUsers = async () => {
        try {
            const response = await fetch('/api/users');
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching users:', error);
            return [];
        }
    };

    const updateUserRole = async (userId, newRole) => {
        try {
            const response = await fetch(`/api/role/${userId}`, {
                method: 'PUT', headers: {
                    'Content-Type': 'application/json',
                }, body: JSON.stringify({role: newRole}),
            });
            if (!response.ok) throw new Error('Failed to update role');
            // Refresh user data
        } catch (error) {
            console.error('Error updating user role:', error);
        }
    };

    const handleAnnouncementSubmit = async () => {
        setLoading(true);
        try {
            // Implement Firebase messaging here
            console.log('Sending announcement:', announcement);
            setAnnouncement('');
        } catch (error) {
            console.error('Error sending announcement:', error);
        } finally {
            setLoading(false);
        }
    };

    return (<div className="p-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.totalUsers}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.activeProjects}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.activeCourses}</div>
                </CardContent>
            </Card>
        </div>

        {/* Announcement Section */}
        <Card className="mb-8">
            <CardHeader>
                <CardTitle>Send Announcement</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <Textarea
                        placeholder="Type your announcement message..."
                        value={announcement}
                        onChange={(e) => setAnnouncement(e.target.value)}
                        className="min-h-[100px]"
                    />
                    <Button
                        onClick={handleAnnouncementSubmit}
                        disabled={loading || !announcement.trim()}
                    >
                        {loading ? 'Sending...' : 'Send Announcement'}
                    </Button>
                </div>
            </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="users" className="space-y-4">
            <TabsList>
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="courses">Courses</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
            </TabsList>

            <TabsContent value="users" className="space-y-4">
                <DataTable columns={columns} data={[]} />
            </TabsContent>

            <TabsContent value="courses" className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Course Management</h2>
                    <Button>Add New Course</Button>
                </div>
                <DataTable
                    columns={[{accessorKey: 'code', header: 'Course Code'}, {
                        accessorKey: 'title', header: 'Title'
                    }, {accessorKey: 'instructor', header: 'Instructor'}, {
                        accessorKey: 'students', header: 'Enrolled Students'
                    }, {accessorKey: 'status', header: 'Status'},]}
                    data={[]}
                />
            </TabsContent>

            <TabsContent value="projects" className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Project Management</h2>
                    <Button>Add New Project</Button>
                </div>
                <DataTable
                    columns={[{accessorKey: 'name', header: 'Project Name'}, {
                        accessorKey: 'course', header: 'Course'
                    }, {accessorKey: 'teams', header: 'Teams'}, {
                        accessorKey: 'deadline', header: 'Deadline'
                    }, {accessorKey: 'status', header: 'Status'},]}
                    data={[]}
                />
            </TabsContent>
        </Tabs>
    </div>);
};

export default AdminDashboard;