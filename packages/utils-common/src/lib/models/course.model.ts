export interface Course {
  id: string;
  title: string;
  description: string;
  teacher: string;
}

export interface CreateCourseRequest {
  title: string;
  description: string;
  teacher: string;
}

export interface UpdateCourseRequest extends Partial<CreateCourseRequest> {}
