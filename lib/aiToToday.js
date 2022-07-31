#!/usr/bin/env node
const { Client } = require('@notionhq/client')
const notion = new Client({
  auth: process.env.NOTION_SECRET,
});

const { leadingZero } = require('../utils/leadingZero')
const { today } = require('../utils/datez.js')

const actionItemDB = process.env.ACTION_ITEMS_DB_ID;

const todayDate = today();

exports.aiToToday = async () => {
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
              on_or_before: todayDate,
            },
          },
        ],
      },
    });

    // todo - The below is likely not efficient
    // todo There should be a better way to convert to pageID array
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
              start: todayDate,
            },
          },
        },
      });

    });
  } catch (err) {
    console.log(err);
  }
};
