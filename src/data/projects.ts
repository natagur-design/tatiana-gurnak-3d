export type Photo = { src: string; width: number; height: number };

export type Project = {
  id: string;
  images: Photo[];
};

const img = (name: string, width: number, height: number): Photo => ({
  src: `/images/${name}.webp`,
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
      img("livingroom-1", 2500, 2000),
      img("livingroom-2", 2500, 2000),
      img("livingroom-3", 2500, 2000),
      img("livingroom-4", 2500, 2000),
      img("livingroom-5", 2500, 2000),
      img("livingroom-6", 2482, 2000),
      img("livingroom-7", 2500, 2000),
    ],
  },
  {
    id: "openplan",
    images: [
      img("openplan-1", 2500, 1875),
      img("openplan-2", 2500, 1875),
      img("openplan-3", 2500, 1875),
      img("openplan-4", 2500, 1875),
      img("openplan-5", 2500, 1875),
      img("openplan-6", 2500, 1875),
      img("openplan-7", 2500, 1875),
    ],
  },
  {
    id: "living",
    images: [
      img("living-2", 2500, 2000),
      img("living-1", 2500, 2000),
      img("living-3", 2500, 2000),
      img("living-4", 2500, 2000),
      img("living-5", 2500, 2000),
      img("living-6", 2500, 2000),
      img("living-7", 2500, 2000),
    ],
  },
  {
    id: "bedroom",
    images: [
      img("bedroom-1", 2500, 2000),
      img("bedroom-2", 2500, 2000),
      img("bedroom-3", 2500, 2000),
      img("bedroom-4", 2500, 2000),
    ],
  },
  {
    id: "house",
    images: [
      img("house-1", 3000, 2000),
      img("house-2", 3000, 2000),
      img("house-3", 3000, 2000),
      img("house-4", 3000, 2000),
      img("house-5", 3000, 2000),
      img("house-6", 3000, 2000),
    ],
  },
  {
    id: "kitchen",
    images: [
      img("kitchen-1", 2500, 2000),
      img("kitchen-2", 2500, 2000),
      img("kitchen-3", 2500, 2000),
      img("kitchen-4", 2500, 1946),
      img("kitchen-5", 2500, 2000),
      img("kitchen-6", 2500, 2000),
      img("kitchen-7", 2500, 1937),
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
    id: "chalet",
    images: [
      img("chalet-1", 3000, 1997),
      img("chalet-2", 3000, 1997),
      img("chalet-3", 3000, 2000),
      img("chalet-4", 3000, 1996),
      img("chalet-5", 3000, 1997),
      img("chalet-6", 3000, 1997),
      img("chalet-7", 3000, 1997),
    ],
  },
  {
    id: "luxbedroom",
    images: [
      img("luxbedroom-1", 2500, 1875),
      img("luxbedroom-2", 2500, 1862),
      img("luxbedroom-3", 2500, 1875),
      img("luxbedroom-4", 2500, 1875),
      img("luxbedroom-5", 2500, 1875),
      img("luxbedroom-6", 2500, 1875),
    ],
  },
  {
    id: "office",
    images: [
      img("office-1", 2000, 2500),
      img("office-2", 2000, 2500),
      img("office-3", 2500, 2890),
      img("office-4", 2400, 3000),
      img("office-5", 2000, 2500),
    ],
  },
  {
    id: "study",
    images: [
      img("study-1", 2500, 2500),
      img("study-2", 2500, 2500),
      img("study-3", 2500, 2500),
      img("study-4", 2500, 2500),
      img("study-5", 2500, 2500),
      img("study-6", 2500, 2500),
      img("study-7", 2500, 2500),
    ],
  },
];
