// controllers/userController.js
const { db } = require('../firebase/firebaseService');

const saveUser = async (req, res) => {
  const user = req.user;
  const userRef = db.collection('users').doc(user.uid);

  try {
    await userRef.set({
      email: user.email,
      uid: user.uid,
      name: user.name || null,
      registeredAt: new Date(),
    }, { merge: true });

    res.status(200).json({ message: 'User saved successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save user' });
  }
};

module.exports = { saveUser };
