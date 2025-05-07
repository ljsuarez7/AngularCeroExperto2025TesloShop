import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'store-front-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './store-front-navbar.component.html',
})
export class StoreFrontNavbarComponent { }
