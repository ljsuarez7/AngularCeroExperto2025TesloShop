import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';

@Component({
  selector: 'store-front-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './store-front-navbar.component.html',
})
export class StoreFrontNavbarComponent {

  authService = inject(AuthService);

}
