module.exports = {
  instance: { name: "sample" },
  close: async () => {
    console.info("Sample actor is closed");
  },
};
