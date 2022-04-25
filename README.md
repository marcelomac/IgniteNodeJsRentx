# Cadastro de carro ! teste

**RF**
Deve ser possível cadastrar um novo carro.
Deve ser possível listar todas as categorias.

**RN**
Não deve ser possível cadastrar cadastrar um carro com uma placa já existente.
Não deve ser possível alterar a placa de um carro já cadastrado.
Por padrão, o carro deve ser cadastrado com disponibilidade.
Somente um usuário administrador poderá cadastrar um carro.

# Alteração de carro

**RF**

**RN**
Não deve ser possível alterar a placa de um carro já cadastrado.

# Listagem de carro

**RF**
Deve ser possível listar todos os carros disponíveis.
Deve ser possível listar todos os carros disponíveis pelo nome da categoria.
Deve ser possível listar todos os carros disponíveis pelo nome da marca.
Deve ser possível listar todos os carros disponíveis pelo nome do carro.

**RN**
O usuário não precisa estar logado no sistema.

# Cadastro de especificação de carro

**RF**
Deve ser possível cadastrar uma especificação para um carro.
x Deve ser possível listar todas as especificações.
x Deve ser possível listar todos os carros.

**RN**
Não deve ser possível cadastrar uma especificação para um carro não cadastrado.
Não deve ser possível cadastrar uma especificação já existente para o mesmo carro.
Somente um usuário administrador poderá cadastrar uma especificação.

# Cadastro de imagens do carro

**RF**
Deve ser possível cadastrar a imagem do carro.
Deve ser possível listar todos os carros.

**RNF**
Utilizar o multer para o upload dos arquivos.

**RN**
O usuário deve poder cadastrar mais de uma imagem para o mesmo carro.
Somente um usuário administrador poderá cadastrar uma imagem.

# Aluguel de carro

**RF**
Deve ser possível cadastrar um aluguel.

**RN**
O aluguel deve ter duração mínima de 24 horas.
Não deve ser possível cadastrar um novo aluguel caso já exista um aberto para o mesmo usuário.
Não deve ser possível cadastrar um novo aluguel caso já exista um aberto para o mesmo carro.
O status do carro deverá ser alterado para indisponível.

# Devolução de carro

**RF**
Deve ser possível realizar a devolução de um carro

**RN**
Se o carro for devolvido com menos de 24h, deverá ser cobrada a diária completa
Ao realizar a devolução, o carro deverá ser liberado para outro aluguel
Ao realizar a devolução, o usuário deverá ser liberado para outro aluguel
ao realizar a devolução, deverá ser calculado o total do aluguel
Caso o horário de devolução seja superior ao horário previsto de entregua, deverá ser cobrada multa
proporcional aos dias de atraso
Caso haja multa, deverá ser somada ao total do aluguel

# Listagem de Alugueis para usuário

**RF**
Deve ser possível realizar a busca de todos os alugues para o usuário

**RN**
O usuário deve estar logado na aplicação

# Recuperar senha

**RF**
- Deve ser possível ao usuário recuperar a senha informando o e-mail
- O usuário deve receber um e-mail com o passo a passo para a recuperação da senha
- O usuário deve conseguir inserir uma nova senha

**RN**
- O usuário precisa informar uma nova senha
- o link enviado para a recuperação deve expirar em 3 horas
