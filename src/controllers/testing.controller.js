import jwt from "jsonwebtoken";

function testing(req, res) {
  const data = "this is a data that has been added";
  const coded = jwt.sign(data, "secretkey123");
  const decoded = jwt.verify(coded, "secretkey123");
  res.send(`<h2>${decoded}</h2>`);
}

export default testing;
