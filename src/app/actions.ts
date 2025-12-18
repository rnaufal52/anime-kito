"use server";

import { api } from "@/services/api";

export interface AnimeCardData {
  key: string;
  title: string;
  poster: string;
  slug: string;
  rating?: string;
  episode?: string;
}

export async function getMoreOngoingAnime(page: number): Promise<AnimeCardData[]> {
  try {
    const { data } = await api.getOngoingAnime(page);
    return data.ongoingAnimeData.map(anime => ({
        key: anime.slug,
        title: anime.title,
        poster: anime.poster,
        slug: anime.slug,
        episode: anime.current_episode.replace('Episode ', '')
    }));
  } catch (error) {
    return [];
  }
}

export async function getMoreCompleteAnime(page: number): Promise<AnimeCardData[]> {
  try {
    const { data } = await api.getCompleteAnime(page);
    return data.completeAnimeData.map(anime => ({
        key: anime.slug,
        title: anime.title,
        poster: anime.poster,
        slug: anime.slug,
        rating: anime.rating
    }));
  } catch (error) {
    return [];
  }
}

export async function getMoreAnimeByGenre(slug: string, page: number): Promise<AnimeCardData[]> {
  try {
    const { data } = await api.getAnimeByGenre(slug, page);
    return data.anime.map(anime => ({
        key: anime.slug,
        title: anime.title,
        poster: anime.poster,
        slug: anime.slug,
        rating: anime.rating
    }));
  } catch (error) {
    return [];
  }
}

export async function resolveUrl(url: string): Promise<string> {
  let currentUrl = url;
  
  try {
    // Limit redirect depth to avoid infinite loops
    for (let i = 0; i < 5; i++) {
        const response = await fetch(currentUrl, {
            method: "GET",
            redirect: "manual", // Don't follow automatically so we can see the Location header
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            }
        });

        if (response.status >= 300 && response.status < 400) {
            const location = response.headers.get("location");
            if (location) {
                // Handle relative URLs
                if (location.startsWith("/")) {
                    const baseUrl = new URL(currentUrl).origin;
                    currentUrl = `${baseUrl}${location}`;
                } else {
                    currentUrl = location;
                }
                
                // If we found a Mega link (or other target), we can stop early if we want, 
                // but usually following to the end is best.
                // However, Desustream often redirects straight to the file.
                continue;
            }
        }
        
        // If not a redirect, we reached the destination
        break;
    }
    
    return currentUrl;

  } catch (error) {
    return url;
  }
}

export async function searchAnimeAction(keyword: string): Promise<AnimeCardData[]> {
  try {
    const { data } = await api.searchAnime(keyword);
    return data.map(anime => ({
        key: anime.slug,
        title: anime.title,
        poster: anime.poster,
        slug: anime.slug,
        rating: anime.rating,
        episode: anime.status 
    }));
  } catch (error) {
    console.error("Search error:", error);
    return [];
  }
}
