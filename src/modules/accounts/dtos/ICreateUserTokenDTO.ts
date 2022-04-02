interface ICreateUserTokensDTO {
  refresh_token: string;
  user_id: string;
  expires_date: Date;
}

export { ICreateUserTokensDTO };
