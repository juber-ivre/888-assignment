---
title: Simple Node JS Command Line Application
created: '2023-02-09T15:48:12.350Z'
modified: '2023-02-09T15:57:02.314Z'
---

# Simple Node JS Command Line Application


## Prerequisites

Before you start, you should have the following software installed:

    Node.js
    npm (Node Package Manager)

### Libraries Used for this Assignment

- lowdb is a small local JSON database powered by Lodash, which means it has a simple API with functional and chainable methods. lowdb is great for small projects because it doesn't require any setup, and it's file-based, which means that it's easy to work with.

- inquirer is a powerful command line interface tool for Node.js. It provides an easy way to prompt users for input, with various types of questions, such as text input, password input, and multiple choice questions.

- dotenv is a library makes it easy to load environment variables from a .env file in your project and makes them available as properties of the process.env object. This way, you can easily access them in your code and use them to configure your application.


## Setting up the environment

Unzip the attachement on a designated folder and install dependencies

``` npm install ```


## Before start

The application contains a DB creation and seeder script. Type the following at the root folder of the application.

``` node db/seeder.js ```

This will create the working DB for this application with a basic seed.

## Running the Application 

To run the  application type 

``` npm start ``` 


## Running tests

You can install jest globally and run it direct from CLI of the project folder

``` npm i jest -g ```

or as a Dev Dependency

``` npm i jest --save-dev ```

This project is using native ECMAScript Modules - ESM and Jest only supports it by passing --experimental-vm-modules flag, please see instructions below

``` node --experimental-vm-modules node_modules/jest/bin/jest.js tests/sports.test.js ```










