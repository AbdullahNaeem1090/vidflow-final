export interface IPlaylist{
  id: string;
  title: string;
  description: string;
  videosCount: number;
  image: string;
  category: "Public" | "Private" | "Personal";
  videos: string[];
  owner:string
}


export interface  PlaylistPreview {
  id: string
  title: string
  thumbnail: string
  videoCount: number
}
