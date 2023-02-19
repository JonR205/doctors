import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from 'src/User';
import { take } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Appointment } from 'src/appointment';

@Injectable({
  providedIn: 'root',
})
export class UiService {
  private showRegister = false;
  private showLogin = true;
  private loading = false;
  private userId: number | undefined;
  private username: string | undefined;
  private doctor = false;
  private appointments: Appointment[] = [];

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {
    const username = localStorage.getItem('username');
    const password = localStorage.getItem('password');

    if (username !== null && password !== null) {
      this.tryLogin(username, password);
    }
  }

  // getters for state managment
  public getShowLogin(): boolean {
    return this.showLogin;
  }
  public getShowRegister(): boolean {
    return this.showRegister;
  }
  public getLoading(): boolean {
    return this.loading;
  }
  public getUsername(): string | undefined {
    return this.username;
  }
  public getAppointments(): Appointment[] {
    return this.appointments;
  }

  // switches state from login to Register
  public startRegister(): void {
    this.showLogin = false;
    this.showRegister = true;
  }
  // switches state from Register ti login
  public startLogin(): void {
    this.showLogin = true;
    this.showRegister = false;
  }

  private loginSuccess(user: User): void {
    this.showLogin = false;
    this.userId = user.id;
    this.username = user.username;
    this.doctor = user.doctor;
    localStorage.setItem('username', user.username);
    localStorage.setItem('password', user.password);
    this.loadAppointments();
  }

  private loadAppointments(): void {
    if (this.doctor) {
      this.http.get<Appointment[]>(`http://localhost:3000/appointments?doctorId=${this.userId}`)
      .pipe(take(1))
      .subscribe( {
        next: appointments => this.appointments = appointments,
      })
    } else {
      this.snackBar.open('Patien appointments not loaded')
      
    }
      
  }

  public tryLogin(username: string, password: string): void {
    this.http
      .get<User[]>(
        `http://localhost:3000/users?username=${username}&password=${password}`
      )
      .pipe(take(1))
      .subscribe({
        next: (users) => {
          if (users.length !== 1) {
            this.snackBar.open('Invalid username and or password', undefined, {
              duration: 3000,
            });
            return;
          }

          this.loginSuccess(users[0]);
        },
        error: (err) => {
          this.snackBar.open('Oops, Something went wrong!', undefined, {
            duration: 3000,
          });
        },
      });
  }
  public logout(): void {
    this.showRegister = false;
    this.showLogin = true;
    this.loading = false;
    this.userId = undefined;
    this.username = undefined;
    this.doctor = false;
    this.appointments = [];
    localStorage.clear();
  }
}
