# Knowledge Base Platform

A full-stack knowledge management platform built with **Spring Boot** backend and **React** frontend, designed to help users create, organize, and share knowledge documents efficiently.

## 🚀 Project Overview

This platform provides a modern, secure, and user-friendly interface for managing knowledge documents. Users can create rich text documents, organize them with proper categorization, search through their content, and manage document visibility and sharing.

## 🏗️ Architecture

- **Frontend**: React 19.1.0 with modern hooks and functional components
- **Backend**: Spring Boot 3.5.3 with Spring Security and JPA
- **Database**: MySQL 8.0 with Hibernate ORM
- **Authentication**: JWT-based authentication system
- **Styling**: Custom CSS with modern design principles

## ✨ Features

### 🔐 Authentication & Security
- **User Registration & Login**: Secure user account creation and authentication
- **JWT Token Management**: Stateless authentication with automatic token refresh
- **Password Security**: Encrypted password storage and validation
- **Session Management**: Automatic logout on token expiration

### 📝 Document Management
- **Rich Text Editor**: Advanced text editor with formatting options (bold, italic, underline)
- **Document CRUD Operations**: Create, Read, Update, and Delete documents
- **Document Visibility**: Control document access with Private/Public settings
- **Version Control**: Track document versions and modification history
- **Document Metadata**: Automatic tracking of creation and modification timestamps

### 🔍 Search & Discovery
- **Real-time Search**: Instant search through document titles and content
- **Debounced Search**: Optimized search performance with 300ms debouncing
- **Search Highlighting**: Visual search result highlighting
- **Cross-field Search**: Search across both title and content simultaneously

### 🎨 User Interface
- **Modern UI Design**: Clean, responsive interface with intuitive navigation
- **Responsive Layout**: Works seamlessly on desktop and mobile devices
- **Toast Notifications**: User-friendly feedback for all actions
- **Loading States**: Visual feedback during data operations
- **Error Handling**: Comprehensive error messages and recovery options

### 📊 Dashboard Features
- **Document Overview**: Quick view of all user documents
- **Document Statistics**: Creation dates, modification history
- **Quick Actions**: Easy access to create, edit, and delete functions
- **Search Integration**: Integrated search functionality in dashboard

## 🛠️ Technology Stack

### Frontend
- **React 19.1.0**: Modern React with hooks
- **React Router DOM 7.6.3**: Client-side routing
- **Axios 1.10.0**: HTTP client for API communication
- **JWT Decode 4.0.0**: JWT token parsing
- **React Toastify 11.0.5**: Toast notifications
- **Custom CSS**: Modern styling with responsive design

### Backend
- **Spring Boot 3.5.3**: Main framework
- **Spring Security 6.5.1**: Authentication and authorization
- **Spring Data JPA**: Database operations
- **Hibernate 6.6.18**: ORM framework
- **MySQL Connector**: Database connectivity
- **JWT 0.12.3**: Token-based authentication
- **Lombok**: Code generation and boilerplate reduction

### Database
- **MySQL 8.0**: Primary database
- **HikariCP**: Connection pooling
- **Hibernate DDL**: Automatic schema generation

## 📋 Prerequisites

Before running this project, ensure you have the following installed:

- **Java 21** or higher
- **Node.js 18** or higher
- **MySQL 8.0** or higher
- **Maven 3.6** or higher
- **Git** (for cloning the repository)

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd knowledge-base-platform
```

### 2. Database Setup

1. **Create MySQL Database**:
   ```sql
   CREATE DATABASE knowledge_base;
   ```

2. **Configure Database Connection**:
   Update `server/knowledge-base-server/src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/knowledge_base?useSSL=false&serverTimezone=UTC
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```

### 3. Backend Setup

1. **Navigate to Backend Directory**:
   ```bash
   cd server/knowledge-base-server
   ```

2. **Install Dependencies**:
   ```bash
   mvn clean install
   ```

3. **Start Backend Server**:
   ```bash
   mvn spring-boot:run
   ```

   The backend will start on `http://localhost:8080`

   **Note**: If port 8080 is already in use, you can:
   - Kill the process using port 8080: `netstat -ano | findstr :8080` then `taskkill /PID <PID> /F`
   - Or change the port in `application.properties`: `server.port=8081`

### 4. Frontend Setup

1. **Navigate to Frontend Directory**:
   ```bash
   cd client
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start Frontend Development Server**:
   ```bash
   npm start
   ```

   The frontend will start on `http://localhost:3000`

## 🎯 Usage Guide

### Getting Started

1. **Access the Application**: Open `http://localhost:3000` in your browser
2. **Register an Account**: Click "Sign Up" and create your account
3. **Login**: Use your credentials to log in
4. **Create Your First Document**: Click "Create Document" to start

### Creating Documents

1. Click the **"Create Document"** button
2. Enter a **title** for your document
3. Use the **rich text editor** to write your content
   - Use the toolbar for formatting (bold, italic, underline)
   - Switch to simple text mode if needed
4. Set **visibility** (Private or Public)
5. Click **"Save Document"**

### Managing Documents

- **View Documents**: All your documents appear on the dashboard
- **Edit Documents**: Click the edit (✏️) button on any document
- **Delete Documents**: Click the delete (🗑️) button (with confirmation)
- **Search Documents**: Use the search bar to find specific documents

### Search Functionality

- **Real-time Search**: Type in the search bar to instantly filter documents
- **Search Scope**: Searches through both document titles and content
- **Clear Search**: Click the "X" button to clear search results

## 🔧 Configuration

### Backend Configuration

Key configuration options in `application.properties`:

```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/knowledge_base
spring.datasource.username=root
spring.datasource.password=your_password

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# Server Configuration
server.port=8080

# JWT Configuration
app.jwt.secret=your_jwt_secret_key
```

### Frontend Configuration

API endpoint configuration in components:
- Backend URL: `http://localhost:8080`
- API Base: `http://localhost:8080/api`

## 🐛 Troubleshooting

### Common Issues

1. **Port 8080 Already in Use**:
   ```bash
   netstat -ano | findstr :8080
   taskkill /PID <PID> /F
   ```

2. **Database Connection Issues**:
   - Verify MySQL is running
   - Check database credentials in `application.properties`
   - Ensure database `knowledge_base` exists

3. **Frontend Build Issues**:
   ```bash
   cd client
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **Backend Build Issues**:
   ```bash
   cd server/knowledge-base-server
   mvn clean install
   ```

### Development Tips

- **Backend Logs**: Check console output for detailed error messages
- **Frontend Console**: Use browser developer tools (F12) for debugging
- **Database**: Use MySQL Workbench or similar tool to inspect data
- **JWT Tokens**: Check browser localStorage for token management

## 📁 Project Structure

```
knowledge-base-platform/
├── client/                          # React Frontend
│   ├── public/                      # Static files
│   │   ├── components/              # React components
│   │   │   ├── Auth/               # Authentication components
│   │   │   ├── Dashboard/          # Main dashboard
│   │   │   └── Documents/          # Document management
│   │   ├── App.js                  # Main app component
│   │   └── index.js                # App entry point
│   └── package.json                # Frontend dependencies
├── server/                          # Spring Boot Backend
│   └── knowledge-base-server/
│       ├── src/main/java/
│       │   └── com/mahesh/knowledge_base_server/
│       │       ├── controller/     # REST controllers
│       │       ├── entity/         # JPA entities
│       │       ├── repository/     # Data repositories
│       │       ├── service/        # Business logic
│       │       ├── security/       # Security configuration
│       │       └── dto/            # Data transfer objects
│       ├── src/main/resources/
│       │   └── application.properties
│       └── pom.xml                 # Backend dependencies
└── README.md                       # This file
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Encryption**: BCrypt password hashing
- **CORS Configuration**: Proper cross-origin resource sharing
- **Input Validation**: Server-side validation for all inputs
- **SQL Injection Protection**: Parameterized queries via JPA

## 🚀 Deployment

### Production Build

**Frontend**:
```bash
cd client
npm run build
```

**Backend**:
```bash
cd server/knowledge-base-server
mvn clean package
java -jar target/knowledge-base-server-0.0.1-SNAPSHOT.jar
```

### Environment Variables

For production deployment, consider:
- Using environment variables for database credentials
- Configuring proper JWT secrets
- Setting up HTTPS
- Configuring production database settings

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Mahesh Reddy Pannala**
- Email: maheshreddy.pannalaaa@gmail.com

