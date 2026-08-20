import { NgTemplateOutlet } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { CardModule } from 'primeng/card';
import { CarouselModule } from 'primeng/carousel';
import { SiteDataService } from '../../services/site-data-service.service';
import { TeacherBios } from '../../types/class-schedule-teacher-tuition.type';
import { GalleriaModule } from 'primeng/galleria';

@Component({
  selector: 'app-about-us',
  imports: [TabsModule, NgTemplateOutlet, CardModule, CarouselModule, GalleriaModule ],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.scss',
})
export class AboutUsComponent {
  private siteDataService = inject(SiteDataService);

  tabValue = signal('0');
  instructors: TeacherBios[] = [];

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
}
