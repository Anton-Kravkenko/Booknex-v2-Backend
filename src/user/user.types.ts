import { Prisma } from '@prisma/client'
import { IconTypes } from '../utils/icon-types'

export type UserLibraryType = keyof Pick<
	Prisma.UserSelect,
	| 'finishedBooks'
	| 'likedBooks'
	| 'readingBooks'
	| 'likedShelves'
	| 'unwatchedShelves'
>
export const DesignationType = {
	finishedBooks: 'Book',
	likedBooks: 'Book',
	readingBooks: 'Book',
	likedShelves: 'Shelf',
	unwatchedShelves: 'Shelf'
}
export const userLibraryFields: UserLibraryType[] = [
	'finishedBooks',
	'likedBooks',
	'readingBooks',
	'likedShelves',
	'unwatchedShelves'
]

export interface UserStatisticsType {
	name: 'Books read' | 'Pages read' | 'Time in read' | 'Reading speed'
	count: number | string
	icon: IconTypes
}
