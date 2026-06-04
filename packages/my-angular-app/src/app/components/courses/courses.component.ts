import { Component, OnInit, OnDestroy } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { 
  Course, 
  ApiService, 
  CreateEnrollmentRequest 
} from '@monorepo-test/utils-common';
import { 
  CourseCardComponent, 
  ButtonComponent 
} from '@monorepo-test/ui-shared';
import { SimpleUserService } from '../../app';

@Component({
  selector: 'app-courses',
  imports: [CourseCardComponent, ButtonComponent],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.css'
})
export class CoursesComponent implements OnInit, OnDestroy {
  courses: Course[] = [];
  loading = true;
  error: string | null = null;
  isEnrolling = false;
  enrollmentStatus: { [courseId: string]: boolean } = {}; // Track enrollment status for each course
  
  private unsubscribe?: () => void;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadCoursesAndEnrollments();
    
    // Subscribe to user changes
    this.unsubscribe = SimpleUserService.subscribe((newUserId: string) => {
      // When the user changes, reload courses to update the state
      this.loadCoursesAndEnrollments();
    });
  }

  ngOnDestroy(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  private getCurrentStudentId(): string {
    return SimpleUserService.getCurrentUserId();
  }

  private loadCoursesAndEnrollments(): void {
    this.loading = true;
    this.error = null;
    const currentStudentId = this.getCurrentStudentId();

    this.apiService.getCourses().subscribe({
      next: (courses) => {
        this.courses = courses;
        // For each course, check if the user is enrolled
        this.checkEnrollmentStatus(courses, currentStudentId);
      },
      error: (error) => {
        console.error('Error loading courses:', error);
        this.error = 'Failed to load courses. Please ensure the server is running.';
        this.loading = false;
      }
    });
  }

  private checkEnrollmentStatus(courses: Course[], studentId: string): void {
    const enrollmentChecks = courses.map(course => 
      this.apiService.isStudentEnrolledInCourse(studentId, course.id)
    );

    // Use Promise.all to wait for all checks
    Promise.all(enrollmentChecks.map(obs => lastValueFrom(obs))).then(results => {
      this.enrollmentStatus = {};
      courses.forEach((course, index) => {
        this.enrollmentStatus[course.id] = results[index] || false;
      });
      this.loading = false;
    }).catch(error => {
      console.error('Error checking enrollment status:', error);
      this.loading = false;
    });
  }

  isEnrolledInCourse(courseId: string): boolean {
    return this.enrollmentStatus[courseId] || false;
  }

  getButtonText(courseId: string): string {
    return this.isEnrolledInCourse(courseId) ? 'Already Enrolled' : 'Enroll';
  }

  getButtonVariant(courseId: string): "primary" | "secondary" | "success" | "danger" {
    return this.isEnrolledInCourse(courseId) ? 'secondary' : 'success';
  }

  canEnroll(courseId: string): boolean {
    return !this.isEnrolledInCourse(courseId) && !this.isEnrolling;
  }

  enrollInCourse(courseId: string): void {
    if (this.isEnrolling || this.isEnrolledInCourse(courseId)) return;

    this.isEnrolling = true;
    const currentStudentId = this.getCurrentStudentId();

    // Create the enrollment directly since we know the user is not enrolled
    const enrollmentRequest: CreateEnrollmentRequest = {
      studentId: currentStudentId,
      courseId: courseId,
      date: new Date().toISOString().split('T')[0] // Format YYYY-MM-DD
    };

    this.apiService.createEnrollment(enrollmentRequest).subscribe({
      next: () => {
        alert('You have successfully enrolled in the course!');
        this.isEnrolling = false;
        // Update local state
        this.enrollmentStatus[courseId] = true;
      },
      error: (error) => {
        console.error('Error enrolling in course:', error);
        alert('Error enrolling in the course. Please try again.');
        this.isEnrolling = false;
      }
    });
  }
}
