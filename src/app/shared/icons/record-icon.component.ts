import { Component } from '@angular/core';

@Component({
  selector: 'app-recording-icon',
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  `,
})
export class RecordingIconComponent {}

@Component({
  selector: 'app-stop-icon',
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      <path stroke-linecap="round" stroke-linejoin="round" d="M9 10H7m4 0h2m4 0h2" />
      <rect x="9" y="9" width="6" height="6" rx="1" ry="1"></rect>
    </svg>
  `,
})
export class StopIconComponent {}
