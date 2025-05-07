import { Component, inject, input } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { Product } from '@products/interfaces/product.interface';
import { ProductsService } from '@products/services/products.service';

@Component({
  selector: 'app-product-page',
  imports: [],
  templateUrl: './product-page.component.html',
})
export class ProductPageComponent {

  activatedRoute = inject(ActivatedRoute);
  productsService = inject(ProductsService);

  productIdSlug: string = this.activatedRoute.snapshot.params['idSlug'];

  productResource = rxResource({
    request: () => ({idSlug: this.productIdSlug}),
    loader: ({request}) => this.productsService.getProductByIdSlug(request.idSlug)
  });

}
