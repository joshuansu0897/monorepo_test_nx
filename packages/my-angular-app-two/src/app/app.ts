import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NxWelcome } from './nx-welcome';
import { UiShared } from '@monorepo-test/ui-shared';

@Component({
  imports: [NxWelcome, RouterModule, UiShared],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected title = 'my-angular-app-two';
}
