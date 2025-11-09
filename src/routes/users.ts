import { Router } from 'express';
import { db } from '../database';
import { validateUUID, validateUserData } from '../middleware';

const router = Router();

router.get('/', (req, res) => {
  const users = db.getAllUsers();
  res.status(200).json(users);
});

router.get('/:userId', validateUUID, (req, res) => {
  const { userId } = req.params;
  const user = db.getUserById(userId);

  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  res.status(200).json(user);
});

router.post('/', validateUserData, (req, res) => {
  const { username, age, hobbies } = req.body;
  
  const newUser = db.createUser({ username, age, hobbies });
  res.status(201).json(newUser);
});

router.put('/:userId', validateUUID, validateUserData, (req, res) => {
  const { userId } = req.params;
  const { username, age, hobbies } = req.body;

  const updatedUser = db.updateUser(userId, { username, age, hobbies });

  if (!updatedUser) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  res.status(200).json(updatedUser);
});

router.delete('/:userId', validateUUID, (req, res) => {
  const { userId } = req.params;
  const deleted = db.deleteUser(userId);

  if (!deleted) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  res.status(204).send();
});

export default router;
