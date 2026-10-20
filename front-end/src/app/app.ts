import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Main } from './main/main';
import { Register } from './register/register';

@Component({
  imports: [RouterOutlet, Main, Register],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {}