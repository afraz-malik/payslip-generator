module.exports = {
  apps: [
    {
      name: "payslip-gen",
      script: "npm start",
      node_args: "--experimental-specifier-resolution=node",
      log_date_format: "YYYY-MM-DD---HH:mm:ss:SSS[Z]",
      restart_delay: 0,
      ignore_watch: ["node_modules"],
    },
  ],
};
