import { Component, OnInit, OnDestroy } from '@angular/core';
import { 
  EnrollmentWithDetails, 
  ApiService 
} from '@monorepo-test/utils-common';
import { 
  TableComponent, 
  TableColumn, 
  TableAction,
  ButtonComponent 
} from '@monorepo-test/ui-shared';
import { SimpleUserService } from '../../app';

@Component({
  selector: 'app-my-enrollments',
  imports: [TableComponent, ButtonComponent],
  templateUrl: './my-enrollments.component.html',
  styleUrl: './my-enrollments.component.css'
})
export class MyEnrollmentsComponent implements OnInit, OnDestroy {
  enrollments: EnrollmentWithDetails[] = [];
  loading = true;
  error: string | null = null;
  
  private unsubscribe?: () => void;

  // Table configuration
  tableColumns: TableColumn[] = [
    { key: 'course.title', label: 'Course', sortable: true },
    { key: 'course.teacher', label: 'Teacher', sortable: true },
    { key: 'date', label: 'Enrollment Date', sortable: true },
    { key: 'course.description', label: 'Description' }
  ];

  tableActions: TableAction[] = [
    {
      label: 'Cancel',
      variant: 'danger',
      onClick: (enrollment: EnrollmentWithDetails) => this.cancelEnrollment(enrollment)
    }
  ];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadEnrollments();
    
    // Subscribe to user changes
    this.unsubscribe = SimpleUserService.subscribe((newUserId: string) => {
      // When the user changes, reload enrollments
      this.loadEnrollments();
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

  loadEnrollments(): void {
    this.loading = true;
    this.error = null;
    const currentStudentId = this.getCurrentStudentId();

    this.apiService.getStudentEnrollmentsWithDetails(currentStudentId).subscribe({
      next: (enrollments) => {
        this.enrollments = enrollments;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading enrollments:', error);
        this.error = 'Failed to load your enrollments. Please ensure the server is running.';
        this.loading = false;
      }
    });
  }

  cancelEnrollment(enrollment: EnrollmentWithDetails): void {
    const courseName = enrollment.course?.title || 'the course';
    
    if (confirm(`Are you sure you want to cancel your enrollment in "${courseName}"?`)) {
      this.apiService.deleteEnrollment(enrollment.id).subscribe({
        next: () => {
          alert('Enrollment successfully canceled');
          this.loadEnrollments(); // Reload the list
        },
        error: (error) => {
          console.error('Error canceling enrollment:', error);
          alert('Error canceling enrollment. Please try again.');
        }
      });
    }
  }
}
