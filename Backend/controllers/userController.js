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



const handleRegister = async (e) => {
  e.preventDefault();
  setError('');

  if (!email.includes('@') || password.length < 8) {
    setError('Valid email and password of 8+ characters required.');
    return;
  }

  try {
    await createUserWithEmailAndPassword(auth, email, password);

    //  After successful registration
    const token = await auth.currentUser.getIdToken();

    await fetch('http://localhost:5000/api/user/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    });

    navigate('/dashboard');
  } catch (err) {
    setError(err.message);
  }
};
