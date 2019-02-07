const app = require("express")();
const faker = require("faker");
const is = require("is_js");
const cors = require("cors");

/*
var randomName = faker.name.findName(); // Rowan Nikolaus
var randomEmail = faker.internet.email(); // Kassandra.Haley@erich.biz
var randomCard = faker.helpers.createCard();
*/
function serialize(o = {}, res) {
  res.end(JSON.stringify(o));
}

const API_KEY = "Bearer 6616037a-4dfd-4f42-b3e1-834fe2cbafdf";

app.options("*", cors()); // include before other routes
app.use(
  cors({
    origin: /localhost/
  })
);
app.get("*", (req, res) => {
  const email = req.url.replace("/", "");
  const hasAuth = req.headers.authorization === API_KEY;

  if (!hasAuth)
    serialize({ error: true, errors: ["Not authorized"] }, res.status(403));

  if (is.email(email)) {
    const fname = faker.name.firstName();
    const lname = faker.name.lastName();
    serialize(
      {
        id: faker.random.uuid(),
        name: {
          fullName: fname + " " + lname,
          givenName: fname,
          familyName: lname
        },
        email: email,
        gender: "male",
        location: "Paris, Île-de-France, FR"
      },
      res.status(200)
    );
  } else {
    serialize(
      { error: true, errors: ["Must be an email address"] },
      res.status(400)
    );
  }
});

if (process.env.DEV === "true") {
  app.listen("8090", () => {
    console.log("listening on port 8090");
  });
} else {
  app.listen();
}
