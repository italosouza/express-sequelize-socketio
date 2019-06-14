# SEQUELIZE

## Criando uma nova Migration

`Migrations` são utilizadas para versionar a execução de scripts, elas garantes que os comando de expansão e contração de dados sejam executadas na sua devida ordem.

```bash
npx sequelize migration:create --name=create-users
```

## Excutando as Migrations pendentes

Executa as `migration` que estiverem pendentes de execução.

```bash
npx sequelize db:migrate
```

## Realizando o Rollback de Migrations

Para desfazer a execução mais recente de um script podemos executar o seginte comando:

```bash
npx sequelize db:migrate:undo
```

## Criando uma Seed

`Seed` são utilizadas para alimentar a base com uma massa de dados.

```bash
npx sequelize seed:generate --name demo-user
```
