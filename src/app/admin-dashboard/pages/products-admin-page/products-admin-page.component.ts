import { Component, inject } from '@angular/core';
import { ProductTableComponent } from "../../../products/components/product-table/product-table.component";
import { rxResource } from '@angular/core/rxjs-interop';
import { ProductsService } from '@products/services/products.service';
import { PaginationService } from '@shared/components/pagination/pagination.service';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';

@Component({
  selector: 'app-products-admin-page',
  imports: [ProductTableComponent, PaginationComponent],
  templateUrl: './products-admin-page.component.html',
})
export class ProductsAdminPageComponent {

  productsService = inject(ProductsService);
  paginationService = inject(PaginationService);

  productsResource = rxResource({
    request: () => ({page: this.paginationService.currentPage() - 1}),
    loader: ({request}) => {
      return this.productsService.getProducts({
        offset: request.page * 9
      });
    }
  });

}
