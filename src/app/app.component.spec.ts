import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { Component, Input } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NotificationPreference } from './shared/notification-preference.type';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        MockNotificationCardComponent,
        MockNotificationEnableComponent
      ],
      imports: [
        MatToolbarModule
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should show the author', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('#preferences-footer').textContent).toContain('Ben Bartle');
  });
});

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'notificationcard-component',
  template: ''
})
class MockNotificationCardComponent {
  @Input() notificationPreference: NotificationPreference;
}

@Component({
  selector: 'notificationenable-component',
  template: ''
})
class MockNotificationEnableComponent {

}