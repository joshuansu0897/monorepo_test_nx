
export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  date: string;
}

export interface CreateEnrollmentRequest {
  studentId: string;
  courseId: string;
  date: string;
}

export interface EnrollmentWithDetails extends Enrollment {
  student?: {
    id: string;
    name: string;
    email: string;
  };

  course?: {
    id: string;
    title: string;
    description: string;
    teacher: string;
  };
}
