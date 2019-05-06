export class Usuario{
    public username: string;
    public mail: string;
    public password: string;
    public name: string;
    public location: string;
    public description: string;
    public verified: boolean;
    public created_at: Date;
    public birthday: Date;
    public lang: string;
    public profile_banner_url: string;
    public profile_img_url: string;
    //Not in db
    public likes: number;
    public followers: number;
    public following: number;
    public posts: number;
  /*
    constructor(){
      this.username = "";
      this.mail = "";
      this.password = "";
      this.name = "";
      this.location = "";
      this.description = "";
      this.verified = false;
      this.lang = "";
      this.profile_banner_url = "";
      this.profile_img_url = "";
    }*/
    constructor(){
    }
  
  }