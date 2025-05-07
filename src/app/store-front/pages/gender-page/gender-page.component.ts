import { Component, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProductCardComponent } from '@products/components/product-card/product-card.component';
import { ProductsService } from '@products/services/products.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-gender-page',
  imports: [ProductCardComponent],
  templateUrl: './gender-page.component.html',
})
export class GenderPageComponent {

  route = inject(ActivatedRoute);
  productsService = inject(ProductsService);

  gender = toSignal(
    this.route.params.pipe(
      map(({gender}) => gender)
    )
  );

  //Se podria implementar una caché para no estar pidiendo esto todo el rato, mirar en curso angular pro se hacer con una libreria
  productsResource = rxResource({
    request: () => ({gender: this.gender()}),
    loader: ({request}) => {
      return this.productsService.getProducts({
        gender: request.gender
      });
    }
  });

}
