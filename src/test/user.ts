import * as chai from "chai";
import chaiHttp from "chai-http";
import dotenv from "dotenv";
dotenv.config();
import { describe, it } from "node:test";

chai.use(chaiHttp);
const should = chai.should();

describe("Testing user signup api call ", () => {
  it("creates a new user", (done) => {
    chai
      .request(process.env.API as string)
      .post("/api/v1/user/signup")
      .send({
        name: "Shubham",
        email: "shubhamhunmai@gmail.com",
        password: "Shubhamhunmai@13",
      })
      .end((err, res) => {
        console.log(should);
        res.should.have.status(201);
        res.body.should.be.an("object");
        res.body.should.have.property("message");
        res.body.message.should.contain("user has been created");
        done();
      });
  });
});
