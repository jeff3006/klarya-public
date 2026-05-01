/**
 * Multilingual lead signal detection
 *
 * Detects buying intent and contact info in user messages across 8 languages.
 *
 * Languages: HE, EN, FR, AR, RU, ES, IT, DE.
 */

export type SignalType =
  | 'buying_intent'
  | 'quote_request'
  | 'objection'
  | 'urgency'
  | 'high_engagement';

export interface DetectedSignal {
  type: SignalType;
  score: number; // 0..1
  trigger: string;
}

export interface LeadInfo {
  phone?: string;
  email?: string;
  website?: string;
  firstName?: string;
}

// Generic international phone pattern (adjust country code prefix as needed)
const PHONE_REGEX =
  /\+?\d{1,3}[-.\s]?\(?\d{2,4}\)?[-.\s]?\d{2,4}[-.\s]?\d{2,4}[-.\s]?\d{0,4}/;
const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
const URL_REGEX =
  /(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+\.(?:com|net|org|biz|io|app|me|info)(?:\/[^\s]*)?/i;
// First-name hints across multiple languages
const FIRST_NAME_HINTS =
  /(?:my name is|i'm|je m'appelle|me llamo|mi chiamo|ich heiße)\s+([A-ZÉÀ-ÿ֐-׿؀-ۿЀ-ӿ][a-zé֐-׿؀-ۿЀ-ӿ]+)/i;

export function extractLeadInfo(allUserText: string): LeadInfo {
  const info: LeadInfo = {};
  const phoneMatch = allUserText.match(PHONE_REGEX);
  if (phoneMatch) info.phone = phoneMatch[0].replace(/[-.\s()]/g, '');
  const emailMatch = allUserText.match(EMAIL_REGEX);
  if (emailMatch) info.email = emailMatch[0];
  const urlMatch = allUserText.match(URL_REGEX);
  if (urlMatch) info.website = urlMatch[0];
  const nameMatch = allUserText.match(FIRST_NAME_HINTS);
  if (nameMatch) info.firstName = nameMatch[1];
  return info;
}

interface Pattern {
  type: SignalType;
  regex: RegExp;
  score: number;
}

const PATTERNS: Pattern[] = [
  // Buying intent — multilingual
  {
    type: 'buying_intent',
    regex:
      /\b(price|cost|how much|prix|combien|cher|preis|kosten|prezzo|precio|מחיר|سعر|цена)\b/i,
    score: 0.7,
  },
  // Urgency
  {
    type: 'urgency',
    regex:
      /\b(urgent|asap|now|today|maintenant|aujourd'hui|sofort|דחוף|عاجل|срочно|hoy|adesso)\b/i,
    score: 0.85,
  },
  // Objection
  {
    type: 'objection',
    regex:
      /\b(too expensive|hesitate|trop cher|teuer|caro|חושב|غالي|дорого)\b/i,
    score: 0.5,
  },
];

export function detectSignals(text: string): DetectedSignal[] {
  const found: DetectedSignal[] = [];
  for (const p of PATTERNS) {
    const m = text.match(p.regex);
    if (m) found.push({ type: p.type, score: p.score, trigger: m[0] });
  }
  return found;
}

export function maxScore(signals: DetectedSignal[]): number {
  return signals.reduce((max, s) => Math.max(max, s.score), 0);
}
