const Immutable = require("immutable");

// const map1 = Immutable.Map({a:1, b:2, c:3});
// const map2 = map1.set("b", 50);
// console.log(map1.get("b"));
// console.log(map2.get("b"));

class HistoryItem {
  constructor(args) {
    this.date = args.date;
    this.title = args.title;
    this.url = args.url;
  }
}




const historyList = Immutable.List.of(
  new HistoryItem({
    date: new Date(2016, 11, 15, 8, 0, 0),
    title: "Google",
    url: "https://www.google.com"
  }),
  new HistoryItem({
    date: new Date(2017, 11, 15, 8, 0, 1),
    title: "GitHub",
    url: "https://github.com/nabezokodaikon"
  }),
  new HistoryItem({
    date: new Date(2015, 11, 15, 8, 0, 2),
    title: "Docker",
    url: "https://www.docker.com"
  })
);

function comparator(a, b) {
  if (a < b) {
    return -1;
  } else if (a > b) {
    return 1;
  } else {
    return 0;
  }
}
const dateSortList = historyList.sort((a, b) => {
  return comparator(a.date.getTime(), b.date.getTime());
});

const titleSortList = historyList.sort((a, b) => {
  return comparator(
      a.title.toString().toLowerCase(), 
      b.title.toString().toLowerCase());
});

module.exports = {
  srcList: () => {
    historyList.forEach((i) => {
      console.log(i.title);
    });
  },
  titleSortList: () => {
    titleSortList.forEach((i) => {
      console.log(i.title);
    });
  },
  dateSortList: () => {
    dateSortList.forEach((i) => {
      console.log(i.title);
    });
  }
}
