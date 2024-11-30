import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LightControlComponent } from './light-control.component';

describe('LightControlComponent', () => {
  let component: LightControlComponent;
  let fixture: ComponentFixture<LightControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LightControlComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LightControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
