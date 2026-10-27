// hooks/useFoods.js
import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";

// Fetch all foods
export const useAllFoods = (page = 1, limit = 100) => {
  return useQuery({
    queryKey: ["foods", "all", page, limit],
    queryFn: async () => {
      const response = await api.get("/food", { params: { page, limit } });
      return response.data;
    },
  });
};

// Fetch foods by category
export const useFoodsByCategory = (category, page = 1, limit = 100) => {
  return useQuery({
    queryKey: ["foods", "category", category, page, limit],
    queryFn: async () => {
      const response = await api.get(`/food/category/${category}`, {
        params: { page, limit },
      });
      return response.data;
    },
    enabled: !!category && category !== "all",
  });
};
