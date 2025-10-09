// TODO: Remove hardcoded tenant ID - implement proper multi-tenancy
// This is a temporary fallback for development only
export const DEFAULT_TENANT_ID = '00000000-0000-0000-0000-000000000010';

// TODO: Implement tenant resolution from:
// 1. URL subdomain (tenant1.docunest.com)
// 2. URL path (/tenant/tenant1/manuals)
// 3. User's authenticated tenant from JWT
export const getTenantId = (): string => {
  // For now, return the default tenant ID
  // In production, this should resolve from the current context
  return DEFAULT_TENANT_ID;
};
