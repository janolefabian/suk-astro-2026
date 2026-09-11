export const designs = [
  { id: 'salon', name: 'Salon', description: 'Ruhig und elegant. Feine Serifenschrift, viel Luft, keine Farbigkeit.', fonts: 'Newsreader + Manrope' },
  { id: 'studio', name: 'Studio', description: 'Offen und unkompliziert. Weiche Formen, klare Schrift, hellere Flächen.', fonts: 'DM Sans' },
  { id: 'edition', name: 'Edition', description: 'Wie ein Konzertprogramm. Ausdrucksstarke Serifen und klare Schwarz-Weiß-Kontraste.', fonts: 'Cormorant Garamond + Manrope' },
  { id: 'lesart', name: 'Lesart', description: 'Persönlich und entspannt. Eine kräftigere, freundlichere Serifenschrift.', fonts: 'Lora + Manrope' },
] as const;

export type DesignId = typeof designs[number]['id'];
export const defaultDesign: DesignId = 'salon';
export const designStorageKey = 'suk-design-comparison-v1';
export function findDesign(id: unknown) {
  return designs.find(design => design.id === id);
}
