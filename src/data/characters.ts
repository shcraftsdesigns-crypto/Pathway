import type { BiblicalCharacter, CharacterCategory, ScriptureReference, Testament, TimelineEvent } from '@/types'
import { ref } from '@/lib/scripture'

type Ev = [title: string, description: string, reference: ScriptureReference]
const events = (slug: string, list: Ev[]): TimelineEvent[] =>
  list.map(([title, description, r], i) => ({ id: `${slug}-${i + 1}`, title, description, scriptureReferences: [r] }))

interface Seed {
  id: string; name: string; slug: string; alt?: string[]; t: Testament; cats: CharacterCategory[]
  subtitle: string; desc: string; bio: string; key: ScriptureReference; tl: Ev[]
}
const build = (s: Seed): BiblicalCharacter => ({
  id: s.id, name: s.name, slug: s.slug, alternateNames: s.alt, testament: s.t, categories: s.cats,
  subtitle: s.subtitle, shortDescription: s.desc, biography: s.bio, keyScriptures: [s.key], timeline: events(s.slug, s.tl),
})

export const FEATURED_SLUGS = ['david', 'moses', 'esther', 'joseph', 'peter', 'paul']

export const characters: BiblicalCharacter[] = [
  build({ id: '1', name: 'Abraham', slug: 'abraham', alt: ['Abram'], t: 'Old Testament', cats: ['Patriarchs'], subtitle: 'Father of the covenant people',
    desc: "Called by God to leave his home; recipient of God's covenant promises.", key: ref('Genesis', 12, 1, 3),
    bio: "Abraham (first called Abram) is introduced in Genesis 11–12 and is central to the story of God's covenant with a chosen people. His journey of trust is traced through Genesis 12–25.",
    tl: [['Called to leave his homeland', 'God calls Abram to go to a land he will be shown.', ref('Genesis', 12, 1, 3)], ['Covenant promise', 'God makes a covenant with Abram concerning descendants.', ref('Genesis', 15)], ['Birth of Isaac', 'Isaac is born to Abraham and Sarah.', ref('Genesis', 21, 1, 7)], ['Test of faith', 'Abraham is tested regarding Isaac.', ref('Genesis', 22)]] }),
  build({ id: '2', name: 'Joseph', slug: 'joseph', t: 'Old Testament', cats: ['Patriarchs', 'Leaders'], subtitle: 'Son of Jacob; ruler in Egypt',
    desc: 'Sold by his brothers, later rose to authority in Egypt and preserved his family.', key: ref('Genesis', 50, 15, 21),
    bio: "Joseph's story fills much of Genesis 37–50, moving from family conflict to slavery, imprisonment and high office in Egypt.",
    tl: [['Sold by his brothers', 'Joseph is sold and taken to Egypt.', ref('Genesis', 37)], ['Prison and false accusation', "Joseph serves in Potiphar's house and is imprisoned.", ref('Genesis', 39)], ['Rise to authority', "Joseph interprets Pharaoh's dreams and is placed in charge.", ref('Genesis', 41)], ['Reunion with his family', 'Joseph reveals himself to his brothers.', ref('Genesis', 45)]] }),
  build({ id: '3', name: 'Moses', slug: 'moses', t: 'Old Testament', cats: ['Prophets', 'Leaders'], subtitle: 'Deliverer and lawgiver',
    desc: 'Led Israel out of Egypt and received the Law at Sinai.', key: ref('Exodus', 3),
    bio: 'Moses is the central human figure of Exodus through Deuteronomy, associated with the exodus, the covenant at Sinai and the wilderness journey.',
    tl: [['Born and preserved', "Moses is hidden, then raised in Pharaoh's household.", ref('Exodus', 2)], ['Called at the burning bush', 'God commissions Moses to lead Israel out of Egypt.', ref('Exodus', 3)], ['The exodus', 'Israel is delivered at the sea as it leaves Egypt.', ref('Exodus', 14)], ['The covenant at Sinai', 'Israel comes to Sinai and the covenant is set before them.', ref('Exodus', 19, 1, 6)], ['Looks over the land', 'Moses views the land from Mount Nebo.', ref('Deuteronomy', 34)]] }),
  build({ id: '4', name: 'Joshua', slug: 'joshua', alt: ['Hoshea'], t: 'Old Testament', cats: ['Leaders'], subtitle: "Moses' successor",
    desc: "Led Israel into the promised land after Moses' death.", key: ref('Joshua', 1),
    bio: "Joshua served as Moses' assistant and then led Israel into Canaan, as recorded in the book of Joshua.",
    tl: [['Sent as a spy', 'Joshua is one of the men sent to explore Canaan.', ref('Numbers', 13)], ['Commissioned to lead', 'Joshua is charged with leading Israel.', ref('Joshua', 1)], ['Crossing the Jordan', 'Israel crosses into the land.', ref('Joshua', 3)], ['Renewing the covenant', 'Joshua calls Israel to serve the Lord.', ref('Joshua', 24)]] }),
  build({ id: '5', name: 'Ruth', slug: 'ruth', t: 'Old Testament', cats: ['Women'], subtitle: 'A Moabite woman of loyalty',
    desc: "Remained with Naomi and became part of David's family line.", key: ref('Ruth', 1, 16, 17),
    bio: "The book of Ruth tells of a Moabite widow who commits herself to Naomi and to Israel's God, and later marries Boaz, who acts as her kinsman-redeemer.",
    tl: [['Stays with Naomi', 'Ruth chooses to go with Naomi to Bethlehem.', ref('Ruth', 1)], ["Gleans in Boaz's field", 'Ruth gathers grain and meets Boaz.', ref('Ruth', 2)], ['Redemption', 'Boaz acts as kinsman-redeemer.', ref('Ruth', 4, 1, 13)], ['A place in the line of David', "Ruth's descendants include David.", ref('Ruth', 4, 17, 22)]] }),
  { ...build({ id: '6', name: 'David', slug: 'david', t: 'Old Testament', cats: ['Kings'], subtitle: 'King of Israel · Psalmist',
    desc: "Shepherd who became Israel's greatest king, known for faith and serious failure.", key: ref('Psalm', 23),
    bio: "David's life is told mainly in 1 Samuel 16 through 1 Kings 2, and many psalms are attributed to him.",
    tl: [['Anointed by Samuel', 'Samuel anoints David among his brothers.', ref('1 Samuel', 16)], ['Fought Goliath', 'David faces the Philistine champion.', ref('1 Samuel', 17)], ['Served under Saul', "David enters Saul's service and rises in success and in Saul's jealousy.", ref('1 Samuel', 18, 1, 30)], ['Became king', 'David is anointed king over Israel.', ref('2 Samuel', 5, 1, 5)], ['Captured Jerusalem', 'David takes Jerusalem.', ref('2 Samuel', 5, 6, 10)], ['Personal failure', "David's sin involving Bathsheba and Uriah; Nathan confronts him in chapter 12.", ref('2 Samuel', 11)], ['Family conflict', "Absalom's rebellion.", ref('2 Samuel', 15)], ['Final years', 'David charges Solomon before his death.', ref('1 Kings', 2, 1, 4)]] }),
    relationships: [
      { id: 'david-saul', relatedName: 'Saul', relationshipType: 'King he served', description: 'David served in Saul’s court and later fled from him.', scriptureReferences: [ref('1 Samuel', 18, 1, 30), ref('1 Samuel', 19)] },
      { id: 'david-jonathan', relatedName: 'Jonathan', relationshipType: 'Close friend', description: 'Saul’s son Jonathan formed a covenant of friendship with David.', scriptureReferences: [ref('1 Samuel', 18, 1, 4)] },
      { id: 'david-solomon', relatedName: 'Solomon', relationshipType: 'Son and successor', description: 'Solomon succeeded David as king.', scriptureReferences: [ref('1 Kings', 1)] },
    ] },
  build({ id: '7', name: 'Esther', slug: 'esther', alt: ['Hadassah'], t: 'Old Testament', cats: ['Women'], subtitle: 'Queen of Persia',
    desc: 'A Jewish queen who acted to save her people from destruction.', key: ref('Esther', 4, 14),
    bio: "Esther's story is told in the book of Esther, set in the Persian empire.",
    tl: [['Chosen as queen', 'Esther becomes queen.', ref('Esther', 2)], ["Haman's plot", 'A decree threatens the Jews.', ref('Esther', 3)], ['Approaches the king', 'Esther risks going to the king.', ref('Esther', 5, 1, 8)], ['Deliverance', 'The plot is reversed.', ref('Esther', 8)]] }),
  build({ id: '8', name: 'Daniel', slug: 'daniel', alt: ['Belteshazzar'], t: 'Old Testament', cats: ['Prophets'], subtitle: 'Exile in Babylon',
    desc: 'A faithful exile who served in Babylon and received visions.', key: ref('Daniel', 6),
    bio: 'Daniel was taken to Babylon and served in the royal courts while remaining faithful to God.',
    tl: [['Taken into exile', 'Daniel is taken to Babylon.', ref('Daniel', 1)], ['Interprets a dream', "Daniel explains Nebuchadnezzar's dream.", ref('Daniel', 2)], ['Fiery furnace', "Daniel's companions refuse to worship an image.", ref('Daniel', 3)], ["The lions' den", 'Daniel is delivered.', ref('Daniel', 6)]] }),
  build({ id: '9', name: 'Peter', slug: 'peter', alt: ['Simon', 'Cephas'], t: 'New Testament', cats: ['Apostles', 'Disciples'], subtitle: 'Fisherman turned apostle',
    desc: 'One of Jesus’ closest disciples, a leader of the early church.', key: ref('Matthew', 16, 13, 20),
    bio: 'Peter appears throughout the Gospels and the early chapters of Acts.',
    tl: [['Called by Jesus', 'Simon is called to follow Jesus.', ref('Matthew', 4, 18, 20)], ['Confesses Jesus as Christ', "Peter's confession at Caesarea Philippi.", ref('Matthew', 16, 13, 20)], ['Denies Jesus', 'Peter denies knowing Jesus.', ref('Luke', 22, 54, 62)], ['Recommissioned', 'Jesus asks Peter three times about his love and calls him to follow.', ref('John', 21, 15, 19)], ['Preaches at Pentecost', 'Peter addresses the crowd.', ref('Acts', 2)]] }),
  build({ id: '10', name: 'Paul', slug: 'paul', alt: ['Saul of Tarsus'], t: 'New Testament', cats: ['Apostles'], subtitle: 'Apostle to the Gentiles',
    desc: 'Former persecutor of the church who became a missionary and writer of letters.', key: ref('Acts', 9),
    bio: "Paul's story is told in Acts, and his letters make up much of the New Testament.",
    tl: [['Persecutes the church', "Saul approves of Stephen's death.", ref('Acts', 8, 1, 3)], ['Encounter on the Damascus road', 'Saul meets the risen Jesus.', ref('Acts', 9, 1, 19)], ['First missionary journey', 'Paul and Barnabas are sent out.', ref('Acts', 13)], ['Arrives in Rome', "Paul's journey ends in Rome.", ref('Acts', 28, 16, 31)]] }),
]
