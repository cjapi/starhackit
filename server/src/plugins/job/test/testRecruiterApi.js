import assert from "assert";
import testMngr from "~/test/testManager";
import _ from "lodash";

import createFakeJob from "./createFakeJob";

describe("Recruiter No Auth", function() {
  let client;
  before(async () => {
    await testMngr.start();
    client = testMngr.client("bob");
  });
  after(async () => {
    await testMngr.stop();
  });

  it("should get a 401 when getting all jobs", async () => {
    try {
      const jobs = await client.get("v1/recruiter/job");
      assert(jobs);
    } catch (error) {
      assert.equal(error.body, "Unauthorized");
      assert.equal(error.statusCode, 401);
    }
  });
  it("should get 403 when getting a job", async () => {
    try {
      let job = await client.get("v1/recruiter/job/123456");
      assert(job);
    } catch (error) {
      assert.equal(error.body, "Unauthorized");
      assert.equal(error.statusCode, 401);
    }
  });
});

describe("Recruiter Auth", function() {
  let client;
  before(async () => {
    await testMngr.start();
    client = testMngr.client("alice");
    await client.login();
  });
  after(async () => {
    await testMngr.stop();
  });
  it("should create a job and get this job", async () => {
    const input = createFakeJob();
    const job = await client.post("v1/recruiter/job", input);
    assert(job);
    assert(job.user_id);
    assert.equal(job.title, input.title);

    const jobNew = await client.get(`v1/recruiter/job/${job.id}`);
    assert(jobNew);
    assert(job.user_id);
    assert.equal(job.title, jobNew.title);
  });
  it("should create many jobs", async () => {
    _.times(2, async () => {
      const input = createFakeJob();
      const job = await client.post("v1/recruiter/job", input);
      assert(job);
      assert(job.user_id);
      assert.equal(job.title, input.title);
    });
  });
  it("should update a job", async () => {
    const inputNew = createFakeJob();
    const newJob = await client.post("v1/recruiter/job", inputNew);
    const inputUpdated = createFakeJob();
    const updatedJob = await client.patch(
      `v1/recruiter/job/${newJob.id}`,
      inputUpdated
    );
    assert.equal(updatedJob.title, inputUpdated.title);
  });
  it("should delete a job", async () => {
    const inputNew = createFakeJob();
    const newJob = await client.post("v1/recruiter/job", inputNew);
    await client.post("v1/recruiter/job", createFakeJob());
    const jobsBeforeDelete = await client.get("v1/recruiter/job");
    await client.delete(`v1/recruiter/job/${newJob.id}`);
    const jobsAfterDelete = await client.get("v1/recruiter/job");
    assert.equal(jobsBeforeDelete.length, jobsAfterDelete.length + 1);
  });
  it("should get all jobs", async () => {
    let jobs = await client.get("v1/recruiter/job");
    assert(jobs);
    assert(Array.isArray(jobs));
  });
  it("should get 404 when the job is not found", async () => {
    try {
      let jobs = await client.get("v1/recruiter/job/8f7be687-5457-4c37-b1e4-bb974c9fa28a");
      assert(jobs);
    } catch (error) {
      assert(error.body.error);
      assert.equal(error.body.error.name, "NotFound");
      assert.equal(error.statusCode, 404);
    }
  });
});
