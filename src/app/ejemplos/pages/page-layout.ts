import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import Header from 'src/app/ejemplos/components/header';

@Component({
  selector: 'app-page-layout',
  standalone: true,
  imports: [RouterOutlet, Header],
  template: `
    <app-header />
    <main>
      <router-outlet />
    </main>
  `,
})
export default class PageLayout {}
