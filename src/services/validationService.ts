
import { Product } from './apiService';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface ProductValidation extends ValidationResult {
  product: Product;
  defects: {
    emptyTitle: boolean;
    negativePrice: boolean;
    invalidRating: boolean;
    missingFields: string[];
  };
}

export interface TestResults {
  responseCode: number;
  totalProducts: number;
  validProducts: number;
  validationTests: {
    responseCodeTest: ValidationResult;
    titleValidation: ValidationResult;
    priceValidation: ValidationResult;
    ratingValidation: ValidationResult;
    dataIntegrityTest: ValidationResult;
  };
  timestamp: string;
}

export class ValidationService {
  static validateProduct(product: Product): ProductValidation {
    const errors: string[] = [];
    const defects = {
      emptyTitle: false,
      negativePrice: false,
      invalidRating: false,
      missingFields: []
    };

    // Check for missing fields
    if (!product.title) {
      defects.missingFields.push('title');
    }
    if (product.price === undefined || product.price === null) {
      defects.missingFields.push('price');
    }
    if (!product.rating || product.rating.rate === undefined) {
      defects.missingFields.push('rating.rate');
    }

    // Validate title - must not be empty
    if (!product.title || product.title.trim() === '') {
      defects.emptyTitle = true;
      errors.push('Product title is empty or missing');
    }

    // Validate price - must not be negative
    if (product.price < 0) {
      defects.negativePrice = true;
      errors.push(`Product price is negative: ${product.price}`);
    }

    // Validate rating - must not exceed 5
    if (product.rating && product.rating.rate > 5) {
      defects.invalidRating = true;
      errors.push(`Product rating exceeds maximum (5): ${product.rating.rate}`);
    }

    // Additional validation for rating - should be between 0 and 5
    if (product.rating && (product.rating.rate < 0 || product.rating.rate > 5)) {
      defects.invalidRating = true;
      errors.push(`Product rating is out of valid range (0-5): ${product.rating.rate}`);
    }

    return {
      product,
      isValid: errors.length === 0,
      errors,
      defects
    };
  }

  static validateAllProducts(products: Product[], responseCode: number): {
    results: TestResults;
    defectiveProducts: ProductValidation[];
  } {
    console.log(`Starting validation of ${products.length} products...`);

    const productValidations = products.map(product => this.validateProduct(product));
    const defectiveProducts = productValidations.filter(validation => !validation.isValid);
    const validProducts = products.length - defectiveProducts.length;

    // Count specific validation errors
    const titleErrors = defectiveProducts.filter(p => p.defects.emptyTitle).length;
    const priceErrors = defectiveProducts.filter(p => p.defects.negativePrice).length;
    const ratingErrors = defectiveProducts.filter(p => p.defects.invalidRating).length;
    const missingFieldErrors = defectiveProducts.filter(p => p.defects.missingFields.length > 0).length;

    const results: TestResults = {
      responseCode,
      totalProducts: products.length,
      validProducts,
      validationTests: {
        responseCodeTest: {
          isValid: responseCode === 200,
          errors: responseCode !== 200 ? [`Expected status code 200, got ${responseCode}`] : []
        },
        titleValidation: {
          isValid: titleErrors === 0,
          errors: titleErrors > 0 ? [`${titleErrors} products have empty or missing titles`] : []
        },
        priceValidation: {
          isValid: priceErrors === 0,
          errors: priceErrors > 0 ? [`${priceErrors} products have negative prices`] : []
        },
        ratingValidation: {
          isValid: ratingErrors === 0,
          errors: ratingErrors > 0 ? [`${ratingErrors} products have invalid ratings (>5 or <0)`] : []
        },
        dataIntegrityTest: {
          isValid: missingFieldErrors === 0,
          errors: missingFieldErrors > 0 ? [`${missingFieldErrors} products have missing required fields`] : []
        }
      },
      timestamp: new Date().toISOString()
    };

    console.log(`Validation complete: ${validProducts}/${products.length} products valid, ${defectiveProducts.length} defective`);

    return { results, defectiveProducts };
  }

  static generateTestReport(results: TestResults, defectiveProducts: ProductValidation[]): string {
    const report = [
      '=== API Data Validation Report ===',
      `Timestamp: ${new Date(results.timestamp).toLocaleString()}`,
      `API Endpoint: https://fakestoreapi.com/products`,
      `Response Code: ${results.responseCode} ${results.validationTests.responseCodeTest.isValid ? '✓' : '✗'}`,
      '',
      `Total Products: ${results.totalProducts}`,
      `Valid Products: ${results.validProducts}`,
      `Defective Products: ${defectiveProducts.length}`,
      '',
      '=== Test Results ===',
      `Response Code Test: ${results.validationTests.responseCodeTest.isValid ? 'PASSED' : 'FAILED'}`,
      `Title Validation: ${results.validationTests.titleValidation.isValid ? 'PASSED' : 'FAILED'}`,
      `Price Validation: ${results.validationTests.priceValidation.isValid ? 'PASSED' : 'FAILED'}`,
      `Rating Validation: ${results.validationTests.ratingValidation.isValid ? 'PASSED' : 'FAILED'}`,
      `Data Integrity: ${results.validationTests.dataIntegrityTest.isValid ? 'PASSED' : 'FAILED'}`,
      ''
    ];

    if (defectiveProducts.length > 0) {
      report.push('=== Defective Products ===');
      defectiveProducts.forEach((product, index) => {
        report.push(`${index + 1}. Product ID: ${product.product.id}`);
        report.push(`   Title: "${product.product.title}"`);
        report.push(`   Errors: ${product.errors.join(', ')}`);
        report.push('');
      });
    }

    return report.join('\n');
  }
}
