// AI Prompt Generation Service
export const generateDrawingPrompt = async (): Promise<string> => {
  // For demo purposes, we'll use a curated list of creative prompts
  // In production, this would call an actual AI prompt generation service
  
  const prompts = [
    "A magical forest where trees grow upside down and their roots reach toward glowing stars",
    "An underwater city inhabited by colorful fish wearing tiny hats and riding seahorses",
    "A floating island castle surrounded by rainbow bridges and flying books",
    "A steampunk dragon made of copper gears and steam pipes, breathing colorful smoke",
    "A cozy coffee shop on Mars where aliens and humans share pastries and stories",
    "A garden where flowers bloom into tiny galaxies, each petal containing swirling stars",
    "A library where words literally fly off the pages and dance around the room",
    "A lighthouse that guides lost dreams back to their sleeping owners",
    "A mountain peak where clouds are harvested and turned into cotton candy",
    "A village built entirely inside giant mushrooms, with fairy-tale creatures as residents",
    "A train that travels through different seasons, each car representing a time of year",
    "A bakery where the bread dough comes to life and helps knead itself",
    "A clock tower where time moves backwards and elderly people become young again",
    "A desert oasis where sand dunes are actually sleeping giants covered in golden sand",
    "A space station greenhouse where Earth plants learn to grow in zero gravity",
    "A music box that contains an entire miniature world of dancing figurines",
    "A cave system lit by bioluminescent crystals that sing in harmony",
    "A windmill that generates not electricity, but bottled laughter and joy",
    "A bridge made of solidified rainbows connecting two mountain peaks",
    "A submarine exploring an ocean inside a snow globe on someone's desk"
  ];
  
  const stories = [
    "Once upon a time, in a world where colors had personalities, a shy violet befriended a bold orange to create the most beautiful sunset the world had ever seen.",
    "There was a painter who discovered that every stroke of their brush created real butterflies that would fly away carrying messages of hope to distant lands.",
    "In a small town, every door led to a different season - spring doors were covered in flowers, summer doors radiated warmth, autumn doors rustled with leaves, and winter doors sparkled with frost.",
    "A young artist found a pencil that could draw portals to anywhere they imagined, but each drawing cost them one precious memory.",
    "The last dragon on Earth was actually a librarian who transformed every night to protect ancient books from those who would misuse their knowledge.",
    "In a world where music created physical shapes in the air, a deaf composer learned to 'see' their symphonies and painted the most beautiful melodies ever witnessed.",
    "A clockmaker discovered that every clock they repaired gave someone an extra hour of life, but took an hour from their own.",
    "There existed a garden where each flower bloomed only when someone in the world performed an act of kindness.",
    "A lighthouse keeper found that their light didn't guide ships, but guided lost souls back to their happiest memories.",
    "In a city where buildings could walk, a young architect had to design homes that would be happy to stay in one place.",
    "A baker's bread could absorb sadness from anyone who ate it, but the baker had to find a way to release all that accumulated sorrow.",
    "Every star in the sky was actually a wish someone had made, and a young astronomer was tasked with delivering them to their intended recipients.",
    "In a forest where trees could speak but only to those who truly listened, a lonely child learned the ancient wisdom of the woods.",
    "A mapmaker drew places that didn't exist yet, and travelers who followed the maps would bring these imaginary locations into reality.",
    "There was a tailor who could weave emotions into fabric, creating clothes that would make the wearer feel exactly what they needed most."
  ];
  
  const allPrompts = [...prompts, ...stories];
  
  // Simulate generation time
  await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 600));
  
  return allPrompts[Math.floor(Math.random() * allPrompts.length)];
};

export const generateThematicPrompt = async (theme: string): Promise<string> => {
  const themePrompts: Record<string, string[]> = {
    fantasy: [
      "A dragon's egg hidden in a crystal cave, guarded by singing stones",
      "An enchanted forest where each tree holds a different magical power",
      "A wizard's tower that grows taller with each spell cast inside it"
    ],
    scifi: [
      "A space colony built inside an asteroid, powered by harvested starlight",
      "Robots that have learned to dream and paint their electronic visions",
      "A planet where gravity works in reverse during certain moon phases"
    ],
    nature: [
      "A mountain waterfall that flows upward during sunrise",
      "A flower field where each bloom opens to reveal a tiny ecosystem",
      "An ancient oak tree with branches that shelter different seasons"
    ],
    abstract: [
      "The feeling of nostalgia given physical form and color",
      "A geometric landscape where mathematical equations grow like plants",
      "The sound of laughter transformed into a visual pattern"
    ]
  };
  
  const prompts = themePrompts[theme.toLowerCase()] || themePrompts.fantasy;
  await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 400));
  
  return prompts[Math.floor(Math.random() * prompts.length)];
};