import { Prisma } from '@prisma/client'
import { IconTypes } from '../utils/icon-types'

export type UserLibraryCategoryType = keyof Pick<
	Prisma.UserSelect,
	'finishedBooks' | 'readingBooks' | 'watchedShelves' | 'hiddenShelves'
>
export const DesignationType = {
	finishedBooks: 'Book',
	readingBooks: 'Book',
	watchedShelves: 'Shelf',
	hiddenShelves: 'Shelf'
}
export enum UserLibraryFieldsEnum {
	finishedBooks = 'finishedBooks',
	readingBooks = 'readingBooks',
	watchedShelves = 'watchedShelves',
	hiddenShelves = 'hiddenShelves'
}

export const CatalogTitleType = {
	finishedBooks: 'Finished',
	readingBooks: 'Reading',
	watchedShelves: 'Watched',
	hiddenShelves: 'Hidden'
}

export const userLibraryFields: UserLibraryCategoryType[] = [
	'finishedBooks',
	'readingBooks',
	'watchedShelves',
	'hiddenShelves'
]

export interface UserStatisticsType {
	name: 'Books read' | 'Pages read' | 'Time in read' | 'Reading speed'
	count: number | string
	icon: IconTypes
}

export interface UserLibraryCatalogType
	extends Pick<UserStatisticsType, 'count' | 'icon'> {
	name: keyof typeof CatalogTitleType
	type: UserLibraryFieldsEnum
}
