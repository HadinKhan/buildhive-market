import { useState, useCallback, useMemo } from 'react';
import type { Product } from '../../pages/ProductsPage';

export interface FilterState {
  materialTypes: string[];
  priceRange: [number, number];
  rating: number | null;
  sellers: string[];
  verification: boolean;
  availability: string | null;
  sortBy: string;
  page: number;
  itemsPerPage: number;
}

export const useFilters = (allProducts: Product[]) => {
  const defaultMaxPrice = useMemo(
    () => Math.max(1000, ...allProducts.map((product) => product.price)),
    [allProducts]
  );

  const [filters, setFilters] = useState<FilterState>({
    materialTypes: [],
    priceRange: [0, defaultMaxPrice],
    rating: null,
    sellers: [],
    verification: false,
    availability: null,
    sortBy: 'featured',
    page: 1,
    itemsPerPage: 12,
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [comparisonItems, setComparisonItems] = useState<string[]>([]);

  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.tags.some((t) => t.toLowerCase().includes(query))
      );
    }

    // Material type filter
    if (filters.materialTypes.length > 0) {
      result = result.filter((p) => {
        const searchableValues = [
          p.subcategory,
          p.materialType,
          ...p.tags,
          ...Object.values(p.specs || {}),
        ]
          .filter(Boolean)
          .map((value) => String(value).toLowerCase());

        return filters.materialTypes.some((type) =>
          searchableValues.some((value) => value.includes(type.toLowerCase()))
        );
      });
    }

    // Price range filter
    result = result.filter(
      (p) => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    );

    // Rating filter
    if (filters.rating !== null) {
      result = result.filter((p) => p.rating >= filters.rating!);
    }

    // Seller filter
    if (filters.sellers.length > 0) {
      result = result.filter((p) => filters.sellers.includes(p.seller));
    }

    // Verification filter
    if (filters.verification) {
      result = result.filter((p) => p.verified);
    }

    // Availability filter (if applicable)
    if (filters.availability) {
      // This would need more logic based on your data structure
      // For now, we'll keep all as "in stock"
    }

    // Sorting
    switch (filters.sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        result.sort((a, b) => Number(b.id) - Number(a.id));
        break;
      case 'featured':
      default:
        // Keep original order
        break;
    }

    return result;
  }, [allProducts, searchQuery, filters]);

  const paginatedProducts = useMemo(() => {
    const startIdx = (filters.page - 1) * filters.itemsPerPage;
    const endIdx = startIdx + filters.itemsPerPage;
    return filteredProducts.slice(startIdx, endIdx);
  }, [filteredProducts, filters.page, filters.itemsPerPage]);

  const totalPages = Math.ceil(filteredProducts.length / filters.itemsPerPage);

  const updateFilter = useCallback(
    <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
      setFilters((prev: FilterState) => ({
        ...prev,
        [key]: value,
        page: key === 'page' ? (value as number) : 1,
      }));
    },
    []
  );

  const updatePriceRange = useCallback((range: [number, number]) => {
    setFilters((prev: FilterState) => ({
      ...prev,
      priceRange: range,
      page: 1,
    }));
  }, []);

  const toggleMaterialType = useCallback((type: string) => {
    setFilters((prev: FilterState) => ({
      ...prev,
      materialTypes: prev.materialTypes.includes(type)
        ? prev.materialTypes.filter((t) => t !== type)
        : [...prev.materialTypes, type],
      page: 1,
    }));
  }, []);

  const toggleSeller = useCallback((seller: string) => {
    setFilters((prev: FilterState) => ({
      ...prev,
      sellers: prev.sellers.includes(seller)
        ? prev.sellers.filter((s) => s !== seller)
        : [...prev.sellers, seller],
      page: 1,
    }));
  }, []);

  const toggleComparison = useCallback((productId: string) => {
    setComparisonItems((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      }
      if (prev.length >= 3) {
        return [prev[1], prev[2], productId];
      }
      return [...prev, productId];
    });
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilters({
      materialTypes: [],
      priceRange: [0, defaultMaxPrice],
      rating: null,
      sellers: [],
      verification: false,
      availability: null,
      sortBy: 'featured',
      page: 1,
      itemsPerPage: 12,
    });
    setSearchQuery('');
  }, [defaultMaxPrice]);

  const getActiveFiltersCount = useCallback(() => {
    let count = 0;
    if (filters.materialTypes.length > 0) count++;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < defaultMaxPrice) count++;
    if (filters.rating !== null) count++;
    if (filters.sellers.length > 0) count++;
    if (filters.verification) count++;
    if (searchQuery.trim()) count++;
    return count;
  }, [defaultMaxPrice, filters, searchQuery]);

  return {
    filters,
    searchQuery,
    setSearchQuery,
    filteredProducts,
    paginatedProducts,
    totalPages,
    updateFilter,
    updatePriceRange,
    toggleMaterialType,
    toggleSeller,
    toggleComparison,
    comparisonItems,
    clearAllFilters,
    getActiveFiltersCount,
    resultCount: filteredProducts.length,
  };
};
