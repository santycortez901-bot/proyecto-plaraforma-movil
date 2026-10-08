import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { IonContent, IonIcon } from '@ionic/angular';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { personOutline } from 'ionicons/icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [FormsModule, IonContent, IonIcon],
})
export class LoginPage {
  feedbackMessage = '';
  private readonly router = inject(Router);

  constructor() {
    addIcons({ personOutline });
  }

  onSubmit(form: NgForm): void {
    this.feedbackMessage = '';
    if (form.valid) {
      void this.router.navigateByUrl('/mapa');
    }
  }

  onForgotPassword(): void {
    this.feedbackMessage = 'La recuperación de contraseña todavía no está conectada.';
  }
}
