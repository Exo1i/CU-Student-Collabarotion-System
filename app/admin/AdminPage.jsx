"use client";
import {
  Admin,
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
  SelectInput,
  SimpleForm,
  TextField,
  TextInput,
  BooleanField,
  BooleanInput,
} from "react-admin";

import postgrestRestProvider, {
  defaultSchema,
} from "@raphiniert/ra-data-postgrest";

const config = {
  apiUrl: "/api/admin",
  httpClient: fetchUtils.fetchJson,
  defaultListOp: "eq",
  primaryKeys: new Map([
    ["users", ["user_id"]],
    ["course", ["course_code"]],
    ["project", ["project_id"]],
    ["assignment", ["assignment_id"]],
    ["enrollment", ["course_code", "student_id"]],
    ["chat_group", ["group_id"]],
    ["channel", ["channel_num", "group_id"]],
    ["message", ["message_id"]],
    ["participation", ["project_id", "student_id", "team_num"]],
  ]),
  schema: defaultSchema,
};

export const UserList = () => (
  <List sort={{ field: "user_id", order: "ASC" }}>
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
      <SelectInput
        source="role"
        choices={[
          { id: "student", name: "Student" },
          { id: "instructor", name: "Instructor" },
          { id: "admin", name: "Admin" },
        ]}
      />
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
      <SelectInput
        source="role"
        choices={[
          { id: "student", name: "Student" },
          { id: "instructor", name: "Instructor" },
          { id: "admin", name: "Admin" },
        ]}
      />
      <TextInput source="img_url" />
    </SimpleForm>
  </Create>
);

export const CourseList = () => (
  <List sort={{ field: "course_code", order: "ASC" }}>
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

export const CourseEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="course_code" disabled />
      <TextInput source="course_name" />
      <ReferenceField source="instructor_id" reference="users">
        <TextInput source="instructor_id" />
      </ReferenceField>
      <NumberInput source="max_grade" />
    </SimpleForm>
  </Edit>
);

export const CourseCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="course_code" />
      <TextInput source="course_name" />
      <ReferenceField source="instructor_id" reference="users">
        <TextInput source="username" />
      </ReferenceField>
      <NumberInput source="max_grade" />
    </SimpleForm>
  </Create>
);

export const ProjectList = () => (
  <List sort={{ field: "project_id", order: "ASC" }}>
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

export const ProjectEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="project_id" disabled />
      <TextInput source="project_name" />
      <ReferenceField source="course_code" reference="course">
        <TextInput source="course_code" />
      </ReferenceField>
      <DateInput source="start_date" />
      <DateInput source="end_date" />
      <TextInput source="description" />
      <NumberInput source="max_team_size" />
      <NumberInput source="max_grade" />
    </SimpleForm>
  </Edit>
);

export const ProjectCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="project_id" />
      <TextInput source="project_name" />
      <ReferenceField source="course_code" reference="course">
        <TextInput source="course_name" />
      </ReferenceField>
      <DateInput source="start_date" />
      <DateInput source="end_date" />
      <TextInput source="description" />
      <NumberInput source="max_team_size" />
      <NumberInput source="max_grade" />
    </SimpleForm>
  </Create>
);

export const AssignmentsList = () => (
  <List sort={{ field: "assignment_id", order: "ASC" }}>
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
  </List>
);

export const AssignmentEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="assignment_id" disabled />
      <TextInput source="title" />
      <ReferenceField source="course_code" reference="course">
        <TextInput source="course_code" />
      </ReferenceField>
      <NumberInput source="max_grade" />
      <TextInput source="description" />
      <DateInput source="due_date" />
    </SimpleForm>
  </Edit>
);

export const AssignmentCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="assignment_id" />
      <TextInput source="title" />
      <ReferenceField source="course_code" reference="course">
        <TextInput source="course_name" />
      </ReferenceField>
      <NumberInput source="max_grade" />
      <TextInput source="description" />
      <DateInput source="due_date" />
    </SimpleForm>
  </Create>
);

export const EnrollmentList = () => (
  <List>
    <Datagrid rowClick="edit">
      <ReferenceField source="student_id" reference="users">
        <TextField source="username" />
      </ReferenceField>
      <ReferenceField source="course_code" reference="course">
        <TextField source="course_name" />
      </ReferenceField>
    </Datagrid>
  </List>
);

export const EnrollmentEdit = () => (
  <Edit>
    <SimpleForm>
      <ReferenceInput source="student_id" reference="users">
        <SelectInput optionText="user_id" />
      </ReferenceInput>
      <ReferenceInput source="course_code" reference="course">
        <TextInput source="course_code" />
      </ReferenceInput>
    </SimpleForm>
  </Edit>
);

export const EnrollmentCreate = () => (
  <Create>
    <SimpleForm>
      <ReferenceInput source="student_id" reference="users">
        <SelectInput optionText="user_id" />
      </ReferenceInput>
      <ReferenceInput source="course_code" reference="course">
        <SelectInput optionText="course_code" />
      </ReferenceInput>
    </SimpleForm>
  </Create>
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
        recordRepresentation="assignment"
      />
      <Resource
        name="enrollment"
        list={EnrollmentList}
        edit={EnrollmentEdit}
        create={EnrollmentCreate}
        recordRepresentation="enrollment"
      />
      <Resource
        name="chat_group"
        list={ChatGroupList}
        edit={ChatGroupEdit}
        create={ChatGroupCreate}
        recordRepresentation="chat_group"
      />
      <Resource
        name="channel"
        list={ChannelList}
        recordRepresentation="channel"
      />
      <Resource
        name="message"
        list={MessageList}
        edit={MessageEdit}
        create={MessageCreate}
        recordRepresentation="message"
      />
      <Resource
        name="participation"
        list={ParticipationList}
        edit={participationEdit}
        create={participationCreate}
        recordRepresentation="participation"
      />
    </Admin>
  );
}
