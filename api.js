const express = require('express');
const app = express();

/*
    Dog API

    CRUD -> Create, Read, Update and Delete

    Create -> /api/breed/create/:name/:lifespan/:characteristics - done
    Update -> /api/breed/update/:id/:name/:lifespan/:characteristics
    Delete -> /api/breed/delete/:id

    Read ->
        - via Breed name /api/breed/get/name/:name
        - via Breed ID /api/breed/get/id/:id
        - Randomly /api/breed/get/:limit -> if no limit is provided it should display ten random dogs

    {
        id: number,
        name: string,
        lifespan: string,
        characteristics: string
    }
    3-10
 */

let dogs = [
    {id: 1, name: 'Bulldog', lifespan: '5-7', character: 'Stubborn much'},
    {id: 2, name: 'Dogue do bordeaux', lifespan: '7-9', character: 'Lovely'},
    {id: 3, name: 'Pug', lifespan: '6-11', character: 'Small'}
];

app.get('/api/breed/create/:name/:lifespan/:desc', function(req, res) {
    const element = {id: dogs.length + 1, name: req.params.name, lifespan: req.params.lifespan, character: req.params.desc};
    dogs.push(element);
    console.log(dogs);
    res.send(element);
});

app.get('/api/breed/update/:id/:name/:lifespan/:desc', function(req, res) {
    const element = dogs.find(e => e.id.toString() === req.params.id);
    // Use indexOf function on dogs array and use element as condition
    const dogIndex = dogs.indexOf(element);

    if(req.params.name !== 'false') {
        // Modify element.name to match req.params.name
        element.name = req.params.name;
        // instead of dogs[dogIndex].name = req.params.name;
    }

    if(req.params.lifespan !== 'false') {
        // Modify element.lifespan to match req.params.lifespan
        element.lifespan = req.params.lifespan;
    }

    if(req.params.desc !== 'false') {
        // Modify element.character to match req.params.desc
        element.character = req.params.desc;
    }

    dogs[dogIndex] = element;

    res.send(dogs[dogIndex]);
});

app.get('/test', (req, res) => {
    const element = dogs.find((e) => {return e.id === 1});

    if(element) {
        res.send('OK');
    } else {
        res.send('Error');
    }
});

app.get('/api/breed/get/name/:name', function(req, res) {
   const found = dogs.filter(function(element) {
       const position = element.name.toLowerCase().search(req.params.name.toLowerCase());
       return position !== -1;
   });
   res.send(found);
   //  const e = "Hello from the other side!";
   //  console.log('Searching for ll: ', e.search('ll')); // This returned 2
   //  console.log('Searching for Hello: ', e.search('Hello')); // This returned 0
   //  console.log('Searching for other: ', e.search('other')); // This returned 15
   //  console.log('Searching for !: ', e.search('!')); // This returned 25
   //  console.log('Searching for aadsasd: ', e.search('aadsasd')); // This returned -1
   //  console.log('Searching for sidee: ', e.search('sidee')); // This returned -1
   //  res.send('Whatever');
});

// TO SEARCH ARRAY RANDOMLY YOU HAVE TO:
// 1. Sort it in random order (dogs.sort(() => .5 - Math.random() ;
// 2. Select limit of first elements and return it e.g. if the limit is 5 select first 5 elements (read about array.slice() function)
// 3. Returned the sliced array in res.send()


// function find(array, value) {
//     for(let i = 0; i < array.length; i++) {
//         const e = array[i];
//         if(e.id.toString() === value) {
//             return e;
//         }
//     }
// }

/*
    let dogs = [
        {id: 1, name: 'Bulldog', lifespan: '5-7', character: 'Stubborn much'},
        {id: 2, name: 'Dogue do bordeaux', lifespan: '7-9', character: 'Lovely'}
    ]

    Request was: /api/breed/update/2/Dog de bordeaux/false/false

    1. Find a dog by index and store it in a variable called element => element = {id: 2, name: 'Dogue do bordeaux', lifespan: '7-9', character: 'Lovely'}
    2. Find an index of the element in the dogs array => dogIndex

    3. For every field (req.params.) that is not false modify elements field to the value that came from the request.
        3.1. Name does not equal false so it will be update in the following way
                element.name = req.params.name => element.name = 'Dog de bordeaux'

    4. {id: 2, name: 'Dog do bordeaux', lifespan: '7-9', character: 'Lovely'}
    5. Put the updated object in the array in the following way dogs[dogIndex] = element
    dogs[1] = {id: 2, name: 'Dog do bordeaux', lifespan: '7-9', character: 'Lovely'};
    6. Send response back to the user

 */

app.listen(3000);
