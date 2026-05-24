import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';
import { 
  Course, 
  CreateCourseRequest, 
  UpdateCourseRequest,
  Student,
  CreateStudentRequest,
  UpdateStudentRequest,
  Enrollment,
  CreateEnrollmentRequest,
  EnrollmentWithDetails
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  // ========== COURSES ==========
  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.baseUrl}/courses`);
  }

  getCourse(id: string): Observable<Course> {
    return this.http.get<Course>(`${this.baseUrl}/courses/${id}`);
  }

  createCourse(course: CreateCourseRequest): Observable<Course> {
    return this.http.post<Course>(`${this.baseUrl}/courses`, course);
  }

  updateCourse(id: string, course: UpdateCourseRequest): Observable<Course> {
    return this.http.put<Course>(`${this.baseUrl}/courses/${id}`, course);
  }

  deleteCourse(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/courses/${id}`);
  }

  // ========== STUDENTS ==========
  getStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.baseUrl}/students`);
  }

  getStudent(id: string): Observable<Student> {
    return this.http.get<Student>(`${this.baseUrl}/students/${id}`);
  }

  createStudent(student: CreateStudentRequest): Observable<Student> {
    return this.http.post<Student>(`${this.baseUrl}/students`, student);
  }

  updateStudent(id: string, student: UpdateStudentRequest): Observable<Student> {
    return this.http.put<Student>(`${this.baseUrl}/students/${id}`, student);
  }

  deleteStudent(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/students/${id}`);
  }

  // ========== ENROLLMENTS ==========
  getEnrollments(): Observable<Enrollment[]> {
    return this.http.get<Enrollment[]>(`${this.baseUrl}/enrollments`);
  }

  getEnrollment(id: string): Observable<Enrollment> {
    return this.http.get<Enrollment>(`${this.baseUrl}/enrollments/${id}`);
  }

  createEnrollment(enrollment: CreateEnrollmentRequest): Observable<Enrollment> {
    return this.http.post<Enrollment>(`${this.baseUrl}/enrollments`, enrollment);
  }

  deleteEnrollment(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/enrollments/${id}`);
  }

  // ========== HELPERS ==========
  /**
   * Obtiene las inscripciones de un estudiante específico con detalles del curso
   */
  getStudentEnrollmentsWithDetails(studentId: string): Observable<EnrollmentWithDetails[]> {
    return forkJoin({
      enrollments: this.getEnrollments(),
      courses: this.getCourses()
    }).pipe(
      map(({ enrollments, courses }) => {
        return enrollments
          .filter(enrollment => enrollment.studentId === studentId)
          .map(enrollment => ({
            ...enrollment,
            course: courses.find(course => course.id === enrollment.courseId)
          }));
      })
    );
  }

  /**
   * Obtiene los estudiantes inscritos en un curso específico
   */
  getCourseEnrollmentsWithDetails(courseId: string): Observable<EnrollmentWithDetails[]> {
    return forkJoin({
      enrollments: this.getEnrollments(),
      students: this.getStudents()
    }).pipe(
      map(({ enrollments, students }) => {
        return enrollments
          .filter(enrollment => enrollment.courseId === courseId)
          .map(enrollment => ({
            ...enrollment,
            student: students.find(student => student.id === enrollment.studentId)
          }));
      })
    );
  }

  /**
   * Verifica si un estudiante ya está inscrito en un curso
   */
  isStudentEnrolledInCourse(studentId: string, courseId: string): Observable<boolean> {
    return this.getEnrollments().pipe(
      map(enrollments => 
        enrollments.some(enrollment => 
          enrollment.studentId === studentId && 
          enrollment.courseId === courseId
        )
      )
    );
  }
}
