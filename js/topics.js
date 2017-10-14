
// add a topic line to a div with data already entered
function makelines(table, keys) {
  let lines = table
    .data(keys)
    .enter()
    .append("tr")

  console.log(keys)
  lines
    .append("td")
    .text((i) => i[0])


  lines
    .append("td")
    .text((i) => i[1].join(" "))

  lines
    .append("td")
    .text((i) => i[2])


}

function maketable() {
  let data  = [
    {"text": "topic id", "width": "10vw"},
    {"text": "overtime", "width": "15vw"},
    {"text": "base words", "width": "40vw"},
    {"text": "proportion", "width": "25vw"},
  ]

  let table = d3
    .select("div.wrapper")
    .selectAll("table")
    .append("table")

  table
    .data(data)
    .enter()
    .append("th")
    .text((d, i) => d["text"])
    .style("width", (d, i) => d["width"])

  return table

}

function callback(error, keys, years) {
  data['coll_keys'] = keys
  data['coll_years'] = years
  
  let table = maketable()
      lines = makelines(table, keys)

}

d3.queue()
  .defer(d3.json, "https://eight1911.github.io/page/data/coll/keys.json")
  .defer(d3.json, "https://eight1911.github.io/page/data/coll/years.json")
  .await(callback)