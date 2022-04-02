import { v4 as uuidv4 } from 'uuid';
import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity('categories')
class Category {
  @PrimaryColumn()
  // Caso o nome da entity seja diferente da coluna da tabela, usar a notation
  // @Column("name_col")
  id?: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @CreateDateColumn()
  created_at: Date;

  // caso esteja criando uma categoria, o constructor cria o id:
  constructor() {
    if (!this.id) {
      this.id = uuidv4();
    }
  }
}

export { Category };
