import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { StoreFrontNavbarComponent } from '../../components/store-front-navbar/store-front-navbar.component';

@Component({
  selector: 'app-store-front-layout',
  imports: [RouterOutlet, StoreFrontNavbarComponent],
  templateUrl: './store-front-layout.component.html',
})
export class StoreFrontLayoutComponent { }
