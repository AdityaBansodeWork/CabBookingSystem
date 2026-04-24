import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RideHandling } from './ride-handling';

describe('RideHandling', () => {
  let component: RideHandling;
  let fixture: ComponentFixture<RideHandling>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RideHandling]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RideHandling);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
