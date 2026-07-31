import { HttpClient } from '@angular/common/http';
import { inject, Injectable, OnInit } from '@angular/core';
import {
  BaseStyleInfo,
  Class,
  ClassesAndSchedulesData,
  TeacherBioData,
  TeacherBios,
  Tuition,
  TuitionData,
} from '../types/class-schedule-teacher-tuition.type';
import { BehaviorSubject, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SiteDataService {
  private http = inject(HttpClient);
  public classes: BehaviorSubject<Class[]> = new BehaviorSubject<Class[]>([]);
  public baseStyles: BehaviorSubject<BaseStyleInfo[]> = new BehaviorSubject<BaseStyleInfo[]>([]);
  public teacherBios: BehaviorSubject<TeacherBios[]> = new BehaviorSubject<TeacherBios[]>([]);
  public tuition: BehaviorSubject<Tuition[]> = new BehaviorSubject<Tuition[]>([]);

  getAllData(): void {
    this.http.get<TuitionData>('assets/site-data/tuition.json').subscribe({
      next: (tuitionData: TuitionData) => {
        this.tuition.next(tuitionData.tuition);
      },
      error: err => {
        console.error('Failed to load tuition data', err);
      },
    });

    this.http.get<TeacherBioData>('assets/site-data/teacher-bios.json').subscribe({
      next: (teacherData: TeacherBioData) => {
        this.teacherBios.next(teacherData.teachers);
      },
      error: err => {
        console.error('Failed to load teacher bios data', err);
      },
    });

    this.http.get<ClassesAndSchedulesData>('assets/site-data/classes-schedules.json').subscribe({
      next: (classAndSchedules: ClassesAndSchedulesData) => {
        this.classes.next(classAndSchedules.classes);
        this.baseStyles.next(classAndSchedules.baseStyles);
      },
      error: err => {
        console.error('Failed to class and schedule data', err);
      },
    });
  }
}
