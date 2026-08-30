const CURRENT_STUDENT_KEY =
  "currentStudentId";


export function getCurrentStudentId() {

  const stored =
    localStorage.getItem(
      CURRENT_STUDENT_KEY
    );

  if (!stored) {
    return 1;
  }

  return Number(stored);

}


export function setCurrentStudentId(
  studentId
) {

  localStorage.setItem(
    CURRENT_STUDENT_KEY,
    studentId.toString()
  );

}