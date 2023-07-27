export default {
  created() {
    const cookiesArray = document.cookie.split(";");
    let ourToken = "";
    cookiesArray.map((cString) => {
      if (cString.split("=")[0] === "token") {
        ourToken = cString.split("=")[1];
        ourToken.trim();
      }
    });
    if (!ourToken) {
      this.$router.push("/login");
    }
  },
};
