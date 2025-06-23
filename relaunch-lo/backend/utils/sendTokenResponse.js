// Get token from model, create cookie and send response
export const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();
  
  // Parse JWT_EXPIRE from environment (e.g., "7d" -> 7 days)
  const jwtExpire = process.env.JWT_EXPIRE || '7d';
  let maxAgeMs;
  
  if (jwtExpire.endsWith('d')) {
    const days = parseInt(jwtExpire);
    maxAgeMs = days * 24 * 60 * 60 * 1000; // Convert days to milliseconds
  } else if (jwtExpire.endsWith('h')) {
    const hours = parseInt(jwtExpire);
    maxAgeMs = hours * 60 * 60 * 1000; // Convert hours to milliseconds
  } else {
    // Assume it's already in milliseconds or days as a number
    maxAgeMs = parseInt(jwtExpire) * 24 * 60 * 60 * 1000;
  }
  
  const options = {
    maxAge: maxAgeMs,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  };

  // Remove password from response
  user.password = undefined;

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
      data: user
    });
};
