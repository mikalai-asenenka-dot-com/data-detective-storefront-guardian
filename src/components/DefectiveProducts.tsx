
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, DollarSign, Star, FileText } from "lucide-react";
import { ProductValidation } from '@/services/validationService';

interface DefectiveProductsProps {
  products: ProductValidation[];
}

export const DefectiveProducts: React.FC<DefectiveProductsProps> = ({ products }) => {
  if (products.length === 0) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600">
            <Star className="h-5 w-5" />
            No Defects Found
          </CardTitle>
          <CardDescription>
            All products passed validation tests successfully!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🎉</div>
            <p className="text-lg text-gray-600">
              Excellent! The API data integrity is maintained across all products.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getDefectIcon = (defects: ProductValidation['defects']) => {
    if (defects.emptyTitle) return <FileText className="h-4 w-4 text-red-500" />;
    if (defects.negativePrice) return <DollarSign className="h-4 w-4 text-red-500" />;
    if (defects.invalidRating) return <Star className="h-4 w-4 text-red-500" />;
    return <AlertTriangle className="h-4 w-4 text-red-500" />;
  };

  const getDefectBadges = (defects: ProductValidation['defects']) => {
    const badges = [];
    if (defects.emptyTitle) badges.push(<Badge key="title" variant="destructive">Empty Title</Badge>);
    if (defects.negativePrice) badges.push(<Badge key="price" variant="destructive">Negative Price</Badge>);
    if (defects.invalidRating) badges.push(<Badge key="rating" variant="destructive">Invalid Rating</Badge>);
    if (defects.missingFields.length > 0) {
      badges.push(<Badge key="missing" variant="destructive">Missing Fields</Badge>);
    }
    return badges;
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Defective Products Found
          </CardTitle>
          <CardDescription>
            {products.length} product{products.length !== 1 ? 's' : ''} failed validation tests
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-4">
        {products.map((productValidation, index) => {
          const { product, defects, errors } = productValidation;
          
          return (
            <Card key={product.id} className="shadow-md border-l-4 border-l-red-500">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {getDefectIcon(defects)}
                    <div>
                      <CardTitle className="text-lg">
                        Product #{product.id}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {product.title || 'No title available'}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {getDefectBadges(defects)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <h5 className="font-medium text-sm text-gray-600 mb-1">Price</h5>
                    <p className={`font-mono ${defects.negativePrice ? 'text-red-600 font-bold' : 'text-gray-900'}`}>
                      ${product.price}
                    </p>
                  </div>
                  <div>
                    <h5 className="font-medium text-sm text-gray-600 mb-1">Rating</h5>
                    <p className={`font-mono ${defects.invalidRating ? 'text-red-600 font-bold' : 'text-gray-900'}`}>
                      {product.rating ? product.rating.rate : 'N/A'} / 5.0
                    </p>
                  </div>
                  <div>
                    <h5 className="font-medium text-sm text-gray-600 mb-1">Category</h5>
                    <p className="text-gray-900">{product.category}</p>
                  </div>
                </div>

                <div>
                  <h5 className="font-medium text-sm text-gray-600 mb-2">Validation Errors</h5>
                  <ul className="space-y-1">
                    {errors.map((error, errorIndex) => (
                      <li key={errorIndex} className="flex items-center gap-2 text-sm text-red-600">
                        <AlertTriangle className="h-3 w-3" />
                        {error}
                      </li>
                    ))}
                  </ul>
                </div>

                {defects.missingFields.length > 0 && (
                  <div className="mt-3">
                    <h5 className="font-medium text-sm text-gray-600 mb-1">Missing Fields</h5>
                    <div className="flex flex-wrap gap-1">
                      {defects.missingFields.map((field, fieldIndex) => (
                        <Badge key={fieldIndex} variant="outline" className="text-red-600 border-red-200">
                          {field}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
