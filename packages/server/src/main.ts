import * as http from 'http';
import * as url from 'url';

// Types
interface Course {
    id: string;
    title: string;
    description: string;
    teacher: string;
}

interface Student {
    id: string;
    name: string;
    email: string;
}

interface Enrollment {
    id: string;
    studentId: string;
    courseId: string;
    date: string;
}

// In-memory data
let courses: Course[] = [
    { id: '1', title: 'Angular monorepo with NX', description: 'how to use monorepo architecture', teacher: 'Teacher One' },
    { id: '2', title: 'Python Fundamentals', description: 'Python from scratch', teacher: 'Teacher One' },
    { id: '3', title: 'Go for Backend', description: 'powerful backend technology from Google', teacher: 'Teacher Two' }
];

let students: Student[] = [
    { id: '1', name: 'Alice Cooper', email: 'alice@gmail.com' },
    { id: '2', name: 'Bob Dylan', email: 'bob@gmail.com' },
    { id: '3', name: 'Courtney Love', email: 'courtney@gmail.com' }
];

let enrollments: Enrollment[] = [
    { id: '1', studentId: '1', courseId: '1', date: '2025-08-15' },
    { id: '2', studentId: '1', courseId: '2', date: '2025-08-20' },
    { id: '3', studentId: '2', courseId: '1', date: '2025-08-21' },
    { id: '4', studentId: '3', courseId: '1', date: '2025-08-25' }
];

// Helper functions
const generateId = () => Date.now().toString();

const parseBody = (req: http.IncomingMessage): Promise<any> => {
    return new Promise((resolve) => {
        let body = '';
        req.on('data', (chunk) => body += chunk);
        req.on('end', () => {
            try {
                resolve(body ? JSON.parse(body) : {});
            } catch {
                resolve({});
            }
        });
    });
};

const sendJSON = (res: http.ServerResponse, data: any, status = 200) => {
    res.writeHead(status, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end(JSON.stringify(data));
};

const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url || '', true);
    const path = parsedUrl.pathname || '';
    const method = req.method || '';
    const pathParts = path.split('/').filter(p => p);

    // Handle CORS preflight
    if (method === 'OPTIONS') {
        res.writeHead(200, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        });
        res.end();
        return;
    }

    try {
        // COURSES endpoints
        if (pathParts[0] === 'courses') {
            if (method === 'GET' && pathParts.length === 1) {
                sendJSON(res, courses);
            } else if (method === 'GET' && pathParts.length === 2) {
                const course = courses.find(c => c.id === pathParts[1]);
                if (course) {
                    sendJSON(res, course);
                } else {
                    sendJSON(res, { error: 'Course not found' }, 404);
                }
            } else if (method === 'POST' && pathParts.length === 1) {
                const body = await parseBody(req);
                const newCourse: Course = {
                    id: generateId(),
                    title: body.title,
                    description: body.description,
                    teacher: body.teacher
                };
                courses.push(newCourse);
                sendJSON(res, newCourse, 201);
            } else if (method === 'PUT' && pathParts.length === 2) {
                const body = await parseBody(req);
                const index = courses.findIndex(c => c.id === pathParts[1]);
                if (index !== -1) {
                    courses[index] = { ...courses[index], ...body };
                    sendJSON(res, courses[index]);
                } else {
                    sendJSON(res, { error: 'Course not found' }, 404);
                }
            } else if (method === 'DELETE' && pathParts.length === 2) {
                const index = courses.findIndex(c => c.id === pathParts[1]);
                if (index !== -1) {
                    courses.splice(index, 1);
                    sendJSON(res, {});
                } else {
                    sendJSON(res, { error: 'Course not found' }, 404);
                }
            }
        }

        // STUDENTS endpoints
        else if (pathParts[0] === 'students') {
            if (method === 'GET' && pathParts.length === 1) {
                sendJSON(res, students);
            } else if (method === 'GET' && pathParts.length === 2) {
                const student = students.find(s => s.id === pathParts[1]);
                if (student) {
                    sendJSON(res, student);
                } else {
                    sendJSON(res, { error: 'Student not found' }, 404);
                }
            } else if (method === 'POST' && pathParts.length === 1) {
                const body = await parseBody(req);
                const newStudent: Student = {
                    id: generateId(),
                    name: body.name,
                    email: body.email
                };
                students.push(newStudent);
                sendJSON(res, newStudent, 201);
            } else if (method === 'PUT' && pathParts.length === 2) {
                const body = await parseBody(req);
                const index = students.findIndex(s => s.id === pathParts[1]);
                if (index !== -1) {
                    students[index] = { ...students[index], ...body };
                    sendJSON(res, students[index]);
                } else {
                    sendJSON(res, { error: 'Student not found' }, 404);
                }
            } else if (method === 'DELETE' && pathParts.length === 2) {
                const index = students.findIndex(s => s.id === pathParts[1]);
                if (index !== -1) {
                    students.splice(index, 1);
                    sendJSON(res, {});
                } else {
                    sendJSON(res, { error: 'Student not found' }, 404);
                }
            }
        }

        // ENROLLMENTS endpoints
        else if (pathParts[0] === 'enrollments') {
            if (method === 'GET' && pathParts.length === 1) {
                sendJSON(res, enrollments);
            } else if (method === 'GET' && pathParts.length === 2) {
                const enrollment = enrollments.find(e => e.id === pathParts[1]);
                if (enrollment) {
                    sendJSON(res, enrollment);
                } else {
                    sendJSON(res, { error: 'Enrollment not found' }, 404);
                }
            } else if (method === 'POST' && pathParts.length === 1) {
                const body = await parseBody(req);
                const newEnrollment: Enrollment = {
                    id: generateId(),
                    studentId: body.studentId,
                    courseId: body.courseId,
                    date: body.date
                };
                enrollments.push(newEnrollment);
                sendJSON(res, newEnrollment, 201);
            } else if (method === 'DELETE' && pathParts.length === 2) {
                const index = enrollments.findIndex(e => e.id === pathParts[1]);
                if (index !== -1) {
                    enrollments.splice(index, 1);
                    sendJSON(res, {});
                } else {
                    sendJSON(res, { error: 'Enrollment not found' }, 404);
                }
            }
        }

        // Default 404
        else {
            sendJSON(res, { error: 'Not found' }, 404);
        }
    } catch (error) {
        sendJSON(res, { error: 'Internal server error' }, 500);
    }
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
