import type { BiblicalCharacter, CharacterCategory, ScriptureReference, Testament, TimelineEvent } from '@/types'
import { ref } from '@/lib/scripture'

type Ev = [title: string, description: string, reference: ScriptureReference]
const events = (slug: string, list: Ev[]): TimelineEvent[] =>
  list.map(([title, description, r], i) => ({ id: `${slug}-${i + 1}`, title, description, scriptureReferences: [r] }))

interface Seed {
  id: string; name: string; slug: string; alt?: string[]; t: Testament; cats: CharacterCategory[]
  subtitle: string; desc: string; bio: string; key: ScriptureReference; tl: Ev[]
}
const build = (s: Seed): BiblicalCharacter => {
  const timeline = events(s.slug, s.tl)

  return {
    id: s.id,
    name: s.name,
    slug: s.slug,
    alternateNames: s.alt,
    testament: s.t,
    categories: s.cats,
    subtitle: s.subtitle,
    shortDescription: s.desc,
    biography: s.bio,
    keyScriptures: [s.key],
    timeline,
    studyAreas: [
      {
        id: `${s.slug}-background`,
        title: 'Background',
        description: `Study ${s.name}'s biblical background and setting from the referenced passages.`,
        scriptureReferences: [s.key],
      },
      {
        id: `${s.slug}-major-events`,
        title: 'Major Events',
        description: `Trace the major recorded events in ${s.name}'s biblical account.`,
        scriptureReferences: timeline.flatMap((event) => event.scriptureReferences),
      },
      {
        id: `${s.slug}-reflection`,
        title: 'Reflection',
        description: `Reflect on what ${s.name}'s biblical account reveals without going beyond what Scripture supports.`,
        scriptureReferences: [s.key, ...timeline.flatMap((event) => event.scriptureReferences)],
      },
    ],
  }
}

export const FEATURED_SLUGS = ['david', 'moses', 'esther', 'joseph', 'peter', 'paul']

export const characters: BiblicalCharacter[] = [
  build({ id: 'Abram_1', name: 'Abraham', slug: 'abraham', alt: ['Abram'], t: 'Old Testament', cats: ['Patriarchs'], subtitle: 'Father of the covenant people',
    desc: "Called by God to leave his home; recipient of God's covenant promises.", key: ref('Genesis', 12, 1, 3),
    bio: "Abraham (first called Abram) is introduced in Genesis 11–12 and is central to the story of God's covenant with a chosen people. His journey of trust is traced through Genesis 12–25.",
    tl: [['Called to leave his homeland', 'God calls Abram to go to a land he will be shown.', ref('Genesis', 12, 1, 3)], ['Covenant promise', 'God makes a covenant with Abram concerning descendants.', ref('Genesis', 15)], ['Birth of Isaac', 'Isaac is born to Abraham and Sarah.', ref('Genesis', 21, 1, 7)], ['Test of faith', 'Abraham is tested regarding Isaac.', ref('Genesis', 22)]] }),
  build({ id: 'Joseph_1', name: 'Joseph', slug: 'joseph', t: 'Old Testament', cats: ['Patriarchs', 'Leaders'], subtitle: 'Son of Jacob; ruler in Egypt',
    desc: 'Sold by his brothers, later rose to authority in Egypt and preserved his family.', key: ref('Genesis', 50, 15, 21),
    bio: "Joseph's story fills much of Genesis 37–50, moving from family conflict to slavery, imprisonment and high office in Egypt.",
    tl: [['Sold by his brothers', 'Joseph is sold and taken to Egypt.', ref('Genesis', 37)], ['Prison and false accusation', "Joseph serves in Potiphar's house and is imprisoned.", ref('Genesis', 39)], ['Rise to authority', "Joseph interprets Pharaoh's dreams and is placed in charge.", ref('Genesis', 41)], ['Reunion with his family', 'Joseph reveals himself to his brothers.', ref('Genesis', 45)]] }),
  build({ id: 'Moses_1', name: 'Moses', slug: 'moses', t: 'Old Testament', cats: ['Prophets', 'Leaders'], subtitle: 'Deliverer and lawgiver',
    desc: 'Led Israel out of Egypt and received the Law at Sinai.', key: ref('Exodus', 3),
    bio: 'Moses is the central human figure of Exodus through Deuteronomy, associated with the exodus, the covenant at Sinai and the wilderness journey.',
    tl: [['Born and preserved', "Moses is hidden, then raised in Pharaoh's household.", ref('Exodus', 2)], ['Called at the burning bush', 'God commissions Moses to lead Israel out of Egypt.', ref('Exodus', 3)], ['The exodus', 'Israel is delivered at the sea as it leaves Egypt.', ref('Exodus', 14)], ['The covenant at Sinai', 'Israel comes to Sinai and the covenant is set before them.', ref('Exodus', 19, 1, 6)], ['Looks over the land', 'Moses views the land from Mount Nebo.', ref('Deuteronomy', 34)]] }),
  build({ id: 'Joshua_1', name: 'Joshua', slug: 'joshua', alt: ['Hoshea'], t: 'Old Testament', cats: ['Leaders'], subtitle: "Moses' successor",
    desc: "Led Israel into the promised land after Moses' death.", key: ref('Joshua', 1),
    bio: "Joshua served as Moses' assistant and then led Israel into Canaan, as recorded in the book of Joshua.",
    tl: [['Sent as a spy', 'Joshua is one of the men sent to explore Canaan.', ref('Numbers', 13)], ['Commissioned to lead', 'Joshua is charged with leading Israel.', ref('Joshua', 1)], ['Crossing the Jordan', 'Israel crosses into the land.', ref('Joshua', 3)], ['Renewing the covenant', 'Joshua calls Israel to serve the Lord.', ref('Joshua', 24)]] }),
  build({ id: 'Ruth_1', name: 'Ruth', slug: 'ruth', t: 'Old Testament', cats: ['Women'], subtitle: 'A Moabite woman of loyalty',
    desc: "Remained with Naomi and became part of David's family line.", key: ref('Ruth', 1, 16, 17),
    bio: "The book of Ruth tells of a Moabite widow who commits herself to Naomi and to Israel's God, and later marries Boaz, who acts as her kinsman-redeemer.",
    tl: [['Stays with Naomi', 'Ruth chooses to go with Naomi to Bethlehem.', ref('Ruth', 1)], ["Gleans in Boaz's field", 'Ruth gathers grain and meets Boaz.', ref('Ruth', 2)], ['Redemption', 'Boaz acts as kinsman-redeemer.', ref('Ruth', 4, 1, 13)], ['A place in the line of David', "Ruth's descendants include David.", ref('Ruth', 4, 17, 22)]] }),
  { ...build({ id: 'David_1', name: 'David', slug: 'david', t: 'Old Testament', cats: ['Kings'], subtitle: 'King of Israel · Psalmist',
    desc: "Shepherd who became Israel's greatest king, known for faith and serious failure.", key: ref('Psalm', 23),
    bio: "David's life is told mainly in 1 Samuel 16 through 1 Kings 2, and many psalms are attributed to him.",
    tl: [['Anointed by Samuel', 'Samuel anoints David among his brothers.', ref('1 Samuel', 16)], ['Fought Goliath', 'David faces the Philistine champion.', ref('1 Samuel', 17)], ['Served under Saul', "David enters Saul's service and rises in success and in Saul's jealousy.", ref('1 Samuel', 18, 1, 30)], ['Became king', 'David is anointed king over Israel.', ref('2 Samuel', 5, 1, 5)], ['Captured Jerusalem', 'David takes Jerusalem.', ref('2 Samuel', 5, 6, 10)], ['Personal failure', "David's sin involving Bathsheba and Uriah; Nathan confronts him in chapter 12.", ref('2 Samuel', 11)], ['Family conflict', "Absalom's rebellion.", ref('2 Samuel', 15)], ['Final years', 'David charges Solomon before his death.', ref('1 Kings', 2, 1, 4)]] }),
    relationships: [
      { id: 'david-saul', relatedName: 'Saul', relationshipType: 'King he served', description: 'David served in Saul’s court and later fled from him.', scriptureReferences: [ref('1 Samuel', 18, 1, 30), ref('1 Samuel', 19)] },
      { id: 'david-jonathan', relatedName: 'Jonathan', relationshipType: 'Close friend', description: 'Saul’s son Jonathan formed a covenant of friendship with David.', scriptureReferences: [ref('1 Samuel', 18, 1, 4)] },
      { id: 'david-solomon', relatedName: 'Solomon', relationshipType: 'Son and successor', description: 'Solomon succeeded David as king.', scriptureReferences: [ref('1 Kings', 1)] },
    ] },
  build({ id: 'Hadassah_1', name: 'Esther', slug: 'esther', alt: ['Hadassah'], t: 'Old Testament', cats: ['Women'], subtitle: 'Queen of Persia',
    desc: 'A Jewish queen who acted to save her people from destruction.', key: ref('Esther', 4, 14),
    bio: "Esther's story is told in the book of Esther, set in the Persian empire.",
    tl: [['Chosen as queen', 'Esther becomes queen.', ref('Esther', 2)], ["Haman's plot", 'A decree threatens the Jews.', ref('Esther', 3)], ['Approaches the king', 'Esther risks going to the king.', ref('Esther', 5, 1, 8)], ['Deliverance', 'The plot is reversed.', ref('Esther', 8)]] }),
  build({ id: 'Daniel_2', name: 'Daniel', slug: 'daniel', alt: ['Belteshazzar'], t: 'Old Testament', cats: ['Prophets'], subtitle: 'Exile in Babylon',
    desc: 'A faithful exile who served in Babylon and received visions.', key: ref('Daniel', 6),
    bio: 'Daniel was taken to Babylon and served in the royal courts while remaining faithful to God.',
    tl: [['Taken into exile', 'Daniel is taken to Babylon.', ref('Daniel', 1)], ['Interprets a dream', "Daniel explains Nebuchadnezzar's dream.", ref('Daniel', 2)], ["The lions' den", 'Daniel is delivered.', ref('Daniel', 6)], ['Receives visions', 'Daniel receives visions concerning kingdoms and events to come.', ref('Daniel', 7)]] }),
  build({ id: 'Simon_1', name: 'Peter', slug: 'peter', alt: ['Simon', 'Cephas'], t: 'New Testament', cats: ['Apostles', 'Disciples'], subtitle: 'Fisherman turned apostle',
    desc: 'One of Jesus’ closest disciples, a leader of the early church.', key: ref('Matthew', 16, 13, 20),
    bio: 'Peter appears throughout the Gospels and the early chapters of Acts.',
    tl: [['Called by Jesus', 'Simon is called to follow Jesus.', ref('Matthew', 4, 18, 20)], ['Confesses Jesus as Christ', "Peter's confession at Caesarea Philippi.", ref('Matthew', 16, 13, 20)], ['Denies Jesus', 'Peter denies knowing Jesus.', ref('Luke', 22, 54, 62)], ['Recommissioned', 'Jesus asks Peter three times about his love and calls him to follow.', ref('John', 21, 15, 19)], ['Preaches at Pentecost', 'Peter addresses the crowd.', ref('Acts', 2)]] }),
  build({ id: 'Saul_2', name: 'Paul', slug: 'paul', alt: ['Saul of Tarsus'], t: 'New Testament', cats: ['Apostles'], subtitle: 'Apostle to the Gentiles',
    desc: 'Former persecutor of the church who became a missionary and writer of letters.', key: ref('Acts', 9),
    bio: "Paul's story is told in Acts, and his letters make up much of the New Testament.",
    tl: [['Persecutes the church', "Saul approves of Stephen's death.", ref('Acts', 8, 1, 3)], ['Encounter on the Damascus road', 'Saul meets the risen Jesus.', ref('Acts', 9, 1, 19)], ['First missionary journey', 'Paul and Barnabas are sent out.', ref('Acts', 13)], ['Arrives in Rome', "Paul's journey ends in Rome.", ref('Acts', 28, 16, 31)]] }),

  build({ id: 'Jacob_1', name: 'Jacob', slug: 'jacob', alt: ['Israel'], t: 'Old Testament', cats: ['Patriarchs'], subtitle: 'Son of Isaac · Father of the twelve sons of Israel',
    desc: 'Son of Isaac who was renamed Israel and became father of the family from which the tribes of Israel descended.', key: ref('Genesis', 32, 28),
    bio: 'Jacob was the second-born son of Isaac and Rebekah and the twin brother of Esau. Genesis traces his life from conflict within his family through his years with Laban, his return to Canaan, and his later move to Egypt.',
    tl: [['Birth of Jacob and Esau', 'Jacob is born after his twin brother Esau.', ref('Genesis', 25, 19, 26)], ['Receives Isaac’s blessing', 'Jacob receives the blessing Isaac intended to give Esau.', ref('Genesis', 27)], ['Dream at Bethel', 'Jacob dreams of a stairway reaching toward heaven and receives covenant promises.', ref('Genesis', 28, 10, 22)], ['Family grows in Paddan-aram', 'Jacob marries and his household grows during his years with Laban.', ref('Genesis', 29)], ['Returns toward Canaan', 'Jacob leaves Laban and begins the journey back toward his homeland.', ref('Genesis', 31)], ['Renamed Israel', 'After wrestling through the night, Jacob is given the name Israel.', ref('Genesis', 32, 22, 32)], ['Reconciled with Esau', 'Jacob and Esau meet again after years of separation.', ref('Genesis', 33)], ['Moves to Egypt', 'Jacob travels to Egypt after learning that Joseph is alive.', ref('Genesis', 46)], ['Blesses his sons', 'Jacob speaks concerning his sons before his death.', ref('Genesis', 49)]] }),

  build({ id: 'Saul_1', name: 'Saul', slug: 'saul-1', t: 'Old Testament', cats: ['Kings'], subtitle: 'First king of Israel · Son of Kish',
    desc: 'Son of Kish from Benjamin who became Israel’s first king.', key: ref('1 Samuel', 10, 1),
    bio: 'Saul, son of Kish of Benjamin, was chosen and anointed as Israel’s first king. His reign is narrated primarily in 1 Samuel 9–31.',
    tl: [['Meets Samuel', 'Saul encounters Samuel while searching for his father’s donkeys.', ref('1 Samuel', 9)], ['Anointed by Samuel', 'Samuel anoints Saul and tells him that he will rule Israel.', ref('1 Samuel', 10, 1)], ['Confirmed as king', 'Saul is publicly presented and later confirmed as king.', ref('1 Samuel', 10, 17, 24)], ['Rescues Jabesh-gilead', 'Saul leads Israel against the Ammonites.', ref('1 Samuel', 11)], ['Rebuked after sacrifice', 'Samuel confronts Saul after Saul offers the burnt offering.', ref('1 Samuel', 13, 8, 14)], ['Rejected after Amalek', 'Samuel tells Saul that the Lord has rejected him as king after his disobedience concerning Amalek.', ref('1 Samuel', 15)], ['Conflict with David', 'Saul becomes hostile toward David as David rises in prominence.', ref('1 Samuel', 18)], ['Dies at Mount Gilboa', 'Saul dies during Israel’s battle with the Philistines.', ref('1 Samuel', 31)]] }),

  build({ id: 'Aaron_1', name: 'Aaron', slug: 'aaron', t: 'Old Testament', cats: ['Leaders'], subtitle: 'Brother of Moses · High priest of Israel',
    desc: 'Brother of Moses who served as spokesman and was appointed to Israel’s priesthood.', key: ref('Exodus', 28, 1),
    bio: 'Aaron was the brother of Moses from the tribe of Levi. He accompanied Moses before Pharaoh and was appointed with his sons to the priesthood.',
    tl: [['Called to meet Moses', 'The Lord directs Aaron to meet Moses in the wilderness.', ref('Exodus', 4, 27, 31)], ['Speaks before Pharaoh', 'Aaron accompanies Moses in confronting Pharaoh.', ref('Exodus', 5, 1)], ['Appointed to the priesthood', 'Aaron and his sons are set apart for priestly service.', ref('Exodus', 28, 1)], ['Golden calf', 'Aaron makes the golden calf while Moses is on the mountain.', ref('Exodus', 32, 1, 6)], ['Priestly ministry begins', 'Aaron begins his priestly ministry after consecration.', ref('Leviticus', 9)], ['Miriam and Aaron speak against Moses', 'Aaron and Miriam speak against Moses.', ref('Numbers', 12)], ['Korah’s rebellion and Aaron’s intercession', 'Aaron ministers during the judgment that follows the rebellion.', ref('Numbers', 16, 41, 50)], ['Aaron’s staff buds', 'Aaron’s staff is used as a sign concerning the priesthood.', ref('Numbers', 17)], ['Death on Mount Hor', 'Aaron dies on Mount Hor and Eleazar succeeds him as priest.', ref('Numbers', 20, 22, 29)]] }),

  build({ id: 'Solomon_1', name: 'Solomon', slug: 'solomon', alt: ['Jedidiah'], t: 'Old Testament', cats: ['Kings'], subtitle: 'Son of David · King of Israel',
    desc: 'Son of David who became king of Israel, built the temple in Jerusalem, and was renowned for wisdom.', key: ref('1 Kings', 3, 5, 14),
    bio: 'Solomon was a son of David and Bathsheba who succeeded David as king. His reign included the building of the temple, international prominence, and later religious unfaithfulness.',
    tl: [['Born to David and Bathsheba', 'Solomon is born and is also called Jedidiah.', ref('2 Samuel', 12, 24, 25)], ['Established as king', 'Solomon is established on David’s throne.', ref('1 Kings', 2, 12)], ['Asks for wisdom', 'Solomon asks God for an understanding heart to govern.', ref('1 Kings', 3, 5, 14)], ['Builds the temple', 'Solomon begins and completes the temple in Jerusalem.', ref('1 Kings', 6)], ['Temple dedicated', 'Solomon dedicates the temple and prays before Israel.', ref('1 Kings', 8)], ['Queen of Sheba visits', 'The queen of Sheba comes to test Solomon with difficult questions.', ref('1 Kings', 10, 1, 13)], ['Turns after other gods', 'Solomon’s wives turn his heart toward other gods in his later years.', ref('1 Kings', 11, 1, 13)], ['Death of Solomon', 'Solomon dies after a forty-year reign.', ref('1 Kings', 11, 41, 43)]] }),

  build({ id: 'Nebuchadnezzar_1', name: 'Nebuchadnezzar', slug: 'nebuchadnezzar', t: 'Old Testament', cats: ['Kings'], subtitle: 'King of Babylon',
    desc: 'King of Babylon associated with the conquest of Judah and prominently featured in the book of Daniel.', key: ref('Daniel', 2, 1),
    bio: 'Nebuchadnezzar was king of Babylon during the period in which Judah and Jerusalem came under Babylonian domination. He appears prominently in Kings, Chronicles, Jeremiah, Ezekiel and Daniel.',
    tl: [['Campaigns against Jerusalem', 'Nebuchadnezzar comes against Jerusalem during the Babylonian domination of Judah.', ref('2 Kings', 24)], ['Jerusalem falls', 'Babylon captures Jerusalem and carries people into exile.', ref('2 Kings', 25, 1, 21)], ['Dream of the great image', 'Nebuchadnezzar dreams a troubling dream that Daniel interprets.', ref('Daniel', 2)], ['Golden image', 'Nebuchadnezzar commands worship of a golden image and orders three Jewish exiles into the furnace when they refuse.', ref('Daniel', 3)], ['Dream of the great tree', 'Daniel interprets Nebuchadnezzar’s dream concerning his humiliation.', ref('Daniel', 4, 1, 27)], ['Humbled and restored', 'Nebuchadnezzar is humbled and later acknowledges the King of heaven.', ref('Daniel', 4, 28, 37)]] }),

  build({ id: 'Judah_1', name: 'Judah', slug: 'judah-1', t: 'Old Testament', cats: ['Patriarchs'], subtitle: 'Fourth son of Jacob and Leah',
    desc: 'Fourth-born son of Jacob and Leah and ancestor of the tribe of Judah.', key: ref('Genesis', 29, 35),
    bio: 'Judah was the fourth son of Jacob and Leah. Genesis records his role in the Joseph narrative, his family through Tamar, and the blessing Jacob pronounced over him.',
    tl: [['Birth of Judah', 'Leah gives birth to Judah.', ref('Genesis', 29, 35)], ['Intervenes concerning Joseph', 'Judah proposes selling Joseph rather than killing him.', ref('Genesis', 37, 26, 27)], ['Judah and Tamar', 'Genesis records Judah’s family story involving Tamar.', ref('Genesis', 38)], ['Offers himself for Benjamin', 'Judah appeals to Joseph and offers himself in Benjamin’s place.', ref('Genesis', 44, 18, 34)], ['Sent ahead to Joseph', 'Jacob sends Judah ahead as the family moves toward Egypt.', ref('Genesis', 46, 28)], ['Receives Jacob’s blessing', 'Jacob speaks a prominent blessing concerning Judah.', ref('Genesis', 49, 8, 12)]] }),

  build({ id: 'Jeremiah_6', name: 'Jeremiah', slug: 'jeremiah-6', t: 'Old Testament', cats: ['Prophets'], subtitle: 'Prophet from Anathoth · Son of Hilkiah',
    desc: 'Prophet from Anathoth who proclaimed the word of the Lord during the final decades of the kingdom of Judah.', key: ref('Jeremiah', 1, 1, 10),
    bio: 'Jeremiah, son of Hilkiah from Anathoth, served as a prophet during the reigns surrounding Judah’s fall to Babylon. His ministry is recorded primarily in the book bearing his name.',
    tl: [['Called as a prophet', 'The word of the Lord comes to Jeremiah and commissions him for prophetic ministry.', ref('Jeremiah', 1, 1, 10)], ['Temple message', 'Jeremiah is commanded to proclaim a message at the gate of the Lord’s house.', ref('Jeremiah', 7, 1, 15)], ['Persecuted by Pashhur', 'Jeremiah is struck and put in stocks after prophesying.', ref('Jeremiah', 20, 1, 6)], ['Letter to the exiles', 'Jeremiah sends a letter to the exiles in Babylon.', ref('Jeremiah', 29, 1, 14)], ['Buys a field', 'During the siege, Jeremiah purchases a field as a sign connected with future restoration.', ref('Jeremiah', 32)], ['Imprisoned in a cistern', 'Officials cast Jeremiah into a cistern before he is rescued.', ref('Jeremiah', 38)], ['Jerusalem falls', 'Jeremiah remains amid the events surrounding Jerusalem’s capture.', ref('Jeremiah', 39)], ['Taken toward Egypt', 'Jeremiah is taken with the remnant as they go to Egypt.', ref('Jeremiah', 43, 1, 7)]] }),

  build({ id: 'Ahab_1', name: 'Ahab', slug: 'ahab', t: 'Old Testament', cats: ['Kings'], subtitle: 'Son of Omri · King of Israel',
    desc: 'King of Israel, husband of Jezebel, whose reign is closely connected with the ministry of Elijah.', key: ref('1 Kings', 16, 29, 33),
    bio: 'Ahab, son of Omri, ruled the northern kingdom of Israel. First Kings describes his idolatry, his encounters with Elijah, wars with Aram, the case of Naboth’s vineyard, and his death in battle.',
    tl: [['Becomes king', 'Ahab son of Omri begins his reign over Israel.', ref('1 Kings', 16, 29, 33)], ['Elijah announces drought', 'Elijah tells Ahab that there will be no dew or rain except by his word.', ref('1 Kings', 17, 1)], ['Confrontation at Mount Carmel', 'Ahab witnesses the confrontation involving Elijah and the prophets of Baal.', ref('1 Kings', 18)], ['Wars with Ben-hadad', 'Ahab fights the king of Aram and receives prophetic messages concerning the battles.', ref('1 Kings', 20)], ['Naboth’s vineyard', 'Ahab desires Naboth’s vineyard, and Elijah confronts him after Naboth is killed.', ref('1 Kings', 21)], ['Dies in battle', 'Ahab is wounded and dies during the battle at Ramoth-gilead.', ref('1 Kings', 22, 29, 40)]] }),

  build({ id: 'Joab_1', name: 'Joab', slug: 'joab', t: 'Old Testament', cats: ['Leaders'], subtitle: 'Son of Zeruiah · Commander of David’s army',
    desc: 'Son of Zeruiah who became commander of David’s army and played a major role throughout David’s reign.', key: ref('2 Samuel', 8, 16),
    bio: 'Joab, son of Zeruiah, was a military commander closely associated with David. His story includes military victories, political interventions, acts of violence, and his eventual death during Solomon’s accession.',
    tl: [['Conflict with Abner’s forces', 'Joab commands David’s servants during conflict with Abner’s men.', ref('2 Samuel', 2, 12, 32)], ['Kills Abner', 'Joab kills Abner after Abner has met with David.', ref('2 Samuel', 3, 22, 30)], ['Becomes commander', 'Joab leads the attack associated with the capture of Jerusalem.', ref('1 Chronicles', 11, 4, 6)], ['Arranges Uriah’s death', 'David sends instructions through Joab that lead to Uriah’s death in battle.', ref('2 Samuel', 11, 14, 25)], ['Helps bring Absalom back', 'Joab uses the woman of Tekoa as part of an effort concerning Absalom’s return.', ref('2 Samuel', 14)], ['Kills Absalom', 'Joab kills Absalom during the rebellion despite David’s command concerning him.', ref('2 Samuel', 18, 5, 15)], ['Kills Amasa', 'Joab kills Amasa and resumes pursuit during Sheba’s rebellion.', ref('2 Samuel', 20, 8, 13)], ['Supports Adonijah', 'Joab joins Adonijah’s attempt to become king.', ref('1 Kings', 1, 5, 7)], ['Death under Solomon', 'Joab is killed at Solomon’s command after seeking refuge at the altar.', ref('1 Kings', 2, 28, 34)]] }),

  build({ id: 'Samuel_2', name: 'Samuel', slug: 'samuel-2', t: 'Old Testament', cats: ['Prophets', 'Leaders'], subtitle: 'Prophet and judge of Israel · Son of Hannah',
    desc: 'Son of Hannah who served as prophet and judge and anointed Saul and David.', key: ref('1 Samuel', 3, 19, 21),
    bio: 'Samuel was the son of Hannah and Elkanah. Dedicated to the Lord from childhood, he became a prophet and judge during Israel’s transition to monarchy and anointed both Saul and David.',
    tl: [['Birth and dedication', 'Hannah gives birth to Samuel and later brings him to serve at the house of the Lord.', ref('1 Samuel', 1, 20, 28)], ['Called by the Lord', 'The Lord calls Samuel while he is serving under Eli.', ref('1 Samuel', 3)], ['Leads Israel at Mizpah', 'Samuel calls Israel to turn from foreign gods and leads them at Mizpah.', ref('1 Samuel', 7, 3, 13)], ['Israel asks for a king', 'The elders ask Samuel to appoint a king over them.', ref('1 Samuel', 8)], ['Anoints Saul', 'Samuel privately anoints Saul as ruler.', ref('1 Samuel', 10, 1)], ['Confronts Saul', 'Samuel announces the Lord’s rejection of Saul as king after the Amalek episode.', ref('1 Samuel', 15)], ['Anoints David', 'Samuel anoints David in the presence of his brothers.', ref('1 Samuel', 16, 1, 13)], ['Death of Samuel', 'Samuel dies and Israel gathers to mourn him.', ref('1 Samuel', 25, 1)]] }),

  build({ id: 'Hezekiah_1', name: 'Hezekiah', slug: 'hezekiah', t: 'Old Testament', cats: ['Kings'], subtitle: 'Son of Ahaz · King of Judah',
    desc: 'King of Judah remembered for trusting the Lord, religious reforms, and the Assyrian crisis during his reign.', key: ref('2 Kings', 18, 1, 7),
    bio: 'Hezekiah, son of Ahaz, ruled Judah. Kings and Chronicles record his reforms, his response to the Assyrian invasion, his illness and recovery, and the visit of Babylonian envoys.',
    tl: [['Becomes king and reforms worship', 'Hezekiah begins his reign and removes objects associated with idolatrous worship.', ref('2 Kings', 18, 1, 8)], ['Cleanses and reopens the temple', 'Hezekiah directs the cleansing and restoration of temple worship.', ref('2 Chronicles', 29)], ['Celebrates Passover', 'Hezekiah sends throughout Israel and Judah inviting people to celebrate Passover.', ref('2 Chronicles', 30)], ['Assyrian invasion', 'Sennacherib invades Judah and threatens Jerusalem.', ref('2 Kings', 18, 13, 37)], ['Hezekiah seeks the Lord', 'Hezekiah brings the Assyrian threat before the Lord and Isaiah delivers a message.', ref('2 Kings', 19)], ['Illness and recovery', 'Hezekiah becomes ill, prays, and receives additional years of life.', ref('2 Kings', 20, 1, 11)], ['Babylonian envoys', 'Hezekiah shows his treasures to envoys from Babylon and receives Isaiah’s warning.', ref('2 Kings', 20, 12, 19)], ['Death of Hezekiah', 'Hezekiah dies and Manasseh succeeds him.', ref('2 Kings', 20, 20, 21)]] }),

  build({ id: 'Isaac_1', name: 'Isaac', slug: 'isaac', t: 'Old Testament', cats: ['Patriarchs'], subtitle: 'Son of Abraham and Sarah',
    desc: 'Promised son of Abraham and Sarah, husband of Rebekah, and father of Esau and Jacob.', key: ref('Genesis', 21, 1, 5),
    bio: 'Isaac was the son promised to Abraham and Sarah. Genesis records his birth, the testing of Abraham involving him, his marriage to Rebekah, and his role as father of Esau and Jacob.',
    tl: [['Birth of Isaac', 'Sarah gives birth to Isaac in Abraham’s old age.', ref('Genesis', 21, 1, 7)], ['Abraham is tested', 'God tests Abraham concerning Isaac, and Isaac is spared.', ref('Genesis', 22, 1, 19)], ['Marries Rebekah', 'Rebekah becomes Isaac’s wife.', ref('Genesis', 24, 62, 67)], ['Esau and Jacob are born', 'Rebekah gives birth to the twins Esau and Jacob.', ref('Genesis', 25, 19, 26)], ['Lives in Gerar', 'Isaac lives in Gerar during famine and receives the Lord’s promise.', ref('Genesis', 26, 1, 14)], ['Disputes and wells', 'Isaac’s servants dig wells amid disputes with local herdsmen.', ref('Genesis', 26, 17, 33)], ['Blesses Jacob and Esau', 'Isaac gives the blessing to Jacob and later speaks to Esau.', ref('Genesis', 27)], ['Death of Isaac', 'Isaac dies and Esau and Jacob bury him.', ref('Genesis', 35, 27, 29)]] }),

]
