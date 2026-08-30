import { MenuItem } from "../types/menu.types";

export const MOCK_MENU_ITEMS: MenuItem[] = [
  {
    id: "item-1",
    categoryId: "cat-1",
    name: "Salade César Poulet",
    description:
      "Laitue romaine, blanc de poulet grillé, parmesan, croûtons et sauce César maison.",
    price: 12.5,
    imageUrl: [
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
    ],
    status: "AVAILABLE",
    isVegetarian: false,
    isGlutenFree: false,
    preparationTimeMinutes: 10,
  },
  {
    id: "item-2",
    categoryId: "cat-1",
    name: "Velouté de Potimarron",
    description:
      "Soupe onctueuse au potimarron, graines de courge torréfiées et crème fraîche.",
    price: 8.0,
    imageUrl: [
      "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80",
    ],
    status: "AVAILABLE",
    isVegetarian: true,
    isGlutenFree: true,
    preparationTimeMinutes: 8,
  },
  {
    id: "item-3",
    categoryId: "cat-1",
    name: "Carpaccio de Bœuf",
    description:
      "Fines tranches de bœuf, huile d'olive au basilic, câpres et copeaux de parmesan.",
    price: 14.0,
    imageUrl: [
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
    ],
    status: "AVAILABLE",
    isVegetarian: false,
    isGlutenFree: true,
    preparationTimeMinutes: 10,
  },
  {
    id: "item-4",
    categoryId: "cat-1",
    name: "Tartine d'Avocat & Œuf Poché",
    description:
      "Pain au levain, guacamole maison, œuf bio poché et graines de sésame.",
    price: 10.5,
    imageUrl: [
      "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
    ],
    status: "OUT_OF_STOCK",
    isVegetarian: true,
    isGlutenFree: false,
    preparationTimeMinutes: 12,
  },
  {
    id: "item-5",
    categoryId: "cat-2",
    name: "Cheeseburger Gourmet",
    description:
      "Steak haché pur bœuf 180g, cheddar affiné, oignons confits, bacon croustillant.",
    price: 16.5,
    imageUrl: [
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80",
    ],
    status: "AVAILABLE",
    isVegetarian: false,
    isGlutenFree: false,
    preparationTimeMinutes: 15,
    optionGroups: [
      {
        id: "optg-cuisson",
        required: true,
        minChoices: 1,
        maxChoices: 1,
        options: [
          { id: "opt-1", name: "Saignant" },
          { id: "opt-2", name: "À point" },
          { id: "opt-3", name: "Bien cuit" },
        ],
      },
      {
        id: "optg-supplements",
        required: false,
        maxChoices: 2,
        options: [
          { id: "opt-4", name: "Double fromage", priceExtra: 1.5 },
          { id: "opt-5", name: "Bacon extra", priceExtra: 2.0 },
        ],
      },
    ],
  },
  {
    id: "item-6",
    categoryId: "cat-2",
    name: "Veggie Burger",
    description:
      "Galette de haricots rouges et quinoa, avocat, tomate, sauce yaourt aux herbes.",
    price: 15.0,
    imageUrl: [
      "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80",
    ],
    status: "AVAILABLE",
    isVegetarian: true,
    isGlutenFree: false,
    preparationTimeMinutes: 15,
  },
  {
    id: "item-7",
    categoryId: "cat-2",
    name: "Pavé de Saumon Rôti",
    description:
      "Saumon de Norvège, mousseline de patate douce et légumes de saison poêlés.",
    price: 19.5,
    imageUrl: [
      "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80",
    ],
    status: "AVAILABLE",
    isVegetarian: false,
    isGlutenFree: true,
    preparationTimeMinutes: 20,
  },
  {
    id: "item-8",
    categoryId: "cat-2",
    name: "Entrecôte Grillée 300g",
    description:
      "Pièce de bœuf française grillée, servie avec frites maison et beurre maître d'hôtel.",
    price: 24.0,
    imageUrl: [
      "https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=800&q=80",
    ],
    status: "AVAILABLE",
    isVegetarian: false,
    isGlutenFree: true,
    preparationTimeMinutes: 18,
    optionGroups: [
      {
        id: "optg-sauce",
        required: true,
        minChoices: 1,
        maxChoices: 1,
        options: [
          { id: "sauce-1", name: "Sauce Poivre" },
          { id: "sauce-2", name: "Sauce Béarnaise" },
          { id: "sauce-3", name: "Sauce Roquefort", priceExtra: 1.0 },
        ],
      },
    ],
  },
  {
    id: "item-9",
    categoryId: "cat-2",
    name: "Risotto aux Champignons Sauvages",
    description:
      "Riz Arborio, poêlée de cèpes et girolles, parsemé de parmesan et huile de truffe.",
    price: 17.0,
    imageUrl: [
      "https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?auto=format&fit=crop&w=800&q=80",
    ],
    status: "AVAILABLE",
    isVegetarian: true,
    isGlutenFree: true,
    preparationTimeMinutes: 20,
  },
  {
    id: "item-10",
    categoryId: "cat-2",
    name: "Pâtes Carbonara Traditionnelles",
    description:
      "Spaghetti, guanciale croustillant, jaune d'œuf, pecorino romano et poivre noir.",
    price: 14.5,
    imageUrl: [
      "https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&w=800&q=80",
    ],
    status: "AVAILABLE",
    isVegetarian: false,
    isGlutenFree: false,
    preparationTimeMinutes: 12,
  },
  {
    id: "item-11",
    categoryId: "cat-2",
    name: "Curry Vert de Légumes Tofu",
    description:
      "Tofu poêlé, brocolis, pois gourmands et lait de coco au curry vert, riz basmati.",
    price: 15.5,
    imageUrl: [
      "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&w=800&q=80",
    ],
    status: "HIDDEN",
    isVegetarian: true,
    isGlutenFree: true,
    preparationTimeMinutes: 15,
  },
  {
    id: "item-12",
    categoryId: "cat-3",
    name: "Tiramisu Classique",
    description:
      "Biscuit cuillère imbibé de café expresso, crème mascarpone et cacao amer.",
    price: 7.0,
    imageUrl: [
      "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=800&q=80",
    ],
    status: "AVAILABLE",
    isVegetarian: true,
    isGlutenFree: false,
    preparationTimeMinutes: 5,
  },
  {
    id: "item-13",
    categoryId: "cat-3",
    name: "Fondant au Chocolat",
    description:
      "Cœur coulant au chocolat noir 70%, servi tiède avec une boule de glace vanille.",
    price: 8.0,
    imageUrl: [
      "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80",
    ],
    status: "AVAILABLE",
    isVegetarian: true,
    isGlutenFree: false,
    preparationTimeMinutes: 10,
  },
  {
    id: "item-14",
    categoryId: "cat-3",
    name: "Cheesecake Fruits Rouges",
    description:
      "Cheesecake style New-Yorkais sur biscuit spéculoos avec coulis de framboise.",
    price: 7.5,
    imageUrl: [
      "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80",
    ],
    status: "OUT_OF_STOCK",
    isVegetarian: true,
    isGlutenFree: false,
    preparationTimeMinutes: 5,
  },
  {
    id: "item-15",
    categoryId: "cat-3",
    name: "Café Gourmand",
    description: "Un café expresso accompagné de 3 mini desserts du chef.",
    price: 8.5,
    imageUrl: [
      "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80",
    ],
    status: "AVAILABLE",
    isVegetarian: true,
    isGlutenFree: false,
    preparationTimeMinutes: 5,
  },
  {
    id: "item-16",
    categoryId: "cat-4",
    name: "Limonade Artisanale",
    description:
      "Citron pressé, eau pétillante, sirop de sucre de canne et menthe fraîche.",
    price: 4.5,
    imageUrl: [
      "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80",
    ],
    status: "AVAILABLE",
    isVegetarian: true,
    isGlutenFree: true,
    preparationTimeMinutes: 3,
  },
  {
    id: "item-17",
    categoryId: "cat-4",
    name: "Jus d'Orange Pressé",
    description: "Oranges fraîches pressées à la minute (25cl).",
    price: 4.0,
    imageUrl: [
      "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=800&q=80",
    ],
    status: "AVAILABLE",
    isVegetarian: true,
    isGlutenFree: true,
    preparationTimeMinutes: 3,
  },
  {
    id: "item-18",
    categoryId: "cat-4",
    name: "Bière Artisanale IPA (33cl)",
    description:
      "Bière blonde houblonnée aux notes d'agrumes et de fruits tropicaux.",
    price: 6.5,
    imageUrl: [
      "https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&w=800&q=80",
    ],
    status: "AVAILABLE",
    isVegetarian: true,
    isGlutenFree: false,
    preparationTimeMinutes: 2,
  },
  {
    id: "item-19",
    categoryId: "cat-4",
    name: "Verre de Bordeaux Rouge (12cl)",
    description:
      "AOC Bordeaux Supérieur, notes de fruits noirs et épices douce.",
    price: 5.5,
    imageUrl: [
      "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80",
    ],
    status: "AVAILABLE",
    isVegetarian: true,
    isGlutenFree: true,
    preparationTimeMinutes: 2,
  },
  {
    id: "item-20",
    categoryId: "cat-4",
    name: "Eau Minérale Pétillante (75cl)",
    description: "Bouteille en verre San Pellegrino.",
    price: 5.0,
    imageUrl: [
      "https://images.unsplash.com/photo-1560023907-5f339617ea30?auto=format&fit=crop&w=800&q=80",
    ],
    status: "AVAILABLE",
    isVegetarian: true,
    isGlutenFree: true,
    preparationTimeMinutes: 1,
  },
];
