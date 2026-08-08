module.exports = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Vercel API 정상 작동!'
  });
};
