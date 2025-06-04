
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { TestResults as TestResultsType } from '@/services/validationService';

interface TestResultsProps {
  results: TestResultsType;
}

export const TestResults: React.FC<TestResultsProps> = ({ results }) => {
  const getStatusBadge = (isValid: boolean) => (
    <Badge variant={isValid ? "default" : "destructive"} className="ml-2">
      {isValid ? "PASSED" : "FAILED"}
    </Badge>
  );

  const getStatusIcon = (isValid: boolean) => (
    isValid ? 
      <CheckCircle className="h-5 w-5 text-green-500" /> : 
      <XCircle className="h-5 w-5 text-red-500" />
  );

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Detailed Test Results
          </CardTitle>
          <CardDescription>
            Comprehensive validation results for all test criteria
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Test Summary</h4>
              <div className="space-y-2 text-sm">
                <div>Executed: {new Date(results.timestamp).toLocaleString()}</div>
                <div>Total Products: {results.totalProducts}</div>
                <div>Valid Products: {results.validProducts}</div>
                <div>Success Rate: {((results.validProducts / results.totalProducts) * 100).toFixed(1)}%</div>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Response Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  {getStatusIcon(results.validationTests.responseCodeTest.isValid)}
                  Status Code: {results.responseCode}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Validation Test Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Response Code Test */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(results.validationTests.responseCodeTest.isValid)}
                <div>
                  <h4 className="font-medium">Response Code Test</h4>
                  <p className="text-sm text-gray-600">Verify server response is 200 OK</p>
                </div>
              </div>
              {getStatusBadge(results.validationTests.responseCodeTest.isValid)}
            </div>

            {/* Title Validation */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(results.validationTests.titleValidation.isValid)}
                <div>
                  <h4 className="font-medium">Title Validation</h4>
                  <p className="text-sm text-gray-600">Ensure all products have non-empty titles</p>
                  {!results.validationTests.titleValidation.isValid && (
                    <p className="text-sm text-red-600 mt-1">
                      {results.validationTests.titleValidation.errors.join(', ')}
                    </p>
                  )}
                </div>
              </div>
              {getStatusBadge(results.validationTests.titleValidation.isValid)}
            </div>

            {/* Price Validation */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(results.validationTests.priceValidation.isValid)}
                <div>
                  <h4 className="font-medium">Price Validation</h4>
                  <p className="text-sm text-gray-600">Verify all prices are non-negative</p>
                  {!results.validationTests.priceValidation.isValid && (
                    <p className="text-sm text-red-600 mt-1">
                      {results.validationTests.priceValidation.errors.join(', ')}
                    </p>
                  )}
                </div>
              </div>
              {getStatusBadge(results.validationTests.priceValidation.isValid)}
            </div>

            {/* Rating Validation */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(results.validationTests.ratingValidation.isValid)}
                <div>
                  <h4 className="font-medium">Rating Validation</h4>
                  <p className="text-sm text-gray-600">Check that ratings don't exceed 5.0</p>
                  {!results.validationTests.ratingValidation.isValid && (
                    <p className="text-sm text-red-600 mt-1">
                      {results.validationTests.ratingValidation.errors.join(', ')}
                    </p>
                  )}
                </div>
              </div>
              {getStatusBadge(results.validationTests.ratingValidation.isValid)}
            </div>

            {/* Data Integrity Test */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(results.validationTests.dataIntegrityTest.isValid)}
                <div>
                  <h4 className="font-medium">Data Integrity Test</h4>
                  <p className="text-sm text-gray-600">Verify all required fields are present</p>
                  {!results.validationTests.dataIntegrityTest.isValid && (
                    <p className="text-sm text-red-600 mt-1">
                      {results.validationTests.dataIntegrityTest.errors.join(', ')}
                    </p>
                  )}
                </div>
              </div>
              {getStatusBadge(results.validationTests.dataIntegrityTest.isValid)}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
