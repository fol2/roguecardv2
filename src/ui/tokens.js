// Current base design tokens, mirrored from styles.css for Node-side content validation.
export const UI_TOKENS = Object.freeze({
  'ease-out-soft': 'cubic-bezier(0.22, 1, 0.36, 1)',
  'ease-spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  gold: '#f2c14e', 'gold-dim': '#9c7c34', ink: '#0b0e1a', parchment: '#e8dfc8',
  text: '#d7dcea', 'text-dim': '#8b93ad', panel: 'rgba(14, 18, 34, 0.86)',
  'panel-line': 'rgba(242, 193, 78, 0.28)', atk: '#ff5964', skl: '#4ea8de',
  pwr: '#b388ff', sts: '#7fae9c', hp: '#ff5964', blk: '#7fd4ff', good: '#7ddb8f',
  bad: '#ff7847', lead: '#05070e',
  'glass-fill': 'linear-gradient(168deg, rgba(26, 32, 52, 0.92), rgba(10, 13, 22, 0.94) 60%)',
  'gold-line': 'color-mix(in srgb, var(--gold) 55%, transparent)',
  'font-body': "'Alegreya', Georgia, serif",
  'font-display': "'Cinzel', 'Alegreya', serif",
});
export const UI_TOKEN_IDS = Object.freeze(Object.keys(UI_TOKENS));
