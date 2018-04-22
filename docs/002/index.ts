import { Chapter, run } from "book_assert";

const chapter = new Chapter();

chapter.section("事前準備").setup(section => {
  const variables = {
    sbtNew: `sbt new x7c1/play-api-seed.g8
              --app_prefix=tutorial
              --name=hello-tutorial
              --organization=example`.replace(/\s+/g, " "),

    changeDir: "cd ./hello-tutorial",

    runTest: "sbt tutorial-play/test",
  };

  section.assert(() =>
    // run("rm -rf ./hello-tutorial")
    run("ls -al")
      .then(() => run(variables.sbtNew))
      .then(() => run(variables.changeDir))
      .then(() => run(variables.runTest)),
  );
  section.reveal(variables);
});

export { chapter };
