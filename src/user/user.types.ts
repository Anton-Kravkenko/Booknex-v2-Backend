import { Prisma } from '@prisma/client'
import { IconTypes } from '../utils/icon-types'

export type UserLibraryCategoryType = keyof Pick<
	Prisma.UserSelect,
	'finishedBooks' | 'readingBooks' | 'watchedShelves' | 'hiddenShelves'
>
export const DesignationType = {
	finishedBooks: 'book',
	readingBooks: 'book',
	watchedShelves: 'shelf',
	hiddenShelves: 'shelf'
}
export enum UserLibraryFieldsEnum {
	finishedBooks = 'finishedBooks',
	readingBooks = 'readingBooks',
	watchedShelves = 'watchedShelves',
	hiddenShelves = 'hiddenShelves'
}

export const UserOppositeToggle = {
	finishedBooks: UserLibraryFieldsEnum.readingBooks,
	readingBooks: UserLibraryFieldsEnum.finishedBooks,
	watchedShelves: UserLibraryFieldsEnum.hiddenShelves,
	hiddenShelves: UserLibraryFieldsEnum.watchedShelves
}

export const CatalogTitleType = {
	finishedBooks: 'Finished',
	readingBooks: 'Reading',
	watchedShelves: 'Watched',
	hiddenShelves: 'Hidden'
}

export const userLibraryFields: UserLibraryCategoryType[] = [
	UserLibraryFieldsEnum.finishedBooks,
	UserLibraryFieldsEnum.readingBooks,
	UserLibraryFieldsEnum.watchedShelves,
	UserLibraryFieldsEnum.hiddenShelves
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

export const idSelect = {
	select: { id: true }
}
