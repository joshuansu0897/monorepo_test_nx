import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  { 
    path: '', 
    redirectTo: '/courses', 
    pathMatch: 'full' 
  },
  { 
    path: 'courses', 
    loadComponent: () => import('./components/courses/courses.component').then(m => m.CoursesComponent)
  },
  { 
    path: 'my-enrollments', 
    loadComponent: () => import('./components/my-enrollments/my-enrollments.component').then(m => m.MyEnrollmentsComponent)
  }
];
