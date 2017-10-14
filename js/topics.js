
function makegraph(item, years) {
  let height = 3,
      width  = 10,
      colwidth = width / 104, // there are 104 years
      svg = item
    .append("svg")
    .style("width", width +"vw")
    .style("height", height + "em")
    .selectAll("rect")
    .data((d) => d[3])
    .enter()

  svg
    .append("rect")
    .attr("width", colwidth+ "em") // width / number of columns
    .attr("height", (d) => height*d + "em")
    .attr("x", (d, i) => i*colwidth + "vw")
    .attr("y", (d) => (height - height*d) + "em")
    .attr("fill", "#00dddd")


}

// add a topic line to a div with data already entered
function makelines(table, keys, years) {
  let percent = (i) => Math.round(i*100000)/1000 + "%"
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
    .text((i) => percent(i[1]))


}

function maketable() {
  let data  = [
    {"text": "ID", "width": "4vw" },
    {"text": "over time", "width": "11vw"},
    {"text": "base words", "width": "60vw"},
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
    .text((d) => d["text"])
    .attr("class", (d) => d["propotion"])
    .style("width", (d) => d["width"])

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