
export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

export interface APIResponse {
  data: Product[];
  status: number;
  statusText: string;
}

export class APIService {
  private static readonly BASE_URL = 'https://fakestoreapi.com';

  static async fetchProducts(): Promise<APIResponse> {
    try {
      console.log('Fetching products from FakeStore API...');
      
      const response = await fetch(`${this.BASE_URL}/products`);
      
      console.log(`API Response Status: ${response.status}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      console.log(`Received ${data.length} products from API`);
      
      return {
        data,
        status: response.status,
        statusText: response.statusText
      };
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  static async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.BASE_URL}/products?limit=1`);
      return response.ok;
    } catch {
      return false;
    }
  }
}
