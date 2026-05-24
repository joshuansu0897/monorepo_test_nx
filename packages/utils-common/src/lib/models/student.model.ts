export interface Student {
  id: string;
  name: string;
  email: string;
}

export interface CreateStudentRequest {
  name: string;
  email: string;
}

export interface UpdateStudentRequest extends Partial<CreateStudentRequest> {}
