export interface FeedAttributes {
    movies: Movie[]
}

export interface Movie {
    title: string
    category: string
    platform: string
    poster: string
}