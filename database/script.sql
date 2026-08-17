CREATE DATABASE IF NOT EXISTS equipmanager;
USE equipmanager;

CREATE TABLE IF NOT EXISTS equipamentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    patrimonio VARCHAR(50) UNIQUE NOT NULL,
    localizacao VARCHAR(100) NOT NULL,
    status VARCHAR(30) DEFAULT 'Disponível'
);
