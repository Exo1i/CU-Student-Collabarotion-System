"use client";
import {
    Admin,
    BooleanField,
    BooleanInput,
    Create,
    Datagrid,
    DateField,
    DateInput,
    Edit,
    fetchUtils,
    List,
    NumberField,
    NumberInput,
    ReferenceField,
    ReferenceInput,
    Resource,
    SearchInput,
    SelectInput,
    SimpleForm,
    TextField,
    TextInput
} from "react-admin";

import postgrestRestProvider, {defaultSchema} from "@raphiniert/ra-data-postgrest";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";
import {useState} from "react";
import AddAdminModal from "@/app/admin/AddAdminForm";

// Updated configuration with proper search operator
const config = {
    apiUrl: process.env.NEXT_PUBLIC_POSTGREST_URL,
    httpClient: fetchUtils.fetchJson,
    defaultListOp: "ilike",
    primaryKeys: new Map([["users", ["user_id"]], ["course", ["course_code"]], ["project", ["project_id"]], ["assignment", ["assignment_id"]], ["enrollment", ["course_code", "student_id"]], ["chat_group", ["group_id"]], ["channel", ["channel_num", "group_id"]], ["message", ["message_id"]], ["participation", ["project_id", "student_id", "team_num"]]]),
    schema: defaultSchema,
};
// Users
export const UserList = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (<>
        <List
            sort={{field: "user_id", order: "ASC"}}
            filters={[<SearchInput
                source="username"
                placeholder="Search by username"
                alwaysOn
                name={"username"}
                key={"username"}
            />,]}
        >
            <Datagrid rowClick="edit">
                <TextField source="user_id" label="User ID" />
                <TextField source="username" label="Username" />
                <TextField source="fname" label="First Name" />
                <TextField source="lname" label="Last Name" />
                <TextField source="role" label="Role" />
                <TextField source="img_url" label="Image URL" />
            </Datagrid>
        </List>
        <div className="flex justify-center mt-4">
            <Button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
            >
                Add Admin
            </Button>
        </div>
        {isModalOpen && (<AddAdminModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
        />)}
    </>);
};
export const UserEdit = () => (<Edit>
    <SimpleForm>
        <TextInput source="user_id" disabled />
        <TextInput source="username" />
        <TextInput source="fname" />
        <TextInput source="lname" />
        <SelectInput
            source="role"
            choices={[{id: "student", name: "Student"}, {id: "instructor", name: "Instructor"}, {
                id: "admin", name: "Admin"
            }]}
        />
        <TextInput source="img_url" />
    </SimpleForm>
</Edit>);

export const UserCreate = () => (<Create>
    <SimpleForm>
        <TextInput source="user_id" disabled />
        <TextInput source="username" />
        <TextInput source="fname" />
        <TextInput source="lname" />
        <SelectInput
            source="role"
            choices={[{id: "student", name: "Student"}, {id: "instructor", name: "Instructor"}, {
                id: "admin", name: "Admin"
            }]}
        />
        <TextInput source="img_url" />
    </SimpleForm>
</Create>);

// Course
export const CourseList = () => (<List
    sort={{field: "course_code", order: "ASC"}}
    filters={[<SearchInput source="course_name" placeholder="Search by course name" alwaysOn name={"course_name"}
                           key={"course_name"} />]}
>
    <Datagrid rowClick="edit">
        <TextField source="course_code" />
        <TextField source="course_img" />
        <TextField source="course_name" />
        <ReferenceField source="instructor_id" reference="users">
            <TextField source="username" />
        </ReferenceField>
        <NumberField source="max_grade" />
    </Datagrid>
</List>);

export const CourseEdit = () => (<Edit>
    <SimpleForm>
        <TextInput source="course_code" disabled />
        <TextInput source="course_name" />
        <TextInput source="course_img" />
        <ReferenceInput source="instructor_id" filter={{role: "instructor"}} reference="users">
            <SelectInput optionText={record => `${record.fname} ${record.lname}`} />
        </ReferenceInput>
        <NumberInput source="max_grade" />
    </SimpleForm>
</Edit>);

export const CourseCreate = () => (<Create>
    <SimpleForm>
        <TextInput source="course_code" disabled />
        <TextInput source="course_name" />
        <TextInput source="course_img" />
        <ReferenceInput source="instructor_id" filter={{role: "instructor"}} reference="users">
            <SelectInput optionText={record => `${record.fname} ${record.lname}`} />
        </ReferenceInput>
        <NumberInput source="max_grade" />
    </SimpleForm>
</Create>);

// Project
export const ProjectList = () => (<List
    sort={{field: "project_id", order: "ASC"}}
    filters={[<SearchInput source="project_name" placeholder="Search by project name" name="project_name"
                           key="project_name" alwaysOn />]}
>
    <Datagrid rowClick="edit">
        <TextField source="project_id" />
        <TextField source="project_name" />
        <ReferenceField source="course_code" reference="course">
            <TextField source="course_name" />
        </ReferenceField>
        <DateField source="start_date" />
        <DateField source="end_date" />
        <TextField source="description" />
        <NumberField source="max_team_size" />
        <NumberField source="max_grade" />
    </Datagrid>
</List>);

export const ProjectEdit = () => (<Edit>
    <SimpleForm>
        <TextInput source="project_id" disabled />
        <TextInput source="project_name" />
        <ReferenceInput source="course_code" reference="course">
            <SelectInput optionText="course_name" />
        </ReferenceInput>
        <DateInput source="start_date" />
        <DateInput source="end_date" />
        <TextInput source="description" />
        <NumberInput source="max_team_size" />
        <NumberInput source="max_grade" />
    </SimpleForm>
</Edit>);

export const ProjectCreate = () => (<Create>
    <SimpleForm>
        <TextInput source="project_id" disabled />
        <TextInput source="project_name" />
        <ReferenceInput source="course_code" reference="course">
            <SelectInput optionText="course_name" />
        </ReferenceInput>
        <DateInput source="start_date" />
        <DateInput source="end_date" />
        <TextInput source="description" />
        <NumberInput source="max_team_size" />
        <NumberInput source="max_grade" />
    </SimpleForm>
</Create>);

// Assignments
export const AssignmentsList = () => (<List
    sort={{field: "assignment_id", order: "ASC"}}
    filters={[<SearchInput source="title" placeholder="Search by assignment title" alwaysOn name={"title"}
                           key={"title"} />]}
>
    <Datagrid rowClick="edit">
        <TextField source="assignment_id" />
        <TextField source="title" />
        <ReferenceField source="course_code" reference="course">
            <TextField source="course_name" />
        </ReferenceField>
        <NumberField source="max_grade" />
        <TextField source="description" />
        <DateField source="due_date" />
    </Datagrid>
</List>);

export const AssignmentEdit = () => (<Edit>
    <SimpleForm>
        <TextInput source="assignment_id" disabled />
        <TextInput source="title" />
        <ReferenceInput source="course_code" reference="course">
            <SelectInput optionText="course_name" />
        </ReferenceInput>
        <NumberInput source="max_grade" />
        <TextInput source="description" />
        <DateInput source="due_date" />
    </SimpleForm>
</Edit>);

export const AssignmentCreate = () => (<Create>
    <SimpleForm>
        <TextInput source="assignment_id" disabled />
        <TextInput source="title" />
        <ReferenceInput source="course_code" reference="course">
            <SelectInput optionText="course_name" />
        </ReferenceInput>
        <NumberInput source="max_grade" />
        <TextInput source="description" />
        <DateInput source="due_date" />
    </SimpleForm>
</Create>);

// Enrollment
export const EnrollmentList = () => (<List>
    <Datagrid rowClick="edit">
        <ReferenceField source="student_id" reference="users">
            <TextField source="username" />
        </ReferenceField>
        <ReferenceField source="course_code" reference="course">
            <TextField source="course_name" />
        </ReferenceField>
    </Datagrid>
</List>);

export const EnrollmentEdit = () => (<Edit>
    <SimpleForm>
        <ReferenceInput source="student_id" reference="users" disabled>
            <SelectInput optionText="username" />
        </ReferenceInput>
        <ReferenceInput source="course_code" reference="course" disabled>
            <SelectInput optionText="course_name" />
        </ReferenceInput>
    </SimpleForm>
</Edit>);

export const EnrollmentCreate = () => (<Create>
    <SimpleForm>
        <ReferenceInput source="student_id" reference="users">
            <SelectInput optionText="username" />
        </ReferenceInput>
        <ReferenceInput source="course_code" reference="course">
            <SelectInput optionText="course_name" />
        </ReferenceInput>
    </SimpleForm>
</Create>);

// Chat Group
export const ChatGroupList = () => (
    <List filters={[<SearchInput placeholder="Search by group name" source="group_name" key="group_name"
                                 name="group_name" alwaysOn />]}>
        <Datagrid rowClick="edit">
            <NumberField source="group_id" />
            <TextField source="group_name" />
        </Datagrid>
    </List>);

export const ChatGroupEdit = () => (<Edit>
    <SimpleForm>
        <NumberInput source="group_id" disabled />
        <TextInput source="group_name" />
    </SimpleForm>
</Edit>);

export const ChatGroupCreate = () => (<Create>
    <SimpleForm>
        <NumberInput source="group_id" disabled />
        <TextInput source="group_name" />
    </SimpleForm>
</Create>);

// Channel
export const ChannelList = () => (<List
    filters={[<SearchInput source="channel_name" placeholder="Search by channel name" name={"channel_name"}
                           key={"channel_name"} alwaysOn />]}>
    <Datagrid rowClick="edit">
        <NumberField source="channel_num" />
        <NumberField source="group_id" />
        <TextField source="channel_name" />
        <TextField source="channel_type" />
    </Datagrid>
</List>);

export const ChannelEdit = () => (<Edit>
    <SimpleForm>
        <NumberInput source="channel_num" disabled />
        <NumberInput source="group_id" disabled />
        <TextInput source="channel_name" />
        <SelectInput
            source="channel_type"
            choices={[{id: "open", name: "Open"}, {id: "restricted", name: "Restricted to Instructors and Admins"}]}
        />
    </SimpleForm>
</Edit>);

export const ChannelCreate = () => (<Create>
    <SimpleForm>
        <NumberInput source="channel_num" disabled />
        <ReferenceInput source="group_id" reference="chat_group">
            <SelectInput optionText="group_name" />
        </ReferenceInput>
        <TextInput source="channel_name" />
        <SelectInput
            source="channel_type"
            choices={[{id: "open", name: "Open"}, {id: "restricted", name: "Restricted to Instructors and Admins"}]}
        />
    </SimpleForm>
</Create>);

// Message
export const MessageList = () => (<List
    sort={{field: "message_id", order: "ASC"}}
    filters={[<SearchInput source="content" placeholder="Search message content" name={"content"} key={"content"}
                           alwaysOn />]}
>
    <Datagrid rowClick="edit">
        <NumberField source="message_id" />
        <NumberField source="channel_num" />
        <NumberField source="group_id" />
        <TextField source="type" />
        <TextField source="content" />
        <ReferenceField source="sender_id" reference="users">
            <TextField source="username" />
        </ReferenceField>
        <DateField
            source="time_stamp"
            showTime
            options={{
                year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric"
            }}
        />
    </Datagrid>
</List>);

export const MessageEdit = () => (<Edit>
    <SimpleForm>
        <NumberInput source="message_id" disabled />
        <NumberInput source="channel_num" disabled />
        <NumberInput source="group_id" disabled />
        <TextInput source="type" />
        <TextInput source="content" />
        <ReferenceInput source="sender_id" reference="users">
            <SelectInput optionText="username" />
        </ReferenceInput>
        <DateInput source="time_stamp" />
    </SimpleForm>
</Edit>);

export const MessageCreate = () => (<Create>
    <SimpleForm>
        <NumberInput source="message_id" disabled />
        <ReferenceInput source="channel_num" reference="channel">
            <SelectInput optionText="channel_name" />
        </ReferenceInput>
        <ReferenceInput source="group_id" reference="chat_group">
            <SelectInput optionText="group_name" />
        </ReferenceInput>
        <TextInput source="type" />
        <TextInput source="content" />
        <ReferenceInput source="sender_id" reference="users">
            <SelectInput optionText="username" />
        </ReferenceInput>
        <DateInput source="time_stamp" />
    </SimpleForm>
</Create>);

// Participation
export const ParticipationList = () => (<List>
    <Datagrid rowClick="edit">
        <ReferenceField source="project_id" reference="project">
            <TextField source="project_name" />
        </ReferenceField>
        <ReferenceField source="student_id" reference="users">
            <TextField source="username" />
        </ReferenceField>
        <NumberField source="team_num" />
        <BooleanField source="leader" />
    </Datagrid>
</List>);

export const ParticipationEdit = () => (<Edit>
    <SimpleForm>
        <ReferenceInput source="project_id" reference="project" disabled>
            <SelectInput optionText="project_name" />
        </ReferenceInput>
        <ReferenceInput source="student_id" reference="users" disabled>
            <SelectInput optionText="username" />
        </ReferenceInput>
        <NumberInput source="team_num" disabled />
        <BooleanInput source="leader" />
    </SimpleForm>
</Edit>);

export const ParticipationCreate = () => (<Create>
    <SimpleForm>
        <ReferenceInput source="project_id" reference="project">
            <SelectInput optionText="project_name" />
        </ReferenceInput>
        <ReferenceInput source="student_id" reference="users">
            <SelectInput optionText="username" />
        </ReferenceInput>
        <NumberInput source="team_num" />
        <BooleanInput source="leader" />
    </SimpleForm>
</Create>);

// Main Admin Page component
export default function AdminPage() {
    const dataProvider = postgrestRestProvider(config);
    const router = useRouter();

    const handleGoBack = () => {
        router.push('/dashboard');
    };

    return (<>
        <Button
            onClick={handleGoBack}
            className="m-4 absolute left-0 bottom-0 z-10"
        >
            Go back to dashboard
        </Button>
        <Admin dataProvider={dataProvider}>
            <Resource
                name="users"
                list={UserList}
                edit={UserEdit}
                create={UserCreate}
                recordRepresentation="username"
            />
            <Resource
                name="course"
                list={CourseList}
                edit={CourseEdit}
                create={CourseCreate}
                recordRepresentation="course_name"
            />
            <Resource
                name="project"
                list={ProjectList}
                edit={ProjectEdit}
                create={ProjectCreate}
                recordRepresentation="project_name"
            />
            <Resource
                name="assignment"
                list={AssignmentsList}
                edit={AssignmentEdit}
                create={AssignmentCreate}
                recordRepresentation="title"
            />
            <Resource
                name="enrollment"
                list={EnrollmentList}
                edit={EnrollmentEdit}
                create={EnrollmentCreate}
            />
            <Resource
                name="chat_group"
                list={ChatGroupList}
                edit={ChatGroupEdit}
                create={ChatGroupCreate}
                recordRepresentation="group_name"
            />
            <Resource
                name="channel"
                list={ChannelList}
                edit={ChannelEdit}
                create={ChannelCreate}
                recordRepresentation="channel_name"
            />
            <Resource
                name="message"
                list={MessageList}
                edit={MessageEdit}
                create={MessageCreate}
            />
            <Resource
                name="participation"
                list={ParticipationList}
                edit={ParticipationEdit}
                create={ParticipationCreate}
            />
        </Admin>
    </>);
}

