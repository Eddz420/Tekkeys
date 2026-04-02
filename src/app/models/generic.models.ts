export interface FeaturedProduct {
  id: number;
  name: string;
  image_url: string;
  url: string;
  price_original: number;
  currency: string;
}
export function createProductTemplateParams(
  overrides?: Partial<GenericModelParams>
): GenericModelParams {
  return {
    args: [],
    kwargs: {
      domain: [],
      specification: {},
      ...overrides?.kwargs,
    },
    method: "web_search_read",
    model: "product.template",
    ...overrides
  };
}
export interface GenericModelParams {
  args: any[];
  kwargs: {
    limit?: any,
    domain?: any[];
    context?: any;
    specification?: Record<string, FieldSpecification>;
    groupBy?: string[];
    aggregate?: Record<string, AggregateSpecification>;
  };
  method: string;
  model: string;
}
export interface FieldSpecification {
  fields?: Record<string, any>;
}

export interface AggregateSpecification {
  type: string;
  field: string;
}
export interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  first: boolean;
  last: boolean;
  number: number
}