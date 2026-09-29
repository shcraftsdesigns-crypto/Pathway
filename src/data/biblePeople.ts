export interface BiblePerson {
  id: string
  name: string
  slug: string
  alternateNames: string[]
  testament: 'Old Testament' | 'New Testament'
  books: string[]
  description: string
  scriptureReferences: string[]
}

export const biblePeople: BiblePerson[] = [
  {
    id: 'test-abraham',
    name: 'Abraham',
    slug: 'abraham',
    alternateNames: ['Abram'],
    testament: 'Old Testament',
    books: ['Genesis'],
    description: 'Patriarch of Israel and recipient of God’s covenant.',
    scriptureReferences: ['Genesis 12:1-9', 'Genesis 17:1-8'],
  },
  {
    id: 'test-moses',
    name: 'Moses',
    slug: 'moses',
    alternateNames: [],
    testament: 'Old Testament',
    books: ['Exodus', 'Leviticus', 'Numbers', 'Deuteronomy'],
    description: 'Leader who brought the Israelites out of Egypt.',
    scriptureReferences: ['Exodus 3:1-10', 'Exodus 14:21-31'],
  },
  {
    id: 'test-peter',
    name: 'Peter',
    slug: 'peter',
    alternateNames: ['Simon', 'Simon Peter', 'Cephas'],
    testament: 'New Testament',
    books: ['Matthew', 'Mark',
'Luke', 'John', 'Acts'],
    description: 'One of Jesus’ apostles and a prominent leader of the early church.',
    scriptureReferences: ['Matthew 4:18-20', 'Acts 2:14-41'],
  },
]
