import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `
    <div class="min-h-screen bg-background p-4 md:p-8 lg:p-12">
      <div class="max-w-7xl mx-auto space-y-12">
        <!-- Header -->
        <header class="text-center space-y-6 py-12">
          <h1 class="text-gradient text-5xl md:text-6xl lg:text-7xl font-bold">
            {{ title() }}
          </h1>
          <p class="text-text-secondary text-lg md:text-xl max-w-2xl mx-auto">
            Modern Dark Theme with Excellent Accessibility
          </p>
        </header>

        <!-- Color Showcase -->
        <section class="glass-effect rounded-2xl md:rounded-3xl p-8 md:p-10 space-y-6 shadow-xl">
          <div class="space-y-2">
            <h2 class="text-3xl font-bold text-text-primary">
              Color System
            </h2>
            <p class="text-text-tertiary">High contrast colors with WCAG AA+ compliance</p>
          </div>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div class="space-y-3">
              <div class="h-32 bg-primary-600 rounded-2xl shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-glow"></div>
              <div class="space-y-1">
                <p class="text-sm font-semibold text-text-primary">Primary</p>
                <p class="text-xs text-text-tertiary">#2563eb</p>
              </div>
            </div>
            <div class="space-y-3">
              <div class="h-32 bg-accent-600 rounded-2xl shadow-lg transition-transform duration-300 hover:scale-105"></div>
              <div class="space-y-1">
                <p class="text-sm font-semibold text-text-primary">Accent</p>
                <p class="text-xs text-text-tertiary">#9333ea</p>
              </div>
            </div>
            <div class="space-y-3">
              <div class="h-32 bg-success rounded-2xl shadow-lg transition-transform duration-300 hover:scale-105"></div>
              <div class="space-y-1">
                <p class="text-sm font-semibold text-text-primary">Success</p>
                <p class="text-xs text-text-tertiary">#22c55e</p>
              </div>
            </div>
            <div class="space-y-3">
              <div class="h-32 bg-error rounded-2xl shadow-lg transition-transform duration-300 hover:scale-105"></div>
              <div class="space-y-1">
                <p class="text-sm font-semibold text-text-primary">Error</p>
                <p class="text-xs text-text-tertiary">#ef4444</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Button Examples -->
        <section class="bg-surface border-2 border-border rounded-3xl p-8 md:p-10 space-y-6 shadow-lg">
          <div class="space-y-2">
            <h2 class="text-3xl font-bold text-text-primary">
              Button Variants
            </h2>
            <p class="text-text-tertiary">Interactive buttons with smooth transitions</p>
          </div>
          <div class="flex flex-wrap gap-4">
            <button class="
              bg-primary-600 hover:bg-primary-700 active:bg-primary-800
              text-text-primary font-medium
              px-8 py-4
              rounded-xl
              shadow-md hover:shadow-lg
              transition-all duration-normal
              hover:-translate-y-0.5
              focus-visible:ring-4 focus-visible:ring-primary-500/50 focus-visible:outline-none
            ">
              Primary Button
            </button>
            <button class="
              bg-accent-600 hover:bg-accent-700 active:bg-accent-800
              text-text-primary font-medium
              px-8 py-4
              rounded-xl
              shadow-md hover:shadow-lg
              transition-all duration-normal
              hover:-translate-y-0.5
            ">
              Accent Button
            </button>
            <button class="
              bg-surface-elevated hover:bg-surface-hover
              text-text-primary font-medium
              border-2 border-border hover:border-border-hover
              px-8 py-4
              rounded-xl
              transition-all duration-normal
              hover:-translate-y-0.5
            ">
              Secondary Button
            </button>
            <button class="
              text-primary-400 hover:text-primary-300 font-medium
              px-8 py-4
              rounded-xl
              hover:bg-surface-elevated
              transition-all duration-normal
            ">
              Ghost Button
            </button>
          </div>
        </section>

        <!-- Card Examples -->
        <section class="space-y-6">
          <div class="space-y-2">
            <h2 class="text-3xl font-bold text-text-primary">
              Interactive Cards
            </h2>
            <p class="text-text-tertiary">Cards with hover effects and elevation</p>
          </div>
          <div class="grid md:grid-cols-3 gap-8">
            <div class="
              card-hover
              bg-surface
              border-2 border-border
              rounded-2xl
              p-8
              space-y-4
              cursor-pointer
            ">
              <div class="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center shadow-md">
                <span class="text-3xl">🚀</span>
              </div>
              <h3 class="text-2xl font-bold text-text-primary">Fast</h3>
              <p class="text-text-secondary leading-relaxed">
                Lightning fast performance with modern technologies and optimized rendering
              </p>
            </div>
            <div class="
              card-hover
              bg-surface
              border-2 border-border
              rounded-2xl
              p-8
              space-y-4
              cursor-pointer
            ">
              <div class="w-16 h-16 bg-gradient-to-br from-accent-500 to-accent-700 rounded-2xl flex items-center justify-center shadow-md">
                <span class="text-3xl">🎨</span>
              </div>
              <h3 class="text-2xl font-bold text-text-primary">Beautiful</h3>
              <p class="text-text-secondary leading-relaxed">
                Modern dark theme with excellent accessibility and smooth animations
              </p>
            </div>
            <div class="
              card-hover
              bg-surface
              border-2 border-border
              rounded-2xl
              p-8
              space-y-4
              cursor-pointer
            ">
              <div class="w-16 h-16 bg-gradient-to-br from-green-500 to-green-700 rounded-2xl flex items-center justify-center shadow-md">
                <span class="text-3xl">✨</span>
              </div>
              <h3 class="text-2xl font-bold text-text-primary">Accessible</h3>
              <p class="text-text-secondary leading-relaxed">
                WCAG AA+ compliant with high contrast ratios for better readability
              </p>
            </div>
          </div>
        </section>

        <!-- Glass Effect Examples -->
        <section class="space-y-6">
          <div class="space-y-2">
            <h2 class="text-3xl font-bold text-text-primary">
              Glass Morphism
            </h2>
            <p class="text-text-tertiary">Frosted glass effect with backdrop blur</p>
          </div>
          <div class="grid md:grid-cols-2 gap-8">
            <div class="glass-effect rounded-3xl p-8 space-y-4 shadow-xl">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 bg-primary-600 rounded-xl"></div>
                <div>
                  <h3 class="text-xl font-semibold text-text-primary">Glass Card 1</h3>
                  <p class="text-sm text-text-tertiary">Backdrop blur effect</p>
                </div>
              </div>
              <p class="text-text-secondary leading-relaxed">
                This card demonstrates the glass morphism effect with a frosted background and subtle border.
              </p>
            </div>
            <div class="glass-effect rounded-3xl p-8 space-y-4 shadow-xl">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 bg-accent-600 rounded-xl"></div>
                <div>
                  <h3 class="text-xl font-semibold text-text-primary">Glass Card 2</h3>
                  <p class="text-sm text-text-tertiary">Semi-transparent</p>
                </div>
              </div>
              <p class="text-text-secondary leading-relaxed">
                The glass effect creates depth and visual hierarchy with translucent backgrounds.
              </p>
            </div>
          </div>
        </section>

        <!-- Status Messages -->
        <section class="space-y-6">
          <div class="space-y-2">
            <h2 class="text-3xl font-bold text-text-primary">
              Status Messages
            </h2>
            <p class="text-text-tertiary">Semantic colors for different message types</p>
          </div>
          <div class="grid md:grid-cols-2 gap-6">
            <div class="bg-surface-elevated border-l-4 border-success rounded-2xl p-6 space-y-2 shadow-md">
              <h3 class="text-success-light font-bold text-lg">Success</h3>
              <p class="text-text-secondary">
                Your changes have been saved successfully! All data is now synced.
              </p>
            </div>
            <div class="bg-surface-elevated border-l-4 border-warning rounded-2xl p-6 space-y-2 shadow-md">
              <h3 class="text-warning-light font-bold text-lg">Warning</h3>
              <p class="text-text-secondary">
                Please review your settings before continuing with this action.
              </p>
            </div>
            <div class="bg-surface-elevated border-l-4 border-error rounded-2xl p-6 space-y-2 shadow-md">
              <h3 class="text-error-light font-bold text-lg">Error</h3>
              <p class="text-text-secondary">
                An error occurred while processing your request. Please try again.
              </p>
            </div>
            <div class="bg-surface-elevated border-l-4 border-info rounded-2xl p-6 space-y-2 shadow-md">
              <h3 class="text-info-light font-bold text-lg">Info</h3>
              <p class="text-text-secondary">
                Check out the documentation for more details about the features.
              </p>
            </div>
          </div>
        </section>

        <!-- Surfaces & Elevations -->
        <section class="space-y-6">
          <div class="space-y-2">
            <h2 class="text-3xl font-bold text-text-primary">
              Surfaces & Elevation
            </h2>
            <p class="text-text-tertiary">Different surface levels and shadows</p>
          </div>
          <div class="grid md:grid-cols-4 gap-6">
            <div class="bg-surface rounded-2xl p-6 text-center space-y-2 shadow-sm">
              <p class="text-sm font-semibold text-text-primary">Surface</p>
              <p class="text-xs text-text-tertiary">Base level</p>
            </div>
            <div class="bg-surface-elevated rounded-2xl p-6 text-center space-y-2 shadow-md">
              <p class="text-sm font-semibold text-text-primary">Elevated</p>
              <p class="text-xs text-text-tertiary">Level 1</p>
            </div>
            <div class="bg-surface-elevated rounded-2xl p-6 text-center space-y-2 shadow-lg">
              <p class="text-sm font-semibold text-text-primary">Modal</p>
              <p class="text-xs text-text-tertiary">Level 2</p>
            </div>
            <div class="bg-surface-elevated rounded-2xl p-6 text-center space-y-2 shadow-xl">
              <p class="text-sm font-semibold text-text-primary">Popover</p>
              <p class="text-xs text-text-tertiary">Level 3</p>
            </div>
          </div>
        </section>

        <router-outlet></router-outlet>
      </div>
    </div>
  `,
})
export class App {
  protected readonly title = signal('Kandy');
}
