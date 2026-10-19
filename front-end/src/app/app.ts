import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Main } from './main/main';

@Component({
  imports: [RouterOutlet, Main],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  
}
