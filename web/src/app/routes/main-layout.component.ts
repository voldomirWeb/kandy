import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../components/navbar.component';
import { FooterComponent } from '../components/footer.component';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  template: `
    <div class="min-h-screen bg-background flex flex-col">
      <app-navbar
        [currentUser]="currentUser()"
        (onLogout)="logout()"
      />

      <main class="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        <router-outlet></router-outlet>
      </main>

      <app-footer />
    </div>
  `,
})
export class MainLayoutComponent {
  private authService = inject(AuthService);

  public currentUser = this.authService.currentUser;

  public logout(): void {
    this.authService.logout();
  }
}
