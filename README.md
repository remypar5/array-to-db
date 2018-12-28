# arrayToDb()
A simple utility to create a DB table out of a given array of objects. Use it to create a simple object out of an array of objects, accessible by each object's respective unique identifier. This provides easier and faster access.

## Installation
NPM
```
npm i --save @remypar5/array-to-db
```
Yarn
```
yarn add @remypar5/array-to-db
```

## Usage:
```javascript
import arrayToDb from '@remypar5/array-to-db';

const heroesArray = [
    { id: 'luke', name: 'Luke Skywalker' },
    { id: 'tony', name: 'Iron Man' },
    { id: 'bruce', name: 'Batman' },
];
const heroes = arrayToDb(heroesArray);
console.log(heroes);
/* {
    luke: { id: 'luke', name: 'Luke Skywalker' },
    tony: { id: 'tony', name: 'Iron Man' },
    bruce: { id: 'bruce', name: 'Batman' },
}; */

```
