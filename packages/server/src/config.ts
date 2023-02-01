const envVars = JSON.parse(JSON.stringify(process.env));

export const config = {
  mode: envVars.NODE_ENV || 'development',
  port: envVars.PORT || 5000,
  socket: envVars.SOCKET || envVars.PORT || 3000,
};

export default config;