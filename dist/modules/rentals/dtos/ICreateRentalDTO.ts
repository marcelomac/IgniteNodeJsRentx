// os campos 'id' e 'end_date' são opcionais e usados no update:
interface ICreateRentalDTO {
  id?: string;
  car_id: string;
  user_id: string;
  expected_return_date: Date;
  end_date?: Date;
  total?: number;
}

export { ICreateRentalDTO };
