import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { 
  Course, 
  EnrollmentWithDetails, 
  ApiService 
} from '@monorepo-test/utils-common';
import { 
  TableComponent, 
  TableColumn, 
  ButtonComponent 
} from '@monorepo-test/ui-shared';

@Component({
  selector: 'app-course-enrollments',
  imports: [FormsModule, TableComponent, ButtonComponent],
  templateUrl: './course-enrollments.component.html',
  styleUrl: './course-enrollments.component.css'
})
export class CourseEnrollmentsComponent implements OnInit {
  courses: Course[] = [];
  enrollments: EnrollmentWithDetails[] = [];
  selectedCourseId = '';
  selectedCourse: Course | null = null;
  loadingCourses = true;
  loadingEnrollments = false;
  error: string | null = null;

  // Table configuration
  tableColumns: TableColumn[] = [
    { key: 'student.name', label: 'Student Name', sortable: true },
    { key: 'student.email', label: 'Email', sortable: true },
    { key: 'date', label: 'Enrollment Date', sortable: true }
  ];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.loadingCourses = true;
    this.error = null;

    this.apiService.getCourses().subscribe({
      next: (courses) => {
        this.courses = courses;
        this.loadingCourses = false;
      },
      error: (error) => {
        console.error('Error loading courses:', error);
        this.error = 'Failed to load courses. Please ensure the server is running.';
        this.loadingCourses = false;
      }
    });
  }

  onCourseChange(): void {
    if (this.selectedCourseId) {
      this.selectedCourse = this.courses.find(c => c.id === this.selectedCourseId) || null;
      this.loadEnrollments();
    } else {
      this.selectedCourse = null;
      this.enrollments = [];
    }
  }

  loadEnrollments(): void {
    if (!this.selectedCourseId) return;

    this.loadingEnrollments = true;
    this.error = null;

    this.apiService.getCourseEnrollmentsWithDetails(this.selectedCourseId).subscribe({
      next: (enrollments) => {
        this.enrollments = enrollments;
        this.loadingEnrollments = false;
      },
      error: (error) => {
        console.error('Error loading enrollments:', error);
        this.error = 'Failed to load course enrollments.';
        this.loadingEnrollments = false;
      }
    });
  }
}
