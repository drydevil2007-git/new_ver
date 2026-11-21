/**
 * DanehsYar Comprehensive University Course Database Client Helper
 * Provides type-safe querying, filtering, and export capabilities.
 */

export interface CourseDatabaseRecord {
  id: string;
  code: string;
  fieldId: string;
  fieldNameFa: string;
  fieldNameEn: string;
  facultyId: string;
  facultyNameFa: string;
  facultyNameEn: string;
  titleFa: string;
  titleEn: string;
  credits: number;
  difficulty: 'introductory' | 'intermediate' | 'advanced';
  standardCategory: string;
  prerequisites: string[];
  topicsFa: string[];
  topicsEn: string[];
  keyFormula: string;
  referenceBooks: string[];
  model3d: string | null;
  feynmanAnalogyFa: string;
  feynmanAnalogyEn: string;
  hardestExamQuestionFa: string;
  hardestExamFormulaLatex: string;
}

export interface CourseDatabaseFaculty {
  id: string;
  nameFa: string;
  nameEn: string;
  iconName: string;
  color: string;
  coursesCount: number;
}

export interface CourseDatabaseDiscipline {
  id: string;
  nameFa: string;
  nameEn: string;
  facultyFa: string;
  facultyEn: string;
  coursesCount: number;
}

export interface CourseDatabasePayload {
  $schema: string;
  metadata: {
    name: string;
    nameEn: string;
    version: string;
    generatedAt: string;
    totalCourses: number;
    totalFields: number;
    totalFaculties: number;
    license: string;
    curriculaStandards: string[];
  };
  faculties: CourseDatabaseFaculty[];
  disciplines: CourseDatabaseDiscipline[];
  courses: CourseDatabaseRecord[];
}

let cachedDatabase: CourseDatabasePayload | null = null;

/**
 * Loads the course database on demand.
 */
export async function loadCourseDatabase(): Promise<CourseDatabasePayload> {
  if (cachedDatabase) return cachedDatabase;
  try {
    const res = await fetch('/data/courses_database.json');
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data: CourseDatabasePayload = await res.json();
    cachedDatabase = data;
    return data;
  } catch (error) {
    console.error('Failed to load courses_database.json from public directory, trying dynamic import:', error);
    const mod = await import('../data/courses_database.json');
    cachedDatabase = mod.default as CourseDatabasePayload;
    return cachedDatabase;
  }
}

/**
 * Triggers a direct browser download of the complete JSON database.
 */
export async function exportCourseDatabaseAsJson(): Promise<void> {
  try {
    const response = await fetch('/data/courses_database.json');
    let blob: Blob;
    if (response.ok) {
      blob = await response.blob();
    } else {
      const data = await loadCourseDatabase();
      blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json;charset=utf-8;' });
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `daneshyar_university_courses_database_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error('Error exporting course database:', err);
    window.open('/data/courses_database.json', '_blank');
  }
}
