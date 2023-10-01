import { Prisma } from '@prisma/client'

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
