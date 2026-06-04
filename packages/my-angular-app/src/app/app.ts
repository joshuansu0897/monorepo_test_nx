import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { 
  ApiService, 
  Student 
} from '@monorepo-test/utils-common';

// Simple Service to manage the current user
export class SimpleUserService {
  private static currentUserId = '1';
  private static listeners: ((id: string) => void)[] = [];
  
  static getCurrentUserId(): string {
    return this.currentUserId;
  }
  
  static setCurrentUserId(id: string): void {
    this.currentUserId = id;
    // Notification to all listeners about the change
    this.listeners.forEach(listener => listener(id));
  }

  static subscribe(listener: (id: string) => void): () => void {
    this.listeners.push(listener);
    // Return a function to unsubscribe
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }
}

@Component({
  imports: [RouterModule, CommonModule],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected title = 'Student Platform';
  students: Student[] = [];
  currentStudentId = '1'; // Default value

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadStudents();
  }

  private loadStudents(): void {
    this.apiService.getStudents().subscribe({
      next: (students) => {
        this.students = students;
        // If there are students, select the first one by default
        if (students.length > 0) {
          this.currentStudentId = students[0].id;
          SimpleUserService.setCurrentUserId(this.currentStudentId);
        }
      },
      error: (error) => {
        console.error('Error loading students:', error);
      }
    });
  }

  onStudentChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.currentStudentId = target.value;
    SimpleUserService.setCurrentUserId(this.currentStudentId);
  }
}
