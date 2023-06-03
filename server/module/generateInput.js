const { exec, execSync, spawn, spawnSync } = require("child_process");

const generateInput = async (id_number) => {
  try {
    // const idAscii = [];
    // for (let i = 0; i < id_number.length; i++) {
    //   idAscii.push(id_number.charCodeAt(i));
    // }
    // var unitValue = 3;
    // for (let ele of idAscii) {
    //   unitValue += ele;
    // }
    // console.log(unitValue);

    /*------------ for windows ---------------------*/
    execSync(
      `echo {"in": ${id_number}, "in1": ${1}}> ../assets/inputs/${id_number}_input.json`,
      {
        stdio: ["ignore", "ignore", process.stderr],
      }
    );
    /*
        ------------ for linux ---------------------
        execSync(`echo '{"in": ${unitValue}, "in1": ${1}}'> ../assets/inputs/${walletAddress}_input.json`, {
            stdio: ["ignore", "ignore", process.stderr],
        });
    
        --------------------------------------------
        */

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
module.exports = generateInput;
