#!/usr/bin/env node
import { Client } from '@notionhq/client'
const notion = new Client({
  auth: process.env.NOTION_SECRET,
});

// leading zero helper function
function leadingZero(value) {
  if (value < 10) {
    return (value = `0${value}`);
  }
  return value;
}

// Create today's date
let year = new Date().getFullYear().toString();
let month = new Date().getMonth();
month += 1;
month = leadingZero(month);
let day = new Date().getDate();
day = leadingZero(day);

const today = `${year}-${month}-${day}`;

const actionItemDB = process.env.ACTION_ITEMS_DB_ID;

const updateToToday = async () => {
  try {
    const actionItems = await notion.databases.query({
      database_id: actionItemDB,
      filter: {
        and: [
          {
            property: "Done",
            checkbox: {
              equals: false,
            },
          },
          {
            property: "Status",
            select: {
              equals: "Active",
            },
          },
          {
            property: "Do Date",
            date: {
              on_or_before: today,
            },
          },
        ],
      },
    });

    // ! The below is likely not efficient
    // There should be a better way to convert to pageID array
    let results = actionItems.results;

    const arrayEntries = Object.entries(results);

    const newArrayOfResults = [];
    arrayEntries.map((item) => {
      const [a, b] = item;
      newArrayOfResults.push(b);
    });
    let pageIds = [];
    newArrayOfResults.map((item) => {
      pageIds.push(item.id);
    });
    pageIds.map(async (each) => {

      const update = await notion.pages.update({
        page_id: each,
        properties: {
          "Do Date": {
            date: {
              start: today,
            },
          },
        },
      });

    });
  } catch (err) {
    console.log(err);
  }
};

updateToToday();
