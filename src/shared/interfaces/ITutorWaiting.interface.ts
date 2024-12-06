export interface ITutorWaiting {
  id: number;
  chosenDate: string;
  status: string;
  lessonRequest: ITutorLessonWaiting;
}

export interface ITutorLessonWaiting {
  classId: number;
  reason: string[];
  preferredDates: string[];
  status: string;
  additionalInfo: string;
  urlMeet: string | null;
  subject: {
    subjectId: number;
    subjectName: string;
  };
  student: {
    id: number;
    username: string;
    educationLevel: {
      educationId: number;
      levelType: string;
    };
  };
}
