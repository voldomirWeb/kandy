import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="bg-surface border-t-2 border-border">
      <div class="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex flex-col md:flex-row justify-between items-center gap-4">
          <p class="text-text-tertiary text-sm">
            © 2025 Kandy. All rights reserved.
          </p>
          <div class="flex gap-6">
            <a href="#" class="text-text-tertiary hover:text-text-primary text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#" class="text-text-tertiary hover:text-text-primary text-sm transition-colors">
              Terms of Service
            </a>
            <a href="#" class="text-text-tertiary hover:text-text-primary text-sm transition-colors">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {}
