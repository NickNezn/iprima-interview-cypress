/**
 * Converts a string to a slug
 * @param title - The string to convert
 * @returns The slug
 */
export function toSlug(title: string): string {
    return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");           
}