import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Product, ProductsResponse } from '@products/interfaces/product.interface';
import { delay, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

const baseUrl = environment.baseUrl;

interface Options {
  limit?: number;
  offset?: number;
  gender?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private http = inject(HttpClient);

  private productsCache = new Map<string, ProductsResponse>();
  private productCache = new Map<string, Product>();

  getProducts(options: Options): Observable<ProductsResponse> {

    const {limit = 9, offset = 0, gender = ''} = options;

    console.log(this.productsCache.entries());

    //Caché basica, mejor utilizar algo como tanstackquery para el caché para poder invalidarlo y cosas así...
    const key = `${limit}-${offset}-${gender}`;

    if(this.productsCache.has(key)){
      return of(this.productsCache.get(key)!);
    }

    return this.http
    .get<ProductsResponse>(`${baseUrl}/products`, {
      params: {
        limit,
        offset,
        gender
      }
    })
    .pipe( //Este console log habria que quitarlo para pro, pero lo dejo como ejemplo
      tap(resp => console.log(resp)),
      tap(resp => this.productsCache.set(key, resp))
    );

  }

  getProductByIdSlug(idSlug: string): Observable<Product> {

    if(this.productCache.has(idSlug)){
      return of(this.productCache.get(idSlug)!);
    }

    return this.http
    .get<Product>(`${baseUrl}/products/${idSlug}`)
    .pipe( //Este console log habria que quitarlo para pro, pero lo dejo como ejemplo
      tap(resp => console.log(resp)),
      delay(2000), //Forzamos 2 segundos de daily para ver la diferencia entre cacheado y no cacheado, en la vida real no hariamos esto
      tap(resp => this.productCache.set(idSlug, resp))
    );

  }

  getProductById(id: string): Observable<Product> {

    if(this.productCache.has(id)){
      return of(this.productCache.get(id)!);
    }

    return this.http
    .get<Product>(`${baseUrl}/products/${id}`)
    .pipe( //Este console log habria que quitarlo para pro, pero lo dejo como ejemplo
      tap(resp => console.log(resp)),
      delay(2000), //Forzamos 2 segundos de daily para ver la diferencia entre cacheado y no cacheado, en la vida real no hariamos esto
      tap(resp => this.productCache.set(id, resp))
    );

  }

  updateProduct(id: string, productLike: Partial<Product>): Observable<Product> {

    return this.http.patch<Product>(`${baseUrl}/products/${id}`, productLike)
    .pipe(
      tap((product) => this.updateProductCache(product))
    );

  }

  updateProductCache(product: Product) {

    const productId = product.id;

    //Actualizamos el caché del producto
    this.productCache.set(productId, product);

    //Actualizamos el caché de la lista de productos
    this.productsCache.forEach(productResponse => {
      productResponse.products = productResponse.products.map((currentProduct) => {
        return currentProduct.id === productId ? product : currentProduct
      })
    });

    console.log('Caché actualizado');


  }

}
