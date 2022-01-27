export interface Entity<TAttributes extends EntityAttributes> {
    entity_id: string,
    attributes: TAttributes,
}

export interface EntityAttributes {
}

export interface FeedAttributes extends EntityAttributes {
    movies: Movie[]
}

export interface Movie {
    title: string
    category: string
    platform: string
    poster: string
}