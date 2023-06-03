const { execSync, spawn } = require("child_process");
const fs = require("fs");

const createZkBadge = async (id_number) => {
  var templatePath = "../../circom/H3ZkCktTemplate.circom";
  let ptauFilePath = "../../circom/pot12_final.ptau";
  let dirName = "../runtime/wallet_" + id_number;
  let inputFilePath = "../../../assets/inputs/" + id_number + "_input.json";
  let publicOutputFilePath =
    "../../assets/outputs/" + id_number + "_public.json";
  let proofFilePath = "../../assets/proofs/" + id_number + "_proof.json";
  let verificationKeyFilePath =
    "../../assets/varificationKeys/" + id_number + "_verificationKey.json";

  try {
    await new Promise((resolve, reject) => {
      console.log("create directory--------------");
      execSync(
        `cd ../runtime && mkdir wallet_${id_number}`,
        {
          stdio: [process.stdin, process.stdout, process.stderr],
        }
      );
      resolve();
    }).then(async () => {
      await new Promise((resolve, reject) => {
        console.log("compiling template--------------");
        execSync(
          `cd ../runtime/${dirName} && circom ${templatePath} --r1cs --wasm --sym`,
          {
            stdio: [process.stdin, process.stdout, process.stderr],
          }
        );
        resolve();
      }).then(async () => {
        await new Promise((resolve, reject) => {
          console.log("generating witness--------------");
          execSync(
            `cd ../runtime/${dirName}/H3ZkCktTemplate_js && node generate_witness.js H3ZkCktTemplate.wasm ${inputFilePath} ../witness.wtns`,
            {
              stdio: [process.stdin, process.stdout, process.stderr],
            }
          );
          resolve();
        }).then(async () => {
          await new Promise((resolve, reject) => {
            console.log("phase 2----------");
            execSync(
              `cd ../runtime/${dirName} && snarkjs groth16 setup H3ZkCktTemplate.r1cs ${ptauFilePath} H3ZkCktTemplate_0000.zkey`,
              {
                stdio: [process.stdin, process.stdout, process.stderr],
              }
            );
            resolve();
          }).then(async () => {
            await new Promise((resolve, reject) => {
              console.log("phase 2, contributing----------");
              const snarkCmd = spawn(
                `cd ../runtime/${dirName} && snarkjs`,
                [
                  "zkey",
                  "contribute",
                  "H3ZkCktTemplate_0000.zkey",
                  "H3ZkCktTemplate_0001.zkey",
                  '--name="1st Contributor Name"',
                  "-v",
                ],
                { shell: true }
              );
              snarkCmd.stdout.on("data", (out) => {
                console.log(out.toString());
              });
              snarkCmd.stdin.write("hyper3\n");
              snarkCmd.stdin.end();

              snarkCmd.on("error", (err) => {
                console.log("process has exited: ", err);
              });
              snarkCmd.on("close", (d) => {
                resolve();
              });
            }).then(async () => {
              await new Promise((resolve, reject) => {
                console.log("generating verification key------------");
                execSync(
                  `cd ../runtime/${dirName} && snarkjs zkey export verificationkey H3ZkCktTemplate_0001.zkey ${verificationKeyFilePath}`,
                  {
                    stdio: [process.stdin, process.stdout, process.stderr],
                  }
                );
                resolve();
              }).then(async () => {
                await new Promise((resolve, reject) => {
                  console.log("generating proof------------");
                  execSync(
                    `cd ../runtime/${dirName} && snarkjs groth16 prove H3ZkCktTemplate_0001.zkey witness.wtns ${proofFilePath} ${publicOutputFilePath}`,
                    {
                      stdio: [process.stdin, process.stdout, process.stderr],
                    }
                  );
                  resolve();
                  setTimeout(() => {
                    fs.rmdir(
                      `../runtime/wallet_${id_number}`,
                      {
                        recursive: true,
                      },
                      (err) => {
                        err ? console.log(err) : console.log("deleted---- ");
                      }
                    );
                  });
                }).then(async () => {
                  console.log("done-------------");
                  console.log(`
       _                                                 ________
      | |                                               |______  |
      | |                                                     / /
      | |______  __      __  _________   ______   _ ___      / /
      |  ____  | \\ \\    / / |  _____  | |  __  \\ | / __|    / /__
      | |    | |  \\ \\  / /  | |     | | | |__| | | |        \\___  \\
      | |    | |   \\ \\/ /   | |_____| | |  ____  | |             \\ |
      |_|    |_|    \\  /    |  ______/  \\_____/  |_|             | |
                    / /     | |                           _____ / /
                   / /      | |                          |______ /
                  /_/       |_|
                            `);
                });
              });
            });
          });
        });
      });
    });
  } catch (err) {
    console.log(err);
    return false;
  }
  return true;
};

module.exports = createZkBadge;
