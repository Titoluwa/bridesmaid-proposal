/**
 * Central configuration for the bridal party.
 *
 * Every personalised piece of the experience — names, roles, letters,
 * proposal lines and colours — lives here, so the page components stay
 * fully reusable. To add or edit a bridesmaid, edit this file only.
 *
 * Letter copy supports a tiny bit of inline formatting:
 *   **bold**   → emphasised (serif, darker)
 *   *italic*   → italic
 */

export type BridesmaidColor = {
  name: string
  hex: string
  /** Heart / emoji shown on the reveal ("This one is yours. 💜") */
  emoji: string
}

export type BridesmaidType = 'chief' | 'bridesmaid'

export type Bridesmaid = {
  slug: string
  name: string
  shortName: string
  /** e.g. "My Encourager" */
  role: string
  /** Short label for compact places such as the admin table, e.g. "Encourager" */
  roleShort: string
  weddingRole: 'Chief Bridesmaid' | 'Bridesmaid'
  type: BridesmaidType
  /** Whether this person takes part in the random pastel colour reveal */
  randomColor: boolean
  /** Fixed colours (only for people who do NOT get a random colour) */
  colors?: BridesmaidColor[]
  /** Short, second-person description shown on the role reveal */
  message: string
  /** Opening line of the letter, e.g. "My Priscilla," */
  salutation: string
  /** Body paragraphs of the personal letter */
  letter: string[]
  /** The line that leads into the question, e.g. "So, my encourager..." */
  leadIn: string
  /** A small note shown under the big question */
  postscript: string
}

/* -------------------------------------------------------------------------- */
/*                                   Colours                                  */
/* -------------------------------------------------------------------------- */

export const bridesmaidColors: BridesmaidColor[] = [
  { name: 'Pastel Pink', hex: '#F6C6D6', emoji: '💗' },
  { name: 'Pastel Peach', hex: '#F8D1B8', emoji: '🧡' },
  { name: 'Pastel Yellow', hex: '#F7E6A8', emoji: '💛' },
  { name: 'Pastel Green', hex: '#C9DEC3', emoji: '💚' },
  { name: 'Pastel Blue', hex: '#C4DDF2', emoji: '💙' },
  { name: 'Pastel Purple', hex: '#D8C7ED', emoji: '💜' },
  { name: 'Pastel Coral', hex: '#F2B8B5', emoji: '❤️' },
]

export const chiefColors: BridesmaidColor[] = [
  { name: 'Champagne Gold', hex: '#D9BF8C', emoji: '🤍' },
  { name: 'Wine', hex: '#6D2335', emoji: '🍷' },
]

/** Default accent used before a colour has been revealed */
export const defaultAccent = '#E7D3A8'

export function findColor(name?: string | null) {
  if (!name) return undefined
  return bridesmaidColors.find((color) => color.name === name)
}

/* -------------------------------------------------------------------------- */
/*                               The bridal party                             */
/* -------------------------------------------------------------------------- */

export const bridesmaids = {
  mojoyinola: {
    slug: 'mojoyinola',
    name: 'Mojoyinola Balogun',
    shortName: 'Mojoyinola',
    role: 'My Anchor',
    roleShort: 'Anchor',
    weddingRole: 'Chief Bridesmaid',
    type: 'chief',
    randomColor: false,
    colors: chiefColors,
    message:
      'My everything. The one I rely on so deeply, and the one I truly cannot imagine doing any of this without.',
    salutation: 'My Mojoyinola,',
    letter: [
      'I honestly don\u2019t know how to put into words what you mean to me, because \u201cfriend\u201d doesn\u2019t quite cover it.',
      'You have been so much more than a friend to me. You have been my person, my safe place, my sounding board, my reality check, my biggest support, and most importantly, **my anchor.**',
      'There are so many moments in my life where I look back and realize that you were there. Sometimes you held my hand, sometimes you held me accountable, sometimes you simply listened, and sometimes you were just there without me even having to ask.',
      'You have seen different versions of me, and somehow, you\u2019ve loved me through all of them.',
      'Now I\u2019m entering one of the biggest and most beautiful chapters of my life, and when I imagined the people I wanted beside me, you weren\u2019t a question. **You were a certainty.**',
      'I don\u2019t just want you beside me on the wedding day. I want you in the madness before it, the happy tears, the last-minute decisions, the laughter, the \u201care we actually doing this?!\u201d moments, and every memory that comes with this season.',
    ],
    leadIn: 'So, my anchor, my person, my everything...',
    postscript: 'I genuinely cannot imagine doing this without you. 🤍',
  },

  priscilla: {
    slug: 'priscilla',
    name: 'Onifade Priscilla',
    shortName: 'Priscilla',
    role: 'My Encourager',
    roleShort: 'Encourager',
    weddingRole: 'Bridesmaid',
    type: 'bridesmaid',
    randomColor: true,
    message:
      'The one who pushes me forward, believes in me, and reminds me that I can \u2014 especially when I doubt myself.',
    salutation: 'My Priscilla,',
    letter: [
      'One thing I will always be grateful for is the way you believe in me.',
      'You have this beautiful way of reminding me that I am capable, even when I\u2019m busy convincing myself otherwise. You encourage me, motivate me, push me, and somehow always know when I need that little extra reminder that *I can actually do this.*',
      'You\u2019ve celebrated my wins, encouraged me through my struggles, and reminded me to keep going when things felt difficult.',
      'As I step into this new chapter of my life, I know there will be moments when I need encouragement, laughter, perspective, and probably someone telling me, \u201cGirl, you\u2019ve got this.\u201d',
      'And I know exactly who I want that person to be.',
    ],
    leadIn: 'So, my encourager...',
    postscript: 'I would love to have you cheering me on as I walk into this beautiful new chapter. 🤍',
  },

  yewande: {
    slug: 'yewande',
    name: 'Zekinat Yewande',
    shortName: 'Yewande',
    role: 'My Emotional Outlet',
    roleShort: 'Emotional Outlet',
    weddingRole: 'Bridesmaid',
    type: 'bridesmaid',
    randomColor: true,
    message:
      'My safe place to vent, laugh, cry, overthink, and simply be myself \u2014 no editing required.',
    salutation: 'My Yewande,',
    letter: [
      'You are one of those people I don\u2019t have to explain myself to.',
      '**With you, I can feel everything.**',
      'I can be happy, overwhelmed, dramatic, emotional, confused, excited, annoyed, or completely unserious, and somehow there is always room for all of it.',
      'Thank you for being a safe place for me to let things out. Thank you for listening to my rants, my stories, my overthinking, my excitement, and everything in between.',
      'You have given me the kind of friendship where I can simply show up as myself, without having to edit how I feel.',
      'And honestly, every bride needs someone she can call and say, \u201cPlease, let me tell you what just happened!\u201d 😂',
      'As I get ready for one of the biggest days of my life, I want my emotional outlet, my listener, my gist partner, and my safe place right there with me.',
    ],
    leadIn: 'So, Yewande...',
    postscript: 'I promise there will be plenty of emotions for you to help me process. 😂🤍',
  },

  shalom: {
    slug: 'shalom',
    name: 'Shalom Komolafe',
    shortName: 'Shalom',
    role: 'My Vibes & Life of the Party',
    roleShort: 'Life of the Party',
    weddingRole: 'Bridesmaid',
    type: 'bridesmaid',
    randomColor: true,
    message:
      'You bring the energy, the laughter, and the good vibes. Everything is a little more alive when you\u2019re in the room.',
    salutation: 'My Shalom,',
    letter: [
      'Let\u2019s be honest...',
      'What is a wedding without vibes?',
      'And what are my vibes without you? 😂',
      'You have this incredible ability to bring energy into a room. You make things lighter, funnier, louder, and infinitely more memorable.',
      'You are the person who can turn a normal moment into a whole experience. Somehow, wherever you are, there is always a story, a laugh, a dance, or something completely unserious happening.',
      'And I absolutely love that about you.',
      'As beautiful and emotional as my wedding day will be, I also want it to be **FUN.** I want laughter, dancing, memories, ridiculous pictures, random videos, and moments that we\u2019ll still be talking about years from now.',
      'So obviously, I need my life-of-the-party right beside me.',
    ],
    leadIn: 'Shalom, my vibes coordinator in spirit...',
    postscript:
      'Your assignment is simple: bring the vibes and make sure nobody is sitting down when they should be dancing. 😂💃🏽🤍',
  },

  olusola: {
    slug: 'olusola',
    name: 'Mojoyinola Olusola-Dada',
    shortName: 'Olusola',
    role: 'My Unhinged Content Creator',
    roleShort: 'Content Creator',
    weddingRole: 'Bridesmaid',
    type: 'bridesmaid',
    randomColor: true,
    message:
      'You turn ordinary moments into memories (and content). Humour and personality in absolutely everything.',
    salutation: 'My Olusola,',
    letter: [
      'There are people who take pictures...',
      'And then there is **you.** 😂',
      'You have a special talent for turning completely normal moments into content, chaos, comedy, and memories all at once.',
      'I already know that if something funny happens at my wedding, somehow you\u2019ll have the footage.',
      'If I\u2019m looking amazing, you\u2019ll capture it.',
      'If I\u2019m doing something ridiculous, you\u2019ll capture that too.',
      'And if there is an opportunity to make an already chaotic situation even more unhinged... I trust you completely. 😂',
      'But beyond the content and the madness, I love that you bring so much personality and fun into my life.',
      'I know you\u2019re going to make this season even more memorable, and honestly, I need someone who understands the assignment *and* is willing to document the evidence.',
    ],
    leadIn: 'So, my unhinged content creator...',
    postscript:
      'Your official responsibilities include: capturing the moments, creating the content, hyping me up, and absolutely no deleting the embarrassing footage. 😂📸🤍',
  },

  blessing: {
    slug: 'blessing',
    name: 'Blessing Akanmu',
    shortName: 'Blessing',
    role: 'My Observer & Gister',
    roleShort: 'Observer & Gister',
    weddingRole: 'Bridesmaid',
    type: 'bridesmaid',
    randomColor: true,
    message:
      'You notice everything, catch every little detail, and somehow always, always have the gist.',
    salutation: 'My Blessing,',
    letter: [
      'You know what I find so funny about you?',
      '**You notice EVERYTHING.** 😂',
      'Nothing gets past you.',
      'You can be sitting quietly somewhere and somehow you\u2019ve already observed the entire situation, identified the characters, understood the dynamics, and \u2014 most importantly \u2014 you have the gist.',
      'And somehow, your commentary always makes everything ten times more entertaining.',
      'But beyond the gist and the observations, I love having you around because you bring such a unique perspective to things. You notice the little details, you see things from angles other people might miss, and you always seem to have something to say about it.',
      'As I prepare for my wedding, I already know there will be approximately 47,000 things happening at once.',
      'I need someone who will notice all of it.',
      'And obviously, I need someone who will give me the full report afterwards. 😂',
    ],
    leadIn: 'So, my observer, my gister, my unofficial wedding correspondent...',
    postscript: 'Your assignment is to observe everything and report back accordingly. No detail is too small. 😂🤍',
  },

  oluchi: {
    slug: 'oluchi',
    name: 'Oluchi Thomas',
    shortName: 'Oluchi',
    role: 'My Accountant',
    roleShort: 'Accountant',
    weddingRole: 'Bridesmaid',
    type: 'bridesmaid',
    randomColor: true,
    message:
      'My organised, responsible, numbers person. You bring structure, accountability, and balance to everything.',
    salutation: 'My Oluchi,',
    letter: [
      'Every bride needs someone who can look at the chaos and say:',
      '**\u201cOkay. Let\u2019s make a plan.\u201d**',
      'And for me, that person is you.',
      'You bring structure, sense, responsibility, and that beautiful ability to make things feel a little more manageable.',
      'While I am busy dreaming, planning, overthinking, changing my mind, and probably adding five more things to the list, I know there is someone who can help me bring things back to reality.',
      'You are dependable, organized, and the kind of person who makes you feel like things are going to be okay because somebody has actually thought things through.',
      'And let\u2019s be honest, somebody needs to keep me financially and mentally accountable during this wedding planning process. 😂',
      'I would love to have you beside me through all of it.',
    ],
    leadIn: 'So, my accountant, my numbers girl, my keeper of the figures...',
    postscript:
      'Your official title may be \u201cAccountant,\u201d but your real assignment is making sure I don\u2019t financially ruin myself because something is \u201cjust so cute.\u201d 😂🤍',
  },

  winner: {
    slug: 'winner',
    name: 'Akinwole Winner',
    shortName: 'Winner',
    role: 'My Calm in the Chaos',
    roleShort: 'Calm in the Chaos',
    weddingRole: 'Bridesmaid',
    type: 'bridesmaid',
    randomColor: true,
    message:
      'Your calm, steady presence makes everything feel a little less overwhelming. You remind me to breathe.',
    salutation: 'My Winner,',
    letter: [
      'There is something about your presence that feels grounding.',
      'In a world where everything can sometimes feel loud, busy, overwhelming, or just plain chaotic, you have a way of bringing a sense of calm with you.',
      'You remind me that everything doesn\u2019t have to be figured out at once.',
      'That sometimes, we can just breathe.',
      'That things will work themselves out.',
      'And that having the right people around you makes even the overwhelming moments easier.',
      'As I prepare for my wedding, I already know there will be excitement, nerves, decisions, emotions, deadlines, and probably a healthy amount of chaos. 😂',
      'So I want people around me who bring something special into my life.',
      'And for you, that thing is **peace.**',
      'I want my calm in the chaos standing beside me as I begin this new chapter.',
    ],
    leadIn: 'So, Winner...',
    postscript: 'I can\u2019t wait to have you there \u2014 keeping me grounded, calm, and hopefully reminding me to breathe. 😂🤍',
  },
} satisfies Record<string, Bridesmaid>

export type BridesmaidSlug = keyof typeof bridesmaids

export const bridesmaidSlugs = Object.keys(bridesmaids) as BridesmaidSlug[]

export function isBridesmaidSlug(slug: string): slug is BridesmaidSlug {
  return Object.prototype.hasOwnProperty.call(bridesmaids, slug)
}

export function getBridesmaid(slug: string): Bridesmaid | undefined {
  return isBridesmaidSlug(slug) ? (bridesmaids[slug] as Bridesmaid) : undefined
}

export function allBridesmaids(): Bridesmaid[] {
  return bridesmaidSlugs.map((slug) => bridesmaids[slug] as Bridesmaid)
}

export function proposalQuestion(bridesmaid: Bridesmaid) {
  return bridesmaid.type === 'chief' ? 'Will you be my Chief Bridesmaid?' : 'Will you be my bridesmaid?'
}

/* -------------------------------------------------------------------------- */
/*                              Closing messages                              */
/* -------------------------------------------------------------------------- */

export type ClosingMessage = {
  heading: string
  paragraphs: string[]
  love: string
}

export const universalClosing: ClosingMessage = {
  heading: 'You said yes! 🤍',
  paragraphs: [
    'And just like that...',
    'You\u2019re officially part of my bridal party.',
    'Thank you for being such a special part of my life and for saying yes to standing beside me during one of the biggest moments of my life.',
    'I can\u2019t wait for the laughter, the tears, the chaos, the dancing, the pictures, the memories, and everything in between.',
    'Most of all, I\u2019m grateful that I\u2019ll get to look around on that day and see people I love standing beside me.',
  ],
  love: 'I love you. 🤍',
}

export const chiefClosing: ClosingMessage = {
  heading: 'You said yes! 🤍',
  paragraphs: [
    'My Chief Bridesmaid.',
    'My anchor.',
    'My person.',
    'I don\u2019t think I\u2019ll ever be able to properly explain how much it means to me that you\u2019ll be standing beside me through this.',
    'I can\u2019t wait to experience this chapter with you.',
  ],
  love: 'I love you, always. 🤍',
}

export function closingFor(bridesmaid: Bridesmaid) {
  return bridesmaid.type === 'chief' ? chiefClosing : universalClosing
}
