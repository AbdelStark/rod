export const RELAYS_PROD = [

  'wss://relay.primal.net',
  'wss://relay.nostr.band',
  'wss://purplepag.es',
  "wss://relay.snort.social",
  "wss://relay.damus.io",
  "wss://nos.lol",
  'wss://relay.nostr.band/', 
  'wss://nos.lol/', 
  'wss://nostr.bitcoiner.social/'
  // 'wss://relay.n057r.club', 'wss://relay.nostr.net',
];

export const RELAYS_TEST = ['wss://relay.n057r.club', 'wss://relay.nostr.net'];

export const RELAY_AFK_PRODUCTION = 'wss://nostr-relay-nestjs-production.up.railway.app';

export const ROD_RELAYS =
  process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_NODE_ENV === "production"
    ? [
      'wss://nostr-relay-nestjs-production.up.railway.app',
      ...RELAYS_PROD,
    ]
    : [
      ...RELAYS_PROD,
      'wss://nostr-relay-nestjs-production.up.railway.app',
    ];

export const MINTS_URLS = {
  MINIBITS: "https://mint.minibits.cash/Bitcoin"
}