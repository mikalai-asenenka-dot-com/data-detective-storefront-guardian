
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, AlertTriangle, PlayCircle, RefreshCw } from "lucide-react";
import { APITester } from "@/components/APITester";
import { TestResults } from "@/components/TestResults";
import { DefectiveProducts } from "@/components/DefectiveProducts";
import { useAPITest } from "@/hooks/useAPITest";

const Index = () => {
  const {
    isLoading,
    testResults,
    defectiveProducts,
    runTests,
    progress
  } = useAPITest();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">
            API Data Validation Dashboard
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Automated testing suite for FakeStore API to detect errors and anomalies in product data
          </p>
        </div>

        {/* Test Control Panel */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlayCircle className="h-6 w-6" />
              Test Control Panel
            </CardTitle>
            <CardDescription>
              Execute automated tests on https://fakestoreapi.com/products
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Button 
                onClick={runTests} 
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                {isLoading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <PlayCircle className="h-4 w-4" />
                )}
                {isLoading ? 'Running Tests...' : 'Run API Tests'}
              </Button>
              
              {isLoading && (
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm text-gray-600">Testing Progress</span>
                    <span className="text-sm font-medium">{progress}%</span>
                  </div>
                  <Progress value={progress} className="w-full" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Test Results */}
        {testResults && (
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Test Overview</TabsTrigger>
              <TabsTrigger value="results">Detailed Results</TabsTrigger>
              <TabsTrigger value="defects">Defective Products</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Test Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="shadow-md">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Response Code</p>
                        <p className="text-2xl font-bold">
                          {testResults.responseCode}
                        </p>
                      </div>
                      {getStatusIcon(testResults.responseCode === 200 ? 'passed' : 'failed')}
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-md">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Products</p>
                        <p className="text-2xl font-bold">
                          {testResults.totalProducts}
                        </p>
                      </div>
                      {getStatusIcon('passed')}
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-md">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Valid Products</p>
                        <p className="text-2xl font-bold text-green-600">
                          {testResults.validProducts}
                        </p>
                      </div>
                      {getStatusIcon('passed')}
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-md">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Defective Products</p>
                        <p className="text-2xl font-bold text-red-600">
                          {defectiveProducts.length}
                        </p>
                      </div>
                      {getStatusIcon(defectiveProducts.length > 0 ? 'failed' : 'passed')}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Status Alert */}
              <Alert className={defectiveProducts.length > 0 ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  {defectiveProducts.length > 0 
                    ? `Found ${defectiveProducts.length} products with data anomalies that require attention.`
                    : "All products passed validation tests. No anomalies detected."
                  }
                </AlertDescription>
              </Alert>
            </TabsContent>

            <TabsContent value="results">
              <TestResults results={testResults} />
            </TabsContent>

            <TabsContent value="defects">
              <DefectiveProducts products={defectiveProducts} />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default Index;
