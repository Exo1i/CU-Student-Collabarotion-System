# 🚀 Learning Management System

A modern, feature-rich learning management system built with Next.js, focusing on collaborative learning and
project-based education.


## ✨ Features

- **Authentication & User Management**
    - Secure login and registration
    - Password reset functionality
    - Role-based access control (Student/Instructor/Admin)
    - Profile management with badges

- **Team Collaboration**
    - Team formation and management
    - Real-time chat integration
    - Project phase tracking
    - Peer review system

- **Course Management**
    - Course creation and enrollment
    - Assignment submission
    - Project management
    - Progress tracking

- **Communication**
    - Real-time messaging
    - Channel-based discussions
    - File sharing capabilities
    - Notification system

## 🛠️ Tech Stack

- **Frontend**: Next.js
- **Database**: PostgreSQL
- **Authentication**: Clerk
- **Real-time**: WebSocket

## 📋 API Endpoints

### Authentication

```
POST /api/auth/login
POST /api/auth/register
POST /api/auth/reset-password
```

### User Management

```
GET /api/users/:id
PATCH /api/users/:id
GET /api/users/:id/badges
GET /api/users/:id/teams
```

### Teams & Projects

```
POST /api/teams
GET /api/teams/:id
POST /api/projects
GET /api/projects/:id/phases
```

[View full API documentation](./API_DOCUMENTATION.md)
 
## 🗂️ Project Structure

```
/
├── src/
│   ├── app/          # Next.js pages
│   ├── components/   # Reusable components
│   ├── lib/         # Database, auth, utilities
│   ├── api/         # API routes
│   └── hooks/       # Custom hooks
├── public/          # Static assets
├── tests/          # Test files
```

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/Exo1i/CUStudentCollabSystem.git
   cd CUStudentCollabSystem
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

    ```env
    DATABASE_URL=your_database_url
    NEXTAUTH_SECRET=your_auth_secret
    NEXTAUTH_URL=http://localhost:3000
    ```  


5. **Set up the database**
   ```bash
   npm run schema
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`

## 🤝 Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 👥 Team

Built with ❤️ by
<table>
<tr>
    <td align="center">
        <a href="https://github.com/exo1i">
            <img src="https://github.com/exo1i.png" width="100px;" alt="Youssef Noser"/><br />
            <sub><b>Youssef Noser</b></sub>
        </a><br />
        <sub>Full Stack Developer</sub>
    </td>
   <td align="center">
        <a href="https://github.com/Hussein-Mohamed1">
            <img src="https://github.com/Hussein-Mohamed1.png" width="100px;" alt="Developer Name 3"/><br />
            <sub><b>Hussien Mohamed</b></sub>
        </a><br />
        <sub>Frontend Developer</sub>
    </td>
    <td align="center">
          <a href="https://github.com/xx-Tasneem-Ahmed-xx">
              <img src="https://github.com/xx-Tasneem-Ahmed-xx.png" width="100px;" alt="Developer Name 3"/><br />
              <sub><b>Tasneem Ahmad</b></sub>
          </a><br />
          <sub>Frontend Developer</sub>
      </td>
    <td align="center">
        <a href="https://github.com/Doha-Ahmed-E">
            <img src="https://github.com/Doha-Ahmed-E.png" width="100px;" alt="Doha Ahmad"/><br />
            <sub><b>Doha Ahmad</b></sub>
        </a><br />
        <sub>Backend Developer</sub>
    </td>

</tr>
</table>
