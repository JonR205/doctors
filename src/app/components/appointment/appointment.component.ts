import { Component, Input, OnInit } from '@angular/core';
import { Appointment } from 'src/appointment';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.css'],
})
export class AppointmentComponent {
  @Input() appointment: Appointment | undefined;

  constructor() {}

  ngOnint(): void {}
}
