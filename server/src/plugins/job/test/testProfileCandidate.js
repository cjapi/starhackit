import assert from "assert";
import testMngr from "~/test/testManager";

describe("Candidate Profile", function() {
  let client;
  before(async () => {
    await testMngr.start();
    client = testMngr.client("alice");
    await client.login();
  });
  after(async () => {
    await testMngr.stop();
  });

  it("should get the candidate profile", async () => {
    const profile = await client.get("v1/candidate/profile");
    //console.log("profile ", profile)
    assert(profile);
  });
  it("should patch the candidate profile", async () => {
    const profileData = {
      summary: "The best cow in the stable",
      experiences: [{ title: "Chef" }],
      sectors: ["Construction", "Restaurant"],
      geo: { type: "Point", coordinates: [-48.234, 20.123] }
    };
    const profile = await client.patch("v1/candidate/profile", profileData);
    //console.log("profile updated", profile)
    assert.equal(profile.summary, profileData.summary);
    assert(profile);
  });
});

describe("Candidate Profile No Auth", function() {
  let client;
  before(async () => {
    await testMngr.start();
    client = testMngr.client("bob");
  });
  after(async () => {
    await testMngr.stop();
  });

  it("should get a 401 when getting the candidate profile", async () => {
    try {
      const profile = await client.get("v1/candidate/profile");
      assert(profile);
    } catch (error) {
      assert.equal(error.body, "Unauthorized");
      assert.equal(error.statusCode, 401);
    }
  });
  it("should get a 401 when patching ", async () => {
    try {
      const profileData = {
        summary: "The best cow in the stable",
        experiences: [{ title: "Chef" }]
      };
      const profile = await client.patch("v1/candidate/profile", profileData);
      assert(profile);
    } catch (error) {
      assert.equal(error.body, "Unauthorized");
      assert.equal(error.statusCode, 401);
    }
  });
});
