import { Prisma } from '@prisma/client'
import { IconTypes } from '../utils/icon-types'

export type UserLibraryType = keyof Pick<
	Prisma.UserSelect,
	| 'finishedBooks'
	| 'likedBooks'
	| 'readingBooks'
	| 'watchedShelves'
	| 'unwatchedShelves'
>
export const DesignationType = {
	finishedBooks: 'Book',
	likedBooks: 'Book',
	readingBooks: 'Book',
	watchedShelves: 'Shelf',
	unwatchedShelves: 'Shelf'
}
export enum UserLibraryFieldsEnum {
	finishedBooks = 'finishedBooks',
	likedBooks = 'likedBooks',
	readingBooks = 'readingBooks',
	watchedShelves = 'watchedShelves',
	unwatchedShelves = 'unwatchedShelves'
}

export const CatalogTitleType = {
	finishedBooks: 'Finished',
	likedBooks: 'Liked',
	readingBooks: 'Reading',
	watchedShelves: 'Watched',
	unwatchedShelves: 'UnWatched'
}

export const userLibraryFields: UserLibraryType[] = [
	'finishedBooks',
	'likedBooks',
	'readingBooks',
	'watchedShelves',
	'unwatchedShelves'
]

export interface UserStatisticsType {
	name: 'Books read' | 'Pages read' | 'Time in read' | 'Reading speed'
	count: number | string
	icon: IconTypes
}
