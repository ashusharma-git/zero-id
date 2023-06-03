pragma circom 2.0.0;

template H3ZkCkt() {
    signal input in;
    signal input in1;
    signal output c;
    c <== in*in1;
 }

 component main = H3ZkCkt();
