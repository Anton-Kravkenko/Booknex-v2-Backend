import { Prisma } from '@prisma/client'

export type UserLibraryType = keyof Pick<
	Prisma.UserSelect,
	| 'finishBooks'
	| 'likedBooks'
	| 'readingBooks'
	| 'likeShelves'
	| 'unWatchedShelves'
>

export const userLibraryFields: ['finishBooks', 'likedBooks', 'readingBooks', 'likeShelves', 'unWatchedShelves']
	= [
	'finishBooks',
	'likedBooks',
	'readingBooks',
	'likeShelves',
	'unWatchedShelves']
