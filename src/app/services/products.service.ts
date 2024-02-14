import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpParams,
  HttpErrorResponse,
  HttpStatusCode,
} from '@angular/common/http';
import { retry, catchError, map } from 'rxjs/operators';
import { throwError, zip } from 'rxjs';

import {
  Product,
  CreateProductDTO,
  UpdateProductDTO,
} from './../models/product.model';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private apiUrl = `${environment.API_URL}/api/v1`;

  constructor(private http: HttpClient) {}

  getByCategory(categoryId: string, limit?: number, offset?: number) {
    let params = new HttpParams();

    if (limit && offset != null) {
      params = params.set('limit', limit);
      params = params.set('offset', offset);
    }

    return this.http.get<Product[]>(
      `${this.apiUrl}/categories/${categoryId}/products`,
      { params }
    );
  }

  getAllSimple() {
    return this.http.get<Product[]>(`${this.apiUrl}/products`).pipe(
      map((products) => {
        return products.map((product) => {
          return {
            ...product,
            // images: JSON.parse(product.images[0]),
          };
        });
      })
    );
  }

  getAll(limit?: number, offset?: number) {
    let params = new HttpParams();

    if (limit && offset != null) {
      params = params.set('limit', limit);
      params = params.set('offset', offset);
    }

    return this.http.get<Product[]>(`${this.apiUrl}/products`, { params }).pipe(
      retry(3),
      map((products) =>
        products.map((product) => {
          return {
            ...product,
            // images: JSON.parse(product.images[0]),
            taxes: 0.19 * product.price,
          };
        })
      )
    );
  }

  fetchReadAndUpdate(id: string, dto: UpdateProductDTO) {
    return zip(this.getOne(id), this.update(id, dto));
  }

  getOne(id: string) {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === HttpStatusCode.Conflict) {
          return throwError(() => 'Something went wrong in the server');
        }
        if (error.status === HttpStatusCode.NotFound) {
          return throwError(() => 'The product does not exist');
        }
        if (error.status === HttpStatusCode.Unauthorized) {
          return throwError(() => 'Not allowed');
        }
        return throwError(() => 'Oops something went wrong');
      })
    );
  }

  create(dto: CreateProductDTO) {
    return this.http.post<Product>(`${this.apiUrl}/products`, dto);
  }

  update(id: string, dto: UpdateProductDTO) {
    return this.http.put<Product>(`${this.apiUrl}/products/${id}`, dto);
  }

  delete(id: string) {
    return this.http.delete<boolean>(`${this.apiUrl}/products/${id}`);
  }
}
