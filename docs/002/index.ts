import { Chapter, run } from "book-assert";

const chapter = new Chapter();

chapter.section("事前準備").setup(_ => {
  const commands = {
    sbtNew: `sbt new x7c1/play-api-seed.g8
              --app_prefix=tutorial
              --name=hello-tutorial
              --organization=example`.replace(/\s+/g, " "),

    changeDir: "cd ./hello-tutorial",

    runTest: "sbt tutorial-play/test",
  };
  _.assert(() =>
    run("rm -rf ./hello-tutorial")
      // run("ls -al")
      .then(() => run(commands.sbtNew))
      .then(() => run(commands.changeDir))
      .then(() => run(commands.runTest))
      .then(() => run("cd ..")),
  );
  _.reveal(commands);
});

export { chapter };
