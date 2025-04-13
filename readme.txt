Requisitos para execução, softwares instalados:

* Net Framework
* Microsoft Visual Studio
* Node.js
* Microsoft SQL Server

---------------------------------------------

Passos para fazer a instalação do sistema e executá-lo:

1º - Baixar o sistema pelo repositório do GitHub.

2º - Extrair o arquivo;

3º - Dentro da pasta backend, execute o arquivo chamado sistema_zoologico.sln, ele irá abrir o Visual Studio com o projeto;

4º - Crie um banco de dados chamado Sistema_Zoologico no  Microsoft SQL Server;

5º - No arquivo appsettings.json, configure sua string de conexão, com as informações do servidor, banco de dados, etc.  Exemplo:  

"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Database=Sistema_Zoologico;Trusted_Connection=True;TrustServerCertificate=True;"
}

Salve o arquivo;

6º - Agora inicie a aplicação, isto irá criar as tabelas necessárias no banco de dados;

7º - Depois que o backend estiver rodando, abra o terminal do windows pelo comando CMD ou o terminal do Linux (caso esteja usando Linux);

8º - Acesso o diretório onde voce salvou o projeto extraído e acesse a pasta frontend.

9º - Dentro do diretório onde esta o frontend, execute o seguinte comando: npm install, e depois o comando npm start (onde iniciara o frontend e irá aparecer a tela de login);

10º - Um login padrão foi criado quando você executou o backend:
usuário: admin
senha: 1234

11º - Após feito o login você será direcionado para a página Home, onde existe aos módulos Animais, Cuidados, Dashboard, onde voce irá utilizar o sistema.
