import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from 'src/app/core/services/breadcrumb.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `<nav>
    <ng-container *ngFor="let breadcrumb of breadcrumbs; let last = last">
     
      <ng-container *ngIf="last">
        <span class="d-none d-md-block texto_color">{{ breadcrumb.label }}</span>
      </ng-container>
    </ng-container>
  </nav> `,
  styles: [
    `
      .texto_color {
        color: #808388;
        font-size: 1rem;
      }
    `,
  ],
})
export default class BreadcrumbComponent implements OnInit {
  breadcrumbs: Array<{ label: string; url: string }> = [];

  constructor(private breadcrumbService: BreadcrumbService) {}

  ngOnInit(): void {
    this.breadcrumbs = this.breadcrumbService.breadcrumbs;
  }
}
