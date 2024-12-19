# API Documentation

## Table of Contents
- [Authentication & User Management](#authentication--user-management)
- [Course Management](#course-management)
- [Project Management](#project-management)
- [Chat System](#chat-system)
- [Student Management](#student-management)
- [Server Actions](#server-actions)


## Authentication & User Management

### `/api/users/[user_id]/route.js`
Handles individual user operations.
- `GET`: Retrieves user details by ID
  - Returns: User object or 404 if not found

### `/api/users/route.js`
Manages user collection operations.
- `GET`: Retrieves all users
- `POST`: (Commented out) Creates a new user

### `/api/webhooks/route.js`
Handles Clerk authentication webhooks.
- `POST`: Processes user events (creation, updates, deletion)
- Functions:
  - `syncUserToDatabase`: Syncs Clerk user data to local database
  - `deleteUserFromDatabase`: Removes user from database
  - `determineUserRole`: Assigns user roles

### `/api/role/[userid]/route.js`
Manages user role operations.
- `GET`: Retrieves role for specific user ID

## Course Management

### `/api/courses/route.js`
Handles course collection operations.
- `GET`: Retrieves all courses with instructor details
- `POST`: (Commented out) Creates new course

### `/api/courses/[course_code]/route.js`
Manages individual course operations.
- `GET`: Retrieves course details, projects, and assignments
- `DELETE`: (Commented out) Removes course
- `PUT`: (Commented out) Updates course details

### `/api/assignments/route.js`
Handles assignment operations.
- `GET`: Retrieves sample assignment data
  - Returns: Array of assignment objects with ID, title, maxGrade, description, dueDate, and status

## Project Management

### `/api/projects/route.js`
Handles project collection operations.
- `GET`: Retrieves all projects
- `POST`: (Commented out) Creates new project

### `/api/projects/[projectid]/route.js`
Manages individual project operations.
- `GET`: Retrieves project details, teams, and progress
- `PUT`: Updates project end date and team size
- `POST`: Adds new phase to project

### `/api/projects/[projectid]/[phaseid]/route.js`
Handles project phase operations.
- `GET`: Retrieves phase details
- `PUT`: Updates phase load and deadline
- `DELETE`: Removes phase

### `/api/projects/[projectid]/phases/route.js`
Manages project phases.
- `GET`: Retrieves all phases for a project

## Chat System

### `/api/chat/route.js`
Handles chat group collection.
- `GET`: Retrieves all chat groups

### `/api/chat/[groupid]/route.js`
Manages individual chat group operations.
- `GET`: Retrieves chat group details and channels

### `/api/chat/[groupid]/[channelnum]/route.js`
Handles channel operations.
- `GET`: Retrieves channel messages with date filtering

### `/api/chat/[groupid]/[channelnum]/[messageid]/route.js`
Manages individual message operations.
- `GET`: Retrieves message details and attachments
- `PATCH`: (Commented out) Updates message content

## Student Management

### `/api/students/route.js`
Handles student collection operations.
- `GET`: Retrieves student count and list

### `/api/students/[studentid]/calendar/route.js`
Manages student calendar.
- `GET`: Retrieves deadlines for assignments and phases

### `/api/students/[studentid]/courses/route.js`
Handles student course operations.
- `GET`: Retrieves enrolled courses with grades

### `/api/students/[studentid]/grades/route.js`
Manages student grades.
- `GET`: Retrieves comprehensive grade information

### `/api/students/[studentid]/profile/route.js`
Handles student profile operations.
- `GET`: Retrieves student profile, badges, reviews, and teams

### `/api/students/[studentid]/teams/route.js`
Manages student team memberships.
- `GET`: Retrieves teams student belongs to

## Server Actions

### Group Actions (`actions/group-actions.js`)
- `renameGroup`: Updates group name
- `deleteGroup`: Removes chat group
- `createGroup`: Creates new chat group

### Channel Actions (`actions/channel-actions.js`)
- `createChannel`: Creates new channel
- `deleteChannel`: Removes channel
- `updateChannel`: Updates channel details

### Message Actions (`actions/message-actions.js`)
- `insertMessage`: Creates new message
- `editMessage`: Updates message content
- `deleteMessage`: Removes message

### User Actions (`actions/user-actions.js`)
- `addUser`: Creates new user
- `fetchUserData`: Retrieves user data
- `updateUser`: Updates user details

### Participation Actions (`actions/Participation.jsx`)
- `Participation`: Manages team participation

### Submission Actions
#### Phase Submission (`actions/add-phasesubmission.jsx`)
- `addphaseSubmission`: Handles phase submissions

#### Assignment Submission (`actions/add-assignmentsubmission.jsx`)
- `addAssignmentSubmission`: Handles assignment submissions

### Review Actions (`actions/add-review.jsx`)
- `GiveReview`: Manages peer reviews

### Project Actions (`actions/add-project.jsx`)
- `addProject`: Creates new project

### Course Actions (`actions/add-course.jsx`)
- `addCourse`: Creates new course
