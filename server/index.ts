import express from "express";
import axios from "axios";
import puppeteer from "puppeteer-core";
import { executablePath } from "puppeteer";

const app = express();
const port = 3000;

const browser = await puppeteer.launch({
  headless: true,
  executablePath: executablePath(),
});

app.get("/", async (req, res) => {
  const page = await browser.newPage();
  await page.goto("https://asuratoon.com/manga/?page=1&order=update");
  let result = []
  do {
    const elementHandles = await page.$$(".listupd a");
    const propertyJsHandles = await Promise.all(
      elementHandles.map((handle) => handle.getProperty("title"))
    );
    const names = await Promise.all(
      propertyJsHandles.map((handle) => handle.jsonValue())
    );
    result = [...result,names]
    if(await page.$('.hpage a.r')){
        await page.click(".hpage a.r");
    }
    else{
        break
    }
  } while (await page.$(".hpage a"));

  console.log(result,result.length)
  console.log(await page.$(".hpage a.r"));
  res.send("");
});

app.listen(port, () => {
  console.log("Server is running on port 3000");
});
