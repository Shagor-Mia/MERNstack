const setAccessToken = async (res, accessToken) => {
  await res.cookie("accessToken", accessToken, {
    maxAge: 5 * 60 * 1000,
    httpOnly: true,
    //   secure: true,
    sameSite: "none",
  });
};

const setRefreshToken = async (res, refreshToken) => {
  await res.cookie("refreshToken", refreshToken, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7days
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
};

module.exports = {
  setAccessToken,
  setRefreshToken,
}; //
