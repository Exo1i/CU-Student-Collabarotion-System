// ProjectPhases.jsx
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAlert } from "@/components/alert-context";
import { Pencil, Trash2 } from 'lucide-react';
import { addPhase, deletePhase, editPhase } from "@/actions/phase-actions";

const ProjectPhases = ({ projectId, phases: initialPhases, onRefresh }) => {
    const { showAlert } = useAlert();
    const [isOpen, setIsOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [phaseToDelete, setPhaseToDelete] = useState(null);
    const [phaseToEdit, setPhaseToEdit] = useState(null);
    const [phases, setPhases] = useState(initialPhases || []);
    const [newPhase, setNewPhase] = useState({
        phase_num: '',
        phase_name: '',
        description: '',
        phase_load: '',
        deadline: '',
    });
    const [editPhaseData, setEditPhaseData] = useState({
        phase_num: '',
        phase_name: '',
        description: '',
        phase_load: '',
        deadline: '',
    });

    const handlePhaseChange = (e) => {
        const { name, value } = e.target;
        setNewPhase(prev => ({ ...prev, [name]: value }));
    };

    const handlePhaseSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await addPhase(
                newPhase.phase_num,
                newPhase.phase_name,
                newPhase.description,
                newPhase.phase_load,
                newPhase.deadline,
                projectId
            );

            if (res.status === 200) {
                showAlert({
                    message: res.message,
                    severity: "success"
                });
                onRefresh();
                setIsOpen(false);
                setNewPhase({
                    phase_num: '',
                    phase_name: '',
                    description: '',
                    phase_load: '',
                    deadline: '',
                });
            } else {
                throw new Error(res.message);
            }
        } catch (error) {
            showAlert({
                message: error.message,
                severity: "error"
            });
        }
    };

    const handleDeletePhase = async (phase) => {
        setPhaseToDelete(phase);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        try {
            const res = await deletePhase(phaseToDelete.phase_num, projectId);
            if (res.status === 200) {
                showAlert({
                    message: "Phase deleted successfully",
                    severity: "success"
                });
                onRefresh();
            } else {
                throw new Error(res.message);
            }
        } catch (error) {
            showAlert({
                message: error.message,
                severity: "error"
            });
        } finally {
            setDeleteDialogOpen(false);
            setPhaseToDelete(null);
        }
    };

    const handleEditClick = (phase) => {
        setPhaseToEdit(phase);
        setEditPhaseData({
            phase_num: phase.phase_num,
            phase_name: phase.phase_name,
            description: phase.description,
            phase_load: phase.phase_load,
            deadline: new Date(phase.deadline).toISOString().split('T')[0],
        });
        setIsEditOpen(true);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditPhaseData(prev => ({ ...prev, [name]: value }));
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await editPhase(
                editPhaseData.phase_num,
                editPhaseData.phase_name,
                editPhaseData.description,
                editPhaseData.phase_load,
                editPhaseData.deadline,
                projectId
            );

            if (res.status === 200) {
                showAlert({
                    message: res.message,
                    severity: "success"
                });
                onRefresh();
                setIsEditOpen(false);
                setPhaseToEdit(null);
            } else {
                throw new Error(res.message);
            }
        } catch (error) {
            showAlert({
                message: error.message,
                severity: "error"
            });
        }
    };

    return (
        <div className="mt-6">
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                        Project Phases
                        <Dialog open={isOpen} onOpenChange={setIsOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-indigo-500 hover:bg-indigo-600 text-white">
                                    Add Phase
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Add New Project Phase</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handlePhaseSubmit} className="space-y-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="phase_num">Phase Number</Label>
                                        <Input
                                            id="phase_num"
                                            name="phase_num"
                                            type="number"
                                            value={newPhase.phase_num}
                                            onChange={handlePhaseChange}
                                            className="col-span-3"
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="phase_name">Phase Name</Label>
                                        <Input
                                            id="phase_name"
                                            name="phase_name"
                                            value={newPhase.phase_name}
                                            onChange={handlePhaseChange}
                                            className="col-span-3"
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="phase_load">Phase Load (%)</Label>
                                        <Input
                                            id="phase_load"
                                            name="phase_load"
                                            type="number"
                                            value={newPhase.phase_load}
                                            onChange={handlePhaseChange}
                                            className="col-span-3"
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="deadline">Due Date</Label>
                                        <Input
                                            id="deadline"
                                            name="deadline"
                                            type="date"
                                            value={newPhase.deadline}
                                            onChange={handlePhaseChange}
                                            className="col-span-3"
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="description">Description</Label>
                                        <Textarea
                                            id="description"
                                            name="description"
                                            value={newPhase.description}
                                            onChange={handlePhaseChange}
                                            className="col-span-3"
                                            required
                                        />
                                    </div>
                                    <Button type="submit" className="w-full">Add Phase</Button>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {phases.map((phase) => (
                            <div key={phase.phase_num} className="border p-4 rounded-lg">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-semibold">Phase {phase.phase_num}: {phase.phase_name}</h3>
                                        <p className="text-sm text-gray-600">{phase.description}</p>
                                        <div className="mt-2 text-sm">
                                            <p>Load: {phase.phase_load}%</p>
                                            <p>Due: {new Date(phase.deadline).toLocaleDateString()}</p>
                                            <p>Submissions: {phase.submissions?.length || 0}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-blue-500 hover:text-blue-700 hover:bg-blue-100"
                                            onClick={() => handleEditClick(phase)}
                                        >
                                            <Pencil className="h-5 w-5" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-red-500 hover:text-red-700 hover:bg-red-100"
                                            onClick={() => handleDeletePhase(phase)}
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Edit Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Project Phase</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleEditSubmit} className="space-y-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="phase_name">Phase Name</Label>
                            <Input
                                id="phase_name"
                                name="phase_name"
                                value={editPhaseData.phase_name}
                                onChange={handleEditChange}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="phase_load">Phase Load (%)</Label>
                            <Input
                                id="phase_load"
                                name="phase_load"
                                type="number"
                                value={editPhaseData.phase_load}
                                onChange={handleEditChange}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="deadline">Due Date</Label>
                            <Input
                                id="deadline"
                                name="deadline"
                                type="date"
                                value={editPhaseData.deadline}
                                onChange={handleEditChange}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                value={editPhaseData.description}
                                onChange={handleEditChange}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="ghost" onClick={() => setIsEditOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit">Save Changes</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Phase</DialogTitle>
                    </DialogHeader>
                    <p>Are you sure you want to delete phase {phaseToDelete?.phase_name}? This action cannot be undone.</p>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button className="bg-red-500 hover:bg-red-600 text-white" onClick={confirmDelete}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ProjectPhases;