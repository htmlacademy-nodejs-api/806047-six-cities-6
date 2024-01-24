export type City = {
  name: string;
  location: {
    latitude: number;
    longitude: number;
  }
}

export type MockServerData = {
  titles: string[];
  cities: City[];
  descriptions: string[];
  previews: string[];
  images: string[];
  names: string[];
  emails: string[];
  avatars: string[];
};

