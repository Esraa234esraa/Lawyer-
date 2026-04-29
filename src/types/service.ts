export interface ServiceChild {
  id?: string | null;
  term: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  childernTheServices: ServiceChild[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
