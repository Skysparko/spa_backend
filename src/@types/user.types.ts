export interface UserAttributes {
  uid?: number;
  name: string;
  image: string;
  mobile_no: string;
  password: string;
  email: string;
  city:string;
  reg_date:Date;
  status:string;
}
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