import { HTTP_INTERCEPTORS, HttpStatusCode } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TokenInterceptor } from '../interceptors/token.interceptor';
import {
  generateManyProducts,
  generateOneProduct,
} from '../models/product.mock';
import {
  CreateProductDTO,
  Product,
  UpdateProductDTO,
} from '../models/product.model';
import { environment } from './../../environments/environment';
import { ProductsService } from './products.service';
import { TokenService } from './token.service';

describe('ProductsService', () => {
  let productService: ProductsService;
  let httpController: HttpTestingController;
  let tokenService: TokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ProductsService,
        TokenService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: TokenInterceptor,
          multi: true,
        },
      ],
    });
    productService = TestBed.inject(ProductsService);
    httpController = TestBed.inject(HttpTestingController);
    tokenService = TestBed.inject(TokenService);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('should be create', () => {
    expect(productService).toBeTruthy();
  });

  describe('tests for getAllSimple', () => {
    it('should return a product list', (doneFn) => {
      const mockData: Product[] = generateManyProducts(2);
      spyOn(tokenService, 'getToken').and.returnValue('<token>');

      productService.getAllSimple().subscribe((data) => {
        expect(data.length).toEqual(mockData.length);
        expect(data).toEqual(mockData);
        doneFn();
      });

      const url = `${environment.API_URL}/api/v1/products`;
      const req = httpController.expectOne(url);
      const headers = req.request.headers;
      expect(headers.get('Authorization')).toEqual(`Bearer <token>`);
      req.flush(mockData);
    });
  });

  describe('tests for getAll', () => {
    it('should return a product list', (doneFn) => {
      const mockData: Product[] = generateManyProducts(3);

      productService.getAll().subscribe((data) => {
        expect(data.length).toEqual(mockData.length);
        doneFn();
      });

      const url = `${environment.API_URL}/api/v1/products`;
      const req = httpController.expectOne(url);
      req.flush(mockData);
    });

    it('should return product list with taxes', (doneFn) => {
      const mockData: Product[] = [
        {
          ...generateOneProduct(),
          price: 100, // taxes => 100 * .19 = 19
        },
        {
          ...generateOneProduct(),
          price: 200, // taxes => 200 * .19 = 38
        },
      ];

      productService.getAll().subscribe((data) => {
        expect(data.length).toEqual(mockData.length);
        expect(data[0].taxes).toEqual(19);
        expect(data[1].taxes).toEqual(38);
        doneFn();
      });

      const url = `${environment.API_URL}/api/v1/products`;
      const req = httpController.expectOne(url);
      req.flush(mockData);
    });
  });

  it('should send query params with limit 10 and offset 3', (doneFn) => {
    const mockData: Product[] = generateManyProducts(3);
    const limit = 10;
    const offset = 3;

    productService.getAll(limit, offset).subscribe((data) => {
      expect(data.length).toEqual(mockData.length);
      doneFn();
    });

    const url = `${environment.API_URL}/api/v1/products?limit=${limit}&offset=${offset}`;
    const req = httpController.expectOne(url);
    req.flush(mockData);
    const params = req.request.params;
    expect(params.get('limit')).toEqual(`${limit}`);
    expect(params.get('offset')).toEqual(`${offset}`);
    httpController.verify();
  });

  describe('test for product creation', () => {
    it('should return a new product', (doneFn) => {
      const mockData = generateOneProduct();
      const dto: CreateProductDTO = {
        title: 'A product',
        price: 100,
        images: ['img'],
        description: 'Simple product',
        categoryId: 99,
      };

      productService.create({ ...dto }).subscribe((data) => {
        expect(data).toEqual(mockData);
        doneFn();
      });

      const url = `${environment.API_URL}/api/v1/products`;
      const req = httpController.expectOne(url);
      req.flush(mockData);
      expect(req.request.body).toEqual(dto);
      expect(req.request.method).toEqual('POST');
    });
  });

  describe('test for product update', () => {
    it('should update a product', (doneFn) => {
      const mockData: Product = generateOneProduct();
      const dto: UpdateProductDTO = {
        title: 'New product title',
      };
      const productId = '1';

      productService.update(productId, { ...dto }).subscribe((data) => {
        expect(data).toEqual(mockData);
        doneFn();
      });

      const url = `${environment.API_URL}/api/v1/products/${productId}`;
      const req = httpController.expectOne(url);
      expect(req.request.method).toEqual('PUT');
      expect(req.request.body).toEqual(dto);
      req.flush(mockData);
    });
  });

  describe('test for delete product', () => {
    it('should delete a product', (doneFn) => {
      const mockData = true;
      const productId = '1';

      productService.delete(productId).subscribe((data) => {
        expect(data).toEqual(mockData);
        doneFn();
      });

      const url = `${environment.API_URL}/api/v1/products/${productId}`;
      const req = httpController.expectOne(url);
      expect(req.request.method).toEqual('DELETE');
      req.flush(mockData);
    });
  });

  describe('test for getOne', () => {
    it('should return a product', (doneFn) => {
      const mockData: Product = generateOneProduct();
      const productId = '1';

      productService.getOne(productId).subscribe((data) => {
        expect(data).toEqual(mockData);
        doneFn();
      });

      const url = `${environment.API_URL}/api/v1/products/${productId}`;
      const req = httpController.expectOne(url);
      expect(req.request.method).toEqual('GET');
      req.flush(mockData);
    });

    it('should return the right msg when the status code is 404', (doneFn) => {
      const productId = '1';
      const msgError = '404 message';
      const mockError = {
        status: HttpStatusCode.NotFound,
        statusText: msgError,
      };

      productService.getOne(productId).subscribe({
        error: (error) => {
          expect(error).toEqual('The product does not exist');
          doneFn();
        },
      });

      const url = `${environment.API_URL}/api/v1/products/${productId}`;
      const req = httpController.expectOne(url);
      expect(req.request.method).toEqual('GET');
      req.flush(msgError, mockError);
    });
  });
});
