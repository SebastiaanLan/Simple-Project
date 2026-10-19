import Router from 'express';

const router = Router();

export let users = ['Sebastiaan', "Rick", "Mike", "Robert"];

router.get('/users', (req, res) => {
    console.log("Send all users");
    res.status(200).json(users);
})

router.get('/users/:id', (req, res) => {
    const id = Number(req.params.id);
    const user = users[id];

    if (user === undefined) {
        console.log("User not found");
        return res.status(404).json({ message: 'User not found'});
    }

    console.log('Send a user');
    res.status(200).json(user);
})

router.post('/users', (req, res) => {
    const user = req.body.username;

    if (user === undefined) {
        console.log("No username found")
        return res.status(400).json({ message: 'Name is required'});
    }

    users.push(user);

    console.log('New user created')
    res.status(201).json(user);
})

router.delete('/users/:id', (req, res) => {
    const id = Number(req.params.id);
    
    if (users[id] === undefined) {
        console.log("User nog found");
        return res.status(404).json({ message: 'User not found'});
    }

    users.splice(id, 1);

    console.log('User removed');
    res.status(204).end();
})

router.put('/users/:id', (req, res) => {
    const newUser = req.body.username

    const id = Number(req.params.id);
    const user = users[id];

    if (user === undefined) {
        console.log("User nog found");
        return res.status(404).json({ message: 'User not found'});
    }

    users[id] = newUser;

    console.log('User updated');
    res.status(201).json(newUser);
})

export default router;