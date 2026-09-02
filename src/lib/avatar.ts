function buildDiceBearUrl(seed: string, style: string): string {
  return `https://api.dicebear.com/9.x/${style}/svg?seed=${encodeURIComponent(seed)}`;
}

export function getCustomerAvatar(customer: {
  id?: string;
  image?: string | null;
  firstName?: string;
  lastName?: string;
}): string | undefined {
  if (customer.image) return customer.image;

  const seed = customer.id || `${customer.firstName ?? ""}${customer.lastName ?? ""}`;

  const styleMapping = [
    "avataaars",
    "bottts",
    "notionists",
    "thumbs",
    "adventurer",
    "big-smile",
    "lorelei",
    "micah",
    "fun-emoji",
    "pixel-art",
  ];

  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }

  const style = styleMapping[Math.abs(hash) % styleMapping.length];
  return buildDiceBearUrl(seed, style);
}