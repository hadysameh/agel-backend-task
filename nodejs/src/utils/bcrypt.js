import bcrypt from "bcrypt";

async function getHashed(textToHash) {
  return new Promise((resolve, reject) => {
    let saltRounds = 10;
    bcrypt.hash(textToHash, saltRounds, function (err, hash) {
      if (err) {
        reject(err);
      } else {
        resolve(hash);
      }
    });
  });
}

export { getHashed };
