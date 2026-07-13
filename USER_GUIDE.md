# Time Tracking Tool - Complete User Guide

## 📖 Table of Contents
1. [Getting Started](#getting-started)
2. [Understanding User Roles](#understanding-user-roles)
3. [Login Process](#login-process)
4. [Admin Role Guide](#admin-role-guide)
5. [Project Manager Role Guide](#project-manager-role-guide)
6. [Team Member Role Guide](#team-member-role-guide)
7. [Common Tasks & Workflows](#common-tasks--workflows)
8. [Tips & Best Practices](#tips--best-practices)
9. [Troubleshooting](#troubleshooting)

---

## 🚀 Getting Started

### What is the Time Tracking Tool?
This application helps teams track time spent on projects and tasks. It provides different dashboards based on your role in the organization, allowing you to manage projects, assign tasks, and log work hours efficiently.

### How to Launch the Application
1. **Windows Users**: Double-click `run.bat`
2. **Mac/Linux Users**: Run `./run.sh` in terminal
3. **Manual Method**: Open terminal and run `mvn clean javafx:run`

### First Time Setup
- No setup required! The application comes with a pre-configured database
- Sample data is automatically loaded for immediate testing
- Demo accounts are ready to use

---

## 👥 Understanding User Roles

The application has three distinct user roles, each with specific permissions and capabilities:

### 🔴 Admin (System Administrator)
**Who**: IT administrators, system managers, company executives
**Purpose**: Manage the entire system, users, and high-level project oversight
**Key Responsibilities**:
- Manage user accounts and assign roles
- Create and oversee all projects
- Monitor system integrations
- Generate comprehensive reports

### 🟡 Project Manager (PM)
**Who**: Project leads, team leads, department managers
**Purpose**: Manage projects and coordinate team activities
**Key Responsibilities**:
- Assign tasks to team members
- Monitor project progress
- Track time allocation across projects
- Review team performance

### 🟢 Team Member (Developer/Employee)
**Who**: Developers, designers, analysts, individual contributors
**Purpose**: Execute tasks and track personal work time
**Key Responsibilities**:
- Log time spent on assigned tasks
- Update task status and progress
- View personal work history
- Manage assigned tasks

---

## 🔐 Login Process

### Step 1: Launch Application
When you start the application, you'll see the login screen with:
- Username field
- Password field
- Demo account information panel

### Step 2: Choose Your Demo Account
For testing purposes, use these pre-configured accounts:

| Role | Username | Password | What You'll See |
|------|----------|----------|-----------------|
| Admin | `admin` | `admin123` | Full system control |
| Project Manager | `pm1` | `pm123` | Project and team management |
| Team Member | `dev1` | `dev123` | Personal task and time management |
| Team Member | `dev2` | `dev123` | Alternative team member view |

### Step 3: Login
1. Enter your username and password
2. Click "Sign In" button (or press Enter)
3. You'll be automatically redirected to your role-specific dashboard

### What Happens After Login?
- The system identifies your role
- You're taken to your personalized dashboard
- Your name appears in the top-right corner
- All features are customized for your role

---

## 🔴 Admin Role Guide

### Dashboard Overview
As an Admin, you have four main tabs:
1. **User Management** - Control user accounts
2. **Project Management** - Oversee all projects
3. **Integration** - Monitor system connections
4. **Reports** - Generate analytics

### Tab 1: User Management
**Purpose**: Manage all user accounts and their roles

#### What You See:
- Table showing all users with their details:
  - ID, Username, Full Name, Email, Current Role
  - "Edit Role" button for each user

#### What You Can Do:
1. **View All Users**: See complete user list with their information
2. **Add New User**:
   - Click "Add User" button
   - Fill in: Username, Password, Full Name, Email, Role
   - Click "Add" to create the account
3. **Change User Roles**:
   - Click "Edit Role" next to any user
   - Select new role from dropdown
   - Confirm the change

#### Step-by-Step: Adding a New User
1. Click the green "Add User" button
2. Enter required information:
   - **Username**: Unique login name (e.g., "john.doe")
   - **Password**: Secure password for the user
   - **Full Name**: Display name (e.g., "John Doe")
   - **Email**: Contact email
   - **Role**: Select from Admin, Project Manager, or Team Member
3. Click "Add" button
4. Success message confirms user creation
5. New user appears in the table

### Tab 2: Project Management
**Purpose**: Create and manage all company projects

#### What You See:
- Table of all projects showing:
  - ID, Title, Description, Start Date, End Date, Status

#### What You Can Do:
1. **View All Projects**: See complete project portfolio
2. **Add New Project**:
   - Click "Add Project" button
   - Enter project details
   - Set timeline and description

#### Step-by-Step: Creating a New Project
1. Click the blue "Add Project" button
2. Fill in the project form:
   - **Title**: Project name (e.g., "Mobile App Redesign")
   - **Description**: Detailed project description
   - **Start Date**: When project begins
   - **End Date**: Target completion date
3. Click "Add" to create the project
4. Project appears in the table immediately

### Tab 3: Integration
**Purpose**: Monitor connections to external project management tools

#### What You See:
- Integration status card showing connection status
- "Test Integration" button

#### What You Can Do:
1. **Check Integration Status**: See if external tools are connected
2. **Test Integration**: Verify connections are working
   - Click "Test Integration"
   - System simulates connection test
   - Status updates to show results

### Tab 4: Reports
**Purpose**: Generate and view project analytics

#### What You See:
- Project selection dropdown
- Date range pickers
- Pie chart showing time distribution

#### What You Can Do:
1. **Select Project**: Choose specific project for analysis
2. **Set Date Range**: Pick start and end dates for report
3. **Generate Report**: Click "Generate Report" to update chart
4. **View Analytics**: Pie chart shows time spent across different projects

#### Step-by-Step: Generating a Report
1. Select a project from the dropdown menu
2. Choose start date (default: 1 month ago)
3. Choose end date (default: today)
4. Click "Generate Report"
5. Chart updates to show time distribution
6. Analyze the visual data for insights

---

## 🟡 Project Manager Role Guide

### Dashboard Overview
As a Project Manager, you have three main tabs:
1. **Task Assignment** - Manage team tasks
2. **Time Tracking Monitor** - View time analytics
3. **Progress Review** - Track project progress

### Tab 1: Task Assignment
**Purpose**: Create and assign tasks to team members

#### What You See:
- Table of all tasks showing:
  - Task ID, Title, Project, Assignee, Status, Due Date, Estimated Hours, Actual Hours

#### What You Can Do:
1. **View All Tasks**: See complete task overview across projects
2. **Assign New Task**: Create and assign tasks to team members

#### Step-by-Step: Assigning a New Task
1. Click the blue "Assign New Task" button
2. Fill in the task details:
   - **Title**: Clear task name (e.g., "Design Login Screen")
   - **Description**: Detailed task requirements
   - **Project**: Select from existing projects
   - **Assignee**: Choose team member from dropdown
   - **Due Date**: Set deadline (default: 2 weeks from today)
   - **Estimated Hours**: How long you expect the task to take
3. Click "Assign" to create the task
4. Task appears in the table
5. Assigned team member can now see it in their dashboard

#### Understanding Task Information:
- **Estimated Hours**: Your initial time estimate
- **Actual Hours**: Real time logged by team members
- **Status**: Current progress (To Do, In Progress, Completed, Blocked)

### Tab 2: Time Tracking Monitor
**Purpose**: Visualize how time is being spent across projects and team members

#### What You See:
- **Left Side**: Pie chart showing time distribution by project
- **Right Side**: Bar chart showing time spent by each team member

#### What You Can Do:
1. **Analyze Project Time**: See which projects consume most time
2. **Monitor Team Performance**: Compare individual team member contributions
3. **Identify Bottlenecks**: Spot projects or people that need attention

#### How to Read the Charts:
- **Pie Chart**: Each slice represents a project's share of total time
- **Bar Chart**: Each bar shows hours worked by individual team members
- **Colors**: Consistent across both charts for easy comparison

### Tab 3: Progress Review
**Purpose**: Track overall project progress and completion rates

#### What You See:
- Table showing project progress with:
  - Project Name, Total Tasks, Completed Tasks, In Progress Tasks, Pending Tasks, Progress %, Progress Bar

#### What You Can Do:
1. **Monitor Progress**: See completion percentages for all projects
2. **Identify Delays**: Spot projects falling behind schedule
3. **Refresh Data**: Update information with latest task statuses
4. **Export Reports**: Generate reports for stakeholders

#### Step-by-Step: Reviewing Progress
1. Look at the "Progress %" column to see completion rates
2. Check the visual progress bars for quick assessment
3. Identify projects with low completion rates
4. Click "Refresh Data" to get latest updates
5. Use "Export Report" for sharing with management

#### Understanding Progress Indicators:
- **Green Progress Bars**: Projects on track
- **Yellow/Orange Bars**: Projects needing attention
- **Red Bars**: Projects significantly behind schedule

---

## 🟢 Team Member Role Guide

### Dashboard Overview
As a Team Member, you have three main tabs:
1. **Log Time** - Record your work hours
2. **My Time Logs** - View your time history
3. **My Tasks** - Manage assigned tasks

### Tab 1: Log Time
**Purpose**: Record time spent on your assigned tasks

#### What You See:
- Time logging form with:
  - Task selection dropdown
  - Date picker
  - Hours spent field
  - Description text area
- Quick action buttons (1 Hour, 4 Hours, 8 Hours)

#### What You Can Do:
1. **Log Work Time**: Record hours spent on specific tasks
2. **Add Descriptions**: Explain what you accomplished
3. **Use Quick Buttons**: Rapidly enter common time amounts

#### Step-by-Step: Logging Time
1. **Select Task**: Choose from your assigned tasks in the dropdown
2. **Pick Date**: Select when you did the work (default: today)
3. **Enter Hours**: Type hours worked (e.g., "2.5" for 2 hours 30 minutes)
4. **Add Description**: Describe what you accomplished:
   - "Fixed login bug and updated user interface"
   - "Completed database schema design"
   - "Reviewed code and wrote unit tests"
5. **Submit**: Click "Log Time" button
6. **Confirmation**: Success message confirms your entry

#### Quick Time Entry:
- **1 Hour Button**: Automatically fills "1.0" in hours field
- **4 Hours Button**: Automatically fills "4.0" in hours field  
- **8 Hours Button**: Automatically fills "8.0" in hours field
- Still need to select task, date, and add description

#### Time Entry Tips:
- **Be Accurate**: Enter actual time worked, not estimated
- **Be Specific**: Describe what you accomplished
- **Log Daily**: Don't wait until end of week
- **Use Decimals**: 1.5 = 1 hour 30 minutes, 0.25 = 15 minutes

### Tab 2: My Time Logs
**Purpose**: View and filter your personal time tracking history

#### What You See:
- Filter controls (date range selection)
- Table of your time entries showing:
  - Date, Task, Project, Hours, Description, Logged At
- Total hours summary

#### What You Can Do:
1. **View All Entries**: See complete work history
2. **Filter by Date**: Focus on specific time periods
3. **Track Total Hours**: See cumulative time worked
4. **Review Descriptions**: Remember what you accomplished

#### Step-by-Step: Filtering Time Logs
1. **Set Start Date**: Click first date picker, choose beginning of period
2. **Set End Date**: Click second date picker, choose end of period
3. **Apply Filter**: Click "Filter" button
4. **Review Results**: Table updates to show only entries in date range
5. **Check Total**: "Total Hours" label updates to show filtered sum

#### Understanding Your Time Data:
- **Date**: When you performed the work
- **Task**: Which task you worked on
- **Project**: Which project the task belongs to
- **Hours**: Time you logged for that entry
- **Description**: What you accomplished
- **Logged At**: When you made the time entry

### Tab 3: My Tasks
**Purpose**: View and manage your assigned tasks

#### What You See:
- Table of your assigned tasks showing:
  - Task ID, Title, Project, Status, Due Date, Estimated Hours, Logged Hours
  - "Update Status" button for each task

#### What You Can Do:
1. **View Assignments**: See all tasks assigned to you
2. **Check Deadlines**: Monitor due dates
3. **Update Status**: Change task progress status
4. **Compare Time**: See estimated vs. actual hours

#### Step-by-Step: Updating Task Status
1. **Find Your Task**: Locate the task you want to update
2. **Click Update Status**: Click the yellow "Update Status" button
3. **Select New Status**: Choose from:
   - **To Do**: Haven't started yet
   - **In Progress**: Currently working on it
   - **Completed**: Finished the task
   - **Blocked**: Can't proceed due to obstacles
4. **Confirm**: Click OK to save the change
5. **Verification**: Status updates in the table

#### Understanding Task Information:
- **Estimated Hours**: How long PM thinks task should take
- **Logged Hours**: Actual time you've recorded
- **Due Date**: When task should be completed
- **Status**: Current progress state

#### Task Status Guidelines:
- **To Do**: Task is assigned but not started
- **In Progress**: Actively working on the task
- **Completed**: Task is finished and ready for review
- **Blocked**: Cannot proceed due to dependencies or issues

---

## 🔄 Common Tasks & Workflows

### Workflow 1: Starting a New Project (Admin → PM → Team)

#### Admin Steps:
1. Login as Admin
2. Go to "Project Management" tab
3. Click "Add Project"
4. Enter project details and timeline
5. Create the project

#### Project Manager Steps:
1. Login as Project Manager
2. Go to "Task Assignment" tab
3. Click "Assign New Task"
4. Create tasks for the new project
5. Assign tasks to team members

#### Team Member Steps:
1. Login as Team Member
2. Go to "My Tasks" tab
3. See newly assigned tasks
4. Update status to "In Progress"
5. Start logging time in "Log Time" tab

### Workflow 2: Daily Time Tracking (Team Member)

#### Morning Routine:
1. Login to application
2. Go to "My Tasks" tab
3. Review tasks for the day
4. Update any status changes from yesterday

#### During Work:
1. Work on assigned tasks
2. Keep track of time spent

#### End of Day:
1. Go to "Log Time" tab
2. Log time for each task worked on
3. Add detailed descriptions of accomplishments
4. Update task statuses if needed

### Workflow 3: Weekly Progress Review (Project Manager)

#### Monday Morning:
1. Login as Project Manager
2. Go to "Progress Review" tab
3. Click "Refresh Data"
4. Review project completion percentages
5. Identify projects needing attention

#### Mid-Week Check:
1. Go to "Time Tracking Monitor" tab
2. Review time distribution charts
3. Check if team members are balanced
4. Identify any bottlenecks

#### Friday Review:
1. Go to "Task Assignment" tab
2. Review completed tasks
3. Plan new tasks for next week
4. Generate reports for stakeholders

### Workflow 4: Monthly Reporting (Admin)

#### Month-End Process:
1. Login as Admin
2. Go to "Reports" tab
3. Set date range for the month
4. Generate reports for each project
5. Review time distribution
6. Share insights with management

---

## 💡 Tips & Best Practices

### For All Users:
- **Login Daily**: Make time tracking a daily habit
- **Be Consistent**: Use the same approach every day
- **Stay Updated**: Keep task statuses current
- **Communicate**: Use descriptions to communicate progress

### For Team Members:
- **Log Time Daily**: Don't wait until end of week
- **Be Detailed**: Write meaningful descriptions
- **Update Status**: Keep task status current
- **Ask Questions**: Contact PM if tasks are unclear

### For Project Managers:
- **Review Weekly**: Check progress at least weekly
- **Balance Workload**: Monitor team member time distribution
- **Set Realistic Estimates**: Use historical data for time estimates
- **Communicate Deadlines**: Ensure team knows priorities

### For Admins:
- **Monitor Usage**: Ensure all team members are logging time
- **Review Reports**: Generate regular analytics
- **Manage Users**: Keep user accounts up to date
- **Plan Capacity**: Use data for resource planning

### Time Logging Best Practices:
- **Round to Quarters**: Use 0.25, 0.5, 0.75 increments
- **Be Honest**: Log actual time, not ideal time
- **Include Breaks**: Don't log lunch or long breaks
- **Categorize Work**: Use descriptions to categorize activities

---

## 🔧 Troubleshooting

### Common Issues and Solutions:

#### Login Problems:
**Problem**: Can't login with demo accounts
**Solution**: 
- Ensure you're using exact usernames: `admin`, `pm1`, `dev1`, `dev2`
- Passwords are case-sensitive: `admin123`, `pm123`, `dev123`
- Try clearing the username field and retyping

#### Application Won't Start:
**Problem**: Error when running the application
**Solution**:
- Ensure Java 17+ is installed
- Run `mvn clean compile` first
- Check that Maven is properly installed
- Try running `mvn clean javafx:run`

#### Database Issues:
**Problem**: No data showing in tables
**Solution**:
- Database auto-initializes on first run
- If still empty, delete `timetracker.mv.db` file and restart
- Sample data should load automatically

#### Time Logging Issues:
**Problem**: Can't log time for tasks
**Solution**:
- Ensure you're logged in as a Team Member
- Check that tasks are assigned to your user
- Verify date is not in the future
- Hours must be a positive number

#### Chart Not Displaying:
**Problem**: Charts appear empty
**Solution**:
- Ensure there's time log data in the system
- Try refreshing the data
- Check date range settings
- Verify you have permission to view the data

#### Task Assignment Problems:
**Problem**: Can't assign tasks as PM
**Solution**:
- Ensure you're logged in as Project Manager
- Verify projects exist before creating tasks
- Check that team members exist in the system
- All fields in task form must be filled

### Getting Help:
1. **Check Error Messages**: Read any error dialogs carefully
2. **Restart Application**: Close and reopen the application
3. **Check Console**: Look for error messages in the terminal
4. **Reset Database**: Delete database file to start fresh
5. **Verify Java Version**: Ensure Java 17+ is installed

### Performance Tips:
- **Close Unused Tabs**: Focus on current work area
- **Refresh Data**: Use refresh buttons to update information
- **Log Out Properly**: Use logout button to end sessions
- **Regular Restarts**: Restart application periodically

---

## 🎯 Quick Reference

### Demo Account Summary:
| Username | Password | Role | Primary Functions |
|----------|----------|------|-------------------|
| admin | admin123 | Admin | User management, Project creation, Reports |
| pm1 | pm123 | Project Manager | Task assignment, Progress monitoring |
| dev1 | dev123 | Team Member | Time logging, Task updates |
| dev2 | dev123 | Team Member | Time logging, Task updates |

### Key Buttons and Their Functions:
- **Green Buttons**: Create/Add actions (Add User, Add Project)
- **Blue Buttons**: Primary actions (Assign Task, Log Time)
- **Yellow Buttons**: Edit/Update actions (Edit Role, Update Status)
- **Red Buttons**: System actions (Logout)
- **Cyan Buttons**: Refresh/Test actions (Refresh Data, Test Integration)

### Time Entry Format:
- **Whole Hours**: 1, 2, 3, 8
- **Half Hours**: 1.5, 2.5, 7.5
- **Quarter Hours**: 0.25, 1.25, 3.75
- **Minutes**: 0.1 = 6 minutes, 0.2 = 12 minutes

### Status Meanings:
- **To Do**: Not started
- **In Progress**: Currently working
- **Completed**: Finished
- **Blocked**: Cannot proceed

This guide covers everything you need to know to effectively use the Time Tracking Tool. Start with the demo accounts, explore each role's capabilities, and gradually build your understanding of the system's full potential.