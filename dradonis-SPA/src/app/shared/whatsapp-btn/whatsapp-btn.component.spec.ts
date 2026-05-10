import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhatsappBtnComponent } from './whatsapp-btn.component';

describe('WhatsappBtnComponent', () => {
  let component: WhatsappBtnComponent;
  let fixture: ComponentFixture<WhatsappBtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WhatsappBtnComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WhatsappBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
