export interface Student {
  id: string;
  email: string;
  password: string;
  name: string;
  firstName: string;
  carne: string;
  faculty: string;
  year: number;
  cedula: string;
  phone: string;
  applicationId: string | null;
  currentStep: number;
}

export const MOCK_STUDENTS: Student[] = [
  {
    id: "stu_001",
    email: "maria@universidad.cr",
    password: "Visastudent123",
    name: "María Fernández Solano",
    firstName: "María",
    carne: "B12345",
    faculty: "Ingeniería",
    year: 3,
    cedula: "1-1234-5678",
    phone: "+506 8888-1234",
    applicationId: "app_001",
    currentStep: 4,
  },
  {
    id: "stu_002",
    email: "carlos@universidad.cr",
    password: "Visastudent123",
    name: "Carlos Méndez Quirós",
    firstName: "Carlos",
    carne: "B23456",
    faculty: "Ciencias Económicas",
    year: 4,
    cedula: "1-2345-6789",
    phone: "+506 8888-5678",
    applicationId: "app_002",
    currentStep: 5,
  },
  {
    id: "stu_003",
    email: "ana@universidad.cr",
    password: "Visastudent123",
    name: "Ana Vargas Ramírez",
    firstName: "Ana",
    carne: "B34567",
    faculty: "Medicina",
    year: 1,
    cedula: "1-3456-7890",
    phone: "+506 8888-9012",
    applicationId: null,
    currentStep: 0,
  },
];

export function findStudentByEmail(email: string): Student | undefined {
  return MOCK_STUDENTS.find((s) => s.email === email);
}

export function authenticateStudent(
  email: string,
  password: string
): Student | null {
  const student = MOCK_STUDENTS.find(
    (s) => s.email === email && s.password === password
  );
  return student || null;
}
