## Node Drive

![Versao React.js](https://img.shields.io/badge/React-18.2.0-orange?style=plastic&logo=react)
![Versao Adonis.js](https://img.shields.io/badge/Adonis-5.9.0-orange?style=plastic&logo=adonisjs)
![versao TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.1-orange?style=plastic&logo=tailwindcss)

# O que é?

Um sistema inspirado no Google Drive, possuindo upload de arquivos, visualização, download, compartilhamento de arquivos, busca pelos arquivos no sistema, etc...

# Tecnologias utilizadas

- ``Typescript``
- ``Node.js``
- ``React.js``
- ``Adonis.js``
- ``TailwindCSS``
- ``Flowbite``
- ``Styled Components``

# Requisitos

- [Node.js](https://nodejs.org/en)
- Um banco de dados. No meu caso, utilizei o [MariaDB](https://mariadb.org/download)

# Preparações para executar o projeto

1. Instalar dependências:

    Após fazer download do repositório, é preciso entrar em ambas as pastas Back-end e Front-end e executar o seguinte comando:
    ```
    npm install
    ```
    
2. Configurar seu banco de dados no arquivo ".env.example", e logo após, remover a extensão ".example".
3. Criar um novo banco de dados com o nome "node_drive".

4. Executar as migrations do projeto e inserir os planos de armazenamento:

    Digite e execute o código abaixo no terminal:
    ```
    node ace migration:fresh
    ```
    Logo após, execute o seed dos planos de armazenamento:
   ```
   node ace db:seed
   ```
6. Execute o projeto
    
    Abra dois terminais em ambas as pastas Back-end e Front-end e execute o comando:
    ```
    npm run dev
    ```
    
    Abra seu navegador e entre na url: ``127.0.0.1:5173`` ou ``localhost:5173``
