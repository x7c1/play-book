import { Chapter, run } from "book-assert";
import * as path from "path";

const { chapter, here } = Chapter.fromHere(__dirname);

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
      .then(() => run(commands.sbtNew))
      .then(() => run(commands.changeDir))
      .then(() => run(commands.runTest))
      .then(() => run("cd ..")),
  );
  _.reveal(commands);
});

chapter.section("POST メソッドの用意").setup(_ => {
  const targets = {
    routes: "./tutorial-play/conf/routes",
    controller: "./tutorial-play/app/controllers/HelloController.scala",
    test: "./tutorial-play/test/controllers/HelloControllerSpec.scala",
  };
  _.assert(() => {
    const routes = path.resolve("./hello-tutorial", targets.routes);
    return run(`patch -u ${routes} < ${here("routes.patch")}`);
  });
  _.assert(() => {
    const controller = path.resolve("./hello-tutorial", targets.controller);
    return run(`patch -u ${controller} < ${here("controller.patch")}`);
  });
  _.assert(() => {
    const test = path.resolve("./hello-tutorial", targets.test);
    return run(`patch -u ${test} < ${here("test.patch")}`);
  });
  _.assert(() => {
    return run("cd ./hello-tutorial")
      .then(() => run("sbt tutorial-play/test"))
      .then(() => run("cd .."));
  });
  _.reveal(targets);
});

export { chapter };
