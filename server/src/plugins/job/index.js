import Promise from 'bluebird';

export default app => {
  ["JobModel", "ProfileCandidateModel", "JobApplicationModel"].forEach(model =>
    app.data.registerModel(__dirname, `./models/${model}`)
  );

  [
    "RecruiterApi",
    "CandidateApi",
    "CandidateProfileApi",
    "JobApplicationApi"
  ].forEach(model => require(`./${model}`)(app));

  const models = app.data.models();
  return {
    seedDefault() {
      const seedDefaultFns = [
        models.Job.seedDefault,
        models.ProfileCandidate.seedDefault
      ];
      return Promise.each(seedDefaultFns, fn => fn(models));
    }
  };
};
