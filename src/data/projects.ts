export type Photo = { src: string; width: number; height: number };

export type Project = {
  id: string;
  images: Photo[];
};

const img = (name: string, width: number, height: number): Photo => ({
  src: `/images/${name}.jpg`,
  width,
  height,
});

// Titles, descriptions and the "kind" caption live in messages/en.json under
// projects.items.<id>. To add a project: put photos in public/images, add an
// entry here and add its texts to the messages file. The first photo of each
// project is its cover.
export const projects: Project[] = [
  {
    id: "livingroom",
    images: [
      img("livingroom-1", 2200, 1760),
      img("livingroom-2", 2200, 1760),
      img("livingroom-3", 2200, 1760),
      img("livingroom-4", 2200, 1760),
      img("livingroom-5", 2200, 1760),
      img("livingroom-6", 2200, 1773),
      img("livingroom-7", 2200, 1760),
    ],
  },
  {
    id: "living",
    images: [
      img("living-2", 2200, 1760),
      img("living-1", 2200, 1760),
      img("living-3", 2200, 1760),
      img("living-4", 2200, 1760),
      img("living-5", 2200, 1760),
      img("living-6", 2200, 1760),
      img("living-7", 2200, 1760),
    ],
  },
  {
    id: "openplan",
    images: [
      img("openplan-1", 2200, 1650),
      img("openplan-2", 2200, 1650),
      img("openplan-3", 2200, 1650),
      img("openplan-4", 2200, 1650),
      img("openplan-5", 2200, 1650),
      img("openplan-6", 2200, 1650),
      img("openplan-7", 2200, 1650),
    ],
  },
  {
    id: "bedroom",
    images: [
      img("bedroom-1", 2200, 1760),
      img("bedroom-2", 2200, 1760),
      img("bedroom-3", 2200, 1760),
      img("bedroom-4", 2200, 1760),
    ],
  },
  {
    id: "house",
    images: [
      img("house-1", 2200, 1467),
      img("house-2", 2200, 1467),
      img("house-3", 2200, 1467),
      img("house-4", 2200, 1467),
      img("house-5", 2200, 1467),
      img("house-6", 2200, 1467),
    ],
  },
  {
    id: "kitchen",
    images: [
      img("kitchen-1", 2200, 1760),
      img("kitchen-2", 2200, 1760),
      img("kitchen-3", 2200, 1760),
      img("kitchen-4", 2200, 1712),
      img("kitchen-5", 2200, 1760),
      img("kitchen-6", 2200, 1760),
      img("kitchen-7", 2200, 1705),
    ],
  },
  {
    id: "office",
    images: [
      img("office-1", 2000, 2500),
      img("office-2", 2000, 2500),
      img("office-3", 2200, 2543),
      img("office-4", 2200, 2750),
      img("office-5", 2000, 2500),
    ],
  },
  {
    id: "chalet",
    images: [
      img("chalet-1", 2200, 1464),
      img("chalet-2", 2200, 1464),
      img("chalet-3", 2200, 1467),
      img("chalet-4", 2200, 1464),
      img("chalet-5", 2200, 1464),
      img("chalet-6", 2200, 1464),
      img("chalet-7", 2200, 1464),
    ],
  },
  {
    id: "luxbedroom",
    images: [
      img("luxbedroom-1", 2200, 1650),
      img("luxbedroom-2", 2200, 1639),
      img("luxbedroom-3", 2200, 1650),
      img("luxbedroom-4", 2200, 1650),
      img("luxbedroom-5", 2200, 1650),
      img("luxbedroom-6", 2200, 1650),
    ],
  },
  {
    id: "closet",
    images: [
      img("closet-1", 2000, 2000),
      img("closet-2", 2000, 2000),
      img("closet-3", 2000, 2000),
      img("closet-4", 2000, 2000),
      img("closet-5", 2000, 2000),
    ],
  },
  {
    id: "study",
    images: [
      img("study-1", 2200, 2200),
      img("study-2", 2200, 2200),
      img("study-3", 2200, 2200),
      img("study-4", 2200, 2200),
      img("study-5", 2200, 2200),
      img("study-6", 2200, 2200),
      img("study-7", 2200, 2200),
    ],
  },
];
