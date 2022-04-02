import { v4 as uuidV4 } from 'uuid';
import { Car } from '@modules/cars/infra/typeorm/entities/Car';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

@Entity('rentals')
class Rental {
  @PrimaryColumn()
  id: string;

  @Column()
  car_id: string;

  @ManyToOne(() => Car)
  @JoinColumn({ name: 'car_id' })
  car: Car;

  @Column()
  user_id: string;

  @CreateDateColumn()
  start_date: Date;

  @CreateDateColumn()
  end_date: Date;

  @CreateDateColumn()
  expected_return_date: Date;

  @Column()
  total: number;

  @CreateDateColumn()
  created_at: Date;

  @CreateDateColumn()
  updated_at: Date;

  constructor() {
    if (!this.id) {
      this.id = uuidV4();
    }
  }
}

export { Rental };
