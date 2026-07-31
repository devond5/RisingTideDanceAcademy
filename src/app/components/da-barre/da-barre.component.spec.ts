import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DaBarreComponent } from './da-barre.component';

describe('DaBarreComponent', () => {
  let component: DaBarreComponent;
  let fixture: ComponentFixture<DaBarreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DaBarreComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DaBarreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
