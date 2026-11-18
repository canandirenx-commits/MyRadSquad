// All mock content lives here. Edit text/names without touching the screens.
// Photos go in public/photos/ — a missing photo shows a gray placeholder.
// Icons come from Phosphor (phosphoricons.com) — swap any icon by changing its name.
import {
  Books, HandHeart, Camera, SoccerBall, Headphones, GameController,
  Dress, FilmSlate, Smiley, ForkKnife,
  Lightning, PaintBrush, Hamburger, PawPrint, BookOpen, PersonSimpleTaiChi, Television, Flask, Mountains, Aperture, Code, MaskHappy,
} from '@phosphor-icons/react'

// The prototype user — the one who joins, starts the trial and turns Spark on
export const me = { name: 'Alex', initials: 'AL', color: '#a78bfa', photo: null }

export const squad = {
  name: 'Lunch Table',
  icon: ForkKnife,
  invitedBy: 'Maya',
  // What's already in the chat — shown locked on the invite screen until the user joins
  stats: { messages: 1837, voice: 12, photos: 12 },
  members: [
    { name: 'Maya', initials: 'MA', color: '#f472b6', photo: '/photos/maya.jpg' },
    { name: 'Jordan', initials: 'JO', color: '#60a5fa', photo: '/photos/jordan.jpg' },
    { name: 'Zoe', initials: 'ZO', color: '#fbbf24', photo: '/photos/zoe.jpg' },
    { name: 'Leo', initials: 'LE', color: '#34d399', photo: '/photos/leo.jpg' },
  ],
}

export const moments = [
  { by: 'Maya', photo: '/photos/moment-lunch.jpg', time: '2m' },
  { by: 'Jordan', photo: '/photos/moment-sports.jpg', time: '14m' },
  { by: 'Zoe', photo: '/photos/moment-study.jpg', time: '1h' },
  { by: 'Leo', photo: '/photos/moment-sunset.jpg', time: '3h' },
]

// ---- Plans (from the brief) ----
export const limits = { free: 5, plus: 12 }

export const plans = {
  // note = gray comparison line under the plan name (the billed price stays the biggest number)
  yearly: { id: 'yearly', label: 'Yearly', price: '$29.99', per: 'year', note: 'Just $0.58/week', badge: 'Save 86%' },
  weekly: { id: 'weekly', label: 'Weekly', price: '$3.99', per: 'week', note: '$207.48 per year', badge: null },
}
export const trialDays = 3

// ---- Home ----
// Who's around right now — makes the squad feel alive at a glance.
// place = a rough spot the friend chose to share with this squad only (never an address or a map pin)
export const presence = [
  { name: 'Jordan', status: 'In a voice room', live: true, place: 'At home', updated: 'now' },
  { name: 'Zoe', status: 'Active 2m ago', live: false, place: 'At the library', updated: '2m ago' },
  { name: 'Maya', status: 'Typing…', live: true, place: 'At school', updated: 'now' },
  { name: 'Leo', status: 'Active 1h ago', live: false, place: 'At practice', updated: '1h ago' },
]

// Squads on Home. The card picks its look from the content (see SquadCard):
// 2+ photos → story row · 1 photo → big photo · no photos → last 3 messages
export const homeSquads = [
  {
    ...squad,
    unread: 6,
    photos: moments,
    messages: [
      { by: 'Maya', text: 'bio test tmrw 💀 who’s ready' },
      { by: 'Jordan', text: 'not me' },
      { by: 'Zoe', text: 'study call at 8?' },
    ],
    spark: { answered: 3 },
  },
]

// Home for a regular user weeks later (decision #101): several squads, Spark already on in the busiest one.
// Open with ?screen=home&plan=trial&intent=regular, or "Regular user" in the reviewer drawer
export const regularSquads = [
  { ...homeSquads[0], unread: 12, stats: { messages: 4206, voice: 38, photos: 64 }, sparkOn: true },
  { ...squad, name: 'Study Crew', icon: Books, unread: 3, stats: { messages: 912, voice: 7, photos: 15 },
    photos: [moments[2], { by: 'Zoe', photo: '/photos/intro/sleepover.jpg' }, { by: 'Leo', photo: '/photos/intro/pizza.jpg' }],
    messages: [{ by: 'Zoe', text: 'notes for the bio test are in the doc' }] },
  { ...squad, name: 'Soccer Squad', icon: SoccerBall, unread: 0, stats: { messages: 534, voice: 21, photos: 9 },
    photos: [moments[1], { by: 'Leo', photo: '/photos/intro/skate.jpg' }, { by: 'Jordan', photo: '/photos/intro/sunset.jpg' }],
    messages: [{ by: 'Leo', text: 'practice moved to 5' }] },
  { ...squad, name: 'Movie Night', icon: FilmSlate, unread: 1, stats: { messages: 287, voice: 4, photos: 6 },
    photos: [{ by: 'Maya', photo: '/photos/intro/concert.jpg' }, { by: 'Zoe', photo: '/photos/intro/mural.jpg' }],
    messages: [{ by: 'Maya', text: 'friday? I vote horror' }] },
]

// ---- Topics: every purpose and interest, with its icon ----
export const topics = {
  study:   { label: 'Study',   icon: Books },
  close:   { label: 'Squad',   icon: HandHeart },
  moments: { label: 'Moments', icon: Camera },
  sports:  { label: 'Sports',  icon: SoccerBall },
  music:   { label: 'Music',   icon: Headphones },
  gaming:  { label: 'Gaming',  icon: GameController },
  fashion: { label: 'Fashion', icon: Dress },
  movies:  { label: 'Movies',  icon: FilmSlate },
  memes:   { label: 'Memes',   icon: Smiley },
  anime:    { label: 'Anime',       icon: Lightning },
  tv:       { label: 'TV shows',    icon: Television },
  food:     { label: 'Food',        icon: Hamburger },
  pets:     { label: 'Pets',        icon: PawPrint },
  art:      { label: 'Art',         icon: PaintBrush },
  photo:    { label: 'Photos',      icon: Aperture },
  dance:    { label: 'Dance',       icon: PersonSimpleTaiChi },
  books:    { label: 'Books',       icon: BookOpen },
  outdoors: { label: 'Outdoors',    icon: Mountains },
  science:  { label: 'Science',     icon: Flask },
  coding:   { label: 'Coding',      icon: Code },
  theater:  { label: 'Theater',     icon: MaskHappy },
}

// ---- "Why are you here?" options (decision #15) ----
export const purposes = [
  { id: 'study', label: 'Study together' },
  { id: 'close', label: 'Stay close' },
  { id: 'moments', label: 'Share moments' },
].map((p) => ({ ...p, icon: topics[p.id].icon }))

// The most picked first, then the rest (decision #78). Each one has a canned Spark below
export const interests = [
  'sports', 'music', 'gaming', 'anime', 'movies', 'tv', 'memes', 'food', 'pets',
  'fashion', 'art', 'photo', 'dance', 'books', 'outdoors', 'science', 'coding', 'theater',
].map((id) => ({ id, ...topics[id] }))

// ---- Canned Spark content, one per topic (no real AI) ----
export const sparks = {
  study:   { topic: 'study',   type: 'quiz',   question: 'Bio quiz: what does the mitochondria make?', options: ['ATP', 'DNA', 'Glucose', 'Vibes'] },
  close:   { topic: 'close',   type: 'poll',   question: 'Squad hangout this weekend: where to?', options: ['Movie night', 'Mall', 'Park', 'Gaming call'] },
  moments: { topic: 'moments', type: 'prompt', question: 'Show the squad what your view looks like right now', options: ['Snap it'] },
  sports:  { topic: 'sports',  type: 'poll',   question: 'Squad pickup game this weekend: what are we playing?', options: ['Soccer', 'Basketball', 'Volleyball', 'Frisbee'] },
  music:   { topic: 'music',   type: 'poll',   question: "What's the squad's song of the week?", options: ['Pop', 'Hip-hop', 'Indie', 'K-pop'] },
  gaming:  { topic: 'gaming',  type: 'poll',   question: 'Squad game night: what are we playing?', options: ['Minecraft', 'Fortnite', 'Among Us', 'Mario Kart'] },
  // Rule: Spark never rates how anyone looks — vote on options, not people
  fashion: { topic: 'fashion', type: 'poll',   question: 'Friday fit theme for the squad?', options: ['Y2K', 'Sporty', 'All black', 'Pajamas'] },
  movies:  { topic: 'movies',  type: 'quiz',   question: 'Finish the line: "I\'ll be…"', options: ['back', 'there', 'fine', 'late'] },
  memes:   { topic: 'memes',   type: 'prompt', question: 'Caption this: Jordan at 7:59 for an 8:00 class', options: ['Write a caption'] },
  anime:    { topic: 'anime',    type: 'poll',   question: 'Squad watch party: which anime next?', options: ['One Piece', 'Jujutsu Kaisen', 'Demon Slayer', 'Spy x Family'] },
  tv:       { topic: 'tv',       type: 'quiz',   question: 'Which show has the most episodes ever?', options: ['The Simpsons', 'SpongeBob', 'Friends', 'Pokémon'] },
  food:     { topic: 'food',     type: 'poll',   question: 'Late-night snack, squad vote:', options: ['Pizza', 'Ramen', 'Tacos', 'Ice cream'] },
  pets:     { topic: 'pets',     type: 'prompt', question: 'Show the squad your pet (or your neighbor’s)', options: ['Snap it'] },
  art:      { topic: 'art',      type: 'prompt', question: 'Draw the squad’s mascot in 60 seconds. Go!', options: ['Snap your drawing'] },
  photo:    { topic: 'photo',    type: 'prompt', question: 'Photo dare: find something shaped like a heart', options: ['Snap it'] },
  dance:    { topic: 'dance',    type: 'prompt', question: 'Teach the squad one dance move in 10 seconds', options: ['Record a video'] },
  books:    { topic: 'books',    type: 'poll',   question: 'Next squad read?', options: ['Fantasy', 'Mystery', 'Romance', 'Manga'] },
  outdoors: { topic: 'outdoors', type: 'poll',   question: 'Weekend outside: where to?', options: ['Hike', 'Beach', 'Park', 'Bike ride'] },
  science:  { topic: 'science',  type: 'quiz',   question: 'Which planet is the hottest?', options: ['Venus', 'Mercury', 'Mars', 'Jupiter'] },
  coding:   { topic: 'coding',   type: 'quiz',   question: 'Which one is a programming language?', options: ['Python', 'Cobra', 'Viper', 'Anaconda'] },
  theater:  { topic: 'theater',  type: 'prompt', question: 'Say “I’m fine” in the most dramatic voice you’ve got', options: ['Record a voice note'] },
}

// The first Spark a new member sees: their first interest, else their first purpose
export function sparkFor(profile) {
  const key = profile.interests[0] ?? profile.purposes[0] ?? 'close'
  return sparks[key]
}

// ---- Spark: settings, transparency, manual sending ----
export const quietOptions = ['2h', '4h', '8h']

// How often Spark posts on its own — the activator decides (decision #42).
// "When I ask" = no automatic Sparks; only the ones you send with ✦
export const frequencyOptions = ['Once a day', 'Twice a day', 'When I ask']

// One line describing the current rhythm, e.g. "After 4h of quiet · once a day"
export function sparkRhythm(quiet, frequency) {
  if (frequency === 'When I ask') return 'Only when someone asks for one'
  return `After ${quiet} of quiet · ${frequency.toLowerCase()}`
}

// "What Spark can see" — the element that prevents creepy (decision #32)
export const sparkRules = {
  sees: ['The topics your squad is into', 'First names in Lunch Table'],
  never: ['Your messages, photos or videos', 'Your DMs or anything outside the squad', "How anyone looks — it never rates people"],
}

export const sparkTypes = [
  { id: 'quiz', label: 'Quiz' },
  { id: 'poll', label: 'Poll' },
  { id: 'game', label: 'Game' },
  { id: 'prompt', label: 'Prompt' },
  { id: 'video', label: 'Video idea' },
]

// Canned "AI" output for manual Sparks: a few per topic, picked by type
export const sparkPool = {
  study: [
    { type: 'quiz', question: 'Bio quiz: what does the mitochondria make?', options: ['ATP', 'DNA', 'Glucose', 'Vibes'] },
    { type: 'quiz', question: 'Quick one: what does DNA stand for?', options: ['Deoxyribonucleic acid', 'Dynamic nuclear atom', 'Double nitrogen acid'] },
    { type: 'poll', question: 'Study call tonight — what time?', options: ['7 PM', '8 PM', '9 PM', 'Tomorrow'] },
    { type: 'game', question: 'Speed round: name 3 organelles in 10 seconds. Go!', options: ['I’m in'] },
    { type: 'prompt', question: 'Drop the one thing you still don’t get for tomorrow’s test', options: ['Reply'] },
    { type: 'video', question: 'Watch together: a 3-min “cell parts” explainer, then react', options: ['Watch now', 'Later'] },
  ],
  sports: [
    { type: 'poll', question: 'Squad pickup game this weekend: what are we playing?', options: ['Soccer', 'Basketball', 'Volleyball', 'Frisbee'] },
    { type: 'quiz', question: 'How many players are on a soccer team on the field?', options: ['9', '10', '11', '12'] },
    { type: 'game', question: 'Guess the score of tonight’s game — closest wins bragging rights', options: ['Make a guess'] },
    { type: 'prompt', question: 'Show your sneakers right now. No cleaning first.', options: ['Snap it'] },
    { type: 'video', question: 'Watch together: top 10 goals this week, then vote the best', options: ['Watch now', 'Later'] },
  ],
}

// Pick a manual Spark for a type + topic. `n` = how many times Shuffle was pressed
export function makeSpark(type, topic, n = 0) {
  const pool = sparkPool[topic] ?? [{ ...sparks[topic] }]
  const matches = pool.filter((s) => s.type === type)
  const list = matches.length ? matches : pool
  return { topic, ...list[n % list.length] }
}

// Samples on the "What's Spark?" sheet: three different kinds of Spark
// (the middle one is replaced by a Spark made from the user's own interests)
export const sparkSamples = [
  { topic: 'close', type: 'prompt', question: "What's one thing that made you laugh today?", options: [], footer: 'No right answer. Just reply in the chat' },
  { ...sparks.sports, footer: 'Answers stay hidden until you vote' },
  {
    topic: 'movies', type: 'game', question: 'Squad movie trivia · round 3 of 5', options: [],
    scores: [
      { name: 'Maya', points: 120 },
      { name: 'Zoe', points: 90 },
      { name: 'You', points: 60 },
      { name: 'Leo', points: 40 },
    ],
    footer: 'Next round drops in 1h',
  },
]

// ---- Squad chat ----
export const chat = [
  { kind: 'text', by: 'Maya', text: 'bio test tmrw 💀 who’s ready' },
  { kind: 'photo', by: 'Jordan', photo: '/photos/moment-sports.jpg', reactions: { fire: 2, laugh: 1 } },
  { kind: 'video', by: 'Zoe', photo: '/photos/moment-study.jpg', duration: '0:12' },
  { kind: 'text', by: 'Leo', text: 'study call at 8?' },
  { kind: 'voice', by: 'Leo', seconds: 14 },
  { kind: 'text', by: 'Maya', text: 'yesss' },
]

// The automatic Spark Jordan sees after the squad went quiet (shared interest first, #16)
export const autoSpark = {
  ...sparks.sports,
  voters: ['Maya', 'Zoe', 'Leo'],
  results: { Soccer: 1, Basketball: 2, Volleyball: 0, Frisbee: 0 },
}
// What Swap replaces it with
export const swapSpark = {
  ...sparks.music,
  voters: ['Maya'],
  results: { Pop: 1, 'Hip-hop': 0, Indie: 0, 'K-pop': 0 },
}

// Example used on the style-check screen
export const sampleSpark = sparks.sports
