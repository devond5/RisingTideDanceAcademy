export interface GalleryData {
  images: string[];
  videos: string[];
}

export interface TeacherBios {
  teacherName: string;
  teacherStyles: string[];
  teacherPhotos: string[];
  teacherBio: string;
  teacherVideos?: string[];
}

export interface TeacherBioData {
  teachers: TeacherBios[];
}

export enum AgeGroup {
  Droplets = 'First Steps (Ages 18 Months-2)',
  Spindrift = 'Pre Dance (Ages 3-4)',
  Ripples = 'Rising Dancer (Ages 5-7)',
  Swells = 'Dance Maker (Ages 8-10)',
  Breakers = 'Ensemble (Ages 11-13)',
  Tsunami = 'Artist in Motion (Ages 14+)',
}
export enum BaseStyles {
  Ballet = 'Ballet',
  ChoreoComp = 'Choreography & Composition',
  ContLyricMod = 'Contemporary, Lyrical, & Modern',
  Jazz = 'Jazz',
  Tap = 'Tap',
  Specialty = 'Specialty Styles',
}

export interface BaseStyleInfo {
  name: BaseStyles;
  description: string;
  attire: string;
}

export enum Level {
  Pre = 'Pre Placement',
  I = 'I',
  II = 'II',
  III = 'III',
  IV = 'IV',
  V = 'V',
}

export enum Days {
  M = 'Monday',
  T = 'Tuesday',
  W = 'Wednesday',
  Th = 'Thursday',
  F = 'Friday',
  Sat = 'Saturday',
  Sun = 'Sunday',
}

export interface Class {
  className: string;
  ageGroup: AgeGroup | string;
  classDay: Days;
  time: string;
  teacher: string;
  hours: string;
  size: string;
  details: string;
  baseStyle: BaseStyles;
  level: Level;
}

export interface Tuition {
  hours: number;
  price: string;
}

export interface TuitionData {
  tuition: Tuition[];
}

export interface ClassesAndSchedulesData {
  baseStyles: BaseStyleInfo[];
  classes: Class[];
}

export interface AgeGroupClasses {
  ageGroupName: string;
  classes: Class[];
}

export interface StyleGroup {
  name: BaseStyles | string;
  description: string;
  attire: string;
  ageGroups: AgeGroupClasses[];
}
