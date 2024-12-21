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
    ["badge", ["badge_id"]],
    ["earnedbadges", ["badge_id", "student_id"]],
    ["submission", ["submission_id"]],
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

export const ChatGroupList = () => (
  <List>
    <Datagrid rowClick="edit">
      <NumberField source="group_id" />
      <TextField source="group_name" />
    </Datagrid>
  </List>
);

export const ChatGroupEdit = () => (
  <Edit>
    <SimpleForm>
      <NumberInput source="group_id" disabled />
      <TextInput source="group_name" />
    </SimpleForm>
  </Edit>
);

export const ChatGroupCreate = () => (
  <Create>
    <SimpleForm>
      <NumberInput source="group_id" />
      <TextInput source="group_name" />
    </SimpleForm>
  </Create>
);

export const ChannelList = () => (
  <List>
    <Datagrid rowClick="edit">
      <NumberField source="channel_num" />
      <NumberField source="group_id" />
      <TextField source="channel_name" />
      <TextField source="channel_type" />
    </Datagrid>
  </List>
);

export const ChannelEdit = () => (
  <Edit>
    <SimpleForm>
      <NumberInput source="channel_num" disabled />
      <NumberInput source="group_id" />
      <TextInput source="channel_name" />
      <TextInput source="channel_type" />
    </SimpleForm>
  </Edit>
);

export const ChannelCreate = () => (
  <Create>
    <SimpleForm>
      <NumberInput source="channel_num" />
      <NumberInput source="group_id" />
      <TextInput source="channel_name" />
      <TextInput source="channel_type" />
    </SimpleForm>
  </Create>
);

export const MessageList = () => (
  <List sort={{ field: "message_id", order: "ASC" }}>
    <Datagrid rowClick="edit">
      <NumberField source="message_id" />
      <NumberField source="channel_num" />
      <NumberField source="group_id" />
      {/* <Tim */}
      <TextField source="type" />
      <TextField source="content" />
      <ReferenceField source="sender_id" reference="users">
        <TextField source="username" />
      </ReferenceField>
      <DateField
        source="time_stamp"
        showTime
        options={{
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
        }}
      />
    </Datagrid>
  </List>
);

export const MessageEdit = () => (
  <Edit>
    <SimpleForm>
      <NumberInput source="message_id" disabled />
      <NumberInput source="channel_num" />
      <NumberInput source="group_id" />
      <TextInput source="type" />
      <TextInput source="content" />
      <ReferenceInput source="sender_id" reference="users">
        <SelectInput optionText="user_id" />
      </ReferenceInput>
      <DateInput source="time_stamp" />
    </SimpleForm>
  </Edit>
);

export const MessageCreate = () => (
  <Create>
    <SimpleForm>
      <NumberInput source="message_id" />
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
      <BooleanField source="leader" />
    </SimpleForm>
  </Create>
);

export const ParticipationList = () => (
  <List>
    <Datagrid rowClick="edit">
      <ReferenceField source="project_id" reference="project">
        <TextField source="project_name" />
      </ReferenceField>
      <ReferenceField source="student_id" reference="users">
        <TextField source="username" />
      </ReferenceField>
      <NumberField source="team_num" />
    </Datagrid>
  </List>
);

export const participationEdit = () => (
  <Edit>
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
  </Edit>
);

export const participationCreate = () => (
  <Create>
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
  </Create>
);

export const BadgeList = () => (
  <List>
    <Datagrid rowClick="edit">
      <NumberField source="badge_id" />
      <TextField source="picture" />
      <TextField source="title" />
      <TextField source="description" />
    </Datagrid>
  </List>
);

export const BadgeEdit = () => (
  <Edit>
    <SimpleForm>
      <NumberInput source="badge_id" disabled />
      <TextInput source="picture" />
      <TextInput source="title" />
      <TextInput source="description" />
    </SimpleForm>
  </Edit>
);

export const BadgeCreate = () => (
  <Create>
    <SimpleForm>
      <NumberInput source="badge_id" />
      <TextInput source="picture" />
      <TextInput source="title" />
      <TextInput source="description" />
    </SimpleForm>
  </Create>
);

export const EarnedBadgeList = () => (
  <List>
    <Datagrid rowClick="edit">
      <ReferenceField source="badge_id" reference="badge">
        <TextField source="title" />
      </ReferenceField>
      <ReferenceField source="student_id" reference="users">
        <TextField source="username" />
      </ReferenceField>
    </Datagrid>
  </List>
);

export const EarnedBadgeEdit = () => (
  <Edit>
    <SimpleForm>
      <ReferenceInput source="badge_id" reference="badge">
        <SelectInput optionText="title" />
      </ReferenceInput>
      <ReferenceInput source="student_id" reference="users">
        <SelectInput optionText="username" />
      </ReferenceInput>
    </SimpleForm>
  </Edit>
);
export const EarnedBadgeCreate = () => (
  <Create>
    <SimpleForm>
      <ReferenceInput source="badge_id" reference="badge">
        <SelectInput optionText="title" />
      </ReferenceInput>
      <ReferenceInput source="student_id" reference="users">
        <SelectInput optionText="username" />
      </ReferenceInput>
    </SimpleForm>
  </Create>
);

export const SubmissionList = () => (
  <List>
    <Datagrid rowClick="edit">
      <NumberField source="submission_id" />
      <ReferenceField source="student_id" reference="users">
        <TextField source="username" />
      </ReferenceField>
      <TextField source="type" />
      <NumberField source="grade" />
      <DateField source="submission_date" />
      <TextField source="submissionurl" />
    </Datagrid>
  </List>
);

export const SubmissionEdit = () => (
  <Edit>
    <SimpleForm>
      <NumberInput source="submission_id" disabled />
      <ReferenceInput source="student_id" reference="users">
        <SelectInput optionText="username" />
      </ReferenceInput>
      <TextInput source="type" />
      <NumberInput source="grade" />
      <DateInput source="submission_date" />
      <TextInput source="submissionurl" />
    </SimpleForm>
  </Edit>
);

export const SubmissionCreate = () => (
  <Create>
    <SimpleForm>
      <NumberInput source="submission_id" />
      <ReferenceInput source="student_id" reference="users">
        <SelectInput optionText="username" />
      </ReferenceInput>
      <TextInput source="type" />
      <NumberInput source="grade" />
      <DateInput source="submission_date" />
      <TextInput source="submissionurl" />
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
        edit={ChannelEdit}
        create={ChannelCreate}
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
      <Resource
        name="badge"
        list={BadgeList}
        edit={BadgeEdit}
        create={BadgeCreate}
        recordRepresentation="badge"
      />
      <Resource
        name="earnedbadges"
        list={EarnedBadgeList}
        edit={EarnedBadgeEdit}
        create={EarnedBadgeCreate}
        recordRepresentation="earnedbadges"
      />
      <Resource
        name="submission"
        list={SubmissionList}
        edit={SubmissionEdit}
        create={SubmissionCreate}
        recordRepresentation="submission"
      />
    </Admin>
  );
}
