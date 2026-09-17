import { Component, computed, inject, OnInit, signal, ViewChild, WritableSignal } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SiteDataService } from '../../services/site-data-service.service';
import { AgeGroup, BaseStyles, Class, Days, Level, Tuition } from '../../types/class-schedule-teacher-tuition.type';
import { TabsModule } from 'primeng/tabs';
import { NgTemplateOutlet } from '@angular/common';
import { DayPilot, DayPilotCalendarComponent, DayPilotModule, DayPilotSchedulerComponent } from '@daypilot/daypilot-lite-angular';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'info';
}

@Component({
  selector: 'app-schedule-tuition',
  imports: [TabsModule, TableModule, ButtonModule, BadgeModule, FontAwesomeModule, NgTemplateOutlet, DayPilotModule],
  templateUrl: './schedule-tuition.component.html',
  styleUrl: './schedule-tuition.component.scss',
})
export class ScheduleTuitionComponent implements OnInit {
  private siteDataService = inject(SiteDataService);
  readonly AgeGroup = AgeGroup;
  scheduleData: WritableSignal<Class[]> = signal<Class[]>([]);
  tuition!: Tuition[];
  selectedSchedules: Class[] = [];

  faInfoCircle = faInfoCircle;
  tabValue = signal('1');

  @ViewChild(DayPilotSchedulerComponent)
  scheduler!: DayPilotSchedulerComponent;

  
  @ViewChild(DayPilotCalendarComponent)
  calendar!: DayPilotCalendarComponent;

  resources = signal<DayPilot.ResourceData[]>([
    {
      name: 'Group A',
      id: 'GA',
      expanded: true,
      children: [
        { name: 'Resource 1', id: 'R1', capacity: 10 },
        { name: 'Resource 2', id: 'R2', capacity: 30 },
        { name: 'Resource 3', id: 'R3', capacity: 20 },
        { name: 'Resource 4', id: 'R4', capacity: 40 },
      ],
    },
  ]);

  scheduleConfig = signal<DayPilot.SchedulerConfig>({
    timeHeaders: [
      { groupBy: 'Month', format: 'MMMM yyyy' },
      { groupBy: 'Day', format: 'd' },
    ],
    scale: 'Day',
    startDate: '2022-01-05',
    days: 35,
    eventEndSpec: 'DateTime',
    resources: [{ name: 'Resource 1', id: 'R1' }],
    heightSpec: 'Auto',
    timeFormat: 'Clock12Hours',
    width: '100%',
  });

  calendarConfig = signal<DayPilot.CalendarConfig>({
    viewType: 'Week',
    startDate: '2022-01-05',
    timeFormat: 'Clock12Hours',
  });

  events = signal<DayPilot.EventData[]>([
    { id: 1, start: '2022-01-21T10:00:00', end: '2022-01-21T14:00:00', text: 'Event 1', resource: 'R1' },
  ]);

  ngOnInit() {
    this.siteDataService.classes.subscribe((classes: Class[]) => {
      this.scheduleData.set(classes);
    });
    this.siteDataService.tuition.subscribe(tuition => {
      this.tuition = tuition;
    });
  }

  dayOptions = [
    { label: 'Show All Days', value: 'all' },
    ...Object.entries(Days).map(([key, label]) => ({
      label,
      value: Days[key as keyof typeof Days],
    })),
  ];

  ageOptions = [
    { label: 'Show All Ages', value: 'all' },
    ...Object.entries(AgeGroup).map(([key, label]) => ({
      label,
      value: AgeGroup[key as keyof typeof AgeGroup],
    })),
  ];

  levelOptions = [
    { label: 'Show All Levels', value: 'all' },
    ...Object.entries(Level).map(([key, label]) => ({
      label,
      value: Level[key as keyof typeof Level],
    })),
  ];

  styleOptions = [
    { label: 'Show All Styles', value: 'all' },
    ...Object.entries(BaseStyles).map(([key, label]) => ({
      label,
      value: BaseStyles[key as keyof typeof BaseStyles],
    })),
  ];

  dayFilter = signal<string>('all');
  ageFilter = signal<string>('all');
  styleFilter = signal<string>('all');
  levelFilter = signal<string>('all');
  selectedClassesTable = signal<Class[]>([]);
  mobileMenuOpen = signal<boolean>(false);
  toasts = signal<Toast[]>([]);

  filteredClasses = computed(() => {
    return this.scheduleData().filter(cls => {
      const dayMatch = this.dayFilter() === 'all' || Days[cls.classDay as unknown as keyof typeof Days] === this.dayFilter();
      const ageMatch = this.ageFilter() === 'all' || AgeGroup[cls.ageGroup as keyof typeof AgeGroup] === this.ageFilter();
      const styleMatch = this.styleFilter() === 'all' || BaseStyles[cls.baseStyle as keyof typeof BaseStyles] === this.styleFilter();
      const levelMatch = this.levelFilter() === 'all' || Level[cls.level as keyof typeof Level] === this.levelFilter();
      return dayMatch && ageMatch && styleMatch && levelMatch;
    });
  });

  selectedClasses = computed(() => {
    return this.scheduleData().filter(cls =>
      this.selectedClassesTable()
        .map(v => v.className)
        .includes(cls.className),
    );
  });

  totalHours = computed(() => {
    return this.selectedClassesTable().reduce((sum, cls) => sum + parseFloat(cls.hours), 0);
  });

  finalMonthlyCost = computed(() => {
    const totalHrs = this.totalHours();
    if (this.tuition.length > 0) {
      const foundTuition = this.tuition.find(t => t.hours === totalHrs);
      if (foundTuition) {
        return foundTuition.price;
      }
      const maxTuition = this.tuition.reduce((max, current) => (current.hours > max.hours ? current : max), this.tuition[0]);
      if (totalHrs > maxTuition.hours) {
        return maxTuition.price;
      }
    }

    return '$0';
  });

  toggleMobileMenu(open: boolean) {
    this.mobileMenuOpen.set(open);
  }

  updateFilter(type: 'day' | 'age' | 'style' | 'level', value: string) {
    if (type === 'day') this.dayFilter.set(value);
    if (type === 'age') this.ageFilter.set(value);
    if (type === 'style') this.styleFilter.set(value);
    if (type === 'level') this.levelFilter.set(value);
  }

  toggleSelection(selectedClass: string) {
    const current = this.selectedClassesTable();
    const classObj = this.scheduleData().find(c => c.className === selectedClass);

    if (current.map(v => v.className).includes(selectedClass)) {
      this.selectedClassesTable.set(current.filter(cls => cls.className !== selectedClass));
      if (classObj) {
        this.addToast(`Removed: ${classObj.className}`, 'info');
      }
    } else if (classObj) {
      this.selectedClassesTable.set([...current, classObj]);
      if (classObj) {
        this.addToast(`Added to Estimator: ${classObj.className}`, 'success');
      }
    }
  }

  isClassSelected(selectedClass: string): boolean {
    return this.selectedClassesTable()
      .map(v => v.className)
      .includes(selectedClass);
  }

  addToast(message: string, type: 'success' | 'info') {
    const id = Date.now();
    this.toasts.update(all => [...all, { id, message, type }]);

    setTimeout(() => {
      this.toasts.update(all => all.filter(t => t.id !== id));
    }, 3000);
  }

  registerSelected() {
    const count = this.selectedClassesTable().length;
    if (count === 0) {
      this.addToast('Please select at least one class to estimate tuition.', 'info');
      return;
    }
    this.addToast(`Redirecting to Parent Portal for ${count} registration(s)!`, 'success');
  }

  convertAgeToLabel(age: AgeGroup | string) {
    if (Object.keys(AgeGroup).includes(age as AgeGroup)) {
      return AgeGroup[age as keyof typeof AgeGroup].split('(')[1]?.replace(')', '').trim();
    } else {
      return age;
    }
  }

  resetFilters() {
    this.dayFilter.set('all');
    this.ageFilter.set('all');
    this.styleFilter.set('all');
    this.levelFilter.set('all');
  }
  onTabChange(newValue: string | number | undefined) {
    if (typeof newValue === 'string') {
      this.tabValue.set(newValue);
    }
  }
}
