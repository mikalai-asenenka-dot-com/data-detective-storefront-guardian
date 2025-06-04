
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock } from "lucide-react";

interface APITesterProps {
  isLoading: boolean;
  onTest: () => void;
}

export const APITester: React.FC<APITesterProps> = ({ isLoading, onTest }) => {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          API Test Configuration
        </CardTitle>
        <CardDescription>
          Configure and execute tests for the FakeStore API
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium mb-2">Endpoint</h4>
            <code className="text-sm bg-gray-100 p-2 rounded block">
              https://fakestoreapi.com/products
            </code>
          </div>
          <div>
            <h4 className="font-medium mb-2">Method</h4>
            <Badge variant="outline">GET</Badge>
          </div>
        </div>
        
        <div>
          <h4 className="font-medium mb-2">Test Criteria</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Response code must be 200</li>
            <li>• Product titles must not be empty</li>
            <li>• Product prices must not be negative</li>
            <li>• Product ratings must not exceed 5</li>
            <li>• All required fields must be present</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
