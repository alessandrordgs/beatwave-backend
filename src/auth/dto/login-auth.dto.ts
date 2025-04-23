export class loginAuthDto {
  auth_id: string;
  email: string;
  last_login_at: Date;
  name: string;
  last_name: string;
  avatar: {
    photo_url: string;
  };
}
