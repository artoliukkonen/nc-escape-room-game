"use strict";

import * as AWS from "aws-sdk";

export const getParameter = async (parameterName: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const ssm = new AWS.SSM();
    const params = {
      Name: parameterName,
      WithDecryption: true,
    };
    ssm.getParameter(params, (error, data) => {
      if (error) {
        reject(error);
      } else {
        resolve(data.Parameter.Value);
      }
    });
  });
};
