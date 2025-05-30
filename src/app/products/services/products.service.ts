import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '@auth/interfaces/user.interface';
import { Gender, Product, ProductsResponse } from '@products/interfaces/product.interface';
import { delay, forkJoin, map, Observable, of, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

const baseUrl = environment.baseUrl;

interface Options {
  limit?: number;
  offset?: number;
  gender?: string;
}

const emptyProduct: Product = {
  id: 'new',
  title: '',
  price: 0,
  description: '',
  slug: '',
  stock: 0,
  sizes: [],
  gender: Gender.Men,
  tags: [],
  images: [],
  user: {} as User
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

    //TODO: Caché basica, mejor utilizar algo como tanstackquery para el caché para poder invalidarlo y cosas así...
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

    if(id === 'new') {
      return of(emptyProduct);
    }

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

  createProduct(productLike: Partial<Product>, imageFileList?: FileList): Observable<Product> {

    //Faltaria implementar el añadir las imagenes y subirlas al backend
    return this.http.post<Product>(`${baseUrl}/products`, productLike)
    .pipe(
      tap((product) => this.updateProductCache(product))
    );

  }

  updateProduct(id: string, productLike: Partial<Product>, imageFileList?: FileList): Observable<Product> {

    const currentImages = productLike.images ?? [];

    return this.uploadImages(imageFileList).pipe(
      map(imagesNames => ({... productLike, images: [...currentImages, ...imagesNames]})),
      switchMap(updatedProduct => this.http.patch<Product>(`${baseUrl}/products/${id}`, updatedProduct)),
      tap((product) => this.updateProductCache(product))
    );

    // return this.http.patch<Product>(`${baseUrl}/products/${id}`, productLike)
    // .pipe(
    //   tap((product) => this.updateProductCache(product))
    // );

  }

  //Podriamos crear un createProductCache para no hacer el foreach al crear ya que sabemos que no va a estar en la lista
  //O podriamos en este mismo metodo pasarle un boolean para si hay que actualizar o no el listado.
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

  }

  //Recibe un fileList y lo sube al backend
  uploadImages(images?: FileList): Observable<string[]> {

    if(!images) return of([]);

    const uploadObservables = Array.from(images).map( imageFile => this.uploadImage(imageFile));

    return forkJoin(uploadObservables); //Espera a que se ejecuten todos los observables y si falla uno lanza excepcion

  }

  uploadImage(imageFile: File): Observable<string> {

    const formData = new FormData();
    formData.append('file', imageFile);

    return this.http
      .post<{fileName: string}>(`${baseUrl}/files/product`, formData)
      .pipe(map(resp => resp.fileName));

  }

}
