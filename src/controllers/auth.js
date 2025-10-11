import { ONE_MONTH } from '../constans/index.js';
import { registerUser } from '../services/auth.js';
import { loginUser } from '../services/auth.js';
import { logoutUser } from '../services/auth.js';
import { refreshSession } from '../services/auth.js';
import { requestEmail } from '../services/auth.js';
import { resetPassword } from '../services/auth.js';



export async function registerController (req, res){
  const user = await registerUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: { user}
  });
};
////////////////////////////////////////////////////////////////////
export async function loginController(req, res) {
  const session = await loginUser(req.body.email, req.body.password);

  res.cookie('refreshtoken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_MONTH)
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_MONTH)
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully logged in!',
    data: { accessToken: session.accessToken }
  });
}
///////////////////////////////////////////////////////////////////
export async function logoutController(req, res) {
  if (req.cookies.sessionId) {
    await logoutUser(req.cookies.sessionId);
  }
  res.clearCookie('refreshtoken');
  res.clearCookie('sessionId');
  res.status(204).send();
}
//////////////////////////////////////////////////////////////////
export async function refreshController(req, res) {
  const { sessionId, refreshtoken } = req.cookies;
  const session = await refreshSession(sessionId, refreshtoken);

  res.cookie('refreshtoken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_MONTH)
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_MONTH)
  });

  res.status(200).json({
    status: 200,
    message: 'Refresh session successfully!',
    data: { accessToken: session.accessToken }
  });
}
//////////////////////////////////////////////////////////////////

export const requestEmailController = async (req, res) => {
  await requestEmail(req.body.email);

  res.json({
    status: 200,
    message: 'Reset password email was successfully sent!',
    data: {},
  });
}
//////////////////////////////////////////////////////////////////
export const resetPasswordController = async (req, res) => {
  await resetPassword(req.body);
  res.json({
    status: 200,
    message: 'Password has been successfully reset.',
    data: {},
  });
}


