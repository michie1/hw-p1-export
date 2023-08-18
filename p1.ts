import * as fs from "fs";

const dongle = "-";
const key = "-";

const startDate = new Date("2022-08-11");
const endDate = new Date("2023-08-10");

async function fetchDate(date: string) {
  const response = await fetch(
    `https://tsdb-reader.homewizard.com/devices/date/${date}`,
    {
      credentials: "include",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:102.0) Gecko/20100101 Firefox/102.0",
        Accept: "application/json",
        "Accept-Language": "en-US,en;q=0.5",
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "cross-site",
      },
      referrer: "https://hwenergy.app/",
      body: `{"devices":[{"identifier":"p1dongle/${dongle}","measurementType":"main_connection"}],"type":"main_connection","values":true,"wattage":true,"gb":"5m","tz":"Europe/Amsterdam","fill":"linear","three_phases":false}`,
      method: "POST",
      mode: "cors",
    },
  );
  return response.json();
}

async function main() {
  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const formattedDate = currentDate.toISOString().split("T")[0];
    const result = await fetchDate(formattedDate.replace(/-/g, "/"));
    const filename = `${formattedDate}.json`;
    fs.writeFileSync(`data/${filename}`, JSON.stringify(result, null, 2));
    currentDate.setDate(currentDate.getDate() + 1);
  }
}

main();
