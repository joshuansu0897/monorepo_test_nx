The server exposes the following endpoints to operate on the main resources:

http://localhost:3000

### Courses
- `GET    /api/courses`         → List all courses
- `GET    /api/courses/:id`     → Get course by ID
- `POST   /api/courses`         → Create a new course
- `PUT    /api/courses/:id`     → Update an existing course
- `DELETE /api/courses/:id`     → Delete a course

### Students
- `GET    /api/students`        → List all students
- `GET    /api/students/:id`    → Get student by ID
- `POST   /api/students`        → Create a new student
- `PUT    /api/students/:id`    → Update an existing student
- `DELETE /api/students/:id`    → Delete a student

### Enrollments
- `GET    /api/enrollments`     → List all enrollments
- `GET    /api/enrollments/:id` → Get enrollment by ID
- `POST   /api/enrollments`     → Create a new enrollment
- `PUT    /api/enrollments/:id` → Update an existing enrollment
- `DELETE /api/enrollments/:id` → Delete an enrollment
