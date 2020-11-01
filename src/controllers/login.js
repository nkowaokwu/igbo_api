/* Logs the user in with email and password */
const login = (req, res) => {
  // eslint-disable-next-line
  const { email, password } = req.body;

  // TODO: Get user auth token from Firebase
  res.send('Logged In!');
};

export default login;
