import { NgTemplateOutlet } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { CardModule } from 'primeng/card';
import { CarouselModule } from 'primeng/carousel';
import { SiteDataService } from '../../services/site-data-service.service';
import { TeacherBios } from '../../types/class-schedule-teacher-tuition.type';
import { GalleriaModule } from 'primeng/galleria';
import { faChevronLeft, faChevronRight, faCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-about-us',
  imports: [TabsModule, NgTemplateOutlet, CardModule, CarouselModule, GalleriaModule, FontAwesomeModule],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.scss',
})
export class AboutUsComponent {
  private siteDataService = inject(SiteDataService);

  tabValue = signal('0');
  selectedInstructor = signal(0);
  selectedInstructorPicture = signal(0);
  selectedInstructorVideo = signal(0);
  isPicture = signal(true);
  instructors: TeacherBios[] = [];
  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;
  faDotCircle = faCircle;
  currentInstructor = this.instructors[this.selectedInstructor()];

  ngOnInit(): void {
    this.siteDataService.teacherBios.subscribe(teacherBios => {
      this.instructors = teacherBios;
    });
  }

  onTabChange(newValue: string | number | undefined) {
    if (typeof newValue === 'string') {
      this.tabValue.set(newValue);
    }
  }

  selectedInstructorNext() {
    let instIndex = this.selectedInstructor();
    if (this.selectedInstructor() !== this.instructors.length - 1) {
      instIndex++;
      this.selectedInstructor.set(instIndex);
      this.selectedInstructorPicture.set(0);
      this.selectedInstructorVideo.set(0);
      this.isPicture.set(true);
    }
  }

  selectedInstructorPrevious() {
    let instIndex = this.selectedInstructor();
    if (this.selectedInstructor() !== 0) {
      instIndex--;
      this.selectedInstructor.set(instIndex);
      this.selectedInstructorPicture.set(0);
      this.selectedInstructorVideo.set(0);
      this.isPicture.set(true);
    }
  }

  selectedInstructorPictureNext(index: number) {
    this.selectedInstructorPicture.set(index);
  }

  selectedInstructorVideoNext(index: number) {
    this.selectedInstructorVideo.set(index);
  }
}
