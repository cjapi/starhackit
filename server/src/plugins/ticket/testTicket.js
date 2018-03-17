import assert from "assert";
import testMngr from "~/test/testManager";

describe("Ticket No Auth", function() {
  let client;
  before(async () => {
    await testMngr.start();
    client = testMngr.client("alice");
  });
  after(async () => {
    await testMngr.stop();
  });

  it("should get a 401 when getting all tickets", async () => {
    try {
      let tickets = await client.get("v1/ticket");
      assert(tickets);
    } catch (error) {
      assert.equal(error.body, "Unauthorized");
      assert.equal(error.statusCode, 401);
    }
  });
  it("should get 403 when getting a ticket", async () => {
    try {
      let ticket = await client.get("v1/ticket/123456");
      assert(ticket);
    } catch (error) {
      assert.equal(error.body, "Unauthorized");
      assert.equal(error.statusCode, 401);
    }
  });
});

describe("Ticket", function() {
  let client;
  before(async () => {
    await testMngr.start();
    client = testMngr.client("alice");
    assert(client);
    await client.login();
  });
  after(async () => {
    await testMngr.stop();
  });
  it("should create a ticket", async () => {
    const input = {
      subject: "Ciao Bella"
    };
    let ticket = await client.post("v1/ticket", input);
    console.log("ticket ", ticket);
    assert(ticket);
    assert(ticket.user_id);
    assert.equal(ticket.subject, input.subject);
  });
  it("should update a ticket", async () => {
    const inputNew = {
      subject: "Hello World"
    };
    const newTicket = await client.post("v1/ticket", inputNew);
    const inputUpdated = {
      subject: "Hello World"
    };
    const updatedTicket = await client.patch("v1/ticket", {...inputUpdated, id: newTicket.id});
    console.log("ticket ", updatedTicket);
    assert.equal(updatedTicket.subject, inputUpdated.subject);
  });
  it("should get all tickets", async () => {
    let tickets = await client.get("v1/ticket");
    console.log("tickets ", tickets);
    assert(tickets);
    assert(Array.isArray(tickets));
  });
  it("should get one ticket", async () => {
    let ticket = await client.get("v1/ticket/1");
    console.log("ticket ", ticket);
    assert(ticket);
    assert(ticket.user_id);
  });
  it("should get 404 when the ticket is not found", async () => {
    try {
      let tickets = await client.get("v1/ticket/123456");
      assert(tickets);
    } catch (error) {
      //console.log(error.body)
      //console.log(error.statusCode)
      assert(error.body.error);
      assert.equal(error.body.error.name, "NotFound");
      assert.equal(error.statusCode, 404);
    }
  });
});
