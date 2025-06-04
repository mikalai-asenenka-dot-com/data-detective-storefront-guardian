
import { useState } from 'react';
import { APIService } from '@/services/apiService';
import { ValidationService, TestResults, ProductValidation } from '@/services/validationService';
import { toast } from 'sonner';

export const useAPITest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<TestResults | null>(null);
  const [defectiveProducts, setDefectiveProducts] = useState<ProductValidation[]>([]);
  const [progress, setProgress] = useState(0);

  const runTests = async () => {
    setIsLoading(true);
    setProgress(0);
    
    try {
      toast.info('Starting API tests...');
      
      // Step 1: Test API connection
      setProgress(20);
      const isConnected = await APIService.testConnection();
      if (!isConnected) {
        throw new Error('Cannot connect to API');
      }

      // Step 2: Fetch products
      setProgress(40);
      const apiResponse = await APIService.fetchProducts();
      
      // Step 3: Validate data
      setProgress(60);
      const { results, defectiveProducts: defective } = ValidationService.validateAllProducts(
        apiResponse.data,
        apiResponse.status
      );

      // Step 4: Generate report
      setProgress(80);
      const report = ValidationService.generateTestReport(results, defective);
      console.log('=== AUTOMATED TEST REPORT ===');
      console.log(report);

      setProgress(100);
      setTestResults(results);
      setDefectiveProducts(defective);

      // Show results toast
      if (defective.length > 0) {
        toast.error(`Tests completed: Found ${defective.length} defective products`);
      } else {
        toast.success('All tests passed: No defects found');
      }

    } catch (error) {
      console.error('Test execution failed:', error);
      toast.error(`Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
      setProgress(0);
    }
  };

  return {
    isLoading,
    testResults,
    defectiveProducts,
    runTests,
    progress
  };
};
