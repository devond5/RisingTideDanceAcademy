import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleTuitionComponent } from './schedule-tuition.component';

describe('ScheduleTuitionComponent', () => {
  let component: ScheduleTuitionComponent;
  let fixture: ComponentFixture<ScheduleTuitionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScheduleTuitionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ScheduleTuitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
