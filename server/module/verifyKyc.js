const { exec, execSync, spawn, spawnSync } = require("child_process");
const fs = require("fs");
const { resolve } = require("path");

const verifyKyc = async (zero_id) => {
  let publicOutputFilePath =
    "../assets/outputs/" + zero_id + "_public.json";
  let proofFilePath = "../assets/proofs/" + zero_id + "_proof.json";
  let verificationKeyFilePath =
    "../assets/varificationKeys/" + zero_id + "_verificationKey.json";

  if(!fs.existsSync(verificationKeyFilePath)){
    return false;
  }
  try {
    const result = execSync(`snarkjs groth16 verify ${verificationKeyFilePath} ${publicOutputFilePath} ${proofFilePath}`)
    if(result.toString().includes("OK!")){
        return true;
    }
    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports = verifyKyc;