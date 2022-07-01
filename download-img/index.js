import fs from "fs";
import http from "http";
import express from "express";
import path from "path";
import request from "request";

import data from "./data.js";
import { initializeApp } from "firebase/app";
import { getStorage, ref, getMetadata } from "firebase/storage";
const app = express();

const fbApp = initializeApp({
  apiKey: "AIzaSyCVkzQB6McpuUpd_2sbJ7bRRscFhxiqvr0",
  authDomain: "talati-2f2a2.firebaseapp.com",
  projectId: "talati-2f2a2",
  storageBucket: "talati-2f2a2.appspot.com",
  messagingSenderId: "340931704635",
  appId: "1:340931704635:web:5c3b1367009001b92ce91e",
});

const storage = getStorage(fbApp);

data.map((i) => {
  const fileRef = ref(storage, i);
  getMetadata(fileRef)
    .then((metadata) => {
      var dir = metadata.fullPath.split("/")[0];
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }

      const fileName =
        metadata.name + "." + metadata.contentType.replace(/(.*)\//g, "");
      const loc = path.join(dir, fileName);
      var download = function (uri, loc, cb) {
        request.head(uri, function (err, res, body) {
          request(uri).pipe(fs.createWriteStream(loc)).on("close", cb);
        });
      };

      download(i, loc, function () {
        console.log("done");
      });
    })
    .catch((error) => {
      console.log(error);
      process.exit(1);
    });
});

const server = http.createServer(app);
server.listen(1000);
