"use client";
import {
    Admin,
    Create,
    Datagrid,
    DateField,
    Edit,
    fetchUtils,
    List,
    NumberField,
    ReferenceField,
    Resource,
    SelectInput,
    SimpleForm,
    TextField,
    TextInput
} from "react-admin";

import postgrestRestProvider, {defaultSchema} from '@raphiniert/ra-data-postgrest';


const config = {
    apiUrl: '/api/admin',
    httpClient: fetchUtils.fetchJson,
    defaultListOp: 'eq',
    primaryKeys: new Map([
        ['users', ['user_id']],
        ['course', ['course_code']],
        ['project', ['project_id']]
    ]),
    schema: defaultSchema
}

export const UserList = () => (
    <List sort={{field: 'user_id', order: 'ASC'}}>
        <Datagrid rowClick="edit">
            <TextField source="user_id" />
            <TextField source="username" />
            <TextField source="fname" />
            <TextField source="lname" />
            <TextField source="role" />
            <TextField source="img_url" />
        </Datagrid>
    </List>
);

export const UserEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="user_id" disabled />
            <TextInput source="username" />
            <TextInput source="fname" />
            <TextInput source="lname" />
            <SelectInput source="role" choices={[
                {id: 'student', name: 'Student'},
                {id: 'instructor', name: 'Instructor'},
                {id: 'admin', name: 'Admin'},
            ]} />
            <TextInput source="img_url" />
        </SimpleForm>
    </Edit>
);

export const UserCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="user_id" />
            <TextInput source="username" />
            <TextInput source="fname" />
            <TextInput source="lname" />
            <SelectInput source="role" choices={[
                {id: 'student', name: 'Student'},
                {id: 'instructor', name: 'Instructor'},
                {id: 'admin', name: 'Admin'},
            ]} />
            <TextInput source="img_url" />
        </SimpleForm>
    </Create>
);

export const CourseList = () => (
    <List sort={{field: 'course_code', order: 'ASC'}}>
        <Datagrid rowClick="edit">
            <TextField source="course_code" />
            <TextField source="course_name" />
            <ReferenceField source="instructor_id" reference="users">
                <TextField source="username" />
            </ReferenceField>
            <NumberField source="max_grade" />
        </Datagrid>
    </List>
);


export const ProjectList = () => (
    <List sort={{field: 'project_id', order: 'ASC'}}>
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
    </List>
);


export default function AdminPage() {
    const dataProvider = postgrestRestProvider(config);

    return (
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
                recordRepresentation="course_name"
            />
            <Resource
                name="project"
                list={ProjectList}
                recordRepresentation="project_name"
            />
        </Admin>
    );
}