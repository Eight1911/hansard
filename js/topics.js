
function makegraph(item, years) {
  let svg = item
    .append("svg")
    .style("width", "16vw")
    .style("height", "4em")
    .selectAll("rect")
    .data((d) => d[3].map((x) => x/d3.max(d[3])))
    .enter()

  svg
    .append("rect")
    .attr("width", "0.153em") // width / number of columns
    .attr("height", (d) => 4*d + "em")
    .attr("x", (d, i) => i*0.153 + "vw")
    .attr("y", (d) => (4 - 4*d) + "em")


}

// add a topic line to a div with data already entered
function makelines(table, keys, years) {
  let lines = table
    .data(keys)
    .enter()
    .append("tr")

  lines
    .append("td")
    .text((i) => i[0])



  makegraph(lines.append("td"), years)


  lines
    .append("td")
    .text((i) => i[2].join(" "))

  lines
    .append("td")
    .text((i) => Math.round(100000*i[1])/1000)


}

function maketable() {
  let data  = [
    {"text": "ID", "width": "3vw"},
    {"text": "over time", "width": "17vw"},
    {"text": "base words", "width": "58vw"},
    {"text": "proportion", "width": "20vw"},
  ]

  let table = d3
    .select("div.wrapper")
    .selectAll("table")
    .append("table")


  header = table
    .append('tr')

  header
    .data(data)
    .enter()
    .append("th")
    .text((d, i) => d["text"])
    .style("width", (d, i) => d["width"])

  return table

}

function callback(error, keys) {
  data['coll_keys'] = keys
  //data['coll_years'] = years
  
  let table = maketable()
      lines = makelines(table, keys)
}

d3.queue()
  .defer(d3.json, "https://eight1911.github.io/page/data/coll/keys.json")
  //.defer(d3.json, "https://eight1911.github.io/page/data/coll/years.json")
  .await(callback)