import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { 
  Course, 
  CreateCourseRequest,
  UpdateCourseRequest,
  ApiService 
} from '@monorepo-test/utils-common';
import { 
  TableComponent, 
  TableColumn, 
  TableAction,
  ButtonComponent,
  CourseCardComponent 
} from '@monorepo-test/ui-shared';

@Component({
  selector: 'app-course-management',
  imports: [FormsModule, TableComponent, ButtonComponent, CourseCardComponent],
  templateUrl: './course-management.component.html',
  styleUrl: './course-management.component.css'
})
export class CourseManagementComponent implements OnInit {
  courses: Course[] = [];
  loading = true;
  error: string | null = null;
  isSubmitting = false;
  editingCourse: Course | null = null;

  courseForm: CreateCourseRequest = {
    title: '',
    description: '',
    teacher: ''
  };

  // Table configuration
  tableColumns: TableColumn[] = [
    { key: 'title', label: 'Title', sortable: true },
    { key: 'teacher', label: 'Teacher', sortable: true },
    { key: 'description', label: 'Description' }
  ];

  tableActions: TableAction[] = [
    {
      label: 'Edit',
      variant: 'primary',
      onClick: (course: Course) => this.editCourse(course)
    },
    {
      label: 'Delete',
      variant: 'danger',
      onClick: (course: Course) => this.deleteCourse(course)
    }
  ];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.loading = true;
    this.error = null;

    this.apiService.getCourses().subscribe({
      next: (courses) => {
        this.courses = courses;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading courses:', error);
        this.error = 'Failed to load courses. Please ensure the server is running.';
        this.loading = false;
      }
    });
  }

  saveCourse(): void {
    if (this.isSubmitting) return;

    // Validate that all required fields are filled
    if (!this.isFormValid()) {
      alert('Please fill in all required fields.');
      return;
    }

    this.isSubmitting = true;

    if (this.editingCourse) {
      // Update existing course
      const updateRequest: UpdateCourseRequest = {
        title: this.courseForm.title,
        description: this.courseForm.description,
        teacher: this.courseForm.teacher
      };

      this.apiService.updateCourse(this.editingCourse.id, updateRequest).subscribe({
        next: () => {
          alert('Course updated successfully');
          this.resetForm();
          this.loadCourses();
        },
        error: (error) => {
          console.error('Error updating course:', error);
          alert('Error updating course. Please try again.');
          this.isSubmitting = false;
        }
      });
    } else {
      // Create new course
      this.apiService.createCourse(this.courseForm).subscribe({
        next: () => {
          alert('Course created successfully');
          this.resetForm();
          this.loadCourses();
        },
        error: (error) => {
          console.error('Error creating course:', error);
          alert('Error creating course. Please try again.');
          this.isSubmitting = false;
        }
      });
    }
  }

  editCourse(course: Course): void {
    this.editingCourse = course;
    this.courseForm = {
      title: course.title,
      description: course.description,
      teacher: course.teacher
    };
  }

  cancelEdit(): void {
    this.resetForm();
  }

  deleteCourse(course: Course): void {
    if (confirm(`Are you sure you want to delete the course "${course.title}"?`)) {
      this.apiService.deleteCourse(course.id).subscribe({
        next: () => {
          alert('Course deleted successfully');
          this.loadCourses();
        },
        error: (error) => {
          console.error('Error deleting course:', error);
          alert('Error deleting course. Please try again.');
        }
      });
    }
  }

  isFormValid(): boolean {
    return !!(
      this.courseForm.title?.trim() &&
      this.courseForm.description?.trim() &&
      this.courseForm.teacher?.trim()
    );
  }

  private resetForm(): void {
    this.courseForm = {
      title: '',
      description: '',
      teacher: ''
    };
    this.editingCourse = null;
    this.isSubmitting = false;
  }
}
