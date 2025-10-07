import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GlassCardComponent } from '../../components/glass-card.component';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterOutlet, GlassCardComponent],
  template: `
    <div class="min-h-screen relative overflow-hidden">
      <!-- Animated Background -->
      <div class="absolute inset-0 bg-background">
        <!-- Gradient Orbs -->
        <div class="absolute top-0 -left-4 w-96 h-96 bg-primary-500 rounded-full mix-blend-normal filter blur-3xl opacity-30 animate-blob"></div>
        <div class="absolute top-0 -right-4 w-96 h-96 bg-accent-500 rounded-full mix-blend-normal filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div class="absolute -bottom-8 left-20 w-96 h-96 bg-primary-600 rounded-full mix-blend-normal filter blur-3xl opacity-25 animate-blob animation-delay-4000"></div>

        <!-- Grid Pattern -->
        <div class="absolute inset-0 bg-grid-pattern opacity-10"></div>

        <!-- Subtle Scan Line Effect -->
        <div class="absolute inset-0 bg-scan-line opacity-5"></div>
      </div>

      <div class="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div class="w-full max-w-md">
          <div class="text-center mb-8">
            <h1 class="text-gradient text-4xl md:text-5xl font-bold mb-2">
              Kandy
            </h1>
          </div>

          <app-glass-card padding="lg" rounded="3xl">
            <router-outlet></router-outlet>
          </app-glass-card>

          <div class="text-center mt-6">
            <p class="text-text-tertiary text-sm">
              © 2025 Kandy. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
    @keyframes blob {
      0% {
        transform: translate(0px, 0px) scale(1);
      }
      33% {
        transform: translate(30px, -50px) scale(1.1);
      }
      66% {
        transform: translate(-20px, 20px) scale(0.9);
      }
      100% {
        transform: translate(0px, 0px) scale(1);
      }
    }

    .animate-blob {
      animation: blob 7s infinite;
    }

    .animation-delay-2000 {
      animation-delay: 2s;
    }

    .animation-delay-4000 {
      animation-delay: 4s;
    }

    .bg-grid-pattern {
      background-image:
        linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
      background-size: 50px 50px;
    }

    .bg-scan-line {
      background: repeating-linear-gradient(
        0deg,
        rgba(255, 255, 255, 0.03),
        rgba(255, 255, 255, 0.03) 1px,
        transparent 1px,
        transparent 2px
      );
    }
  `,
  ],
})
export class AuthLayoutComponent {}
