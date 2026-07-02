"use client";
import axios from "axios";

export const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_BROWSER_API_URL || "http://localhost:8000" });

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("flowforge_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
