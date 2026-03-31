// src/environments/environment.ts
import { AppConfig } from '../app/services/config';

const GUICHET_CONFIG: AppConfig = {
  apiEndpoint: '/odoo',
  title: 'Guichet endpoint',
  clientId: 'wissalsys-ecommerce-guichet',
  secret: 'XY7kmzoNzl100',
};

export const environment = {
  production: false,
  apiEndpointConfig: GUICHET_CONFIG,
};