import { Prisma } from '@prisma/client'

export type UserLibraryType = keyof Pick<
	Prisma.UserSelect,
	| 'finishBooks'
	| 'likedBooks'
	| 'readingBooks'
	| 'likeShelves'
	| 'unWatchedShelves'
>
export const DesignationType = {
	finishBooks: 'Book',
	likedBooks: 'Book',
	readingBooks: 'Book',
	likeShelves: 'Shelves',
	unWatchedShelves: 'Shelves'
}
export const userLibraryFields: UserLibraryType[] = [
	'finishBooks',
	'likedBooks',
	'readingBooks',
	'likeShelves',
	'unWatchedShelves'
]
