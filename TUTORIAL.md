
## Token e RefreshToken

1. Usuário faz uma requisição de Session, que vai gerar um *token* e um *refresh_token*;
2. Enquanto o *token* for válido, o usuário faz as outras requisições. Ex: Users / PATCH Avatar;
3. Quando o token expirar, o usuário utiliza o *refresh_token* gerado na Session e faz uma
requisição em _Authenticate / Refresh Token_. Isso vai gerar um novo *token* que será passado na
nova requisição de Session.
4. Os tempos válidos para *token* e *refresh_token* estão definidos em _src/config/auth.ts_;
5. Em resumo, o *token* é o mecanismo principal de validação e o *refresh_token* é utilizado para
gerar novos tokens quando estes expiram;
6. Para isso deve-se colocar um período de validade menor no *token* e  um período maior no 
*refresh_token*;

## Storages

* Armazenamentos na nuvem para fazer uploads de arquivos
