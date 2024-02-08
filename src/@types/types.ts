export enum BypassLoginEnum {
  Yes = 'Yes',
  No = 'No',
}

export enum StatusEnum {
  Active = 'Active',
  Inactive = 'Inactive',
}

export interface UserAttributes {
  uid?: number;
  name: string;
  image: string;
  mobile_no: string;
  password: string;
  email: string;
  city: string;
  reg_date: Date;
  status: StatusEnum;
  otp?: string;
  bypass_login: BypassLoginEnum;
}

export enum TournamentTypeEnum {
  Single = 'Single',
  Double = 'Double',
  Team = 'Team',
}

export type SportType = "Cricket" | "Badminton" | "Volleyball";

export interface TournamentAttributes {
  tnid?: number;
  uid: number;
  sport: SportType;
  title: string;
  logo: string;
  season: string;
  from_date: Date;
  to_date: Date;
  end_date: Date;
  type: TournamentTypeEnum;
  win_point: number;
}

export interface ApiResponse<T> {
  success: boolean;
  msg: string;
  data: {
    list: T[];
    path: string;
    detail: T | null;
    bearerToken?: string;
  };
}

export const defaultApiResponse = {
  success: false,
  msg: "",
  data: {
    list: [],
    path: '',
    detail: null,
  },
} as const;
// uid, name, image,mobile_no, password, email, city, reg_date,status
// interface ServerAttributes {
//   id?: number;
//   ip: string;
//   name: string;
//   username: string;
//   password: string;
//   dbname: string;
//   createdBy:number;
//   updatedBy:number;
// }

// interface AdminAttributes {
//   id?: number;
//   username: string;
//   password: string;
//   role: string;
// }

// interface UserTransAttributes {
//   id?: number;
//   userId: number;
//   siteId: number;
//   serverId: number;
// }