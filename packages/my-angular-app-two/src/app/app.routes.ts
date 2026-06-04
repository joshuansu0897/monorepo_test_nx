import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  { 
    path: '', 
    redirectTo: '/courses', 
    pathMatch: 'full' 
  },
  { 
    path: 'courses', 
    loadComponent: () => import('./components/course-management/course-management.component').then(m => m.CourseManagementComponent)
  },
  { 
    path: 'course-enrollments', 
    loadComponent: () => import('./components/course-enrollments/course-enrollments.component').then(m => m.CourseEnrollmentsComponent)
  }
];
