export interface IUserData {
  fname: string;
  lname: string;
  phoneNumber: number;

  password: string;
  email: string;
}
export interface IUserVerified {
  isVerified: boolean;
}
export interface Icategory {
  name: string;
}

export interface IBlog {
  title: string;
  description: string;
  imageUrl?: string;
  categoryId?: number;
  thumbImageUrl?: string;
}
