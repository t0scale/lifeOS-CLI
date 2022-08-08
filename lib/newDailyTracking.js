#!/usr/bin/env node
const axios = require('axios')
const { Client } = require('@notionhq/client')
const { today, ouraDate } = require('../utils/datez.js')
const { round } = require('../utils/round.js')


// Sets Oura Auth for all request made with Axios
axios.defaults.headers.common["authorization"] = process.env.OURA_SECRET
// Sets Notion Auth for all request made using notion pkg
const notion = new Client({
  auth: process.env.NOTION_SECRET,
})



let todayDate = today();
let todayOuraDate = ouraDate();




exports.LastNightSleep = async () => {
  try {
    // we want bedtime_end, bedtime_start, duration (in-bed time) total (asleep time)
    const res = await axios.get(
      `https://api.ouraring.com/v1/sleep?start=${todayOuraDate}&end=${todayOuraDate}`
    );
    // filter for the is_longest true parameter - oura can track naps
    // array destructuring - first value of array - if it had commas each would
    // respectively be the following array items
    const [sleepDataObj] = res.data.sleep.filter(
      (filter) => (filter.is_longest = true)
    );
    //destructure the sleep data
    const { bedtime_end, bedtime_start, duration, total } = sleepDataObj;
    // oura's bedtime start and end are full dates with date and time
    // here we are extracting just the hours & mins for input into notion
    let bedHours = new Date(bedtime_start).getHours();
    // todo - update this so that the time is entered based on date and hour
    // todo cont... example: 1am would be 13, but 1pm would be 1
    if (bedHours >= 13) {
      bedHours = bedHours - 12;
    }
    // todo - create utils for this conversion into decimal hours
    const bedMins = new Date(bedtime_start).getMinutes() / 60;
    const bedTime = round(bedHours + bedMins, 2);
    // same as above
    const wakeHrs = new Date(bedtime_end).getHours();
    const wakeMins = new Date(bedtime_end).getMinutes() / 60;
    const wakeTime = round(wakeHrs + wakeMins, 2);
    // oura's sleep duration is given in second, here we convert to decimal hrs
    const inBedTime = round(duration / 60 / 60, 2);
    const asleepTime = round(total / 60 / 60, 2);
    // check the data from above - not needed though
    console.log(
      `\n`,
      "woke up at: ",
      wakeTime,
      `\n`,
      "went to bed at: ",
      bedTime,
      `\n`,
      "in bed for: ",
      inBedTime,
      `\n`,
      "slept for: ",
      asleepTime
    );

    // Notion Daily Tracking Database
    const databaseId = process.env.DAILY_TRACKING_DB_ID;

    // Create today's daily tracking page
    const createPageToday = await notion.pages.create({
      parent: {
        type: "database_id",
        database_id: databaseId,
      },
      properties: {
        Title: {
          title: [
            {
              text: {
                content: "@Today",
              },
            },
          ],
        },
        Date: {
          date: {
            start: todayDate,
          },
        },
      },
    });

 // Now that daily tracking page is created, we query for that page
 // and prepare to enter oura data
    const response1 = await notion.databases.query({
      database_id: databaseId,

      filter: {
        property: "Date",
        date: {
          equals: todayDate,
        },
      },
    })

    // Extract ID of page so we can use it in the next API call
    const page = response1.results[0].id;
    // optional log of the page ID which will be updated with sleep data
    console.log(`\n`, "today's page is: ", page);
    // API Call to update Page
    // Note this doesn't use the database to select the page/entries being updated
    // and instead, it uses the page ID directly
    const response2 = await notion.pages.update({
      page_id: page,
      properties: {
        ToBed: {
          number: bedTime,
        },
        Wake: {
          number: wakeTime,
        },
        "Bed Duration": {
          number: inBedTime,
        },
        "Sleep Duration": {
          number: asleepTime,
        },
      },
    });
  } catch (err) {
    console.log(err);
  }
}